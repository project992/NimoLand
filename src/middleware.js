/* Runs on every request.

   1. Reads the signed session cookie once and hangs the result on
      `Astro.locals` — this is the "load user data, roles and session state"
      trigger. Every page and endpoint downstream reads `locals.user` instead of
      re-parsing cookies or re-querying the database.
   2. Gates the protected routes. The check lives HERE rather than in each
      handler so a new booking route can't be added without protection by
      forgetting a guard. */
import { defineMiddleware } from 'astro:middleware';
import { readSession, clearSessionCookie, SESSION_COOKIE, createSession, setSessionCookie, ESS_SESSION_TTL } from './lib/session.js';
import { safeNext } from './lib/redirect.js';

/** Pages that require a signed-in customer. Prefix match. */
const PROTECTED_PAGES = ['/booking', '/akun', '/pesanan'];

/** API routes that require a signed-in customer. Prefix match. */
const PROTECTED_API = ['/api/bookings', '/api/my', '/api/payments/'];

/** Pages that require a signed-in employee (Portal ESS terpisah). Prefix match.
    Dikosongkan: /ess menyajikan form login sendiri, jadi tidak di-redirect. */
const PROTECTED_EMPLOYEE_PAGES = [];

/** API routes that require a signed-in employee. Prefix match. */
const EMPLOYEE_API = ['/api/ess/tickets', '/api/ess/verify', '/api/ess/videos'];

/** API routes that require a SUPERVISOR (laporan + pengaturan kuota). */
const SUPERVISOR_API = ['/api/ess/reports', '/api/ess/quota'];

/** Role yang boleh variasi kuota & membaca laporan. */
const SUPERVISOR_ROLES = ['Supervisor', 'Manager', 'Admin', 'Owner', 'Direktur'];

/** Endpoint yang dieksklusi dari gate pelanggan (dipanggil pihak ketiga,
    misalnya webhook Midtrans dengan signature sendiri). */
const CUSTOMER_GATE_EXEMPT = ['/api/payments/notification'];

const startsWithAny = (path, prefixes) => prefixes.some(p => path === p || path.startsWith(p + '/'));

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, url, locals, request } = context;

  const claims = readSession(cookies.get(SESSION_COOKIE)?.value);

  // A cookie that fails verification is stale, forged, or signed with a rotated
  // secret. Drop it so the browser stops sending it on every request.
  if (!claims && cookies.has(SESSION_COOKIE)) clearSessionCookie(cookies);

  locals.user = claims
    ? {
        id: claims.sub,
        email: claims.email,
        nik: claims.nik,
        name: claims.name,
        role: claims.role,
        kind: claims.kind,
      }
    : null;
  locals.isCustomer = locals.user?.kind === 'customer';
  locals.isEmployee = locals.user?.kind === 'employee';

  const path = url.pathname;

  // ---- Employee-only API ----
  if (startsWithAny(path, EMPLOYEE_API) && !locals.isEmployee) {
    return json({ error: 'Sesi karyawan diperlukan.' }, 401);
  }

  // ---- Supervisor-only API (laporan & kuota) ----
  if (startsWithAny(path, SUPERVISOR_API) && (!locals.isEmployee || !SUPERVISOR_ROLES.includes(locals.user.role))) {
    return json({ error: 'Akses khusus supervisor.' }, 403);
  }

  // ---- Customer-only API ----
  if (startsWithAny(path, PROTECTED_API) && !CUSTOMER_GATE_EXEMPT.includes(path) && !locals.isCustomer) {
    return json({ error: 'Silakan masuk terlebih dahulu.', loginUrl: '/login' }, 401);
  }

  // ---- Customer-only pages: bounce to login, remembering where they were ----
  if (startsWithAny(path, PROTECTED_PAGES) && !locals.isCustomer) {
    const next = path + url.search;
    return context.redirect(`/login?next=${encodeURIComponent(next)}`, 302);
  }

  // ---- Employee-only pages (Portal ESS terpisah) ----
  if (startsWithAny(path, PROTECTED_EMPLOYEE_PAGES) && !locals.isEmployee) {
    return context.redirect('/login', 302);
  }

  // ---- Auto-logout karyawan: sesi sliding 30 menit ----
  // Setiap request dari karyawan yang valid memperbarui cookie sesi, sehingga
  // 30 menit tanpa aktivitas apa pun membuat cookie kedaluwarsa dan ESS tak
  // lagi bisa diakses.
  if (locals.isEmployee && claims) {
    setSessionCookie(context.cookies, createSession(locals.user, ESS_SESSION_TTL), ESS_SESSION_TTL);
  }

  // ---- Already signed in? Don't show the login/register forms again ----
  if ((path === '/login' || path === '/register') && locals.isCustomer) {
    return context.redirect(safeNext(url.searchParams.get('next')), 302);
  }

  // ---- Legacy path routing: /beranda is the same page as / (canonical) ----
  if (path === '/beranda') {
    return context.redirect('/', 301);
  }

  const response = await next();

  // Auth-sensitive responses must never be cached by a proxy and replayed to
  // the next visitor.
  if (locals.user || path.startsWith('/api/auth')) {
    response.headers.set('Cache-Control', 'no-store');
  }
  if (request.method === 'GET' && path.startsWith('/api/')) {
    response.headers.set('Vary', 'Cookie');
  }

  return response;
});

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
