/* Internationalization helpers.

   LOCALES: supported locale codes.
   getLocale Astro.server-side: reads from URL prefix or cookie.
   t(key): dot-notation translation lookup.
   formatPrice / formatDate / formatNumber: locale-aware formatters. */

import id from '../i18n/id.json' with { type: 'json' };
import en from '../i18n/en.json' with { type: 'json' };

export const LOCALES = ['id', 'en'];
export const DEFAULT_LOCALE = 'id';
export const LOCALE_LABELS = { id: 'ID', en: 'EN' };

const messages = { id, en };

/** Deep-get a translation by dot path, e.g. t('nav.beranda', 'en'). */
export function t(key, locale = DEFAULT_LOCALE) {
  const keys = key.split('.');
  let val = messages[locale] ?? messages[DEFAULT_LOCALE];
  for (const k of keys) {
    val = val?.[k];
    if (val === undefined) {
      // fallback to default locale
      let fb = messages[DEFAULT_LOCALE];
      for (const fk of keys) fb = fb?.[fk];
      return fb ?? key;
    }
  }
  return val;
}

/** Detect locale from URL path prefix (/en/... or /id/...). */
export function localeFromPath(pathname) {
  const first = pathname.split('/')[1];
  if (LOCALES.includes(first)) return first;
  return DEFAULT_LOCALE;
}

/** Detect locale from Accept-Language header. */
export function localeFromHeaders(request) {
  const accept = request?.headers?.get('accept-language') ?? '';
  for (const loc of LOCALES) {
    if (accept.toLowerCase().includes(loc)) return loc;
  }
  return DEFAULT_LOCALE;
}

/** Strip locale prefix from a path: /en/destinasi -> /destinasi */
export function stripLocale(pathname) {
  const first = pathname.split('/')[1];
  if (LOCALES.includes(first)) {
    return '/' + pathname.split('/').slice(2).join('/');
  }
  return pathname;
}

/** Add locale prefix: /destinasi -> /en/destinasi */
export function withLocale(path, locale) {
  if (locale === DEFAULT_LOCALE) return path;
  return '/' + locale + (path.startsWith('/') ? path : '/' + path);
}

/** Locale-aware price formatter. */
export function formatPrice(amount, currency = 'IDR', locale = DEFAULT_LOCALE) {
  if (amount == null) return '-';
  const localeMap = { id: 'id-ID', en: 'en-US' };
  const currencyMap = { id: 'IDR', en: 'USD', eur: 'EUR' };
  return new Intl.NumberFormat(localeMap[locale] ?? 'en-US', {
    style: 'currency',
    currency: currencyMap[currency] ?? currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Locale-aware date formatter. */
export function formatDate(date, locale = DEFAULT_LOCALE, opts = {}) {
  const localeMap = { id: 'id-ID', en: 'en-US' };
  return new Intl.DateTimeFormat(localeMap[locale] ?? 'en-US', {
    weekday: opts.weekday ?? 'long',
    day: 'numeric',
    month: opts.month ?? 'long',
    year: 'numeric',
    ...opts,
  }).format(date);
}

/** Locale-aware short date. */
export function formatDateShort(date, locale = DEFAULT_LOCALE) {
  return formatDate(date, locale, { weekday: undefined, month: 'short' });
}

/** Locale-aware number formatter. */
export function formatNumber(n, locale = DEFAULT_LOCALE) {
  const localeMap = { id: 'id-ID', en: 'en-US' };
  return new Intl.NumberFormat(localeMap[locale] ?? 'en-US').format(n);
}

/** Locale-aware og:locale meta content. */
export function ogLocale(locale) {
  return locale === 'id' ? 'id_ID' : 'en_US';
}

/** English URL slug mapping for navigation items. */
const SLUG_MAP = {
  '/destinasi': '/destinations',
  '/penginapan': '/accommodation',
  '/galeri': '/gallery',
  '/kontak': '/contact',
  '/tentang-kami': '/about-us',
  '/kebijakan-privasi': '/privacy',
  '/pembatalan-refund': '/cancellation-refund',
  '/login': '/login',
  '/register': '/register',
  '/akun': '/account',
  '/ess': '/ess',
};

/** Map an Indonesian path to its English equivalent. */
export function localizePath(path, locale) {
  if (locale === DEFAULT_LOCALE) return path;
  // Check exact match
  if (SLUG_MAP[path]) return SLUG_MAP[path];
  // Check dynamic routes: /destinasi/[slug] -> /destinations/[slug]
  for (const [idPath, enPath] of Object.entries(SLUG_MAP)) {
    if (path.startsWith(idPath + '/')) {
      return path.replace(idPath, enPath);
    }
  }
  return path;
}

/** Reverse: English path back to Indonesian. */
export function delocalizePath(path, locale) {
  if (locale === DEFAULT_LOCALE) return path;
  const reverseMap = Object.fromEntries(Object.entries(SLUG_MAP).map(([k, v]) => [v, k]));
  if (reverseMap[path]) return reverseMap[path];
  for (const [enPath, idPath] of Object.entries(reverseMap)) {
    if (path.startsWith(enPath + '/')) {
      return path.replace(enPath, idPath);
    }
  }
  return path;
}
