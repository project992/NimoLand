import { timingSafeEqual, createHmac, randomUUID } from 'node:crypto';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
const SESSION_COOKIE = "nimo_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
function secret() {
  const s = "anjingidrishideungabcdefghijklmnopqrstuvwexyeze";
  if (s.length < 32) {
    throw new Error(
      `SESSION_SECRET missing or shorter than 32 chars. Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
    );
  }
  return s;
}
const b64url = (buf) => Buffer.from(buf).toString("base64url");
const sign = (payload) => createHmac("sha256", secret()).update(payload).digest("base64url");
function createSession(user) {
  const claims = {
    sub: user.id,
    email: user.email ?? null,
    nik: user.nik ?? null,
    name: user.name,
    role: user.role,
    kind: user.kind,
    sid: randomUUID(),
    iat: Math.floor(Date.now() / 1e3),
    exp: Math.floor(Date.now() / 1e3) + SESSION_MAX_AGE
  };
  const payload = b64url(JSON.stringify(claims));
  return `${payload}.${sign(payload)}`;
}
function readSession(token) {
  if (!token || typeof token !== "string") return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1));
  const wanted = Buffer.from(sign(payload));
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) return null;
  let claims;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (typeof claims?.exp !== "number" || claims.exp < Math.floor(Date.now() / 1e3)) return null;
  return claims;
}
function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    // survives the post-login redirect back to /booking
    secure: Boolean(Object.assign(__vite_import_meta_env__, { SESSION_SECRET: "anjingidrishideungabcdefghijklmnopqrstuvwexyeze" })?.PROD),
    path: "/"
  };
}
function setSessionCookie(cookies, token) {
  cookies.set(SESSION_COOKIE, token, { ...cookieOptions(), maxAge: SESSION_MAX_AGE });
}
function clearSessionCookie(cookies) {
  cookies.delete(SESSION_COOKIE, cookieOptions());
}

export { SESSION_COOKIE as S, clearSessionCookie as a, createSession as c, readSession as r, setSessionCookie as s };
