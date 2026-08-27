import { handler, json, readJson, HttpError } from '../../../lib/http.js';
import { requireSupabase, withTimeout } from '../../../lib/supabase.js';
import { logActivity } from '../../../lib/payments.js';

export const prerender = false;

/* Promo management from the ESS portal. Only the designated admin (Ami) may
   list, create/update, toggle, or delete promos — enforced here the same way
   as /api/ess/accounts. */
const ADMIN_NAME = 'Ami';

function isAdmin(locals) {
  const u = locals?.user;
  return !!u && u.kind === 'employee' && typeof u.name === 'string'
    && u.name.trim().toLowerCase() === ADMIN_NAME.toLowerCase();
}

function requireAdmin(locals) {
  if (!isAdmin(locals)) throw new HttpError(403, 'Hanya akun Ami yang dapat mengelola promo.');
}

const TYPES = ['buy_n_get_m', 'percentage', 'flat'];
const now = () => new Date().toISOString();

export const GET = handler(async ({ locals }) => {
  requireAdmin(locals);
  const db = requireSupabase();
  const { data, error } = await withTimeout(
    db.from('promos').select('*').order('created_at', { ascending: false }).limit(200),
    2000,
  ).catch(() => ({ data: null, error: { message: 'timeout' } }));
  if (error) {
    console.error('[ess-promos] list failed:', error.message);
    throw new HttpError(500, 'Gagal memuat daftar promo.');
  }
  return json({ promos: data ?? [] });
});

/* Create a new promo, or update an existing one when body.id is given. */
export const POST = handler(async ({ request, locals }) => {
  requireAdmin(locals);
  const body = await readJson(request);
  const db = requireSupabase();

  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
  if (!code || code.length > 40) throw new HttpError(400, 'Kode promo wajib diisi.');

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title || title.length > 120) throw new HttpError(400, 'Nama promo wajib diisi.');

  const promo_type = TYPES.includes(body.promo_type) ? body.promo_type : 'buy_n_get_m';
  const description = typeof body.description === 'string' ? body.description.trim().slice(0, 300) : null;
  const sticky = !!body.sticky;

  const target_package = typeof body.target_package === 'string' && body.target_package ? body.target_package : null;
  const active = body.active === undefined ? true : !!body.active;

  let buy_qty = 1, free_qty = 1, discount_pct = null, discount_amount = null;

  if (promo_type === 'buy_n_get_m') {
    buy_qty = intPositive(body.buy_qty, 'Jumlah beli');
    free_qty = intPositive(body.free_qty, 'Jumlah gratis');
  } else if (promo_type === 'percentage') {
    const pct = Number(body.discount_pct);
    if (!Number.isFinite(pct) || pct <= 0 || pct > 100) throw new HttpError(400, 'Persen diskon harus 1–100.');
    discount_pct = pct;
  } else if (promo_type === 'flat') {
    const amt = Number(body.discount_amount);
    if (!Number.isFinite(amt) || amt < 0) throw new HttpError(400, 'Nominal diskon tidak valid.');
    discount_amount = Math.round(amt);
  }

  // Validasi rentang tanggal (kalau diisi).
  let starts_on = null, ends_on = null;
  if (body.starts_on) starts_on = validDate(body.starts_on, 'Tanggal mulai');
  if (body.ends_on) ends_on = validDate(body.ends_on, 'Tanggal selesai');
  if (starts_on && ends_on && ends_on < starts_on) {
    throw new HttpError(400, 'Tanggal selesai harus setelah tanggal mulai.');
  }

  const record = {
    code, title, description, promo_type,
    buy_qty, free_qty, discount_pct, discount_amount,
    target_package, sticky, active, starts_on, ends_on,
    updated_at: now(),
  };

  let data, error;
  if (body.id) {
    if (typeof body.id !== 'string' || !body.id) throw new HttpError(400, 'ID promo tidak valid.');
    const res = await withTimeout(
      db.from('promos').update(record).eq('id', body.id).select().single(),
      2000,
    ).catch(() => ({ data: null, error: { message: 'timeout' } }));
    data = res.data; error = res.error;
    if (!error) await logActivity(db, { actor_nik: locals.user.nik, actor_name: locals.user.name, action: 'PROMO_UPDATE', meta: { code } });
  } else {
    const existing = await withTimeout(db.from('promos').select('id').eq('code', code).maybeSingle(), 2000).catch(() => ({ data: null }));
    if (existing?.data) throw new HttpError(409, `Kode promo ${code} sudah ada.`);
    const res = await withTimeout(db.from('promos').insert(record).select().single(), 2000).catch(() => ({ data: null, error: { message: 'timeout' } }));
    data = res.data; error = res.error;
    if (!error) await logActivity(db, { actor_nik: locals.user.nik, actor_name: locals.user.name, action: 'PROMO_CREATE', meta: { code } });
  }

  if (error) {
    console.error('[ess-promos] save failed:', error.message);
    throw new HttpError(500, 'Gagal menyimpan promo.');
  }
  return json({ ok: true, promo: data }, body.id ? 200 : 201);
});

/* Toggle active state: { id, active }. */
export const PATCH = handler(async ({ request, locals }) => {
  requireAdmin(locals);
  const body = await readJson(request);
  if (!body?.id) throw new HttpError(400, 'ID promo wajib diisi.');
  const active = !!body.active;
  const db = requireSupabase();

  const { data, error } = await withTimeout(
    db.from('promos').update({ active, updated_at: now() }).eq('id', body.id).select('id, code, title, active').single(),
    2000,
  ).catch(() => ({ data: null, error: { message: 'timeout' } }));
  if (error || !data) throw new HttpError(500, 'Gagal memperbarui status promo.');
  await logActivity(db, { actor_nik: locals.user.nik, actor_name: locals.user.name, action: active ? 'PROMO_ENABLE' : 'PROMO_DISABLE', meta: { code: data.code } });
  return json({ ok: true, promo: data });
});

/* Delete a promo: { id }. */
export const DELETE = handler(async ({ request, locals }) => {
  requireAdmin(locals);
  const body = await readJson(request);
  if (!body?.id) throw new HttpError(400, 'ID promo wajib diisi.');
  const db = requireSupabase();

  const { data } = await withTimeout(
    db.from('promos').delete().eq('id', body.id).select('code').single(),
    2000,
  ).catch(() => ({ data: null }));
  if (!data) throw new HttpError(404, 'Promo tidak ditemukan.');
  await logActivity(db, { actor_nik: locals.user.nik, actor_name: locals.user.name, action: 'PROMO_DELETE', meta: { code: data.code } });
  return json({ ok: true, deleted: data.code });
});

function intPositive(v, label) {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0 || n > 100) throw new HttpError(400, `${label} harus bilangan bulat 1–100.`);
  return n;
}

function validDate(v, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new HttpError(400, `${label} tidak valid.`);
  return v;
}
