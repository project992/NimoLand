import { handler, json } from '../../../lib/http.js';

export const prerender = false;

/* The session cookie is HTTP-only, so the SPA cannot read it. This is how the
   client learns who it is on page load — middleware has already verified the
   cookie and populated `locals.user`. */
export const GET = handler(async ({ locals }) => json({ user: locals.user ?? null }));
