/* Runs on every request.

   1. Locale detection: reads from locale cookie, Accept-Language, or default.
   2. Reads the signed session cookie.
   3. Gates protected routes. */
import { defineMiddleware } from 'astro:middleware';
import { readSession, clearSessionCookie, SESSION_COOKIE, createSession, setSessionCookie, ESS_SESSION_TTL } from './lib/session.js';
import { safeNext } from './lib/redirect.js';
import { LOCALES, DEFAULT_LOCALE, t as translate } from './lib/i18n.js';

const LOCALE_COOKIE = 'nl_lang';

/** Pages that require a signed-in customer. Prefix match. */
const PROTECTED_PAGES = ['/booking', '/akun', '/pesanan'];

/** API routes that require a signed-in customer. Prefix match. */
const PROTECTED_API = ['/api/bookings', '/api/my', '/api/payments/'];

/** Pages that require a signed-in employee. */
const PROTECTED_EMPLOYEE_PAGES = [];

/** API routes that require a signed-in employee. */
const EMPLOYEE_API = ['/api/ess/tickets', '/api/ess/verify', '/api/ess/videos'];

/** API routes that require a SUPERVISOR. */
const SUPERVISOR_API = ['/api/ess/reports', '/api/ess/quota'];

const SUPERVISOR_ROLES = ['Supervisor', 'Manager', 'Admin', 'Owner', 'Direktur'];

/** Exempt from customer gate (third-party webhooks). */
const CUSTOMER_GATE_EXEMPT = ['/api/payments/notification'];

const startsWithAny = (path, prefixes) => prefixes.some(p => path === p || path.startsWith(p + '/'));

function parseLocaleCookie(val) {
  if (!val) return null;
  const v = val.split(';')[0]?.trim();
  return LOCALES.includes(v) ? v : null;
}

function detectLocale(request) {
  const accept = request?.headers?.get('accept-language') ?? '';
  for (const loc of LOCALES) {
    if (accept.toLowerCase().includes(loc)) return loc;
  }
  return DEFAULT_LOCALE;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, url, locals, request } = context;
  const path = url.pathname;

  // ---- Locale prefix redirect ----
  // /en/xxx or /id/xxx → set cookie + redirect to /xxx
  const LOCALE_PREFIX_RE = /^\/(en|id)(\/|$)/;
  const prefixMatch = path.match(LOCALE_PREFIX_RE);
  if (prefixMatch) {
    const prefixLocale = prefixMatch[1];
    const rest = path.slice(prefixLocale.length + 1) || '/';
    const qs = url.search; // includes '?'
    cookies.set(LOCALE_COOKIE, prefixLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return context.redirect(rest + qs, 301);
  }

  // ---- Locale detection ----
  // Priority: cookie > Accept-Language > default
  const cookieLocale = parseLocaleCookie(cookies.get(LOCALE_COOKIE)?.value);
  const detectedLocale = cookieLocale || detectLocale(request);

  locals.locale = detectedLocale;
  locals.t = (key) => translate(key, detectedLocale);

  const claims = readSession(cookies.get(SESSION_COOKIE)?.value);

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

  // ---- Employee-only API ----
  if (startsWithAny(path, EMPLOYEE_API) && !locals.isEmployee) {
    return json({ error: 'Sesi karyawan diperlukan.' }, 401);
  }

  // ---- Supervisor-only API ----
  if (startsWithAny(path, SUPERVISOR_API) && (!locals.isEmployee || !SUPERVISOR_ROLES.includes(locals.user?.role))) {
    return json({ error: 'Akses khusus supervisor.' }, 403);
  }

  // ---- Customer-only API ----
  if (startsWithAny(path, PROTECTED_API) && !CUSTOMER_GATE_EXEMPT.includes(path) && !locals.isCustomer) {
    return json({ error: 'Silakan masuk terlebih dahulu.', loginUrl: '/login' }, 401);
  }

  // ---- Customer-only pages ----
  if (startsWithAny(path, PROTECTED_PAGES) && !locals.isCustomer) {
    const returnPath = path + url.search;
    return context.redirect(`/login?next=${encodeURIComponent(returnPath)}`, 302);
  }

  // ---- Employee-only pages ----
  if (startsWithAny(path, PROTECTED_EMPLOYEE_PAGES) && !locals.isEmployee) {
    return context.redirect('/login', 302);
  }

  // ---- Auto-logout karyawan: sesi sliding 30 menit ----
  if (locals.isEmployee && claims) {
    setSessionCookie(context.cookies, createSession(locals.user, ESS_SESSION_TTL), ESS_SESSION_TTL);
  }

  // ---- Already signed in? Don't show login/register again ----
  if ((path === '/login' || path === '/register') && locals.isCustomer) {
    return context.redirect(safeNext(url.searchParams.get('next')), 302);
  }

  // ---- Legacy path: /beranda -> / ----
  if (path === '/beranda') {
    return context.redirect('/', 301);
  }

  const response = await next();

  // Auth-sensitive responses must never be cached
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
