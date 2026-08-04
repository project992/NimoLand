import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute, l as renderScript } from '../chunks/astro/server_rOUT-VGP.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/createLucideIcon_C0cjg1zL.mjs';
import { A as ArrowLeft } from '../chunks/arrow-left_ByUPVSg9.mjs';
import { L as LogOut, T as Ticket, B as BedDouble } from '../chunks/log-out_DClpdBpo.mjs';
import { s as supabase } from '../chunks/supabase_BiwT-ogX.mjs';
import { r as rupiah } from '../chunks/data_BJWyGgzs.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Akun = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Akun;
  const user = Astro2.locals.user;
  const [tickets, rooms] = supabase ? await Promise.all([
    supabase.from("tickets").select("booking_code, ticket_type, quantity, total_price, visit_date, expiry_date, status").eq("customer_id", user.id).order("created_at", { ascending: false }).limit(50),
    supabase.from("room_bookings").select("booking_code, hotel_name, room_name, check_in, check_out, nights, rooms, guests, total_price, status").eq("customer_id", user.id).order("created_at", { ascending: false }).limit(50)
  ]) : [{ data: [] }, { data: [] }];
  const ticketRows = tickets.data ?? [];
  const roomRows = rooms.data ?? [];
  const fmt = (iso) => (/* @__PURE__ */ new Date(iso + "T00:00:00")).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const statusTone = {
    LUNAS: "bg-ok-tint text-ok border-ok/25",
    TERPAKAI: "bg-info-tint text-info border-info/25",
    EXPIRED: "bg-danger-tint text-danger border-danger/25",
    DIKONFIRMASI: "bg-ok-tint text-ok border-ok/25"
  };
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Pesanan Saya \u2014 Nimo Group", "description": "Riwayat pemesanan tiket dan kamar Nimo Group." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-canvas"> <div class="max-w-4xl mx-auto px-5 sm:px-8 py-12"> <a href="/" class="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors mb-8"> ${renderComponent($$result2, "ArrowLeft", ArrowLeft, { "class": "w-4 h-4" })} Kembali ke beranda
</a> <div class="flex items-start justify-between gap-4 flex-wrap"> <div> <h1 class="font-heading font-bold text-ink text-3xl">Pesanan Saya</h1> <p class="text-muted text-sm mt-1.5">${user.name} · ${user.email}</p> </div> <button type="button" data-logout class="inline-flex items-center gap-2 border border-line text-muted hover:text-danger hover:border-danger/30 font-heading font-semibold text-sm px-4 py-2.5 rounded-full transition-colors"> ${renderComponent($$result2, "LogOut", LogOut, { "class": "w-4 h-4" })} Keluar
</button> </div> <!-- Tiket --> <h2 class="flex items-center gap-2 font-heading font-semibold text-ink text-lg mt-10 mb-4"> ${renderComponent($$result2, "Ticket", Ticket, { "class": "w-5 h-5 text-sage-deep" })} Tiket Masuk
</h2> ${ticketRows.length === 0 ? renderTemplate`<div class="card p-8 text-center"> <p class="text-sm text-muted">Belum ada pemesanan tiket.</p> <a href="/" class="btn-accent mt-5">Pesan tiket sekarang</a> </div>` : renderTemplate`<div class="space-y-3"> ${ticketRows.map((t) => renderTemplate`<div class="card p-5 flex flex-wrap items-center justify-between gap-4"> <div class="min-w-0"> <p class="font-heading font-bold text-ink">${t.booking_code}</p> <p class="text-sm text-muted mt-0.5">${t.ticket_type}</p> <p class="text-xs text-muted mt-1.5">
Kunjungan ${fmt(t.visit_date)} · berlaku s/d ${fmt(t.expiry_date)} · ${t.quantity} orang
</p> </div> <div class="text-right shrink-0"> <p class="font-heading font-bold text-ink">${rupiah(Number(t.total_price))}</p> <span${addAttribute([
    "inline-flex mt-1.5 text-[11px] font-heading font-semibold border px-2.5 py-1 rounded-full",
    statusTone[t.status] ?? "bg-paper text-muted border-line"
  ], "class:list")}> ${t.status} </span> </div> </div>`)} </div>`} <!-- Kamar --> <h2 class="flex items-center gap-2 font-heading font-semibold text-ink text-lg mt-10 mb-4"> ${renderComponent($$result2, "BedDouble", BedDouble, { "class": "w-5 h-5 text-sage-deep" })} Menginap
</h2> ${roomRows.length === 0 ? renderTemplate`<div class="card p-8 text-center"> <p class="text-sm text-muted">Belum ada pemesanan kamar.</p> </div>` : renderTemplate`<div class="space-y-3"> ${roomRows.map((r) => renderTemplate`<div class="card p-5 flex flex-wrap items-center justify-between gap-4"> <div class="min-w-0"> <p class="font-heading font-bold text-ink">${r.booking_code}</p> <p class="text-sm text-muted mt-0.5">${r.room_name} · ${r.hotel_name}</p> <p class="text-xs text-muted mt-1.5"> ${fmt(r.check_in)} – ${fmt(r.check_out)} · ${r.nights} malam · ${r.rooms} kamar · ${r.guests} tamu
</p> </div> <div class="text-right shrink-0"> <p class="font-heading font-bold text-ink">${rupiah(Number(r.total_price))}</p> <span${addAttribute([
    "inline-flex mt-1.5 text-[11px] font-heading font-semibold border px-2.5 py-1 rounded-full",
    statusTone[r.status] ?? "bg-paper text-muted border-line"
  ], "class:list")}> ${r.status} </span> </div> </div>`)} </div>`} </div> </div> ${renderScript($$result2, "C:/Users/idris/Desktop/nimo project/src/pages/akun.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/Users/idris/Desktop/nimo project/src/pages/akun.astro", void 0);

const $$file = "C:/Users/idris/Desktop/nimo project/src/pages/akun.astro";
const $$url = "/akun";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Akun,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
