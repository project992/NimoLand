/* Fixed-window rate limiter for the auth endpoints.

   ponytail: in-process Map — correct for the single Node process this app
   deploys as (`adapter: node({ mode: 'standalone' })`). If you ever run more
   than one instance behind a load balancer, each gets its own counter and the
   effective limit multiplies by the instance count. Swap `hits` for Redis /
   Supabase at that point; the `check()` signature stays the same. */

/** @type {Map<string, {count: number, resetAt: number}>} */
const hits = new Map();

let lastSweep = Date.now();
const SWEEP_EVERY = 60_000;

/** Drop expired buckets so a hostile IP range can't grow the Map unbounded. */
function sweep(now) {
  if (now - lastSweep < SWEEP_EVERY) return;
  lastSweep = now;
  for (const [key, bucket] of hits) {
    if (bucket.resetAt <= now) hits.delete(key);
  }
}

/**
 * @param {string} key      bucket identity, e.g. "login:203.0.113.4"
 * @param {number} limit    allowed attempts per window
 * @param {number} windowMs window length
 * @returns {{ok: boolean, remaining: number, retryAfter: number}}
 */
export function check(key, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  sweep(now);

  const bucket = hits.get(key);
  if (!bucket || bucket.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, remaining: limit - bucket.count, retryAfter: 0 };
}

/** Called after a successful login so a legitimate user isn't punished. */
export function reset(key) {
  hits.delete(key);
}

/**
 * Client IP, preferring the proxy header but only trusting it when the app is
 * actually deployed behind one (TRUST_PROXY=1). Otherwise any client could
 * forge X-Forwarded-For and get an unlimited number of buckets.
 * @param {Request} request
 * @param {string|undefined} socketAddress  Astro's clientAddress
 */
export function clientKey(request, socketAddress) {
  const trustProxy = (import.meta.env?.TRUST_PROXY || process.env.TRUST_PROXY) === '1';
  if (trustProxy) {
    const fwd = request.headers.get('x-forwarded-for');
    if (fwd) return fwd.split(',')[0].trim();
  }
  return socketAddress || 'unknown';
}

/** Test seam: clear all buckets. */
export function _reset() {
  hits.clear();
}
