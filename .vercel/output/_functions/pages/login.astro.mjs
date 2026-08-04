import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute, l as renderScript } from '../chunks/astro/server_rOUT-VGP.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/createLucideIcon_C0cjg1zL.mjs';
import { $ as $$AuthShell } from '../chunks/AuthShell_CwCwjcMb.mjs';
import { L as LogIn } from '../chunks/log-in_CT4UWUys.mjs';
import { s as safeNext } from '../chunks/redirect_Do9XBSFN.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const next = safeNext(Astro2.url.searchParams.get("next"));
  const cameFromGate = next !== "/";
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Masuk \u2014 Nimo Group", "description": "Masuk ke akun Nimo Group untuk memesan tiket dan kamar." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "AuthShell", $$AuthShell, { "title": "Masuk ke akun Anda", "subtitle": cameFromGate ? "Setelah masuk, Anda akan kembali ke halaman pemesanan yang tadi dibuka." : "Masuk untuk memesan tiket, menyimpan e-tiket, dan melihat riwayat pesanan." }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<form id="loginForm" class="mt-8" novalidate> <input type="hidden" id="nextUrl"${addAttribute(next, "value")}> <label for="email" class="label">Email</label> <input type="email" id="email" name="email" autocomplete="email" required placeholder="nama@email.com" class="field mb-4"> <label for="password" class="label">Password</label> <input type="password" id="password" name="password" autocomplete="current-password" required placeholder="Masukkan password" class="field mb-4"> <p id="loginError" class="hidden note-error mb-4" role="alert"></p> <button type="submit" id="loginBtn" class="btn-primary w-full py-3.5"> ${renderComponent($$result3, "LogIn", LogIn, { "class": "w-4 h-4" })} Masuk
</button> </form> <p class="text-sm text-muted text-center mt-6">
Belum punya akun?
<a${addAttribute(`/register?next=${encodeURIComponent(next)}`, "href")} class="font-heading font-semibold text-sage-deep border-b border-sage pb-0.5">
Daftar sekarang
</a> </p> ` })} ${renderScript($$result2, "C:/Users/idris/Desktop/nimo project/src/pages/login.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/Users/idris/Desktop/nimo project/src/pages/login.astro", void 0);

const $$file = "C:/Users/idris/Desktop/nimo project/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
