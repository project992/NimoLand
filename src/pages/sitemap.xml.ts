import type { APIRoute } from 'astro';
import { DESTINATIONS, HOTELS } from '../lib/data.js';
import { u } from '../lib/site.js';
import { LOCALES, DEFAULT_LOCALE, withLocale } from '../lib/i18n.js';

/* Server-generated sitemap. Every destination and penginapan automatically
   appears here via DESTINATIONS / HOTELS, so adding a venue later requires
   no further work. Now includes hreflang alternate links for i18n. */
const STATIC = [
  { path: '/', change: 'daily', pri: '1.0' },
  { path: '/destinasi', change: 'weekly', pri: '0.9' },
  { path: '/penginapan', change: 'weekly', pri: '0.9' },
  { path: '/galeri', change: 'weekly', pri: '0.6' },
  { path: '/kontak', change: 'monthly', pri: '0.6' },
  { path: '/tentang-kami', change: 'monthly', pri: '0.5' },
  { path: '/kebijakan-privasi', change: 'monthly', pri: '0.3' },
];

export const prerender = false;

export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10);
  const entries = [
    ...STATIC,
    ...DESTINATIONS.map(d => ({ path: `/destinasi/${d.id}`, change: 'weekly', pri: '0.8' })),
    ...HOTELS.map(h => ({ path: `/penginapan/${h.id}`, change: 'weekly', pri: '0.8' })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map(e => {
    const hreflangs = LOCALES.map(l =>
      `    <xhtml:link rel="alternate" hreflang="${l}" href="${u(withLocale(e.path, l))}" />`
    ).join('\n');
    return `  <url>
    <loc>${u(withLocale(e.path, DEFAULT_LOCALE))}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${e.change}</changefreq>
    <priority>${e.pri}</priority>
${hreflangs}
    <xhtml:link rel="alternate" hreflang="x-default" href="${u(e.path)}" />
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
