import { h as handler, j as json, r as readJson, n as normaliseEmail, a as normaliseName, H as HttpError } from '../../../chunks/http_BFk9SMn6.mjs';
import { c as clientKey, a as check, b as assertPassword, h as hashPassword, r as reset } from '../../../chunks/rateLimit_D5opz2Wb.mjs';
import { s as setSessionCookie, c as createSession } from '../../../chunks/session_Dx5B62S5.mjs';
import { r as requireSupabase } from '../../../chunks/supabase_BiwT-ogX.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;

const LIMIT = 5;              // attempts…
const WINDOW_MS = 60_000;     // …per minute, per IP

const POST = handler(async ({ request, cookies, clientAddress }) => {
  const ip = clientKey(request, clientAddress);
  const gate = check(`register:${ip}`, LIMIT, WINDOW_MS);
  if (!gate.ok) {
    return json(
      { error: `Terlalu banyak percobaan. Coba lagi dalam ${gate.retryAfter} detik.` },
      429,
      { 'Retry-After': String(gate.retryAfter) },
    );
  }

  const body = await readJson(request);
  const email = normaliseEmail(body.email);
  const name = normaliseName(body.name);
  const phone = normalisePhone(body.phone);

  try {
    assertPassword(body.password);
  } catch (err) {
    throw new HttpError(400, err.message);
  }

  const db = requireSupabase();
  const password_hash = await hashPassword(body.password);

  const { data, error } = await db
    .from('customers')
    .insert({ email, full_name: name, phone, password_hash })
    .select('id, email, full_name, role')
    .single();

  if (error) {
    // 23505 = unique_violation on customers.email
    if (error.code === '23505') throw new HttpError(409, 'Email ini sudah terdaftar. Silakan masuk.');
    console.error('[register] insert failed:', error.message);
    throw new HttpError(500, 'Pendaftaran gagal. Coba lagi.');
  }

  // Registration signs the user straight in — this is the "invocation on
  // success" step: session cookie set, and the full profile returned so the
  // client can populate its state without a second round trip.
  const user = {
    id: data.id,
    email: data.email,
    name: data.full_name,
    role: data.role,
    kind: 'customer',
  };
  setSessionCookie(cookies, createSession(user));
  reset(`register:${ip}`);

  return json({ user }, 201);
});

function normalisePhone(value) {
  if (value == null || value === '') return null;
  if (typeof value !== 'string') throw new HttpError(400, 'Nomor telepon tidak valid.');
  const phone = value.replace(/[\s-]/g, '');
  if (!/^\+?[0-9]{8,16}$/.test(phone)) throw new HttpError(400, 'Nomor telepon tidak valid.');
  return phone;
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
