/* Checks for the logic that is expensive to get wrong: password hashing,
   session signing, the rate limiter, and server-side pricing.

   Run: npm test   (node --test, no framework) */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

process.env.SESSION_SECRET = 'test-secret-that-is-definitely-long-enough-32';

const { hashPassword, verifyPassword, assertPassword } = await import('./password.js');
const { createSession, readSession } = await import('./session.js');
const rateLimit = await import('./rateLimit.js');
const { priceTicket, parseISODate, unitPrice, PACKAGES } = await import('./data.js');
const { safeNext } = await import('./redirect.js');

/* ---------------- password ---------------- */

test('password: round-trips and rejects the wrong password', async () => {
  const stored = await hashPassword('correct horse battery');
  assert.equal(await verifyPassword('correct horse battery', stored), true);
  assert.equal(await verifyPassword('correct horse batteri', stored), false);
});

test('password: same input hashes differently (salted)', async () => {
  const a = await hashPassword('sameinput123');
  const b = await hashPassword('sameinput123');
  assert.notEqual(a, b, 'two hashes of the same password must differ');
  assert.equal(await verifyPassword('sameinput123', a), true);
  assert.equal(await verifyPassword('sameinput123', b), true);
});

test('password: malformed stored values return false, never throw', async () => {
  for (const bad of ['', 'not-a-hash', 'scrypt$x$y$z', 'bcrypt$1$2$3$4$5', null, undefined]) {
    assert.equal(await verifyPassword('whatever', bad), false, `should reject: ${bad}`);
  }
});

test('password: policy rejects short and absurdly long inputs', () => {
  assert.throws(() => assertPassword('short'));
  assert.throws(() => assertPassword('x'.repeat(201)));
  assert.doesNotThrow(() => assertPassword('eightchr'));
});

/* ---------------- session ---------------- */

const USER = { id: 'u-1', email: 'a@b.co', name: 'Ami', role: 'customer', kind: 'customer' };

test('session: a valid token round-trips its claims', () => {
  const claims = readSession(createSession(USER));
  assert.equal(claims.sub, 'u-1');
  assert.equal(claims.role, 'customer');
  assert.equal(claims.kind, 'customer');
});

test('session: a tampered payload is rejected', () => {
  const token = createSession(USER);
  const [payload, sig] = token.split('.');

  // Re-encode the claims with an escalated role, keeping the original signature.
  const claims = JSON.parse(Buffer.from(payload, 'base64url').toString());
  claims.role = 'admin';
  claims.kind = 'employee';
  const forged = Buffer.from(JSON.stringify(claims)).toString('base64url') + '.' + sig;

  assert.equal(readSession(forged), null, 'a re-signed-by-nobody payload must not verify');
});

test('session: garbage and expired tokens are rejected without throwing', () => {
  for (const bad of ['', 'a', 'a.b', 'nodot', null, undefined, 'x'.repeat(500)]) {
    assert.equal(readSession(bad), null, `should reject: ${bad}`);
  }
});

test('session: an expired token is rejected', () => {
  const token = createSession(USER);
  const [payload] = token.split('.');
  const claims = JSON.parse(Buffer.from(payload, 'base64url').toString());
  claims.exp = Math.floor(Date.now() / 1000) - 10;

  // Sign it properly — only the expiry is wrong, so this isolates the exp check.
  const newPayload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const sig = createHmac('sha256', process.env.SESSION_SECRET).update(newPayload).digest('base64url');

  assert.equal(readSession(`${newPayload}.${sig}`), null);
});

/* ---------------- rate limiter ---------------- */

test('rateLimit: allows exactly `limit` attempts, then blocks', () => {
  rateLimit._reset();
  const key = 'login:ip:203.0.113.9';

  for (let i = 1; i <= 5; i++) {
    assert.equal(rateLimit.check(key, 5, 60_000).ok, true, `attempt ${i} should pass`);
  }
  const blocked = rateLimit.check(key, 5, 60_000);
  assert.equal(blocked.ok, false, '6th attempt must be blocked');
  assert.ok(blocked.retryAfter > 0, 'a blocked response must say when to retry');
});

test('rateLimit: buckets are independent per key', () => {
  rateLimit._reset();
  for (let i = 0; i < 5; i++) rateLimit.check('a', 5, 60_000);
  assert.equal(rateLimit.check('a', 5, 60_000).ok, false);
  assert.equal(rateLimit.check('b', 5, 60_000).ok, true, 'a different IP must be unaffected');
});

test('rateLimit: the window expires', () => {
  rateLimit._reset();
  for (let i = 0; i < 5; i++) rateLimit.check('c', 5, 1);
  assert.equal(rateLimit.check('c', 5, 1).ok, false);
  // The bucket's window was 1 ms, so by now it has rolled over.
  return new Promise(resolve => setTimeout(() => {
    assert.equal(rateLimit.check('c', 5, 1).ok, true, 'a fresh window must allow attempts again');
    resolve();
  }, 20));
});

test('rateLimit: reset clears a bucket (successful login path)', () => {
  rateLimit._reset();
  for (let i = 0; i < 5; i++) rateLimit.check('d', 5, 60_000);
  rateLimit.reset('d');
  assert.equal(rateLimit.check('d', 5, 60_000).ok, true);
});

/* ---------------- redirect safety ---------------- */

test('safeNext: only same-site paths survive', () => {
  assert.equal(safeNext('/booking?x=1'), '/booking?x=1');
  assert.equal(safeNext('//evil.example.com'), '/', 'protocol-relative URL must be rejected');
  assert.equal(safeNext('https://evil.example.com'), '/');
  assert.equal(safeNext(undefined), '/');
  assert.equal(safeNext(''), '/');
});

/* ---------------- script embedding ---------------- */

const { jsonForScript } = await import('./serialize.js');

test('jsonForScript: a name containing </script> cannot break out', () => {
  const hostile = { name: '</script><img src=x onerror=alert(1)>', kind: 'customer' };
  const out = jsonForScript(hostile);

  assert.ok(!out.includes('<'), 'no raw < may survive');
  assert.ok(!/<\/script/i.test(out), 'the closing tag must not appear literally');
  // Still the same data once parsed — escaping must not corrupt the payload.
  assert.deepEqual(JSON.parse(out), hostile);
});

test('jsonForScript: escapes U+2028 / U+2029 but preserves the value', () => {
  const value = { note: `a${String.fromCharCode(0x2028)}b${String.fromCharCode(0x2029)}c` };
  const out = jsonForScript(value);

  assert.ok(!out.includes(String.fromCharCode(0x2028)), 'raw U+2028 must not survive');
  assert.ok(!out.includes(String.fromCharCode(0x2029)), 'raw U+2029 must not survive');
  assert.deepEqual(JSON.parse(out), value);
});

test('jsonForScript: null and undefined both serialise to null', () => {
  assert.equal(jsonForScript(null), 'null');
  assert.equal(jsonForScript(undefined), 'null');
});

/* ---------------- pricing ---------------- */

test('pricing: weekend costs the weekend rate, weekday the weekday rate', () => {
  // 2026-08-08 is a Saturday, 2026-08-06 a Thursday.
  const saturday = parseISODate('2026-08-08');
  const thursday = parseISODate('2026-08-06');
  assert.equal(saturday.getDay(), 6);
  assert.equal(thursday.getDay(), 4);

  const regular = PACKAGES.find(p => p.id === 'regular');
  assert.equal(unitPrice('regular', 'domestik', 'adult', thursday), regular.price.domestik.adult[0]);
  assert.equal(unitPrice('regular', 'domestik', 'adult', saturday), regular.price.domestik.adult[1]);
});

test('pricing: total is units × counts, and expiry is arrival + 3 days', () => {
  const arrival = parseISODate('2026-08-06'); // Thursday
  const q = priceTicket({ packageId: 'regular', nationality: 'domestik', adult: 2, child: 1, arrival });

  assert.equal(q.total, q.adultUnit * 2 + q.childUnit * 1);
  assert.equal(q.expiry.getDate(), 9, 'ticket must stay valid for 3 days after arrival');
});

test('pricing: an unknown package is rejected rather than priced at zero', () => {
  const arrival = parseISODate('2026-08-06');
  assert.throws(() =>
    priceTicket({ packageId: 'free-please', nationality: 'domestik', adult: 1, child: 0, arrival }));
});

test('parseISODate: rejects malformed input instead of returning Invalid Date', () => {
  for (const bad of ['not-a-date', '2026-13-45', '06/08/2026', '', null, 42]) {
    const result = parseISODate(bad);
    assert.ok(result === null || !Number.isNaN(result.getTime()), `bad input leaked through: ${bad}`);
  }
  assert.equal(parseISODate('06/08/2026'), null);
});
