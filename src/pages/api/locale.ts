import type { APIRoute } from 'astro';
import { LOCALES } from '../../lib/i18n.js';

const LOCALE_COOKIE = 'nl_lang';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  let locale = '';
  let next = '/';

  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      const body = await request.json();
      locale = body?.locale;
      next = body?.next || '/';
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }
  } else {
    const formData = await request.formData();
    locale = formData.get('locale')?.toString() || '';
    next = formData.get('next')?.toString() || '/';
  }

  if (!locale || !LOCALES.includes(locale)) {
    return new Response('Invalid locale', { status: 400 });
  }

  cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  return redirect(next, 302);
};
