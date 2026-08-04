import { e as createComponent, m as maybeRenderHead, k as renderComponent, g as addAttribute, r as renderTemplate, n as Fragment, h as createAstro, l as renderScript, u as unescapeHTML } from '../chunks/astro/server_rOUT-VGP.mjs';
import 'piccolore';
import { c as createLucideIcon, $ as $$Base, j as jsonForScript } from '../chunks/createLucideIcon_C0cjg1zL.mjs';
import { T as Ticket, L as LogOut, B as BedDouble } from '../chunks/log-out_DClpdBpo.mjs';
import { L as LogIn } from '../chunks/log-in_CT4UWUys.mjs';
import { D as DESTINATIONS, H as HOTELS, d as HERO_SLIDES, P as PACKAGES, r as rupiah } from '../chunks/data_BJWyGgzs.mjs';
/* empty css                                 */
import 'clsx';
import { s as supabase } from '../chunks/supabase_BiwT-ogX.mjs';
import { S as ShieldCheck } from '../chunks/shield-check_DPK03t4b.mjs';
import { U as UserPlus } from '../chunks/user-plus_CzrefJnw.mjs';
export { renderers } from '../renderers.mjs';

const ChevronDown = createLucideIcon("chevron-down", [["path", { "d": "m6 9 6 6 6-6" }]]);

const ArrowRight = createLucideIcon("arrow-right", [["path", { "d": "M5 12h14" }], ["path", { "d": "m12 5 7 7-7 7" }]]);

const Menu = createLucideIcon("menu", [["path", { "d": "M4 5h16" }], ["path", { "d": "M4 12h16" }], ["path", { "d": "M4 19h16" }]]);

const X = createLucideIcon("x", [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]]);

const IdCard = createLucideIcon("id-card", [["path", { "d": "M16 10h2" }], ["path", { "d": "M16 14h2" }], ["path", { "d": "M6.17 15a3 3 0 0 1 5.66 0" }], ["circle", { "cx": "9", "cy": "11", "r": "2" }], ["rect", { "x": "2", "y": "5", "width": "20", "height": "14", "rx": "2" }]]);

const $$Astro$5 = createAstro();
const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Navbar;
  const user = Astro2.locals.user;
  const isCustomer = Astro2.locals.isCustomer;
  return renderTemplate`${maybeRenderHead()}<header id="navbar" class="fixed top-0 inset-x-0 z-50" data-astro-cid-5blmo7yk> <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10" data-astro-cid-5blmo7yk> <div class="flex items-center justify-between h-20" data-astro-cid-5blmo7yk> <a href="#/beranda" data-route="beranda" class="flex items-center gap-2 font-heading" data-astro-cid-5blmo7yk> <span class="brand-main text-xl lg:text-2xl font-bold tracking-wide transition-colors" data-astro-cid-5blmo7yk>NIMO</span> <span class="brand-sub text-xs lg:text-sm font-medium uppercase tracking-widest border-l pl-2 transition-colors" data-astro-cid-5blmo7yk>Highland</span> </a> <nav class="hidden lg:flex items-center gap-7 font-heading text-sm font-medium" data-astro-cid-5blmo7yk> <a href="#/beranda" data-route="beranda" class="nav-link transition-colors" data-astro-cid-5blmo7yk>Beranda</a> <div class="has-dropdown relative" data-astro-cid-5blmo7yk> <a href="#/destinations" data-route="destinations" class="nav-link flex items-center gap-1 transition-colors" data-astro-cid-5blmo7yk>
Destinations
${renderComponent($$result, "ChevronDown", ChevronDown, { "class": "w-3.5 h-3.5", "data-astro-cid-5blmo7yk": true })} </a> <div class="dropdown-panel absolute left-1/2 -translate-x-1/2 top-full pt-4 w-72" data-astro-cid-5blmo7yk> <div class="bg-surface rounded-xl shadow-lg border border-line-soft py-2" data-astro-cid-5blmo7yk> <p class="px-5 py-2 text-[11px] font-heading uppercase tracking-widest text-muted" data-astro-cid-5blmo7yk>Katalog Destinasi</p> <ul class="max-h-80 overflow-y-auto divide-y divide-line-soft" data-astro-cid-5blmo7yk> ${DESTINATIONS.map((d) => renderTemplate`<li data-astro-cid-5blmo7yk> <a href="#/destinations" data-route="destinations"${addAttribute(d.id, "data-dest")} class="block px-5 py-2.5 text-sm text-ink hover:bg-paper hover:text-sage-deep transition-colors" data-astro-cid-5blmo7yk> ${d.name} </a> </li>`)} </ul> <a href="#/destinations" data-route="destinations" class="flex items-center gap-2 px-5 py-3 text-sm font-heading font-semibold text-sage-deep bg-paper hover:bg-sage-tint transition-colors" data-astro-cid-5blmo7yk>
Lihat semua destinasi
${renderComponent($$result, "ArrowRight", ArrowRight, { "class": "w-4 h-4", "data-astro-cid-5blmo7yk": true })} </a> </div> </div> </div> <div class="has-dropdown relative" data-astro-cid-5blmo7yk> <a href="#/hotels" data-route="hotels" class="nav-link flex items-center gap-1 transition-colors" data-astro-cid-5blmo7yk>
Hotels
${renderComponent($$result, "ChevronDown", ChevronDown, { "class": "w-3.5 h-3.5", "data-astro-cid-5blmo7yk": true })} </a> <div class="dropdown-panel absolute left-1/2 -translate-x-1/2 top-full pt-4 w-72" data-astro-cid-5blmo7yk> <div class="bg-surface rounded-xl shadow-lg border border-line-soft py-2" data-astro-cid-5blmo7yk> <p class="px-5 py-2 text-[11px] font-heading uppercase tracking-widest text-muted" data-astro-cid-5blmo7yk>Penginapan</p> <ul class="divide-y divide-line-soft" data-astro-cid-5blmo7yk> ${HOTELS.map((h) => renderTemplate`<li data-astro-cid-5blmo7yk> <a href="#/hotels" data-route="hotels"${addAttribute(h.id, "data-hotel")} class="block px-5 py-2.5 text-sm text-ink hover:bg-paper hover:text-sage-deep transition-colors" data-astro-cid-5blmo7yk> ${h.name}<span class="block text-xs text-muted" data-astro-cid-5blmo7yk>${h.area}</span> </a> </li>`)} </ul> <a href="#/hotels" data-route="hotels" class="flex items-center gap-2 px-5 py-3 text-sm font-heading font-semibold text-sage-deep bg-paper hover:bg-sage-tint transition-colors" data-astro-cid-5blmo7yk>
Lihat semua penginapan
${renderComponent($$result, "ArrowRight", ArrowRight, { "class": "w-4 h-4", "data-astro-cid-5blmo7yk": true })} </a> </div> </div> </div> <a href="#/galeri" data-route="galeri" class="nav-link transition-colors" data-astro-cid-5blmo7yk>Galeri</a> <a href="#/beranda" data-route="beranda" data-scroll="tiket" class="nav-link transition-colors" data-astro-cid-5blmo7yk>Tiket</a> <a href="#/kontak" data-route="kontak" class="nav-link transition-colors" data-astro-cid-5blmo7yk>Kontak</a> </nav> <div class="flex items-center gap-2.5" data-astro-cid-5blmo7yk>  ${isCustomer ? renderTemplate`<div class="has-dropdown relative hidden sm:block" data-astro-cid-5blmo7yk> <button type="button" class="nav-account inline-flex items-center gap-2 border rounded-full pl-1.5 pr-3.5 py-1.5 transition-colors" data-astro-cid-5blmo7yk> <span class="w-7 h-7 rounded-full bg-sage text-white flex items-center justify-center font-heading font-bold text-xs" data-astro-cid-5blmo7yk> ${user.name.trim().charAt(0).toUpperCase()} </span> <span class="font-heading font-semibold text-sm max-w-[9rem] truncate" data-astro-cid-5blmo7yk>${user.name}</span> ${renderComponent($$result, "ChevronDown", ChevronDown, { "class": "w-3.5 h-3.5 opacity-60", "data-astro-cid-5blmo7yk": true })} </button> <div class="dropdown-panel absolute right-0 top-full pt-3 w-56" data-astro-cid-5blmo7yk> <div class="bg-surface rounded-xl shadow-lg border border-line-soft py-2" data-astro-cid-5blmo7yk> <p class="px-4 py-2 text-xs text-muted truncate" data-astro-cid-5blmo7yk>${user.email}</p> <a href="/akun" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-paper transition-colors" data-astro-cid-5blmo7yk> ${renderComponent($$result, "Ticket", Ticket, { "class": "w-4 h-4 text-muted", "data-astro-cid-5blmo7yk": true })} Pesanan Saya
</a> <button type="button" data-logout class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-danger-tint transition-colors" data-astro-cid-5blmo7yk> ${renderComponent($$result, "LogOut", LogOut, { "class": "w-4 h-4", "data-astro-cid-5blmo7yk": true })} Keluar
</button> </div> </div> </div>` : renderTemplate`<a href="/login" class="nav-account hidden sm:inline-flex items-center gap-2 border rounded-full px-4 py-2.5 font-heading font-semibold text-sm transition-colors" data-astro-cid-5blmo7yk> ${renderComponent($$result, "LogIn", LogIn, { "class": "w-4 h-4", "data-astro-cid-5blmo7yk": true })} Masuk
</a>`} <button type="button" data-open-booking="ticket" class="hidden sm:inline-flex items-center gap-2 bg-clay hover:bg-clay-deep text-white font-heading font-semibold text-sm px-5 py-2.5 rounded-full transition-colors" data-astro-cid-5blmo7yk> ${renderComponent($$result, "Ticket", Ticket, { "class": "w-4 h-4", "data-astro-cid-5blmo7yk": true })} Beli Tiket
</button> <button id="mobileMenuBtn" aria-label="Buka menu" aria-expanded="false" aria-controls="mobileMenu" class="burger lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors" data-astro-cid-5blmo7yk> ${renderComponent($$result, "Menu", Menu, { "id": "iconOpen", "class": "w-6 h-6", "data-astro-cid-5blmo7yk": true })} ${renderComponent($$result, "X", X, { "id": "iconClose", "class": "w-6 h-6 hidden", "data-astro-cid-5blmo7yk": true })} </button> </div> </div> </div> <!-- Mobile panel --> <div id="mobileMenu" class="lg:hidden hidden bg-surface border-t border-line-soft shadow-lg max-h-[80vh] overflow-y-auto" data-astro-cid-5blmo7yk> <nav class="px-5 py-4 flex flex-col gap-1 font-heading text-sm text-ink" data-astro-cid-5blmo7yk> <a href="#/beranda" data-route="beranda" class="py-3 border-b border-line-soft" data-astro-cid-5blmo7yk>Beranda</a> <details class="border-b border-line-soft" data-astro-cid-5blmo7yk> <summary class="py-3 cursor-pointer list-none flex items-center justify-between" data-astro-cid-5blmo7yk>
Destinations ${renderComponent($$result, "ChevronDown", ChevronDown, { "class": "w-4 h-4", "data-astro-cid-5blmo7yk": true })} </summary> <ul class="pb-2 pl-3 flex flex-col gap-1 text-muted" data-astro-cid-5blmo7yk> ${DESTINATIONS.map((d) => renderTemplate`<li data-astro-cid-5blmo7yk><a href="#/destinations" data-route="destinations"${addAttribute(d.id, "data-dest")} class="block py-2" data-astro-cid-5blmo7yk>${d.name}</a></li>`)} </ul> </details> <details class="border-b border-line-soft" data-astro-cid-5blmo7yk> <summary class="py-3 cursor-pointer list-none flex items-center justify-between" data-astro-cid-5blmo7yk>
Hotels ${renderComponent($$result, "ChevronDown", ChevronDown, { "class": "w-4 h-4", "data-astro-cid-5blmo7yk": true })} </summary> <ul class="pb-2 pl-3 flex flex-col gap-1 text-muted" data-astro-cid-5blmo7yk> ${HOTELS.map((h) => renderTemplate`<li data-astro-cid-5blmo7yk><a href="#/hotels" data-route="hotels"${addAttribute(h.id, "data-hotel")} class="block py-2" data-astro-cid-5blmo7yk>${h.name}</a></li>`)} </ul> </details> <a href="#/galeri" data-route="galeri" class="py-3 border-b border-line-soft" data-astro-cid-5blmo7yk>Galeri</a> <a href="#/beranda" data-route="beranda" data-scroll="tiket" class="py-3 border-b border-line-soft" data-astro-cid-5blmo7yk>Tiket</a> <a href="#/kontak" data-route="kontak" class="py-3 border-b border-line-soft" data-astro-cid-5blmo7yk>Kontak</a> ${isCustomer ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-5blmo7yk": true }, { "default": ($$result2) => renderTemplate` <a href="/akun" class="mt-3 btn-outline" data-astro-cid-5blmo7yk>${renderComponent($$result2, "Ticket", Ticket, { "class": "w-4 h-4", "data-astro-cid-5blmo7yk": true })} Pesanan Saya</a> <button type="button" data-logout class="mt-2 btn-outline text-danger" data-astro-cid-5blmo7yk>${renderComponent($$result2, "LogOut", LogOut, { "class": "w-4 h-4", "data-astro-cid-5blmo7yk": true })} Keluar</button> ` })}` : renderTemplate`<a href="/login" class="mt-3 btn-outline" data-astro-cid-5blmo7yk>${renderComponent($$result, "LogIn", LogIn, { "class": "w-4 h-4", "data-astro-cid-5blmo7yk": true })} Masuk atau Daftar</a>`} <button type="button" data-open-booking="ticket" class="mt-2 btn-accent" data-astro-cid-5blmo7yk> ${renderComponent($$result, "Ticket", Ticket, { "class": "w-4 h-4", "data-astro-cid-5blmo7yk": true })} Beli Tiket Sekarang
</button> <button type="button" data-open-ess class="mt-2 btn-outline text-muted" data-astro-cid-5blmo7yk> ${renderComponent($$result, "IdCard", IdCard, { "class": "w-4 h-4", "data-astro-cid-5blmo7yk": true })} Portal ESS (Karyawan)
</button> </nav> </div> </header> `;
}, "C:/Users/idris/Desktop/nimo project/src/components/Navbar.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="bg-bark pt-16 pb-8"> <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"> <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10"> <div class="lg:col-span-2"> <a href="#/beranda" data-route="beranda" class="flex items-center gap-2 font-heading font-bold text-white text-xl mb-4">
NIMO <span class="text-white/60 text-sm font-medium tracking-widest uppercase">Highland</span> </a> <p class="text-white/55 text-sm leading-relaxed max-w-xs">
Perusahaan pariwisata yang berfokus pada dampak sosial, UMKM, dan energi terbarukan.
</p> </div> <div> <p class="font-heading text-white text-sm font-semibold uppercase tracking-widest mb-5">Jelajah</p> <ul class="space-y-3 text-sm text-white/55"> <li><a href="#/beranda" data-route="beranda" class="hover:text-white transition-colors">Beranda</a></li> <li><a href="#/destinations" data-route="destinations" class="hover:text-white transition-colors">Destinations</a></li> <li><a href="#/hotels" data-route="hotels" class="hover:text-white transition-colors">Hotels</a></li> <li><a href="#/galeri" data-route="galeri" class="hover:text-white transition-colors">Galeri</a></li> </ul> </div> <div> <p class="font-heading text-white text-sm font-semibold uppercase tracking-widest mb-5">Informasi</p> <ul class="space-y-3 text-sm text-white/55"> <li><a href="#/beranda" data-route="beranda" data-scroll="tiket" class="hover:text-white transition-colors">Harga Tiket</a></li> <li><a href="#/beranda" data-route="beranda" data-scroll="faq" class="hover:text-white transition-colors">FAQ</a></li> <li><a href="#/kontak" data-route="kontak" class="hover:text-white transition-colors">Kontak</a></li> <li><button type="button" data-open-ess class="hover:text-white transition-colors">Portal ESS (Karyawan)</button></li> </ul> </div> </div> <div class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 text-xs text-white/45 font-heading tracking-wide"> <span>© 2026 Nimo Land. All rights reserved.</span> <span class="flex items-center gap-3"> <span>Pangalengan, Bandung — Jawa Barat</span> <button type="button" data-open-ess class="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors border border-white/15 rounded-full px-3 py-1"> ${renderComponent($$result, "IdCard", IdCard, { "class": "w-3.5 h-3.5" })} Portal ESS
</button> </span> </div> </div> </footer>`;
}, "C:/Users/idris/Desktop/nimo project/src/components/Footer.astro", void 0);

const $$Astro$4 = createAstro();
const $$BrandIcon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$BrandIcon;
  const { name, class: cls = "w-4 h-4" } = Astro2.props;
  const PATHS = {
    whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.898 9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.8 11.8 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413",
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0m0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881",
    tiktok: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07"
  };
  const d = PATHS[name];
  if (!d) throw new Error(`unknown brand icon: ${name}`);
  return renderTemplate`${maybeRenderHead()}<svg${addAttribute(cls, "class")} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path${addAttribute(d, "d")}></path></svg>`;
}, "C:/Users/idris/Desktop/nimo project/src/components/BrandIcon.astro", void 0);

const $$FloatingActions = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="fixed right-4 sm:right-6 bottom-5 sm:bottom-8 z-40 flex flex-col items-end gap-3"> <a href="https://wa.me/6281111121162" target="_blank" rel="noopener" aria-label="Hubungi via WhatsApp" class="flex items-center gap-2 bg-sage hover:bg-sage-deep text-white font-heading font-semibold text-sm pl-4 pr-5 py-3 rounded-full transition-colors" style="box-shadow: var(--shadow-lift)"> ${renderComponent($$result, "BrandIcon", $$BrandIcon, { "name": "whatsapp", "class": "w-5 h-5" })} <span class="hidden sm:inline">WhatsApp</span> </a> <button type="button" data-open-booking="ticket" aria-label="Beli tiket sekarang" class="flex items-center gap-2 bg-clay hover:bg-clay-deep text-white font-heading font-bold text-sm pl-4 pr-5 py-3.5 rounded-full transition-colors" style="box-shadow: var(--shadow-lift)"> ${renderComponent($$result, "Ticket", Ticket, { "class": "w-5 h-5" })}
Beli Tiket
</button> </div>`;
}, "C:/Users/idris/Desktop/nimo project/src/components/FloatingActions.astro", void 0);

const ChevronLeft = createLucideIcon("chevron-left", [["path", { "d": "m15 18-6-6 6-6" }]]);

const ChevronRight = createLucideIcon("chevron-right", [["path", { "d": "m9 18 6-6-6-6" }]]);

const MapPin = createLucideIcon("map-pin", [["path", { "d": "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" }], ["circle", { "cx": "12", "cy": "10", "r": "3" }]]);

const Sunrise = createLucideIcon("sunrise", [["path", { "d": "M12 2v8" }], ["path", { "d": "m4.93 10.93 1.41 1.41" }], ["path", { "d": "M2 18h2" }], ["path", { "d": "M20 18h2" }], ["path", { "d": "m19.07 10.93-1.41 1.41" }], ["path", { "d": "M22 22H2" }], ["path", { "d": "m8 6 4-4 4 4" }], ["path", { "d": "M16 18a4 4 0 0 0-8 0" }]]);

const Sparkles = createLucideIcon("sparkles", [["path", { "d": "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" }], ["path", { "d": "M20 2v4" }], ["path", { "d": "M22 4h-4" }], ["circle", { "cx": "4", "cy": "20", "r": "2" }]]);

const Star = createLucideIcon("star", [["path", { "d": "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" }]]);

/* Official ratings + review counts per destination.

   Source of truth is the `destination_ratings` view in Supabase (see
   supabase-schema.sql), which aggregates the `reviews` table. Read-only here:
   nothing in the app writes reviews yet.

   If Supabase is unreachable or unconfigured, this returns {} and every rating
   badge simply doesn't render — a missing rating must never be faked, and a
   database blip must never take down the homepage. */

const CACHE_MS = 5 * 60 * 1000;
let cache = { at: 0, data: null };

/**
 * @returns {Promise<Record<string, {rating: number, count: number, source: string|null}>>}
 *          keyed by destination id, e.g. { 'nimo-highland': {...} }
 */
async function getRatings() {
  if (cache.data && Date.now() - cache.at < CACHE_MS) return cache.data;

  if (!supabase) return {};

  const { data, error } = await supabase
    .from('destination_ratings')
    .select('destination_id, rating, review_count, source');

  if (error) {
    console.error('[ratings] load failed:', error.message);
    // Serve a stale cache rather than dropping the badges entirely.
    return cache.data ?? {};
  }

  const byId = {};
  for (const row of data ?? []) {
    if (row.rating == null || row.review_count == null) continue;
    byId[row.destination_id] = {
      rating: Number(row.rating),
      count: Number(row.review_count),
      source: row.source ?? null,
    };
  }

  cache = { at: Date.now(), data: byId };
  return byId;
}

/** Indonesian thousands separator: 12431 -> "12.431" */
function formatCount(n) {
  return Number(n).toLocaleString('id-ID');
}

/** One decimal place, comma separator: 4.6 -> "4,6" */
function formatRating(n) {
  return Number(n).toFixed(1).replace('.', ',');
}

const $$Astro$3 = createAstro();
const $$RatingBadge = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$RatingBadge;
  const { rating, size = "sm", tone = "dark", class: cls = "" } = Astro2.props;
  const sizes = {
    sm: { wrap: "text-xs px-2.5 py-1 gap-1.5", icon: "w-3.5 h-3.5", score: "text-xs" },
    md: { wrap: "text-sm px-3 py-1.5 gap-2", icon: "w-4 h-4", score: "text-sm" },
    lg: { wrap: "text-sm px-4 py-2 gap-2", icon: "w-4.5 h-4.5", score: "text-base" }
  };
  const s = sizes[size] ?? sizes.sm;
  const tones = {
    dark: "bg-clay-tint border-clay/25 text-ink",
    light: "bg-white/15 border-white/25 text-white backdrop-blur-sm"
  };
  const label = rating ? `Rating resmi ${formatRating(rating.rating)} dari 5, berdasarkan ${formatCount(rating.count)} ulasan${rating.source ? ` di ${rating.source}` : ""}` : "";
  return renderTemplate`${rating && renderTemplate`${maybeRenderHead()}<span${addAttribute(["inline-flex items-center rounded-full border font-heading", s.wrap, tones[tone], cls], "class:list")}${addAttribute(label, "title")}${addAttribute(label, "aria-label")}>${renderComponent($$result, "Star", Star, { "class": `${s.icon} fill-clay text-clay shrink-0`, "aria-hidden": "true" })}<span${addAttribute(["font-bold", s.score], "class:list")}>${formatRating(rating.rating)}</span><span class="opacity-70 font-normal">(${formatCount(rating.count)})</span></span>`}`;
}, "C:/Users/idris/Desktop/nimo project/src/components/RatingBadge.astro", void 0);

const $$Astro$2 = createAstro();
const $$Beranda = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Beranda;
  const { ratings = {} } = Astro2.props;
  const headline = ratings["nimo-highland"] ?? null;
  const facilitiesTop = [
    "Restaurant",
    "Sky Bridge",
    "Bean Bag & Net Area",
    "Glass Sky Bridge",
    "Flying Fox",
    "F&B Stand",
    "Souvenir Shop"
  ];
  const facilitiesBottom = [
    "Nimo Zoo",
    "Food Court",
    "Souvenir Shop",
    "Musholla",
    "Playground",
    "Parkir",
    "Toilet",
    "Shuttle lokal"
  ];
  const priceTables = [
    {
      label: "Domestik",
      rows: [
        ["Dewasa \xB7 Weekday", "Rp 40.000"],
        ["Dewasa \xB7 Weekend", "Rp 45.000"],
        ["Anak \xB7 Weekday", "Rp 45.000"],
        ["Anak \xB7 Weekend", "Rp 35.000"]
      ]
    },
    {
      label: "Mancanegara",
      rows: [
        ["Dewasa \xB7 Weekday", "Rp 80.000"],
        ["Dewasa \xB7 Weekend", "Rp 90.000"],
        ["Anak \xB7 Weekday", "Rp 60.000"],
        ["Anak \xB7 Weekend", "Rp 70.000"]
      ]
    },
    {
      label: "Nimo Eye \xB7 Bianglala",
      rows: [
        ["Regular \xB7 Weekday", "Rp 55.000"],
        ["Regular \xB7 Weekend", "Rp 60.000"],
        ["Sunrise \xB7 Weekday", "Rp 60.000"]
      ],
      note: "Kabin 4 pax, 1 putaran \xB1 10 menit. Bianglala tertinggi di Indonesia (rekor MURI)."
    }
  ];
  return renderTemplate`${maybeRenderHead()}<div class="view" data-view="beranda"> <!-- ============ HERO ============ --> <section class="relative min-h-[100svh] flex items-end overflow-hidden bg-bark"> <div id="heroTrack" class="absolute inset-0"> ${HERO_SLIDES.map((s, i) => renderTemplate`<div${addAttribute(["hero-slide absolute inset-0", i === 0 && "active"], "class:list")}> <div class="img-shell absolute inset-0"> <img class="w-full h-full object-cover"${addAttribute(s.alt, "alt")}${addAttribute(s.img, "src")}${addAttribute(s.fb, "data-fallback")}${addAttribute(i === 0 ? "high" : void 0, "fetchpriority")}> </div> </div>`)} </div>  <div class="absolute inset-0 bg-bark/55 pointer-events-none"></div> <button id="heroPrev" type="button" aria-label="Slide sebelumnya" class="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"> ${renderComponent($$result, "ChevronLeft", ChevronLeft, { "class": "w-5 h-5" })} </button> <button id="heroNext" type="button" aria-label="Slide berikutnya" class="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"> ${renderComponent($$result, "ChevronRight", ChevronRight, { "class": "w-5 h-5" })} </button> <div class="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pb-16 lg:pb-24 w-full"> <p class="eyebrow text-white/80 mb-4"> ${renderComponent($$result, "MapPin", MapPin, { "class": "w-4 h-4" })} Pangalengan · Bandung
</p> <h1 class="font-heading font-bold text-white text-4xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-3xl">
Nimo Group
</h1> <div class="flex flex-wrap items-center gap-4 mt-3"> <p class="font-heading text-white/85 text-lg sm:text-2xl italic">Embrace the Serene Breeze</p> ${renderComponent($$result, "RatingBadge", $$RatingBadge, { "rating": headline, "size": "md", "tone": "light" })} </div> <p class="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl mt-6">
Destinasi kebun teh di Pangalengan, Bandung, dengan daya tarik utama Sky Bridge berbentuk U
        yang membentang di atas hamparan kebun teh — panorama 360° yang jarang ditemui di tempat lain.
</p> <div class="flex flex-wrap items-center gap-4 mt-8"> <button type="button" data-open-booking="ticket" class="btn-accent px-7 py-3.5 sm:text-base"> ${renderComponent($$result, "Ticket", Ticket, { "class": "w-4 h-4" })} Beli Tiket Sekarang
${renderComponent($$result, "ArrowRight", ArrowRight, { "class": "w-4 h-4" })} </button> <a href="#/hotels" data-route="hotels" class="inline-flex items-center gap-2 text-white/90 font-heading text-sm sm:text-base border-b border-white/40 hover:border-white pb-1 transition-colors">
Lihat Penginapan
</a> </div> <div id="heroDots" class="flex items-center gap-2 mt-10"></div> </div> </section> <!-- ============ TENTANG ============ --> <section id="tentang" class="bg-surface py-20 lg:py-28"> <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"> <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"> <div class="reveal"> <p class="eyebrow text-sage-deep mb-4"> <span class="w-6 h-px bg-sage"></span> Tentang Destinasi
</p> <h2 class="font-heading font-bold text-ink text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-lg">
Kebun Teh dengan Panorama 360°
</h2> ${headline && renderTemplate`<div class="flex items-center gap-3 mt-5"> ${renderComponent($$result, "RatingBadge", $$RatingBadge, { "rating": headline, "size": "lg" })} ${headline.source && renderTemplate`<span class="text-xs text-muted">Rating resmi · ${headline.source}</span>`} </div>`} <p class="text-muted text-sm sm:text-base leading-relaxed mt-6 max-w-lg">
Saat malam surut, selimut kabut tipis menyapu kebun teh dan menciptakan suasana yang terasa
            seperti mimpi. Cakrawala kemudian menyala dalam warna amber dan merah — golden hour dalam
            bentuknya yang paling murni.
</p> <p class="text-muted text-sm sm:text-base leading-relaxed mt-4 max-w-lg">
Daya tarik utamanya adalah <span class="text-ink font-semibold">Sky Bridge berbentuk U</span>
yang menjulang di atas hamparan hijau. Di momen-momen sunyi itu, hanya kicau burung pagi
            yang menemani.
</p> <div class="grid grid-cols-3 gap-4 mt-10 max-w-md"> <div class="border-l-2 border-sage pl-4"> <p class="font-heading font-bold text-ink text-2xl">360<span class="text-sm">°</span></p> <p class="text-xs text-muted mt-1">Panorama Sky Bridge</p> </div> <div class="border-l-2 border-sage pl-4"> <p class="font-heading font-bold text-ink text-2xl">12+</p> <p class="text-xs text-muted mt-1">Wahana &amp; aktivitas</p> </div> <div class="border-l-2 border-sage pl-4"> <p class="font-heading font-bold text-ink text-2xl">05.00</p> <p class="text-xs text-muted mt-1">Buka akhir pekan</p> </div> </div> <a href="#/destinations" data-route="destinations" class="inline-flex items-center gap-2 font-heading font-semibold text-sage-deep text-sm mt-10 border-b-2 border-sage pb-1 hover:gap-3 transition-all">
Jelajahi destinasi lain
${renderComponent($$result, "ArrowRight", ArrowRight, { "class": "w-4 h-4" })} </a> </div> <div class="relative reveal"> <div id="momentSlider" class="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] rounded-2xl overflow-hidden img-shell"></div> <div class="hidden sm:flex absolute -bottom-6 -left-6 card px-5 py-4 items-center gap-3"> <div class="w-10 h-10 rounded-full bg-sage-tint flex items-center justify-center shrink-0"> ${renderComponent($$result, "Sunrise", Sunrise, { "class": "w-5 h-5 text-sage-deep" })} </div> <div> <p class="font-heading font-bold text-ink text-sm">Buka setiap hari</p> <p class="text-xs text-muted">Sabtu &amp; Minggu dari 05.00</p> </div> </div> </div> </div> </div> </section> <!-- ============ WAHANA ============ --> <section id="wahana" class="bg-paper py-20 lg:py-28"> <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"> <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 reveal"> <div> <p class="eyebrow text-sage-deep mb-4"> <span class="w-6 h-px bg-sage"></span> Wahana &amp; Aktivitas
</p> <h2 class="font-heading font-bold text-ink text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-lg">
Satu Bukit, Segudang Cerita
</h2> </div> <p class="text-muted text-sm max-w-sm">
Pilih kategori untuk menyaring daftar wahana. Semua tersedia di area Nimo Group.
</p> </div> <div id="filterTabs" class="flex flex-wrap gap-3 mb-4" role="group" aria-label="Filter kategori wahana"></div> <p id="filterCount" class="text-xs text-muted mb-8" aria-live="polite"></p> <div id="wahanaGrid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"></div> <p id="wahanaEmpty" class="hidden text-center text-muted text-sm py-12">Belum ada wahana pada kategori ini.</p> </div> </section> <!-- ============ TIKET ============ --> <section id="tiket" class="bg-bark py-20 lg:py-28"> <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"> <div class="max-w-2xl mb-14 reveal"> <p class="eyebrow text-white/70 mb-4"> <span class="w-6 h-px bg-white/40"></span> Tickets &amp; Promotions
</p> <h2 class="font-heading font-bold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">Harga Tiket Masuk</h2> <p class="text-white/65 text-sm sm:text-base mt-4">
Pemesanan online dilakukan minimal H-1 sebelum kedatangan, dan tiket berlaku maksimal 3 hari
          sejak tanggal kedatangan yang dipilih.
</p> </div> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> ${priceTables.map((t) => renderTemplate`<div class="bg-white/5 border border-white/10 rounded-2xl p-7"> <p class="text-white/70 font-heading font-medium uppercase text-xs tracking-widest mb-4">${t.label}</p> <ul class="text-sm divide-y divide-white/10"> ${t.rows.map(([name, price]) => renderTemplate`<li class="flex justify-between py-2.5"> <span class="text-white/60">${name}</span> <span class="text-white font-medium">${price}</span> </li>`)} </ul> ${t.note && renderTemplate`<p class="text-xs text-white/45 mt-4 leading-relaxed">${t.note}</p>`} </div>`)} </div> <div class="flex justify-center mt-12"> <button type="button" data-open-booking="ticket" class="btn-accent px-8 py-3.5 sm:text-base"> ${renderComponent($$result, "Ticket", Ticket, { "class": "w-4 h-4" })} Pesan Tiket Online
${renderComponent($$result, "ArrowRight", ArrowRight, { "class": "w-4 h-4" })} </button> </div> </div> </section> <!-- ============ FASILITAS ============ --> <section id="fasilitas" class="bg-canvas py-20 lg:py-28"> <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"> <div class="mb-12 reveal"> <p class="eyebrow text-sage-deep mb-4"> <span class="w-6 h-px bg-sage"></span> Fasilitas
</p> <h2 class="font-heading font-bold text-ink text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-lg">
Area Atas &amp; Area Bawah Bukit
</h2> </div> <div class="grid md:grid-cols-2 gap-6"> ${[["Area Atas Bukit", facilitiesTop, "bg-sage"], ["Area Bawah Bukit", facilitiesBottom, "bg-clay"]].map(
    ([title, items, dot]) => renderTemplate`<div class="card p-7 reveal"> <h3 class="font-heading font-semibold text-ink text-lg mb-5">${title}</h3> <ul class="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-muted"> ${items.map((f) => renderTemplate`<li class="flex items-center gap-2"> <span${addAttribute(["w-1.5 h-1.5 rounded-full shrink-0", dot], "class:list")}></span>${f} </li>`)} </ul> </div>`
  )} </div> </div> </section> <!-- ============ FAQ ============ --> <section id="faq" class="bg-surface py-20 lg:py-28"> <div class="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10"> <div class="text-center mb-12 reveal"> <p class="eyebrow text-sage-deep mb-4 justify-center"> ${renderComponent($$result, "Sparkles", Sparkles, { "class": "w-4 h-4" })} FAQ
</p> <h2 class="font-heading font-bold text-ink text-3xl sm:text-4xl lg:text-5xl leading-tight">
Pertanyaan Umum
</h2> </div> <div id="faqList" class="space-y-3"></div> </div> </section> </div>`;
}, "C:/Users/idris/Desktop/nimo project/src/components/views/Beranda.astro", void 0);

const Search = createLucideIcon("search", [["path", { "d": "m21 21-4.34-4.34" }], ["circle", { "cx": "11", "cy": "11", "r": "8" }]]);

const $$DestinationsView = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="view" data-view="destinations"> <section class="bg-bark pt-32 pb-16 lg:pt-40 lg:pb-20"> <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"> <p class="eyebrow text-white/70 mb-4"> <span class="w-6 h-px bg-white/40"></span> Katalog Destinasi
</p> <h1 class="font-heading font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-2xl">
Semua Destinasi Nimo
</h1> <p class="text-white/65 text-sm sm:text-base mt-5 max-w-xl">
Dari kebun teh di ketinggian hingga taman air dan kebun binatang. Saring berdasarkan jenis atau
        wilayah, lalu buka detailnya tanpa keluar dari halaman ini.
</p> </div> </section> <section class="bg-canvas py-14 lg:py-20"> <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"> <div class="flex flex-col lg:flex-row lg:items-center gap-5 mb-6"> <div class="relative flex-1 max-w-sm"> ${renderComponent($$result, "Search", Search, { "class": "w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" })} <label for="destSearch" class="sr-only">Cari destinasi</label> <input type="search" id="destSearch" placeholder="Cari destinasi…" class="field rounded-full pl-11"> </div> <div id="destFilters" class="flex flex-wrap gap-3" role="group" aria-label="Filter jenis destinasi"></div> </div> <p id="destCount" class="text-xs text-muted mb-8" aria-live="polite"></p> <div id="destGrid" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"></div> <p id="destEmpty" class="hidden text-center text-muted text-sm py-16">
Tidak ada destinasi yang cocok dengan pencarian.
</p> </div> </section> </div>`;
}, "C:/Users/idris/Desktop/nimo project/src/components/views/DestinationsView.astro", void 0);

const $$HotelsView = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="view" data-view="hotels"> <section class="bg-bark pt-32 pb-16 lg:pt-40 lg:pb-20"> <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"> <p class="eyebrow text-white/70 mb-4"> <span class="w-6 h-px bg-white/40"></span> Akomodasi
</p> <h1 class="font-heading font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-2xl">
Menginap di Tengah Kebun Teh
</h1> <p class="text-white/65 text-sm sm:text-base mt-5 max-w-xl">
Villa kayu, glamping, sampai cabin dengan balkon menghadap perkebunan. Pilih tipe kamar,
        lihat fasilitasnya, lalu pesan langsung di sini.
</p> </div> </section> <section class="bg-canvas py-14 lg:py-20"> <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"> <div id="hotelTabs" class="flex flex-wrap gap-3 mb-4" role="group" aria-label="Filter tipe kamar"></div> <p id="roomCount" class="text-xs text-muted mb-8" aria-live="polite"></p> <div id="roomGrid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"></div> </div> </section> <section class="bg-surface py-16 lg:py-20"> <div class="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10 text-center"> <h2 class="font-heading font-bold text-ink text-2xl sm:text-3xl leading-tight">
Butuh rombongan atau tanggal khusus?
</h2> <p class="text-muted text-sm mt-4">
Tim reservasi bisa membantu mengatur blok kamar, paket menginap plus tiket masuk, atau acara perusahaan.
</p> <a href="https://wa.me/6281111121162" target="_blank" rel="noopener" class="btn-dark mt-7 px-7 py-3.5"> ${renderComponent($$result, "BrandIcon", $$BrandIcon, { "name": "whatsapp", "class": "w-4 h-4" })} Hubungi Tim Reservasi
</a> </div> </section> </div>`;
}, "C:/Users/idris/Desktop/nimo project/src/components/views/HotelsView.astro", void 0);

const $$GaleriView = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="view" data-view="galeri"> <section class="bg-bark pt-32 pb-16 lg:pt-40 lg:pb-20"> <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"> <p class="eyebrow text-white/70 mb-4"> <span class="w-6 h-px bg-white/40"></span> Galeri
</p> <h1 class="font-heading font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight">
Momen di Nimo Group
</h1> <p class="text-white/65 text-sm sm:text-base mt-5 max-w-xl">
Klik salah satu foto untuk membukanya dalam tampilan penuh. Gunakan tombol panah di layar,
        atau tombol <kbd class="px-1.5 py-0.5 rounded border border-white/25 text-[11px]">&larr;</kbd>
dan <kbd class="px-1.5 py-0.5 rounded border border-white/25 text-[11px]">&rarr;</kbd>
pada keyboard, untuk berpindah.
</p> </div> </section> <section class="bg-surface py-14 lg:py-20"> <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"> <div id="galleryGrid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"></div> </div> </section> </div>`;
}, "C:/Users/idris/Desktop/nimo project/src/components/views/GaleriView.astro", void 0);

const Clock = createLucideIcon("clock", [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M12 6v6l4 2" }]]);

const MessageCircle = createLucideIcon("message-circle", [["path", { "d": "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" }]]);

const $$KontakView = createComponent(($$result, $$props, $$slots) => {
  const hours = [
    ["Senin \u2013 Jumat", "08.00\u201317.00"],
    ["Sabtu", "05.00\u201317.00"],
    ["Minggu", "05.00\u201317.00"]
  ];
  return renderTemplate`${maybeRenderHead()}<div class="view" data-view="kontak"> <section class="bg-bark pt-32 pb-16 lg:pt-40 lg:pb-20"> <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"> <p class="eyebrow text-white/70 mb-4"> <span class="w-6 h-px bg-white/40"></span> Kontak
</p> <h1 class="font-heading font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight">
Rencanakan Kunjunganmu
</h1> </div> </section> <section class="bg-canvas py-14 lg:py-20"> <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"> <div class="grid lg:grid-cols-3 gap-6"> <div class="card p-7"> <div class="w-11 h-11 rounded-full bg-sage-tint flex items-center justify-center mb-5"> ${renderComponent($$result, "Clock", Clock, { "class": "w-5 h-5 text-sage-deep" })} </div> <h3 class="font-heading font-semibold text-ink text-lg mb-5">Jam Operasional</h3> <ul class="text-sm divide-y divide-line-soft"> ${hours.map(([day, time]) => renderTemplate`<li class="flex justify-between py-2.5"> <span class="text-muted">${day}</span> <span class="text-ink font-medium">${time}</span> </li>`)} </ul> </div> <div class="card p-7"> <div class="w-11 h-11 rounded-full bg-sage-tint flex items-center justify-center mb-5"> ${renderComponent($$result, "MessageCircle", MessageCircle, { "class": "w-5 h-5 text-sage-deep" })} </div> <h3 class="font-heading font-semibold text-ink text-lg mb-3">Kontak &amp; Reservasi</h3> <p class="text-muted text-sm leading-relaxed mb-4">
Hubungi tim reservasi untuk rombongan, perubahan jadwal, atau pertanyaan lain.
</p> <a href="https://wa.me/6281111121162" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-sage-deep font-heading font-semibold text-sm border-b-2 border-sage pb-1"> ${renderComponent($$result, "BrandIcon", $$BrandIcon, { "name": "whatsapp", "class": "w-4 h-4" })} 0811-1112-1162
</a> <div class="flex items-center gap-3 mt-6"> <a href="https://www.instagram.com/nimohighland/" target="_blank" rel="noopener" aria-label="Instagram Nimo Group" class="w-9 h-9 rounded-full border border-line flex items-center justify-center text-muted hover:bg-sage hover:border-sage hover:text-white transition-colors"> ${renderComponent($$result, "BrandIcon", $$BrandIcon, { "name": "instagram", "class": "w-4 h-4" })} </a> <a href="https://www.tiktok.com/@nimohighland" target="_blank" rel="noopener" aria-label="TikTok Nimo Group" class="w-9 h-9 rounded-full border border-line flex items-center justify-center text-muted hover:bg-sage hover:border-sage hover:text-white transition-colors"> ${renderComponent($$result, "BrandIcon", $$BrandIcon, { "name": "tiktok", "class": "w-4 h-4" })} </a> </div> </div> <div class="card overflow-hidden flex flex-col p-0"> <div class="p-7 pb-4"> <div class="w-11 h-11 rounded-full bg-sage-tint flex items-center justify-center mb-5"> ${renderComponent($$result, "MapPin", MapPin, { "class": "w-5 h-5 text-sage-deep" })} </div> <h3 class="font-heading font-semibold text-ink text-lg mb-2">Lokasi</h3> <p class="text-muted text-sm leading-relaxed">
Banjarsari, Pangalengan, Kabupaten Bandung, Jawa Barat 40378
</p> </div> <div class="mt-auto h-44"> <iframe src="https://www.google.com/maps?q=-7.219462,107.57742&z=17&output=embed" class="w-full h-full" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Peta Nimo Group"></iframe> </div> </div> </div> </div> </section> </div>`;
}, "C:/Users/idris/Desktop/nimo project/src/components/views/KontakView.astro", void 0);

const Info = createLucideIcon("info", [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M12 16v-4" }], ["path", { "d": "M12 8h.01" }]]);

const Minus = createLucideIcon("minus", [["path", { "d": "M5 12h14" }]]);

const Plus = createLucideIcon("plus", [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]]);

const TriangleAlert = createLucideIcon("triangle-alert", [["path", { "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }], ["path", { "d": "M12 9v4" }], ["path", { "d": "M12 17h.01" }]]);

const $$Astro$1 = createAstro();
const $$BookingModal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BookingModal;
  const user = Astro2.locals.user;
  const counters = [
    { key: "adult", label: "Dewasa", priceId: "adultPriceLabel", countId: "adultCount", initial: 1 },
    { key: "child", label: "Anak", priceId: "childPriceLabel", countId: "childCount", initial: 0 }
  ];
  const roomCounters = [
    { key: "rooms", label: "Jumlah Kamar", metaId: "roomRateLabel", countId: "roomsCount", initial: 1 },
    { key: "guests", label: "Jumlah Tamu", metaId: "guestCapLabel", countId: "guestsCount", initial: 2 }
  ];
  const ticketSummary = [
    ["Paket", "sumPackage"],
    ["Tanggal Kedatangan", "sumArrival"],
    ["Tiket Berlaku s/d", "sumExpiry"],
    ["Dewasa", "sumAdult"],
    ["Anak", "sumChild"]
  ];
  const roomSummary = [
    ["Penginapan", "rsumHotel"],
    ["Tipe Kamar", "rsumRoom"],
    ["Check-in", "rsumIn"],
    ["Check-out", "rsumOut"],
    ["Durasi", "rsumNights"],
    ["Tamu", "rsumGuests"],
    ["Perhitungan", "rsumCalc"]
  ];
  return renderTemplate`${maybeRenderHead()}<div id="bookingModal" class="hidden fixed inset-0 z-90 bg-bark/50 p-0 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="bookingTitle"> <div class="bg-surface sm:rounded-2xl w-full sm:max-w-2xl mx-auto min-h-full sm:min-h-0 sm:my-6 shadow-lg"> <div class="sticky top-0 bg-surface border-b border-line-soft sm:rounded-t-2xl z-10"> <div class="flex items-center justify-between px-5 sm:px-7 pt-5 pb-3"> <div> <h3 id="bookingTitle" class="font-heading font-bold text-ink text-lg">Pemesanan Online</h3> <p class="text-xs text-muted mt-0.5">Nimo Group · Pangalengan</p> </div> <button id="closeBooking" type="button" aria-label="Tutup" class="w-9 h-9 rounded-full hover:bg-paper flex items-center justify-center text-muted"> ${renderComponent($$result, "X", X, { "class": "w-5 h-5" })} </button> </div> <div class="flex px-5 sm:px-7 gap-6"> <button type="button" data-btab="ticket" class="btab pb-3 font-heading text-sm font-semibold border-b-2 transition-colors">Tiket Masuk</button> <button type="button" data-btab="room" class="btab pb-3 font-heading text-sm font-semibold border-b-2 transition-colors">Kamar / Menginap</button> </div> </div>  ${user && renderTemplate`<div class="mx-5 sm:mx-7 mt-5 flex items-center gap-3 bg-sage-tint border border-sage/25 rounded-xl px-4 py-3"> ${renderComponent($$result, "ShieldCheck", ShieldCheck, { "class": "w-5 h-5 text-sage-deep shrink-0" })} <p class="text-xs text-ink/75 leading-relaxed">
Memesan sebagai <strong class="text-ink" id="bookingUserName">${user.name}</strong>.
          Pesanan akan tersimpan di akun ini.
</p> </div>`} <!-- ============ TAB: TIKET ============ --> <div id="tabTicket" class="px-5 sm:px-7 py-6"> <div class="note-info mb-6"> ${renderComponent($$result, "Info", Info, { "class": "w-5 h-5 shrink-0 mt-0.5" })} <p>
Pemesanan paling cepat untuk <strong>besok (H-1)</strong> — tanggal hari ini dan tanggal
          lampau tidak dapat dipilih. Tiket berlaku <strong>maksimal 3 hari</strong> sejak tanggal kedatangan.
</p> </div> <p class="label">1. Pilih Paket Tiket</p> <div class="grid gap-3 mb-7"> ${PACKAGES.map((p, i) => renderTemplate`<label${addAttribute([
    "border rounded-xl px-4 py-3.5 cursor-pointer transition-colors hover:border-sage",
    "has-[:checked]:border-sage has-[:checked]:bg-sage-tint flex items-start gap-3",
    i === 0 ? "border-sage bg-sage-tint" : "border-line"
  ], "class:list")}> <input type="radio" name="pkg"${addAttribute(p.id, "value")}${addAttribute(i === 0, "checked")} class="accent-[#5E7A66] mt-1"> <span> <span class="block text-sm font-heading font-semibold text-ink">${p.name}</span> <span class="block text-xs text-muted mt-0.5">${p.desc}</span> </span> </label>`)} </div> <p class="label">2. Kategori Pengunjung</p> <div class="grid grid-cols-2 gap-3 mb-7"> ${[["domestik", "Domestik"], ["manca", "Mancanegara"]].map(([value, label], i) => renderTemplate`<label class="border border-line rounded-xl px-4 py-3 cursor-pointer transition-colors hover:border-sage has-[:checked]:border-sage has-[:checked]:bg-sage-tint flex items-center gap-3"> <input type="radio" name="nationality"${addAttribute(value, "value")}${addAttribute(i === 0, "checked")} class="accent-[#5E7A66]"> <span class="text-sm font-medium">${label}</span> </label>`)} </div> <label for="arrivalDate" class="label">3. Tanggal Kedatangan</label> <input type="date" id="arrivalDate" class="field mb-2"> <p id="dateHint" class="text-xs text-muted mb-2"></p> <p id="dateError" class="hidden note-error mb-2"></p> <div id="expiryNotice" class="hidden bg-paper border border-line rounded-lg px-4 py-3 mb-7"> <p class="text-xs text-muted">Tiket berlaku sampai</p> <p id="expiryValue" class="font-heading font-semibold text-ink text-sm mt-0.5"></p> </div> <div id="expirySpacer" class="mb-7"></div> <p class="label">4. Jumlah Tiket</p> <div class="space-y-3 mb-7"> ${counters.map((c) => renderTemplate`<div class="flex items-center justify-between border border-line rounded-xl px-4 py-3"> <div> <p class="text-sm font-medium">${c.label}</p> <p${addAttribute(c.priceId, "id")} class="text-xs text-muted mt-0.5">—</p> </div> <div class="flex items-center gap-3"> <button type="button"${addAttribute(c.key, "data-step")} data-delta="-1"${addAttribute(`Kurangi tiket ${c.label.toLowerCase()}`, "aria-label")} class="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink hover:bg-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors"> ${renderComponent($$result, "Minus", Minus, { "class": "w-4 h-4" })} </button> <span${addAttribute(c.countId, "id")} class="w-7 text-center font-heading font-semibold text-ink" aria-live="polite">${c.initial}</span> <button type="button"${addAttribute(c.key, "data-step")} data-delta="1"${addAttribute(`Tambah tiket ${c.label.toLowerCase()}`, "aria-label")} class="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink hover:bg-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors"> ${renderComponent($$result, "Plus", Plus, { "class": "w-4 h-4" })} </button> </div> </div>`)} </div> <div class="bg-paper rounded-xl border border-line-soft p-5"> <p class="font-heading font-semibold text-ink text-sm mb-4">Ringkasan Pesanan</p> <ul class="text-sm divide-y divide-line-soft"> ${ticketSummary.map(([label, id]) => renderTemplate`<li class="flex justify-between gap-4 py-2"> <span class="text-muted">${label}</span> <span${addAttribute(id, "id")} class="font-medium text-right">—</span> </li>`)} </ul> <div class="flex justify-between items-center mt-4 pt-4 border-t border-line"> <span class="font-heading font-semibold text-ink">Total Bayar</span> <span id="sumTotal" class="font-heading font-bold text-ink text-2xl">Rp 0</span> </div> </div> <p id="ticketApiError" class="hidden note-error mt-4"></p> <button id="payButton" type="button" disabled class="btn-accent w-full mt-5 py-4 sm:text-base">
Lanjutkan Pembayaran
${renderComponent($$result, "ArrowRight", ArrowRight, { "class": "w-4 h-4" })} </button> <p class="text-xs text-muted text-center mt-3">
Ini simulasi pemesanan. Pembayaran nyata belum terhubung ke payment gateway.
</p> </div> <!-- ============ TAB: KAMAR ============ --> <div id="tabRoom" class="hidden px-5 sm:px-7 py-6"> <div class="note-info mb-6"> ${renderComponent($$result, "BedDouble", BedDouble, { "class": "w-5 h-5 shrink-0 mt-0.5" })} <p>
Check-in paling cepat <strong>besok (H-1)</strong>, dan check-out minimal 1 malam setelah
          check-in. Harga dihitung per kamar per malam.
</p> </div> <label for="roomSelect" class="label">1. Pilih Tipe Kamar</label> <select id="roomSelect" class="field mb-2"> ${HOTELS.map((h) => renderTemplate`<optgroup${addAttribute(h.name, "label")}> ${h.rooms.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}>${r.name} · ${r.type} · ${rupiah(r.rate)}/malam</option>`)} </optgroup>`)} </select> <p id="roomMeta" class="text-xs text-muted mb-7"></p> <p class="label">2. Tanggal Menginap</p> <div class="grid sm:grid-cols-2 gap-3 mb-2"> <div> <label for="checkInDate" class="block text-xs text-muted mb-1.5">Check-in</label> <input type="date" id="checkInDate" class="field"> </div> <div> <label for="checkOutDate" class="block text-xs text-muted mb-1.5">Check-out</label> <input type="date" id="checkOutDate" class="field"> </div> </div> <p id="stayHint" class="text-xs text-muted mb-2"></p> <p id="stayError" class="hidden note-error mb-2"></p> <div class="mb-7"></div> <p class="label">3. Jumlah Kamar &amp; Tamu</p> <div class="space-y-3 mb-3"> ${roomCounters.map((c) => renderTemplate`<div class="flex items-center justify-between border border-line rounded-xl px-4 py-3"> <div> <p class="text-sm font-medium">${c.label}</p> <p${addAttribute(c.metaId, "id")} class="text-xs text-muted mt-0.5">—</p> </div> <div class="flex items-center gap-3"> <button type="button"${addAttribute(c.key, "data-rstep")} data-delta="-1"${addAttribute(`Kurangi ${c.label.toLowerCase()}`, "aria-label")} class="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink hover:bg-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors"> ${renderComponent($$result, "Minus", Minus, { "class": "w-4 h-4" })} </button> <span${addAttribute(c.countId, "id")} class="w-7 text-center font-heading font-semibold text-ink" aria-live="polite">${c.initial}</span> <button type="button"${addAttribute(c.key, "data-rstep")} data-delta="1"${addAttribute(`Tambah ${c.label.toLowerCase()}`, "aria-label")} class="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink hover:bg-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors"> ${renderComponent($$result, "Plus", Plus, { "class": "w-4 h-4" })} </button> </div> </div>`)} </div> <p id="capacityWarn" class="hidden note-warn mb-7"></p> <div id="capacitySpacer" class="mb-7"></div> <div class="bg-paper rounded-xl border border-line-soft p-5"> <p class="font-heading font-semibold text-ink text-sm mb-4">Ringkasan Menginap</p> <ul class="text-sm divide-y divide-line-soft"> ${roomSummary.map(([label, id]) => renderTemplate`<li class="flex justify-between gap-4 py-2"> <span class="text-muted">${label}</span> <span${addAttribute(id, "id")} class="font-medium text-right">—</span> </li>`)} </ul> <div class="flex justify-between items-center mt-4 pt-4 border-t border-line"> <span class="font-heading font-semibold text-ink">Total Bayar</span> <span id="rsumTotal" class="font-heading font-bold text-ink text-2xl">Rp 0</span> </div> </div> <p id="roomApiError" class="hidden note-error mt-4"></p> <button id="roomPayButton" type="button" disabled class="btn-accent w-full mt-5 py-4 sm:text-base">
Lanjutkan Pemesanan Kamar
${renderComponent($$result, "ArrowRight", ArrowRight, { "class": "w-4 h-4" })} </button> <p class="flex items-start gap-2 text-xs text-muted mt-3"> ${renderComponent($$result, "TriangleAlert", TriangleAlert, { "class": "w-4 h-4 shrink-0 mt-px" })}
Tarif kamar masih placeholder — perlu dikonfirmasi ke tim reservasi sebelum dipakai produksi.
</p> </div> </div> </div>`;
}, "C:/Users/idris/Desktop/nimo project/src/components/modals/BookingModal.astro", void 0);

const Lock = createLucideIcon("lock", [["rect", { "width": "18", "height": "11", "x": "3", "y": "11", "rx": "2", "ry": "2" }], ["path", { "d": "M7 11V7a5 5 0 0 1 10 0v4" }]]);

const $$AuthGateModal = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="authGateModal" class="hidden fixed inset-0 z-97 flex items-center justify-center p-4 bg-bark/50" role="dialog" aria-modal="true" aria-labelledby="authGateTitle"> <div class="bg-surface rounded-2xl w-full max-w-sm p-7 shadow-lg relative"> <button type="button" data-close-authgate aria-label="Tutup" class="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-paper flex items-center justify-center text-muted"> ${renderComponent($$result, "X", X, { "class": "w-4 h-4" })} </button> <div class="w-12 h-12 rounded-full bg-sage-tint flex items-center justify-center mb-5"> ${renderComponent($$result, "Lock", Lock, { "class": "w-6 h-6 text-sage-deep" })} </div> <h3 id="authGateTitle" class="font-heading font-bold text-ink text-lg">Masuk untuk melanjutkan</h3> <p class="text-sm text-muted leading-relaxed mt-2">
Pemesanan tiket dan kamar memerlukan akun, supaya e-tiket dan riwayat pesanan Anda tersimpan
      dan bisa dibuka kapan saja.
</p> <p class="text-xs text-muted mt-3">
Setelah masuk, Anda akan kembali ke halaman ini dan form pemesanan terbuka otomatis.
</p> <div class="flex flex-col gap-2.5 mt-6"> <a id="authGateLogin" href="/login" class="btn-primary w-full"> ${renderComponent($$result, "LogIn", LogIn, { "class": "w-4 h-4" })} Masuk
</a> <a id="authGateRegister" href="/register" class="btn-outline w-full"> ${renderComponent($$result, "UserPlus", UserPlus, { "class": "w-4 h-4" })} Daftar Akun Baru
</a> <button type="button" data-close-authgate class="text-xs text-muted hover:text-ink transition-colors mt-1 py-1">
Nanti saja
</button> </div> </div> </div>`;
}, "C:/Users/idris/Desktop/nimo project/src/components/modals/AuthGateModal.astro", void 0);

const Check = createLucideIcon("check", [["path", { "d": "M20 6 9 17l-5-5" }]]);

const Download = createLucideIcon("download", [["path", { "d": "M12 15V3" }], ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }], ["path", { "d": "m7 10 5 5 5-5" }]]);

const $$ETicketModal = createComponent(($$result, $$props, $$slots) => {
  const infoCells = [
    ["Nama Pemesan", "ticketName"],
    ["Tipe Tiket", "ticketType"],
    ["Jumlah Pengunjung", "ticketQty"],
    ["Total Pembayaran", "ticketTotal"]
  ];
  return renderTemplate`${maybeRenderHead()}<div id="eticketModal" class="hidden fixed inset-0 z-96 bg-bark/50 p-0 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="eticketTitle"> <div class="bg-canvas sm:rounded-2xl w-full sm:max-w-md mx-auto min-h-full sm:min-h-0 sm:my-8 sm:shadow-lg sm:border border-line-soft"> <div class="eticket-chrome flex items-center justify-between px-5 sm:px-6 pt-5 pb-2"> <p id="eticketTitle" class="font-heading text-sm font-bold text-ink flex items-center gap-2"> ${renderComponent($$result, "Ticket", Ticket, { "class": "w-4 h-4 text-sage-deep" })} Tiket Digital Anda
</p> <button id="closeEticket" type="button" aria-label="Tutup" class="w-9 h-9 rounded-full hover:bg-paper flex items-center justify-center text-muted"> ${renderComponent($$result, "X", X, { "class": "w-5 h-5" })} </button> </div> <div class="px-5 sm:px-6 pb-6"> <div id="eticketLoading" class="flex flex-col items-center justify-center py-16"> <div class="w-11 h-11 border-[3px] border-sage border-t-transparent rounded-full animate-spin"></div> <p id="eticketLoadingText" class="text-sm text-muted mt-5 font-heading" aria-live="polite">Memproses pembayaran…</p> </div> <div id="eticketBody" class="hidden"> <div id="ticketCard" class="bg-surface rounded-2xl overflow-hidden border border-line-soft" style="box-shadow: var(--shadow-soft)">  <div class="bg-bark px-5 py-5"> <div class="flex items-center justify-between gap-3"> <div class="flex items-center gap-2.5"> <span class="font-heading font-bold text-white text-lg tracking-wide">NIMO</span> <span class="text-white/60 text-[10px] font-medium uppercase tracking-widest border-l border-white/25 pl-2.5">Highland</span> </div> <span class="flex items-center gap-1.5 text-[11px] font-heading font-bold uppercase tracking-wider bg-white/15 text-white px-3 py-1 rounded-full"> ${renderComponent($$result, "Check", Check, { "class": "w-3.5 h-3.5" })} Lunas
</span> </div> </div> <!-- Perforation --> <div class="relative h-3 bg-surface"> <div class="absolute -left-3 -top-1.5 w-6 h-6 rounded-full bg-canvas"></div> <div class="absolute -right-3 -top-1.5 w-6 h-6 rounded-full bg-canvas"></div> <div class="border-t-2 border-dashed border-line"></div> </div> <div class="px-5 pt-4"> <p class="text-[11px] uppercase tracking-widest text-muted">ID Transaksi / Kode Booking</p> <p id="ticketCode" class="font-heading font-bold text-ink text-xl mt-0.5">—</p> </div> <div class="px-5 py-4 grid grid-cols-2 gap-x-4 gap-y-4"> ${infoCells.map(([label, id]) => renderTemplate`<div> <p class="text-[11px] uppercase tracking-widest text-muted">${label}</p> <p${addAttribute(id, "id")} class="font-heading font-semibold text-ink text-sm mt-0.5 leading-snug">—</p> </div>`)} </div> <div class="px-5 pb-2"> <div class="grid grid-cols-2 gap-4"> <div class="rounded-xl border border-sage/25 bg-sage-tint p-3"> <p class="text-[11px] uppercase tracking-widest text-muted flex items-center gap-1"> ${renderComponent($$result, "MapPin", MapPin, { "class": "w-3.5 h-3.5" })} Check-in
</p> <p id="ticketArrival" class="font-heading font-bold text-ink text-xs sm:text-sm mt-1 leading-snug">—</p> </div> <div class="rounded-xl border border-warn/25 bg-warn-tint p-3"> <p class="text-[11px] uppercase tracking-widest text-muted flex items-center gap-1"> ${renderComponent($$result, "Clock", Clock, { "class": "w-3.5 h-3.5" })} Kedaluwarsa
</p> <p id="ticketExpiry" class="font-heading font-bold text-ink text-xs sm:text-sm mt-1 leading-snug">—</p> </div> </div> </div> <div class="px-5 py-4 flex flex-col items-center"> <div class="bg-surface p-2.5 rounded-xl border border-line"> <img id="ticketQR" alt="QR Code E-Ticket" class="w-36 h-36 block"> </div> <p class="text-[11px] text-muted mt-2 text-center">Tunjukkan kode ini di pintu masuk</p> </div> <div class="bg-paper px-5 py-3 flex items-center justify-between gap-3 text-[11px] text-muted border-t border-line-soft"> <span>Nimo Group · Pangalengan</span> <span>Scan untuk verifikasi</span> </div> </div> <div class="eticket-chrome mt-5 flex flex-col sm:flex-row gap-3"> <button id="eticketPrint" type="button" class="btn-dark flex-1 py-3.5"> ${renderComponent($$result, "Download", Download, { "class": "w-4 h-4" })} Unduh Tiket (PNG)
</button> <button id="eticketWhatsapp" type="button" class="btn-primary flex-1 py-3.5"> ${renderComponent($$result, "BrandIcon", $$BrandIcon, { "name": "whatsapp", "class": "w-4 h-4" })} Kirim ke WhatsApp
</button> </div> <p class="eticket-chrome text-center text-[11px] text-muted mt-3">
Tiket ini disimulasikan untuk keperluan demo pembayaran.
</p> </div> </div> </div> </div>`;
}, "C:/Users/idris/Desktop/nimo project/src/components/modals/ETicketModal.astro", void 0);

const $$MiscModals = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- MODAL: DETAIL DESTINASI -->${maybeRenderHead()}<div id="destModal" class="hidden fixed inset-0 z-92 bg-bark/50 p-0 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Detail destinasi"> <div id="destModalBody" class="bg-surface sm:rounded-2xl w-full sm:max-w-2xl mx-auto min-h-full sm:min-h-0 sm:my-6 shadow-lg overflow-hidden"></div> </div> <!-- MODAL: SUKSES --> <div id="successModal" class="hidden fixed inset-0 z-95 flex items-center justify-center p-4 bg-bark/50" role="dialog" aria-modal="true" aria-labelledby="successTitle"> <div class="bg-surface rounded-2xl w-full max-w-sm p-8 text-center shadow-lg"> <div class="w-16 h-16 rounded-full bg-sage-tint flex items-center justify-center mx-auto mb-5"> ${renderComponent($$result, "Check", Check, { "class": "w-8 h-8 text-sage-deep" })} </div> <h3 id="successTitle" class="font-heading font-bold text-ink text-xl mb-2">Pemesanan Berhasil</h3> <p id="successDetail" class="text-muted text-sm leading-relaxed"></p> <p class="text-xs text-muted mt-4">
Kode booking: <span id="bookingCode" class="font-heading font-semibold text-ink"></span> </p> <button id="closeSuccess" type="button" class="btn-dark w-full mt-6">Selesai</button> </div> </div> <!-- MODAL: LIGHTBOX --> <div id="lightbox" class="hidden fixed inset-0 z-95 flex items-center justify-center p-4 bg-bark/95" role="dialog" aria-modal="true" aria-label="Galeri foto"> <button id="lightboxClose" type="button" aria-label="Tutup" class="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10"> ${renderComponent($$result, "X", X, { "class": "w-5 h-5" })} </button> <button id="lightboxPrev" type="button" aria-label="Sebelumnya" class="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10"> ${renderComponent($$result, "ChevronLeft", ChevronLeft, { "class": "w-5 h-5" })} </button> <button id="lightboxNext" type="button" aria-label="Berikutnya" class="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10"> ${renderComponent($$result, "ChevronRight", ChevronRight, { "class": "w-5 h-5" })} </button> <figure class="max-w-4xl w-full text-center"> <img id="lightboxImg" class="w-full max-h-[75vh] object-contain rounded-xl" alt=""> <figcaption class="mt-4"> <p id="lightboxTitle" class="font-heading font-semibold text-white text-lg"></p> <p id="lightboxCounter" class="text-white/55 text-xs mt-1"></p> </figcaption> </figure> </div>`;
}, "C:/Users/idris/Desktop/nimo project/src/components/modals/MiscModals.astro", void 0);

const BadgeCheck = createLucideIcon("badge-check", [["path", { "d": "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" }], ["path", { "d": "m9 12 2 2 4-4" }]]);

const $$Astro = createAstro();
const $$EssPortal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$EssPortal;
  const employee = Astro2.locals.isEmployee ? Astro2.locals.user : null;
  const stats = [
    { id: "essStatTotal", label: "Total", tone: "bg-paper border-line text-ink" },
    { id: "essStatLunas", label: "LUNAS", tone: "bg-ok-tint border-ok/25 text-ok" },
    { id: "essStatUsed", label: "TERPAKAI", tone: "bg-info-tint border-info/25 text-info" },
    { id: "essStatExpired", label: "EXPIRED", tone: "bg-danger-tint border-danger/25 text-danger" }
  ];
  const columns = ["Kode Booking", "Nama Pelanggan", "Tipe Tiket", "Kedatangan", "Expired", "Qty", "Total", "Status", "Aksi"];
  return renderTemplate`<!-- ============ LOGIN ESS ============ -->${maybeRenderHead()}<div id="essLoginModal" class="hidden fixed inset-0 z-96 bg-bark/50 p-0 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="essLoginTitle"> <div class="bg-surface sm:rounded-2xl w-full sm:max-w-md mx-auto min-h-full sm:min-h-0 sm:my-10 sm:shadow-lg overflow-hidden">  <div class="bg-bark px-6 py-6"> <div class="flex items-center gap-2"> <span class="font-heading font-bold text-white text-lg tracking-wide">NIMO</span> <span class="text-white/60 text-[10px] font-medium uppercase tracking-widest border-l border-white/25 pl-2.5">Highland</span> </div> <h3 id="essLoginTitle" class="font-heading font-bold text-white text-xl mt-3 flex items-center gap-2"> ${renderComponent($$result, "IdCard", IdCard, { "class": "w-5 h-5" })} Portal ESS Karyawan
</h3> <p class="text-white/65 text-xs mt-1">Employee Self-Service · Masuk untuk mengelola tiket</p> </div> <form id="essLoginForm" class="px-6 py-6" novalidate> <label for="essNik" class="label">NIK Karyawan</label> <input type="text" id="essNik" name="nik" autocomplete="username" placeholder="Masukkan NIK" class="field mb-4"> <label for="essPassword" class="label">Password</label> <input type="password" id="essPassword" name="password" autocomplete="current-password" placeholder="Masukkan password" class="field mb-3"> <p id="essLoginError" class="hidden note-error mb-4" role="alert"></p> <button type="submit" id="essLoginBtn" class="btn-primary w-full py-3.5"> ${renderComponent($$result, "LogIn", LogIn, { "class": "w-4 h-4" })} Masuk Portal
</button> <button type="button" data-close-ess class="btn-outline w-full mt-3 py-3.5">Batal</button> <p class="flex items-start gap-2 text-[11px] text-muted mt-4"> ${renderComponent($$result, "ShieldCheck", ShieldCheck, { "class": "w-4 h-4 shrink-0 mt-px text-sage" })}
Percobaan masuk dibatasi 5 kali per menit. Password diverifikasi di server.
</p> </form> </div> </div> <!-- ============ DASHBOARD ESS ============ --> <div id="essDashboard"${addAttribute(["fixed inset-0 z-97 bg-canvas overflow-y-auto", !employee && "hidden"], "class:list")}> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> <div class="flex items-center justify-between gap-4 flex-wrap"> <div class="flex items-center gap-2"> <span class="font-heading font-bold text-ink text-lg tracking-wide">NIMO</span> <span class="text-sage-deep text-[10px] font-medium uppercase tracking-widest border-l border-line pl-2">ESS Dashboard</span> </div> <div class="flex items-center gap-3"> <span class="hidden sm:inline text-xs text-muted">Sesi aktif sebagai</span> <div class="flex items-center gap-2.5 card rounded-full pl-1.5 pr-4 py-1.5"> <div id="essAvatar" class="w-8 h-8 rounded-full bg-sage text-white flex items-center justify-center font-heading font-bold text-sm"> ${employee ? employee.name.trim().charAt(0).toUpperCase() : "\u2014"} </div> <div class="leading-tight"> <p id="essProfileName" class="font-heading font-semibold text-ink text-sm">${employee?.name ?? "\u2014"}</p> <p id="essProfileMeta" class="text-[11px] text-muted"> ${employee ? `${employee.nik} \xB7 ${employee.role}` : "\u2014"} </p> </div> </div> <button type="button" id="essLogoutBtn" class="inline-flex items-center gap-2 border border-danger/30 text-danger font-heading font-semibold text-xs px-4 py-2.5 rounded-full hover:bg-danger-tint transition-colors"> ${renderComponent($$result, "LogOut", LogOut, { "class": "w-3.5 h-3.5" })} Logout
</button> </div> </div> <div class="card p-6 mt-6"> <div class="flex items-center justify-between gap-4 flex-wrap"> <div> <h2 class="font-heading font-bold text-ink text-2xl">Monitor Tiket Pelanggan</h2> <p class="text-xs text-muted mt-1">Pantau, cari, dan validasi tiket orderan.</p> </div> <div class="flex gap-3 flex-wrap"> ${stats.map((s) => renderTemplate`<div${addAttribute(["text-center border rounded-xl px-5 py-3", s.tone], "class:list")}> <p${addAttribute(s.id, "id")} class="font-heading font-bold text-xl">0</p> <p class="text-[11px] text-muted">${s.label}</p> </div>`)} </div> </div> <div class="flex flex-col sm:flex-row gap-3 mt-6"> <div class="relative flex-1"> ${renderComponent($$result, "Search", Search, { "class": "w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" })} <label for="essSearch" class="sr-only">Cari tiket</label> <input type="search" id="essSearch" placeholder="Cari kode booking / nama pelanggan…" class="field rounded-full pl-11"> </div> <label for="essFilter" class="sr-only">Filter status</label> <select id="essFilter" class="field rounded-full w-auto px-5"> <option value="SEMUA">Semua Status</option> <option value="LUNAS">LUNAS</option> <option value="TERPAKAI">TERPAKAI (USED)</option> <option value="EXPIRED">EXPIRED</option> </select> </div> </div> <div class="card mt-5 overflow-hidden p-0"> <div class="overflow-x-auto"> <table class="w-full text-left text-sm"> <thead> <tr class="bg-paper text-muted text-[11px] uppercase tracking-wider"> ${columns.map((c) => renderTemplate`<th scope="col" class="px-4 py-3 font-heading font-semibold whitespace-nowrap">${c}</th>`)} </tr> </thead> <tbody id="essTicketBody" class="divide-y divide-line-soft"></tbody> </table> </div> <p id="essTicketEmpty" class="hidden text-center text-muted text-sm py-12">Belum ada tiket ditemukan.</p> </div> <p id="essSyncNote" class="text-center text-[11px] text-muted mt-5" aria-live="polite"></p> </div> </div> <!-- ============ KONFIRMASI VERIFIKASI ============ --> <div id="essVerifyModal" class="hidden fixed inset-0 z-98 flex items-center justify-center p-4 bg-bark/50" role="dialog" aria-modal="true" aria-labelledby="essVerifyTitle"> <div class="bg-surface rounded-2xl w-full max-w-sm p-6 text-center shadow-lg"> <div class="w-14 h-14 rounded-full bg-sage-tint flex items-center justify-center mx-auto mb-4"> ${renderComponent($$result, "BadgeCheck", BadgeCheck, { "class": "w-7 h-7 text-sage-deep" })} </div> <h3 id="essVerifyTitle" class="font-heading font-bold text-ink text-lg">Verifikasi Tiket</h3> <p class="text-sm text-muted leading-relaxed mt-2">
Ubah status tiket <strong id="essVerifyCode" class="text-ink">—</strong> milik
<strong id="essVerifyName" class="text-ink">—</strong> dari <strong>LUNAS</strong> menjadi
<strong>TERPAKAI (USED)</strong>?
</p> <div class="flex gap-3 mt-6"> <button type="button" id="essVerifyCancel" class="btn-outline flex-1">Batal</button> <button type="button" id="essVerifyConfirm" class="btn-primary flex-1">Ya, Verifikasi</button> </div> </div> </div>`;
}, "C:/Users/idris/Desktop/nimo project/src/components/ess/EssPortal.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const ratings = await getRatings();
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Nimo Group \u2014 Embrace the Serene Breeze", "description": "Nimo Group Pangalengan \u2014 kebun teh, Sky Bridge 360\xB0, destinasi & penginapan. Pesan tiket dan kamar online." }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/json" id="ratings-data">', "<\/script> ", " ", '<main id="appRoot"> ', " ", " ", " ", " ", " </main> ", " ", " ", " ", " ", " ", " ", " ", " "])), unescapeHTML(jsonForScript(ratings)), renderComponent($$result2, "Navbar", $$Navbar, {}), maybeRenderHead(), renderComponent($$result2, "Beranda", $$Beranda, { "ratings": ratings }), renderComponent($$result2, "DestinationsView", $$DestinationsView, {}), renderComponent($$result2, "HotelsView", $$HotelsView, {}), renderComponent($$result2, "GaleriView", $$GaleriView, {}), renderComponent($$result2, "KontakView", $$KontakView, {}), renderComponent($$result2, "Footer", $$Footer, {}), renderComponent($$result2, "FloatingActions", $$FloatingActions, {}), renderComponent($$result2, "BookingModal", $$BookingModal, {}), renderComponent($$result2, "AuthGateModal", $$AuthGateModal, {}), renderComponent($$result2, "ETicketModal", $$ETicketModal, {}), renderComponent($$result2, "MiscModals", $$MiscModals, {}), renderComponent($$result2, "EssPortal", $$EssPortal, {}), renderScript($$result2, "C:/Users/idris/Desktop/nimo project/src/pages/index.astro?astro&type=script&index=0&lang.ts")) })}`;
}, "C:/Users/idris/Desktop/nimo project/src/pages/index.astro", void 0);

const $$file = "C:/Users/idris/Desktop/nimo project/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
