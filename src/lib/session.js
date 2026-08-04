/* Stateless sessions: an HMAC-SHA256-signed cookie payload.

   Why not a JWT library — the only algorithm we want is HMAC-SHA256, and
   node:crypto does that in a dozen lines. No `alg: none` footgun, no
   dependency. Sessions carry identity + role only; anything authoritative is
   re-read from the database on use.

   The cookie is HTTP-only, so client JS can never read it; the SPA learns who
   it is from GET /api/auth/me instead. */
import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';

export const SESSION_COOKIE = 'nimo_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  // Optional chaining because import.meta.env only exists under Vite/Astro —
  // this module is also imported by plain `node --test`.
  const s = import.meta.env?.SESSION_SECRET || process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    // Refuse to run on a weak/absent key rather than silently signing with one.
    throw new Error(
      'SESSION_SECRET missing or shorter than 32 chars. ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
    );
  }
  return s;
}

const b64url = buf => Buffer.from(buf).toString('base64url');
const sign = payload => createHmac('sha256', secret()).update(payload).digest('base64url');

/**
 * @param {{id: string, email?: string, nik?: string, name: string, role: string, kind: 'customer'|'employee'}} user
 * @returns {string} signed token
 */
export function createSession(user) {
  const claims = {
    sub: user.id,
    email: user.email ?? null,
    nik: user.nik ?? null,
    name: user.name,
    role: user.role,
    kind: user.kind,
    sid: randomUUID(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const payload = b64url(JSON.stringify(claims));
  return `${payload}.${sign(payload)}`;
}

/**
 * Verify signature and expiry. Returns null on anything suspect — never throws
 * on attacker-controlled input.
 * @param {string|undefined} token
 */
export function readSession(token) {
  if (!token || typeof token !== 'string') return null;

  const dot = token.lastIndexOf('.');
  if (dot <= 0) return null;

  const payload = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1));
  const wanted = Buffer.from(sign(payload));

  // timingSafeEqual throws on length mismatch — check first.
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) return null;

  let claims;
  try {
    claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (typeof claims?.exp !== 'number' || claims.exp < Math.floor(Date.now() / 1000)) return null;
  return claims;
}

/** Cookie options shared by set and clear, so the clear actually matches. */
function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',      // survives the post-login redirect back to /booking
    secure: Boolean(import.meta.env?.PROD),
    path: '/',
  };
}

/** @param {import('astro').AstroCookies} cookies */
export function setSessionCookie(cookies, token) {
  cookies.set(SESSION_COOKIE, token, { ...cookieOptions(), maxAge: SESSION_MAX_AGE });
}

/** @param {import('astro').AstroCookies} cookies */
export function clearSessionCookie(cookies) {
  cookies.delete(SESSION_COOKIE, cookieOptions());
}
