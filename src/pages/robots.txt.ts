import type { APIRoute } from 'astro';
import { SITE } from '../lib/site.js';

export const prerender = false;

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *
Allow: /
Disallow: /api/
Disallow: /login
Disallow: /register
Disallow: /akun

Sitemap: ${SITE.url}/sitemap.xml
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );