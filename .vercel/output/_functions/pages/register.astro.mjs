import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute, l as renderScript } from '../chunks/astro/server_rOUT-VGP.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/createLucideIcon_C0cjg1zL.mjs';
import { $ as $$AuthShell } from '../chunks/AuthShell_CwCwjcMb.mjs';
import { U as UserPlus } from '../chunks/user-plus_CzrefJnw.mjs';
import { s as safeNext } from '../chunks/redirect_Do9XBSFN.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Register = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Register;
  const next = safeNext(Astro2.url.searchParams.get("next"));
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Daftar \u2014 Nimo Group", "description": "Buat akun Nimo Group untuk memesan tiket dan kamar." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "AuthShell", $$AuthShell, { "title": "Buat akun baru", "subtitle": "Cukup nama, email, dan password. Setelah mendaftar Anda langsung masuk dan bisa melanjutkan pemesanan." }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<form id="registerForm" class="mt-8" novalidate> <input type="hidden" id="nextUrl"${addAttribute(next, "value")}> <label for="name" class="label">Nama Lengkap</label> <input type="text" id="name" name="name" autocomplete="name" required maxlength="80" placeholder="Nama sesuai identitas" class="field mb-4"> <label for="email" class="label">Email</label> <input type="email" id="email" name="email" autocomplete="email" required placeholder="nama@email.com" class="field mb-4"> <label for="phone" class="label">
Nomor WhatsApp <span class="font-normal text-muted">(opsional)</span> </label> <input type="tel" id="phone" name="phone" autocomplete="tel" placeholder="08xxxxxxxxxx" class="field mb-4"> <label for="password" class="label">Password</label> <input type="password" id="password" name="password" autocomplete="new-password" required minlength="8" placeholder="Minimal 8 karakter" class="field mb-1.5"> <p class="text-xs text-muted mb-4">Minimal 8 karakter.</p> <p id="registerError" class="hidden note-error mb-4" role="alert"></p> <button type="submit" id="registerBtn" class="btn-primary w-full py-3.5"> ${renderComponent($$result3, "UserPlus", UserPlus, { "class": "w-4 h-4" })} Daftar &amp; Masuk
</button> </form> <p class="text-sm text-muted text-center mt-6">
Sudah punya akun?
<a${addAttribute(`/login?next=${encodeURIComponent(next)}`, "href")} class="font-heading font-semibold text-sage-deep border-b border-sage pb-0.5">
Masuk di sini
</a> </p> ` })} ${renderScript($$result2, "C:/Users/idris/Desktop/nimo project/src/pages/register.astro?astro&type=script&index=0&lang.ts")} ` })} `;
}, "C:/Users/idris/Desktop/nimo project/src/pages/register.astro", void 0);

const $$file = "C:/Users/idris/Desktop/nimo project/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
