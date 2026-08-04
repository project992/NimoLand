/**
 * Only ever redirect to a path on this site.
 *
 * The login flow carries a `?next=` through to the post-login redirect. Without
 * this, a link like /login?next=https://evil.example.com would hand an attacker
 * a phishing page that opens straight after a genuine login on the real domain.
 *
 * Rejects: absolute URLs, protocol-relative `//host`, and anything not starting
 * with a single `/`.
 *
 * @param {unknown} value
 * @returns {string} a safe same-site path, or '/'
 */
export function safeNext(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '/';
  // Backslashes are treated as slashes by some browsers when resolving URLs,
  // so /\evil.example.com could escape the origin.
  if (value.includes('\\')) return '/';
  return value;
}
