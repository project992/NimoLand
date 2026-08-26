import { handler, json, readJson, HttpError } from '../../../lib/http.js';
import { requireSupabase, withTimeout } from '../../../lib/supabase.js';
import { logActivity } from '../../../lib/payments.js';

export const prerender = false;

/* Kuota harian (SUPERVISOR): lihat daftar + set/buka kuota per tanggal.
   quota null / 0 = tanpa batas (dibuka). Endpoint ini di-gate role oleh
   middleware (SUPERVISOR_API). */
export const GET = handler(async () => {
  const db = requireSupabase();
  const { data, error } = await withTimeout(
    db.from('daily_quotas').select('visit_date, quota, note, updated_at')
      .order('visit_date', { ascending: true }).limit(90),
    2000,
  ).catch(() => ({ data: null, error: { message: 'timeout' } }));
  if (error) throw new HttpError(500, 'Gagal memuat kuota.');
  return json({ quotas: data ?? [] });
});

export const POST = handler(async ({ request, locals }) => {
  const body = await readJson(request);
  const db = requireSupabase();

  const date = String(body.visit_date ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new HttpError(400, 'Tanggal tidak valid.');

  // qu+.ota null/0 itu artinya buka (unlimited).
  let quota = null;
  if (body.quota !== undefined && body.quota !== null && String(body.quota).trim() !== '') {
    const n = Number(body.quota);
    if (!Number.isInteger(n) || n < 0) throw new HttpError(400, 'Kuota harus bilangan bulat ≥ 0.');
    quota = n <= 0 ? null : n;
  }
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 200) : null;

  const { data, error } = await withTimeout(
    db.from('daily_quotas').upsert(
      { visit_date: date, quota, note, updated_at: new Date().toISOString() },
      { onConflict: 'visit_date' },
    ).select().single(),
    2000,
  ).catch(() => ({ data: null, error: { message: 'timeout' } }));

  if (error) throw new HttpError(500, 'Gagal menyimpan kuota.');
  await logActivity(db, { actor_nik: locals.user.nik, actor_name: locals.user.name, action: 'QUOTA_SET', meta: { visit_date: date, quota } });
  return json({ quota: data });
});
