import { handler, json } from '../../../lib/http.js';
import { clearSessionCookie } from '../../../lib/session.js';

export const prerender = false;

// POST only. A GET logout can be triggered by any <img src> on another site.
export const POST = handler(async ({ cookies }) => {
  clearSessionCookie(cookies);
  return json({ ok: true });
});
