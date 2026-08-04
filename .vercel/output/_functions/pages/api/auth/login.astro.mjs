import { h as handler, r as readJson, n as normaliseEmail, j as json, H as HttpError } from '../../../chunks/http_BFk9SMn6.mjs';
import { randomBytes } from 'node:crypto';
import { c as clientKey, a as check, v as verifyPassword, r as reset, h as hashPassword } from '../../../chunks/rateLimit_D5opz2Wb.mjs';
import { s as setSessionCookie, c as createSession } from '../../../chunks/session_Dx5B62S5.mjs';
import { r as requireSupabase } from '../../../chunks/supabase_BiwT-ogX.mjs';
import { s as safeNext } from '../../../chunks/redirect_Do9XBSFN.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;

const LIMIT = 5;              // attempts…
const WINDOW_MS = 60_000;     // …per minute

const POST = handler(async ({ request, cookies, clientAddress }) => {
  const ip = clientKey(request, clientAddress);
  const body = await readJson(request);
  const email = normaliseEmail(body.email);

  // Two buckets, because they stop different attacks:
  //   per-IP      — one host spraying many accounts
  //   per-account — a botnet spraying one account from many hosts
  const ipKey = `login:ip:${ip}`;
  const accountKey = `login:acct:${email}`;

  for (const key of [ipKey, accountKey]) {
    const gate = check(key, LIMIT, WINDOW_MS);
    if (!gate.ok) {
      return json(
        { error: `Terlalu banyak percobaan masuk. Coba lagi dalam ${gate.retryAfter} detik.` },
        429,
        { 'Retry-After': String(gate.retryAfter) },
      );
    }
  }

  if (typeof body.password !== 'string' || body.password === '') {
    throw new HttpError(400, 'Password wajib diisi.');
  }

  const db = requireSupabase();
  const { data, error } = await db
    .from('customers')
    .select('id, email, full_name, role, password_hash')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('[login] lookup failed:', error.message);
    throw new HttpError(500, 'Tidak dapat memproses login. Coba lagi.');
  }

  // Same message and a real hash comparison either way: a "user not found"
  // shortcut leaks which emails are registered, both in wording and in timing.
  const ok = data ? await verifyPassword(body.password, data.password_hash) : await burnTime(body.password);
  if (!ok) throw new HttpError(401, 'Email atau password salah.');

  const user = {
    id: data.id,
    email: data.email,
    name: data.full_name,
    role: data.role,
    kind: 'customer',
  };

  // ---- Invocation on successful login ----
  // 1. issue the HTTP-only session cookie
  setSessionCookie(cookies, createSession(user));
  // 2. clear the attempt counters so a legitimate user isn't locked out next time
  reset(ipKey);
  reset(accountKey);
  // 3. hand back identity, role and the resume target in the same response, so
  //    the client has everything it needs without a follow-up request
  return json({ user, next: safeNext(body.next) });
});

/* Verify against a throwaway hash so a missing account costs the same
   wall-clock time as a wrong password. Built at runtime from the same
   hashPassword() the real records use, so it can never drift out of sync with
   the scrypt parameters — a hardcoded constant with stale params would verify
   at a different speed and reintroduce the timing leak it exists to close. */
let dummyHash = null;
async function burnTime(password) {
  dummyHash ??= await hashPassword(randomBytes(32).toString('hex'));
  return verifyPassword(password, dummyHash);
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
