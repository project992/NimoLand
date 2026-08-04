import { scrypt, timingSafeEqual, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

/* Password hashing on node:crypto scrypt — no bcrypt/argon2 dependency needed.
   scrypt is memory-hard and is what Node ships for exactly this job.

   Stored format:  scrypt$N$r$p$<salt-b64>$<hash-b64>
   The parameters live in the string, so raising them later still verifies
   every password already in the database. */

const scryptAsync = promisify(scrypt);

/* N=2^15 (~32 MB, ~150 ms per hash on a typical server core).

   OWASP's headline scrypt figure is N=2^17, but that costs ~3 s per hash here,
   which means a 3-second login and a trivial CPU exhaustion attack: a handful
   of concurrent login attempts would saturate the box, and the rate limiter
   only caps attempts per IP, not across a botnet.

   ponytail: N is encoded in every stored hash, so raising this later keeps
   verifying old passwords — bump N and re-hash on next successful login if the
   threat model changes. */
const N = 1 << 15;
const R = 8;
const P = 1;
const KEYLEN = 64;
// scrypt needs roughly 128 * N * r bytes; Node's default 32 MB cap is too low.
const MAXMEM = 256 * N * R;

/** @param {string} password @returns {Promise<string>} encoded hash */
async function hashPassword(password) {
  assertPassword(password);
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, KEYLEN, { N, r: R, p: P, maxmem: MAXMEM });
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

/**
 * Constant-time verify. Returns false for malformed/unknown-scheme records
 * rather than throwing, so a bad row can't 500 the login endpoint.
 * @param {string} password @param {string} stored
 */
async function verifyPassword(password, stored) {
  if (typeof password !== 'string' || typeof stored !== 'string') return false;

  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const [, n, r, p, saltB64, hashB64] = parts;
  const params = { N: Number(n), r: Number(r), p: Number(p) };
  if (!Number.isInteger(params.N) || !Number.isInteger(params.r) || !Number.isInteger(params.p)) return false;

  let expected;
  try {
    expected = Buffer.from(hashB64, 'base64');
    const actual = await scryptAsync(
      password,
      Buffer.from(saltB64, 'base64'),
      expected.length,
      { ...params, maxmem: 256 * params.N * params.r },
    );
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/** Minimum policy enforced at the trust boundary, not just in the browser. */
function assertPassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    throw new Error('Password minimal 8 karakter.');
  }
  if (password.length > 200) {
    // Long inputs are a cheap DoS against a memory-hard KDF.
    throw new Error('Password maksimal 200 karakter.');
  }
}

const hits = /* @__PURE__ */ new Map();
let lastSweep = Date.now();
const SWEEP_EVERY = 6e4;
function sweep(now) {
  if (now - lastSweep < SWEEP_EVERY) return;
  lastSweep = now;
  for (const [key, bucket] of hits) {
    if (bucket.resetAt <= now) hits.delete(key);
  }
}
function check(key, limit = 5, windowMs = 6e4) {
  const now = Date.now();
  sweep(now);
  const bucket = hits.get(key);
  if (!bucket || bucket.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((bucket.resetAt - now) / 1e3) };
  }
  return { ok: true, remaining: limit - bucket.count, retryAfter: 0 };
}
function reset(key) {
  hits.delete(key);
}
function clientKey(request, socketAddress) {
  return socketAddress || "unknown";
}

export { check as a, assertPassword as b, clientKey as c, hashPassword as h, reset as r, verifyPassword as v };
