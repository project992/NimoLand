import { handler, json, readJson, HttpError } from '../../../lib/http.js';
import { requireSupabase } from '../../../lib/supabase.js';
import { hashPassword, assertPassword } from '../../../lib/password.js';
import { logActivity } from '../../../lib/payments.js';

export const prerender = false;

/* ESS account management.

   Only the designated ESS admin — the Supervisor account named "Ami" — may
   create, list, or delete employee accounts. Anyone else who reaches this
   route (middleware already ensures a signed-in employee) gets a 403.

   A few rules are enforced here, not just in the UI:
     - NIK is unique and uppercased (matches the login endpoint).
     - Duplicate NIK is rejected (upsert would silently overwrite).
     - The last remaining admin account cannot be deleted, and the admin cannot
       delete itself (avoids locking the portal out of account management).
     - Password policy runs through the same assertPassword() as registration
       (min 8 chars).
*/

const ADMIN_NAME = 'Ami';

function isAdmin(user) {
  return !!user && user.kind === 'employee' && typeof user.name === 'string'
    && user.name.trim().toLowerCase() === ADMIN_NAME.toLowerCase();
}

function requireAdmin(locals) {
  if (!isAdmin(locals?.user)) {
    throw new HttpError(403, 'Hanya akun Ami yang dapat mengelola akun ESS.');
  }
}

/* List all employee accounts (without password hashes). */
export const GET = handler(async ({ locals }) => {
  requireAdmin(locals);
  const db = requireSupabase();
  const { data, error } = await db
    .from('employees')
    .select('id, nik, full_name, role, active, created_at')
    .order('nik', { ascending: true });

  if (error) {
    console.error('[ess-accounts] list failed:', error.message);
    throw new HttpError(500, 'Gagal memuat daftar akun.');
  }
  return json({ accounts: data ?? [] });
});

/* Create a new employee account. */
export const POST = handler(async ({ request, locals }) => {
  requireAdmin(locals);
  const body = await readJson(request);

  const nik = typeof body.nik === 'string' ? body.nik.trim().toUpperCase() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const role = typeof body.role === 'string' ? body.role.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!nik || nik.length > 40) throw new HttpError(400, 'NIK wajib diisi (maks. 40 karakter).');
  if (!/^[a-z0-9.\-_]+$/i.test(nik)) {
    throw new HttpError(400, 'NIK hanya boleh huruf, angka, titik, strip, dan underscore.');
  }
  if (!name || name.length > 120) throw new HttpError(400, 'Nama wajib diisi.');
  if (!role || role.length > 60) throw new HttpError(400, 'Role wajib diisi.');
  try {
    assertPassword(password);
  } catch (e) {
    throw new HttpError(400, e.message);
  }

  const db = requireSupabase();

  const existing = await db.from('employees').select('id').eq('nik', nik).maybeSingle();
  if (existing.error) {
    console.error('[ess-accounts] check failed:', existing.error.message);
    throw new HttpError(500, 'Gagal memeriksa NIK.');
  }
  if (existing.data) throw new HttpError(409, `NIK ${nik} sudah terdaftar.`);

  const password_hash = await hashPassword(password);
  const { error } = await db.from('employees').insert({
    nik,
    full_name: name,
    role,
    password_hash,
    active: true,
  });
  if (error) {
    console.error('[ess-accounts] insert failed:', error.message);
    throw new HttpError(500, 'Gagal membuat akun.');
  }

  logActivity(db, { actor_nik: locals.user.nik, actor_name: locals.user.name, action: 'ESS_ACCOUNT_CREATE', meta: { target: nik } });
  return json({ ok: true, account: { nik, full_name: name, role, active: true } }, 201);
});

/* Delete an employee account. Body: { id } or { nik }. */
export const DELETE = handler(async ({ request, locals }) => {
  requireAdmin(locals);
  const body = await readJson(request);

  if (typeof body !== 'object' || body === null) throw new HttpError(400, 'Payload tidak valid.');

  const db = requireSupabase();

  const target = body.nik ? { nik: String(body.nik).trim().toUpperCase() } : null;
  const byId = typeof body.id === 'string' ? body.id : null;

  if (!target && !byId) throw new HttpError(400, 'Tentukan akun yang akan dihapus.');

  const existing = byId
    ? await db.from('employees').select('id, nik, full_name, role').eq('id', byId).maybeSingle()
    : await db.from('employees').select('id, nik, full_name, role').eq('nik', target.nik).maybeSingle();

  if (existing.error) {
    console.error('[ess-accounts] lookup failed:', existing.error.message);
    throw new HttpError(500, 'Gagal memuat akun yang akan dihapus.');
  }
  if (!existing.data) throw new HttpError(404, 'Akun tidak ditemukan.');

  // Never let the admin delete itself.
  if (existing.data.nik === locals.user.nik) {
    throw new HttpError(400, 'Tidak dapat menghapus akun Anda sendiri.');
  }

  // Never delete the last remaining admin account.
  if (existing.data.full_name.trim().toLowerCase() === ADMIN_NAME.toLowerCase()) {
    try {
      const admins = await db.from('employees').select('id').ilike('full_name', ADMIN_NAME);
      const remaining = (admins.data ?? []).length;
      if (remaining <= 1) {
        throw new HttpError(400, 'Tidak dapat menghapus akun admin terakhir.');
      }
    } catch (e) {
      if (e instanceof HttpError) throw e;
      console.error('[ess-accounts] admin count failed:', e.message);
    }
  }

  const { error } = await db.from('employees').delete().eq('id', existing.data.id);
  if (error) {
    console.error('[ess-accounts] delete failed:', error.message);
    throw new HttpError(500, 'Gagal menghapus akun.');
  }

  logActivity(db, { actor_nik: locals.user.nik, actor_name: locals.user.name, action: 'ESS_ACCOUNT_DELETE', meta: { target: existing.data.nik } });
  return json({ ok: true, deleted: existing.data.nik });
});
