import type { APIRoute } from 'astro';
import { DESTINATIONS, HOTELS } from '../lib/data.js';
import { u } from '../lib/site.js';

/* Server-generated sitemap. Every destination and penginapan automatically
   appears here via DESTINATIONS / HOTELS, so adding a venue later requires
   no further work. */
const STATIC = [
  { path: '/', change: 'daily', pri: '1.0' },
  { path: '/destinasi', change: 'weekly', pri: '0.9' },
  { path: '/penginapan', change: 'weekly', pri: '0.9' },
  { path: '/galeri', change: 'weekly', pri: '0.6' },
  { path: '/kontak', change: 'monthly', pri: '0.6' },
  { path: '/tentang-kami', change: 'monthly', pri: '0.5' },
  { path: '/syarat-ketentuan', change: 'monthly', pri: '0.3' },
  { path: '/kebijakan-privasi', change: 'monthly', pri: '0.3' },
  { path: '/pembatalan-refund', change: 'monthly', pri: '0.3' },
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(e => `  <url>
    <loc>${u(e.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${e.change}</changefreq>
    <priority>${e.pri}</priority>
  </url>`)
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};