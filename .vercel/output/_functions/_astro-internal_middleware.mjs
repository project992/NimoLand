import { e as defineMiddleware, s as sequence } from './chunks/render-context_KySmss7T.mjs';
import { r as readSession, S as SESSION_COOKIE, a as clearSessionCookie } from './chunks/session_Dx5B62S5.mjs';
import { s as safeNext } from './chunks/redirect_Do9XBSFN.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_C4ngcWkh.mjs';
import 'piccolore';
import './chunks/astro/server_rOUT-VGP.mjs';
import 'clsx';

/* Runs on every request.

   1. Reads the signed session cookie once and hangs the result on
      `Astro.locals` — this is the "load user data, roles and session state"
      trigger. Every page and endpoint downstream reads `locals.user` instead of
      re-parsing cookies or re-querying the database.
   2. Gates the protected routes. The check lives HERE rather than in each
      handler so a new booking route can't be added without protection by
      forgetting a guard. */

/** Pages that require a signed-in customer. Prefix match. */
const PROTECTED_PAGES = ['/booking', '/akun'];

/** API routes that require a signed-in customer. Prefix match. */
const PROTECTED_API = ['/api/bookings'];

/** API routes that require a signed-in employee. Prefix match. */
const EMPLOYEE_API = ['/api/ess/tickets', '/api/ess/verify'];

const startsWithAny = (path, prefixes) => prefixes.some(p => path === p || path.startsWith(p + '/'));

const onRequest$1 = defineMiddleware(async (context, next) => {
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

  // ---- Customer-only API ----
  if (startsWithAny(path, PROTECTED_API) && !locals.isCustomer) {
    return json({ error: 'Silakan masuk terlebih dahulu.', loginUrl: '/login' }, 401);
  }

  // ---- Customer-only pages: bounce to login, remembering where they were ----
  if (startsWithAny(path, PROTECTED_PAGES) && !locals.isCustomer) {
    const next = path + url.search;
    return context.redirect(`/login?next=${encodeURIComponent(next)}`, 302);
  }

  // ---- Already signed in? Don't show the login/register forms again ----
  if ((path === '/login' || path === '/register') && locals.isCustomer) {
    return context.redirect(safeNext(url.searchParams.get('next')), 302);
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

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
