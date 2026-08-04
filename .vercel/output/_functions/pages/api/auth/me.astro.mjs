import { h as handler, j as json } from '../../../chunks/http_BFk9SMn6.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;

/* The session cookie is HTTP-only, so the SPA cannot read it. This is how the
   client learns who it is on page load — middleware has already verified the
   cookie and populated `locals.user`. */
const GET = handler(async ({ locals }) => json({ user: locals.user ?? null }));

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   GET,
   prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
