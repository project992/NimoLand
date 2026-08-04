import { h as handler, j as json } from '../../../chunks/http_BFk9SMn6.mjs';
import { a as clearSessionCookie } from '../../../chunks/session_Dx5B62S5.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;

// POST only. A GET logout can be triggered by any <img src> on another site.
const POST = handler(async ({ cookies }) => {
  clearSessionCookie(cookies);
  return json({ ok: true });
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
