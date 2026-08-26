import type { APIRoute } from 'astro';
import { LOCALES } from '../../lib/i18n.js';

const LOCALE_COOKIE = 'nl_lang';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const locale = formData.get('locale')?.toString();
  const next = formData.get('next')?.toString() || '/';

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
