import { e as createComponent, m as maybeRenderHead, k as renderComponent, o as renderSlot, g as addAttribute, r as renderTemplate, h as createAstro } from './astro/server_rOUT-VGP.mjs';
import 'piccolore';
import { A as ArrowLeft } from './arrow-left_ByUPVSg9.mjs';
import { S as ShieldCheck } from './shield-check_DPK03t4b.mjs';
import { I as IMG } from './data_BJWyGgzs.mjs';

const $$Astro = createAstro();
const $$AuthShell = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AuthShell;
  const { title, subtitle } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="min-h-screen grid lg:grid-cols-2">  <div class="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 bg-canvas"> <div class="w-full max-w-md mx-auto"> <a href="/" class="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors mb-10"> ${renderComponent($$result, "ArrowLeft", ArrowLeft, { "class": "w-4 h-4" })} Kembali ke beranda
</a> <div class="flex items-center gap-2 mb-8"> <span class="font-heading font-bold text-ink text-xl tracking-wide">NIMO</span> <span class="text-sage-deep text-xs font-medium uppercase tracking-widest border-l border-line pl-2.5">Highland</span> </div> <h1 class="font-heading font-bold text-ink text-3xl leading-tight">${title}</h1> <p class="text-muted text-sm mt-2 leading-relaxed">${subtitle}</p> ${renderSlot($$result, $$slots["default"])} <p class="flex items-start gap-2 text-[11px] text-muted mt-8"> ${renderComponent($$result, "ShieldCheck", ShieldCheck, { "class": "w-4 h-4 shrink-0 mt-px text-sage" })}
Percobaan masuk dan pendaftaran dibatasi 5 kali per menit per alamat IP.
        Sesi disimpan dalam cookie HTTP-only yang tidak bisa dibaca skrip apa pun.
</p> </div> </div>  <div class="hidden lg:block relative img-shell"> <img${addAttribute(IMG.mist, "src")} alt="Kabut pagi di kebun teh Nimo Group" class="absolute inset-0 w-full h-full object-cover"> <div class="absolute inset-0 bg-bark/50"></div> <div class="absolute bottom-12 left-12 right-12"> <p class="font-heading text-white/70 text-xs tracking-[0.28em] uppercase mb-3">Pangalengan · Bandung</p> <p class="font-heading font-bold text-white text-3xl leading-tight max-w-sm">
Embrace the Serene Breeze
</p> <p class="text-white/70 text-sm mt-3 max-w-sm leading-relaxed">
Simpan e-tiket dan riwayat pesanan Anda dalam satu akun.
</p> </div> </div> </div>`;
}, "C:/Users/idris/Desktop/nimo project/src/components/AuthShell.astro", void 0);

export { $$AuthShell as $ };
