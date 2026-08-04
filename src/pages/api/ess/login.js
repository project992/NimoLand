import { handler, json, readJson, HttpError } from '../../../lib/http.js';
import { verifyPassword } from '../../../lib/password.js';
import { createSession, setSessionCookie } from '../../../lib/session.js';
import { requireSupabase } from '../../../lib/supabase.js';
import * as rateLimit from '../../../lib/rateLimit.js';

export const prerender = false;

const LIMIT = 5;
const WINDOW_MS = 60_000;

/* Employee portal login.

   This used to run in the browser: it queried `employees` with the anon key,
   matching `.eq('password', password)` against a plain-text column that had a
   public SELECT policy — so anyone could read every employee's password
   straight from the browser console. It is now server-side, hashed, rate
   limited, and the table has no public policy at all. */
export const POST = handler(async ({ request, cookies, clientAddress }) => {
  const ip = rateLimit.clientKey(request, clientAddress);
  const body = await readJson(request);

  const nik = typeof body.nik === 'string' ? body.nik.trim().toUpperCase() : '';
  if (!nik || nik.length > 40) throw new HttpError(400, 'NIK wajib diisi.');
  if (typeof body.password !== 'string' || body.password === '') {
    throw new HttpError(400, 'Password wajib diisi.');
  }

  for (const key of [`ess:ip:${ip}`, `ess:nik:${nik}`]) {
    const gate = rateLimit.check(key, LIMIT, WINDOW_MS);
    if (!gate.ok) {
      return json(
        { error: `Terlalu banyak percobaan masuk. Coba lagi dalam ${gate.retryAfter} detik.` },
        429,
        { 'Retry-After': String(gate.retryAfter) },
      );
    }
  }

  const db = requireSupabase();
  const { data, error } = await db
    .from('employees')
    .select('id, nik, full_name, role, password_hash, active')
    .eq('nik', nik)
    .maybeSingle();

  if (error) {
    console.error('[ess-login] lookup failed:', error.message);
    throw new HttpError(500, 'Tidak dapat memproses login. Coba lagi.');
  }

  const ok = data?.active ? await verifyPassword(body.password, data.password_hash) : false;
  if (!ok) throw new HttpError(401, 'NIK atau password salah.');

  const user = {
    id: data.id,
    nik: data.nik,
    name: data.full_name,
    role: data.role,
    kind: 'employee',
  };

  setSessionCookie(cookies, createSession(user));
  rateLimit.reset(`ess:ip:${ip}`);
  rateLimit.reset(`ess:nik:${nik}`);

  return json({ user });
});
