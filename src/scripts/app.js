/* =====================================================================
   Nimo Land Group — client SPA

   00. State      — session + data injected by the server
   01. Utilities  — image fallback, dates, toast, reveal
   02. Auth       — session state and logout
   03. Router     — path routing (/destinasi, /penginapan/…)
   04. Navbar     — scroll state + mobile menu
   05. Hero / MomentSlider
   06. Wahana / Destinations / Hotels / Gallery / FAQ
   07. ESS        — employee portal against /api/ess/*
   ===================================================================== */
import {
  DESTINATIONS, DEST_FILTERS, HOTELS, ROOM_TYPES,
  MOMENTS, GALLERY, GALLERY_FEATURED,
  allRooms, parseISODate, addDays, toISODate, rupiah, localSrc,
} from '../lib/data.js';
import { icon } from '../lib/icons.js';

/* ------------------------------------------------------------------
   00. STATE — handed over by the server, never trusted for authorisation
------------------------------------------------------------------ */
const readJsonScript = id => {
  const el = document.getElementById(id);
  if (!el) return null;
  try {
    return JSON.parse(el.textContent);
  } catch {
    return null;
  }
};

const State = {
  user: readJsonScript('session-data'),
  ratings: readJsonScript('ratings-data') ?? {},
  videos: readJsonScript('videos-data') ?? {},
  locale: readJsonScript('locale-data')?.locale ?? 'id',
  messages: readJsonScript('locale-data')?.messages ?? {},
};

const isCustomer = () => State.user?.kind === 'customer';

/** Client-side translation helper (dot path lookup). */
const t = key => {
  const keys = key.split('.');
  let val = State.messages;
  for (const k of keys) val = val?.[k];
  return val ?? key;
};

/* Escape anything that reaches innerHTML. All of it is first-party data today,
   but customer names from the API flow into the ESS table, and one unescaped
   field is all it takes. */
const esc = value =>
  String(value ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ------------------------------------------------------------------
   01. UTILITIES
------------------------------------------------------------------ */
/** Smaller-and-compressed copy of an Unsplash URL for card-sized renderings.
    Leaves third-party/S3 URLs untouched. */
function scaled(url, w = 500, q = 75) {
  return String(url).includes('images.unsplash.com')
    ? String(url).replace(/w=\d+/, `w=${w}`).replace(/q=\d+/, `q=${q}`)
    : url;
}

const ImageFallback = {
  bind(img) {
    img.addEventListener('error', () => {
      const fb = img.dataset.fallback;
      if (fb && img.src !== fb) img.src = scaled(fb);
      else img.style.visibility = 'hidden';
    });
  },
  bindAll(root = document) {
    root.querySelectorAll('img[data-fallback]').forEach(img => {
      this.bind(img);
      if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'));
    });
  },
};

const DateUtil = {
  today() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; },
  addDays,
  toISO: toISODate,
  parseISO: parseISODate,
  long(d) { return d.toLocaleDateString(State.locale === 'en' ? 'en-US' : 'id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); },
  short(d) { return d.toLocaleDateString(State.locale === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); },
  isWeekend(d) { return d.getDay() === 0 || d.getDay() === 6; },
  nights(a, b) { return Math.round((b - a) / 86_400_000); },
};

const Toast = {
  show(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.remove('opacity-0', 'translate-y-4');
    clearTimeout(this._t);
    this._t = setTimeout(() => el.classList.add('opacity-0', 'translate-y-4'), 3200);
  },
};

const Reveal = {
  init() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(e => e.classList.add('visible'));
      return;
    }
    this.io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('visible'); this.io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    this.refresh();
  },
  refresh() {
    if (!this.io) return;
    // Re-observing an element already being observed is a no-op, so this is
    // safe to call on every route change.
    document.querySelectorAll('.reveal:not(.visible)').forEach(e => this.io.observe(e));
  },
};

const lockScroll = on => { document.body.style.overflow = on ? 'hidden' : ''; };

/** JSON fetch that always resolves to {ok, status, data}. */
async function api(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  });
  let data = null;
  try { data = await res.json(); } catch { /* empty or non-JSON body */ }
  return { ok: res.ok, status: res.status, data };
}

/** Cover media for a destination: pull the employee-set video when present,
    otherwise fall back to the static image (with its Unsplash fallback). */
function coverMedia(d, className) {
  const src = State.videos[d.id];
  if (src) {
    if (/\.(mp4|mov|webm)(\?|$)/i.test(src)) {
      return `<video class="${className}" src="${esc(src)}" muted playsinline loop autoplay
                     preload="metadata" aria-label="Video ${esc(d.name)}"></video>`;
    }
    return `<img src="${esc(src)}" alt="${esc(d.name)}"
                class="${className}" ${className.includes('w-full') ? 'loading="lazy"' : ''}>`;
  }
  return `<img src="${localSrc(d.img)}" data-fallback="${localSrc(d.fb)}" alt="${esc(d.name)}"
               class="${className}" ${className.includes('w-full') ? 'loading="lazy"' : ''}>`;
}

/* ------------------------------------------------------------------
   02. AUTH — session state and logout
------------------------------------------------------------------ */
const Auth = {
  init() {
    document.querySelectorAll('[data-logout]').forEach(b =>
      b.addEventListener('click', () => this.logout()));
  },

  async logout() {
    await api('/api/auth/logout', { method: 'POST' });
    // Full reload so every server-rendered fragment (navbar) re-renders from the now-absent session.
    location.href = '/';
  },
};

/* ------------------------------------------------------------------
   03. ROUTER — path routing. Real URLs (/destinasi, /penginapan/…),
   SPA-fast switching via history.pushState, and legacy #/… links are
   migrated to their real paths on first load.
------------------------------------------------------------------ */
const ROUTE_PATHS = { beranda: '/', destinations: '/destinasi', hotels: '/penginapan', galeri: '/galeri', kontak: '/kontak' };
const LEGACY_HASHES = { beranda: '/', destinations: '/destinasi', hotels: '/penginapan', galeri: '/galeri', kontak: '/kontak' };
const DETAIL_RE = /^\/(destinasi|penginapan)\//;

/* Display titles for SPA navigation (server-rendered head already has the
   right one on first paint; this keeps it correct after pushState). */
const TITLES = {
  beranda: 'Nimo Land Group — Jaringan Destinasi Wisata Nasional',
  destinations: 'Destinasi — Nimo Land Group',
  hotels: 'Hotels & Penginapan — Nimo Land Group',
  galeri: 'Galeri — Nimo Land Group',
  kontak: 'Kontak — Nimo Land Group',
};

const Router = {
  routes: ['beranda', 'destinations', 'hotels', 'galeri', 'kontak'],

  init() {
    document.addEventListener('click', e => {
      const el = e.target.closest('[data-route]');
      if (!el) return;
      e.preventDefault();
      this.go(el.dataset.route, el.dataset.scroll);
    });
    window.addEventListener('popstate', () => this.render());

    // Old bookmarks / shared links still point at #/beranda, #/hotels, …
    this.migrateLegacyHash();
    this.render();
  },

  migrateLegacyHash() {
    const m = /^#\/(beranda|destinations|hotels|galeri|kontak)(\?.*)?$/.exec(location.hash);
    if (!m) return;
    history.replaceState(null, '', LEGACY_HASHES[m[1]]);
  },

  go(route, scrollTo) {
    const target = this.routes.includes(route) ? route : 'beranda';
    this.pendingScroll = scrollTo || null;
    const path = ROUTE_PATHS[target];
    if (location.pathname === path) this.render();
    else {
      history.pushState({}, '', path);
      this.render();
    }
  },

  routeFor(path) {
    if (DETAIL_RE.test(path)) {
      return { route: path.startsWith('/penginapan') ? 'hotels' : 'destinations', detail: true };
    }
    const hit = Object.entries(ROUTE_PATHS).find(([, p]) => p === path);
    return { route: hit ? hit[0] : 'beranda', detail: false };
  },

  render() {
    const { route, detail } = this.routeFor(location.pathname);
    this.current = route;

    document.querySelectorAll('.view').forEach(v => {
      const active = detail ? v.dataset.view === 'item-detail' : v.dataset.view === route;
      v.classList.toggle('active', active);
    });

    document.getElementById('navbar').classList.toggle('solid', route !== 'beranda');
    document.querySelectorAll('.nav-link[data-route]').forEach(a =>
      a.classList.toggle('active', a.dataset.route === route));

    if (!detail) document.title = TITLES[route] ?? TITLES.beranda;

    const scrollTo = this.pendingScroll;
    this.pendingScroll = null;

    requestAnimationFrame(() => {
      if (scrollTo) {
        const el = document.getElementById(scrollTo);
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
    });

    Reveal.refresh();
  },
};

/* ------------------------------------------------------------------
   04. NAVBAR
------------------------------------------------------------------ */
const Navbar = {
  init() {
    const navbar = document.getElementById('navbar');
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    const iconOpen = document.getElementById('iconOpen');
    const iconClose = document.getElementById('iconClose');

    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 40);
      if (y > 40 && !menu.classList.contains('hidden')) {
        /* keep navbar visible while the mobile menu is open */
        navbar.classList.remove('hidden-nav');
      } else if (y > 40 && y > lastY) {
        navbar.classList.add('hidden-nav');
      } else {
        navbar.classList.remove('hidden-nav');
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const close = () => {
      menu.classList.add('hidden');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    };

    btn.addEventListener('click', () => {
      if (!menu.classList.contains('hidden')) { close(); return; }
      menu.classList.remove('hidden');
      iconOpen.classList.add('hidden');
      iconClose.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
      navbar.classList.add('scrolled');
    });

    menu.addEventListener('click', e => {
      if (e.target.closest('[data-route], [data-open-ess], [data-logout]')) close();
    });
  },
};

/* ------------------------------------------------------------------
   05. MOMENT SLIDER
------------------------------------------------------------------ */
const MomentSlider = {
  init() {
    const wrap = document.getElementById('momentSlider');
    if (!wrap) return;
    let index = 0;

    if (!wrap.querySelector('.moment-slide')) {
      wrap.innerHTML = MOMENTS.map((m, i) => `
        <div class="moment-slide absolute inset-0 transition-opacity duration-500 ${i === 0 ? 'opacity-100' : 'opacity-0'}">
          <img class="w-full h-full object-cover" alt=""
               src="${localSrc(m.img)}" data-fallback="${localSrc(m.fb)}" loading="lazy">
        </div>`).join('')
        + `<div class="absolute bottom-5 right-5 z-20 flex gap-2">${
          MOMENTS.map((_, i) =>
            `<button type="button" aria-label="Foto ${i + 1}" data-mdot="${i}"
                     class="w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/40'} transition-all"></button>`,
          ).join('')}</div>`;
    }

    ImageFallback.bindAll(wrap);
    const slides = [...wrap.querySelectorAll('.moment-slide')];
    const dots = [...wrap.querySelectorAll('[data-mdot]')];

    const go = i => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => {
        s.classList.toggle('opacity-100', n === index);
        s.classList.toggle('opacity-0', n !== index);
      });
      dots.forEach((d, n) => {
        d.classList.toggle('bg-white', n === index);
        d.classList.toggle('bg-white/40', n !== index);
      });
    };
    dots.forEach(d => d.addEventListener('click', () => go(Number(d.dataset.mdot))));
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => go(index + 1), 2500);
  },
};

/* ------------------------------------------------------------------
   06b. DESTINATIONS
------------------------------------------------------------------ */
const Destinations = {
  filter: 'semua',
  query: '',

  init() {
    const filtersWrap = document.getElementById('destFilters');

    filtersWrap.innerHTML = DEST_FILTERS.map(f => `
      <button type="button" data-dfilter="${f.id}" aria-pressed="false" class="pill inline-flex items-center gap-2">
        ${icon(f.icon, 'w-4 h-4')}${esc(f.label)}
      </button>`).join('');

    this.renderGrid();

    filtersWrap.querySelectorAll('[data-dfilter]').forEach(t =>
      t.addEventListener('click', () => { this.filter = t.dataset.dfilter; this.apply(); }));

    document.getElementById('destSearch').addEventListener('input', e => {
      this.query = e.target.value.trim().toLowerCase();
      this.apply();
    });

    const modal = document.getElementById('destModal');
    modal.addEventListener('click', e => {
      if (e.target === modal || e.target.closest('[data-close-dest]')) this.closeDetail();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) this.closeDetail();
    });

    this.apply();
  },

  renderGrid() {
    const grid = document.getElementById('destGrid');
    grid.innerHTML = DESTINATIONS.map(d => `
      <article class="dest-card group card card-hover overflow-hidden flex flex-col"
               data-type="${d.type}" data-name="${esc(d.name.toLowerCase())}" data-area="${esc(d.area.toLowerCase())}">
        <div class="relative aspect-[16/10] img-shell overflow-hidden">
          ${coverMedia(d, 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500')}
          ${d.tag ? `<span class="absolute top-3 left-3 bg-clay text-white text-[11px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full">${esc(d.tag)}</span>` : ''}
          <span class="absolute bottom-3 right-3 bg-bark/75 backdrop-blur-xs text-white text-[11px] font-heading font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            ${icon('camera', 'w-3 h-3')} 6 Footage
          </span>
        </div>
        <div class="p-5 flex flex-col flex-1">
          <p class="font-heading font-bold text-ink text-lg">${esc(d.name)}</p>
          <p class="text-xs text-muted mt-1 flex items-center gap-1.5">
            ${icon('map-pin', 'w-3.5 h-3.5 shrink-0')}${esc(d.area)}
          </p>
          <p class="text-sm text-muted leading-relaxed mt-3 flex-1">${esc(d.desc.slice(0, 110))}…</p>
          <div class="flex items-center justify-between mt-5 pt-4 border-t border-line-soft">
            <button type="button" data-dest-detail="${d.id}"
                    class="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-sage-deep border-b-2 border-sage pb-0.5 transition-colors">
              ${State.locale === 'en' ? 'View 6 footages' : 'Lihat 6 footage'} ${icon('arrow-right', 'w-3.5 h-3.5')}
            </button>
          </div>
        </div>
      </article>`).join('');
    ImageFallback.bindAll(grid);
    grid.querySelectorAll('[data-dest-detail]').forEach(b =>
      b.addEventListener('click', () => this.openDetail(b.dataset.destDetail)));
    this.apply();
  },

  refresh() {
    this.renderGrid();
  },

  apply() {
    const cards = [...document.querySelectorAll('.dest-card')];
    document.querySelectorAll('[data-dfilter]').forEach(t =>
      t.setAttribute('aria-pressed', String(t.dataset.dfilter === this.filter)));

    let visible = 0;
    cards.forEach(c => {
      const typeOk = this.filter === 'semua' || c.dataset.type === this.filter;
      const textOk = !this.query || c.dataset.name.includes(this.query) || c.dataset.area.includes(this.query);
      const show = typeOk && textOk;
      c.classList.toggle('hidden', !show);
      if (show) visible++;
    });

    document.getElementById('destCount').textContent = State.locale === 'en' ? `Showing ${visible} of ${cards.length} destinations` : `Menampilkan ${visible} dari ${cards.length} destinasi`;
    document.getElementById('destEmpty').classList.toggle('hidden', visible > 0);
  },

  openDetail(id) {
    const d = DESTINATIONS.find(x => x.id === id);
    if (!d) return;
    const body = document.getElementById('destModalBody');

    body.innerHTML = `
      <div class="relative aspect-[16/9] img-shell">
        ${coverMedia(d, 'w-full h-full object-cover')}
        <div class="absolute inset-0 bg-bark/45"></div>
        <button type="button" data-close-dest aria-label="${State.locale === 'en' ? 'Close' : 'Tutup'}"
                class="absolute top-4 right-4 w-9 h-9 rounded-full bg-bark/50 hover:bg-bark/70 flex items-center justify-center text-white">
          ${icon('x', 'w-5 h-5')}
        </button>
        <div class="absolute bottom-5 left-6 right-6">
          <div class="flex items-center gap-3 flex-wrap">
            <h3 class="font-heading font-bold text-white text-2xl">${esc(d.name)}</h3>
          </div>
          <p class="text-white/75 text-xs mt-1 flex items-center gap-1.5">
            ${icon('map-pin', 'w-3.5 h-3.5')}${esc(d.area)}
          </p>
        </div>
      </div>
      <div class="p-6 sm:p-7">
        <p class="text-sm text-muted leading-relaxed">${esc(d.desc)}</p>

        <p class="font-heading font-semibold text-ink text-sm mt-6 mb-3">${State.locale === 'en' ? 'Highlights' : 'Sorotan'}</p>
        <div class="flex flex-wrap gap-2">
          ${d.highlights.map(h =>
            `<span class="text-xs bg-paper border border-line-soft text-muted px-3 py-1.5 rounded-full">${esc(h)}</span>`).join('')}
        </div>

        <p class="font-heading font-semibold text-ink text-sm mt-6 mb-3">${State.locale === 'en' ? 'Gallery (6 Footage)' : 'Galeri (6 Footage)'}</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          ${d.gallery.map((g, i) => `
            <div class="aspect-[4/3] rounded-xl overflow-hidden img-shell">
              <img src="${localSrc(g)}" data-fallback="${localSrc(d.fb)}" alt="${esc(d.name)} ${i + 1}" loading="lazy"
                   class="w-full h-full object-cover">
            </div>`).join('')}
        </div>

        <div class="flex mt-7">
          <button type="button" data-close-dest class="btn-outline flex-1 py-3.5">${State.locale === 'en' ? 'Close' : 'Tutup'}</button>
        </div>
      </div>`;

    ImageFallback.bindAll(body);

    document.getElementById('destModal').classList.remove('hidden');
    lockScroll(true);
  },

  closeDetail() {
    document.getElementById('destModal').classList.add('hidden');
    lockScroll(false);
  },
};

/* ------------------------------------------------------------------
   06c. HOTELS
------------------------------------------------------------------ */
const Hotels = {
  type: 'Semua',
  allRooms,

  init() {
    const tabsWrap = document.getElementById('hotelTabs');
    tabsWrap.innerHTML = ROOM_TYPES.map(t =>
      `<button type="button" data-rtype="${esc(t)}" aria-pressed="false" class="pill">${esc(t)}</button>`).join('');

    this.renderRooms();
    tabsWrap.querySelectorAll('[data-rtype]').forEach(t =>
      t.addEventListener('click', () => { this.type = t.dataset.rtype; this.apply(); }));
    this.apply();
  },

  renderRooms() {
    const grid = document.getElementById('roomGrid');
    const roomCards = allRooms().map(r => `
      <article class="room-card card card-hover overflow-hidden flex flex-col"
               data-type="${esc(r.type)}" data-hotel="${r.hotelId}">
        <div class="aspect-[16/10] img-shell overflow-hidden">
          <img src="${localSrc(r.img)}" data-fallback="${localSrc(r.fb)}" alt="${esc(r.name)}" loading="lazy"
               class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
        </div>
        <div class="p-5 flex flex-col flex-1">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-heading font-bold text-ink text-base">${esc(r.name)}</p>
              <p class="text-xs text-muted mt-0.5">${esc(r.hotelName)} · ${esc(r.area)}</p>
            </div>
            <span class="shrink-0 text-[11px] font-heading font-semibold uppercase tracking-wider bg-sage-tint text-sage-deep px-2.5 py-1 rounded-full">${esc(r.type)}</span>
          </div>

          <p class="text-sm text-muted leading-relaxed mt-3">${esc(r.desc)}</p>

          <div class="flex flex-wrap gap-1.5 mt-4">
            <span class="inline-flex items-center gap-1 text-[11px] bg-paper border border-line-soft text-muted px-2.5 py-1 rounded-full">
              ${icon('users', 'w-3 h-3')} ${r.cap} ${State.locale === 'en' ? 'guests' : 'orang'}
            </span>
            ${r.facilities.slice(0, 3).map(f =>
              `<span class="text-[11px] bg-paper border border-line-soft text-muted px-2.5 py-1 rounded-full">${esc(f)}</span>`).join('')}
          </div>

          <div class="mt-auto pt-5 flex items-end justify-between gap-3">
            <div>
              ${r.rate
                ? `<p class="font-heading font-bold text-ink text-lg">${rupiah(r.rate)}</p>
                   <p class="text-xs text-muted">${State.locale === 'en' ? 'per room / night' : 'per kamar / malam'}</p>`
                : `<p class="font-heading font-bold text-ink text-base">${State.locale === 'en' ? 'Contact reservations' : 'Hubungi reservasi'}</p>
                   <p class="text-xs text-muted">${State.locale === 'en' ? 'rate not yet published' : 'tarif belum dipublikasikan'}</p>`}
            </div>
            <a href="https://wa.me/628216402221" target="_blank" rel="noopener"
              class="inline-flex items-center gap-2 bg-clay hover:bg-clay-deep text-white font-heading font-semibold text-sm px-5 py-2.5 rounded-full transition-colors">${State.locale === 'en' ? 'Contact WhatsApp' : 'Hubungi WhatsApp'}</a>
          </div>
        </div>
      </article>`).join('');

    const hotelCards = HOTELS.filter(h => !h.rooms.length).map(h => `
      <article class="room-card card card-hover overflow-hidden flex flex-col"
               data-type="Semua" data-hotel="${h.id}">
        <div class="aspect-[16/10] img-shell overflow-hidden">
          <img src="${localSrc(h.img)}" data-fallback="${localSrc(h.fb)}" alt="${esc(h.name)}" loading="lazy"
               class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
        </div>
        <div class="p-5 flex flex-col flex-1">
          <p class="font-heading font-bold text-ink text-base">${esc(h.name)}</p>
          <p class="text-xs text-muted mt-0.5">${esc(h.area)}</p>
          <p class="text-sm text-muted leading-relaxed mt-3">${esc(h.desc)}</p>
          <div class="flex flex-wrap gap-1.5 mt-4">
            ${h.facilities.slice(0, 3).map(f =>
              `<span class="text-[11px] bg-paper border border-line-soft text-muted px-2.5 py-1 rounded-full">${esc(f)}</span>`).join('')}
          </div>
          <div class="mt-auto pt-5">
            <a href="https://wa.me/628216402221" target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 bg-clay hover:bg-clay-deep text-white font-heading font-semibold text-sm px-5 py-2.5 rounded-full transition-colors">${State.locale === 'en' ? 'Contact Reservation Team' : 'Hubungi Tim Reservasi'}</a>
          </div>
        </div>
      </article>`).join('');

    grid.innerHTML = roomCards + hotelCards;

    ImageFallback.bindAll(grid);
  },

  apply() {
    const cards = [...document.querySelectorAll('.room-card')];
    document.querySelectorAll('[data-rtype]').forEach(t =>
      t.setAttribute('aria-pressed', String(t.dataset.rtype === this.type)));

    let visible = 0;
    cards.forEach(c => {
      const show = this.type === 'Semua' || c.dataset.type === this.type;
      c.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    document.getElementById('roomCount').textContent = State.locale === 'en' ? `Showing ${visible} of ${cards.length} options` : `Menampilkan ${visible} dari ${cards.length} pilihan`;
  },

  focusHotel(hotelId) {
    this.type = 'Semua';
    this.apply();
    const first = document.querySelector(`.room-card[data-hotel="${hotelId}"]`);
    if (!first) return;
    first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    first.classList.add('ring-2', 'ring-sage');
    setTimeout(() => first.classList.remove('ring-2', 'ring-sage'), 2200);
  },
};

/* ------------------------------------------------------------------
   06d. GALLERY
------------------------------------------------------------------ */
const Gallery = {
  init() {
    const grid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    let current = 0;

    const featuredGrid = document.getElementById('featuredGrid');
    const combined = GALLERY.concat(GALLERY_FEATURED);
    const tileHTML = (g, i) => `
      <button type="button" data-index="${i}"
              class="gallery-item group relative aspect-square rounded-xl overflow-hidden img-shell">
        <img src="${localSrc(g.img)}" data-fallback="${localSrc(g.fb)}" alt="" loading="lazy"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <span class="absolute inset-0 bg-bark/0 group-hover:bg-bark/40 transition-colors flex items-center justify-center">
          <span class="opacity-0 group-hover:opacity-100 transition-opacity text-white">
            ${icon('zoom-in', 'w-8 h-8')}
          </span>
        </span>
      </button>`;
    grid.innerHTML = GALLERY.map((g, i) => tileHTML(g, i)).join('');
    if (featuredGrid) featuredGrid.innerHTML = GALLERY_FEATURED.map((g, i) => tileHTML(g, GALLERY.length + i)).join('');
    ImageFallback.bindAll(grid);
    if (featuredGrid) ImageFallback.bindAll(featuredGrid);
    ImageFallback.bind(lbImg);

    const render = () => {
      const item = combined[current];
      lbImg.src = localSrc(item.img);
      lbImg.dataset.fallback = localSrc(item.fb);
      lbImg.alt = '';
      lbImg.style.visibility = '';
      document.getElementById('lightboxTitle').textContent = '';
      document.getElementById('lightboxCounter').textContent = `${current + 1} / ${combined.length}`;
    };
    const open = i => { current = i; render(); lightbox.classList.remove('hidden'); lockScroll(true); };
    const close = () => { lightbox.classList.add('hidden'); lockScroll(false); };
    const next = () => { current = (current + 1) % combined.length; render(); };
    const prev = () => { current = (current - 1 + combined.length) % combined.length; render(); };

    grid.querySelectorAll('.gallery-item').forEach(el =>
      el.addEventListener('click', () => open(Number(el.dataset.index))));
    if (featuredGrid) featuredGrid.querySelectorAll('.gallery-item').forEach(el =>
      el.addEventListener('click', () => open(Number(el.dataset.index))));
    document.getElementById('lightboxClose').addEventListener('click', close);
    document.getElementById('lightboxNext').addEventListener('click', next);
    document.getElementById('lightboxPrev').addEventListener('click', prev);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => {
      if (lightbox.classList.contains('hidden')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  },
};

/* ------------------------------------------------------------------
   08. ESS — Employee Self-Service
------------------------------------------------------------------ */
const ESS = {
  user: null,

  init() {
    const standalone = !!document.getElementById('essStandalone');

    document.querySelectorAll('[data-open-ess]').forEach(b =>
      b.addEventListener('click', () => this.openLogin()));
    document.querySelectorAll('[data-close-ess]').forEach(b => {
      if (standalone) b.classList.add('hidden');   // tidak ada tombol batal di halaman /ess
      else b.addEventListener('click', () => this.closeLogin());
    });

    document.getElementById('essLoginForm').addEventListener('submit', e => {
      e.preventDefault();
      this.doLogin();
    });
    document.getElementById('essLoginModal').addEventListener('click', e => {
      if (e.target === e.currentTarget && !standalone) this.closeLogin();
    });
    document.getElementById('essLogoutBtn').addEventListener('click', () => this.logout());

    document.getElementById('essVideoForm').addEventListener('submit', e => {
      e.preventDefault();
      this.saveVideo();
    });
    document.getElementById('essVideoClear').addEventListener('click', () => this.clearVideo());
    document.getElementById('essVideoDest').addEventListener('change', () => this.previewVideo());

    document.getElementById('essAccountForm').addEventListener('submit', e => {
      e.preventDefault();
      this.createAccount();
    });
    document.getElementById('essAccountBody').addEventListener('click', e => {
      const btn = e.target.closest('[data-del-acc]');
      if (btn) this.deleteAccount(btn.dataset.delAcc);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { this.closeLogin(); }
    });

    // The server already rendered the dashboard visible for a signed-in
    // employee. Di /ess, tampilkan login bila belum ada sesi karyawan.
    if (State.user?.kind === 'employee') {
      this.user = State.user;
      this.showDashboard();
    } else if (standalone) {
      this.openLogin();
    }
  },

  openLogin() {
    document.getElementById('essLoginError').classList.add('hidden');
    document.getElementById('essLoginModal').classList.remove('hidden');
    lockScroll(true);
    document.getElementById('essNik').focus();
  },
  closeLogin() {
    document.getElementById('essLoginModal').classList.add('hidden');
    if (!this.user) lockScroll(false);
  },

  async doLogin() {
    const nik = document.getElementById('essNik').value.trim();
    const password = document.getElementById('essPassword').value;
    const btn = document.getElementById('essLoginBtn');
    const err = document.getElementById('essLoginError');
    const original = btn.innerHTML;

    if (!nik || !password) {
      err.textContent = t('error.nikPassword');
      err.classList.remove('hidden');
      return;
    }

    err.classList.add('hidden');
    btn.disabled = true;
    btn.textContent = t('ess.memeriksa');

    const { ok, data } = await api('/api/ess/login', {
      method: 'POST',
      body: JSON.stringify({ nik, password }),
    });

    btn.disabled = false;
    btn.innerHTML = original;

    if (!ok) {
      err.textContent = data?.error ?? t('ess.tidakBisaMasuk');
      err.classList.remove('hidden');
      return;
    }

    document.getElementById('essPassword').value = '';
    this.user = data.user;
    this.closeLogin();
    this.showDashboard();
  },

  showDashboard() {
    const u = this.user;
    document.getElementById('essAvatar').textContent = u.name.trim().charAt(0).toUpperCase();
    document.getElementById('essProfileName').textContent = u.name;
    document.getElementById('essProfileMeta').textContent = `${u.nik} · ${u.role}`;
    document.getElementById('essDashboard').classList.remove('hidden');
    lockScroll(true);
    this.syncAccountsPanel();
  },

  isAdmin() {
    const u = this.user;
    return !!(u && u.kind === 'employee' && (u.name || '').trim().toLowerCase() === 'ami');
  },

  /* Show the account management panel only for the designated admin (Ami). */
  syncAccountsPanel() {
    const panel = document.getElementById('essAccountsPanel');
    if (panel) panel.classList.toggle('hidden', !this.isAdmin());
    if (this.isAdmin()) this.loadAccounts();
  },

  async loadAccounts() {
    const { ok, status, data } = await api('/api/ess/accounts');
    if (!ok) {
      if (status === 401) { this.forceLogout(); return; }
      document.getElementById('essAccountError').textContent = data?.error ?? 'Gagal memuat akun.';
      document.getElementById('essAccountError').classList.remove('hidden');
      return;
    }
    this.renderAccounts(data.accounts ?? []);
  },

  renderAccounts(accounts) {
    const body = document.getElementById('essAccountBody');
    const self = this;
    body.innerHTML = accounts.map(a => `
      <tr class="hover:bg-paper/70 transition-colors">
        <td class="px-4 py-3 font-heading font-semibold text-ink text-xs whitespace-nowrap">${esc(a.nik)}</td>
        <td class="px-4 py-3 font-medium text-ink text-sm">${esc(a.full_name)}</td>
        <td class="px-4 py-3 text-muted text-xs">${esc(a.role)}</td>
        <td class="px-4 py-3">${a.active
          ? '<span class="inline-flex items-center gap-1 text-[11px] font-heading font-semibold border border-ok/25 bg-ok-tint text-ok px-2.5 py-1 rounded-full">AKTIF</span>'
          : '<span class="inline-flex items-center gap-1 text-[11px] font-heading font-semibold border border-line bg-paper text-muted px-2.5 py-1 rounded-full">NONAKTIF</span>'}</td>
        <td class="px-4 py-3 text-right">
          ${a.nik === (self.user && self.user.nik) ? '<span class="text-[11px] text-muted">Anda</span>'
            : `<button type="button" data-del-acc="${esc(a.nik)}"
                 class="inline-flex items-center gap-1.5 border border-danger/30 text-danger font-heading font-semibold text-xs px-3 py-2 rounded-full hover:bg-danger-tint transition-colors">
                 ${icon('trash-2', 'w-3.5 h-3.5')} Hapus</button>`}
        </td>
      </tr>`).join('');
    document.getElementById('essAccountEmpty').classList.toggle('hidden', accounts.length > 0);
  },

  async createAccount() {
    const err = document.getElementById('essAccountError');
    err.classList.add('hidden');
    const nik = document.getElementById('essAccNik').value.trim();
    const name = document.getElementById('essAccName').value.trim();
    const role = document.getElementById('essAccRole').value;
    const password = document.getElementById('essAccPassword').value;

    if (!nik || !name || !role || !password) {
      err.textContent = 'Lengkapi NIK, nama, role, dan password.';
      err.classList.remove('hidden');
      return;
    }

    const btn = document.getElementById('essAccountBtn');
    btn.disabled = true;
    const { ok, status, data } = await api('/api/ess/accounts', {
      method: 'POST',
      body: JSON.stringify({ nik, name, role, password }),
    });
    btn.disabled = false;

    if (!ok) {
      if (status === 401) { this.forceLogout(); return; }
      if (status === 403) { this.syncAccountsPanel(); }
      err.textContent = data?.error ?? 'Gagal membuat akun.';
      err.classList.remove('hidden');
      return;
    }

    document.getElementById('essAccNik').value = '';
    document.getElementById('essAccName').value = '';
    document.getElementById('essAccRole').value = '';
    document.getElementById('essAccPassword').value = '';
    Toast.show(`Akun ${data.account.nik} berhasil dibuat`);
    this.loadAccounts();
  },

  async deleteAccount(nik) {
    if (!confirm(`Hapus akun ${nik}?`)) return;
    const { ok, status, data } = await api('/api/ess/accounts', {
      method: 'DELETE',
      body: JSON.stringify({ nik }),
    });
    if (!ok) {
      if (status === 401) { this.forceLogout(); return; }
      if (status === 403) { this.syncAccountsPanel(); }
      Toast.show(data?.error ?? 'Gagal menghapus akun.');
      return;
    }
    Toast.show(`Akun ${data.deleted} dihapus`);
    this.loadAccounts();
  },

  /* Video editor: prefill, save, clear. */
  videoEls() {
    return {
      dest: document.getElementById('essVideoDest'),
      url: document.getElementById('essVideoUrl'),
      note: document.getElementById('essVideoNote'),
      err: document.getElementById('essVideoError'),
    };
  },
  previewVideo() {
    const { dest, url, note, err } = this.videoEls();
    err.classList.add('hidden');
    const current = State.videos[dest.value];
    url.value = current ?? '';
    note.textContent = current
      ? t('ess.videoSaatIni')
      : t('ess.videoBelumAda');
  },
  async saveVideo() {
    const { dest, url, note, err } = this.videoEls();
    err.classList.add('hidden');
    const destination_id = dest.value;
    if (!destination_id) {
      err.textContent = t('ess.pilihDestinasiDulu');
      err.classList.remove('hidden');
      return;
    }
    const video_url = url.value.trim();
    if (video_url && !/^https?:\/\/.+/i.test(video_url)) {
      err.textContent = t('ess.urlHarusHttp');
      err.classList.remove('hidden');
      return;
    }

    const { ok, status, data } = await api('/api/ess/videos', {
      method: 'POST',
      body: JSON.stringify({ destination_id, video_url }),
    });
    if (!ok) {
      if (status === 401) { this.forceLogout(); return; }
      err.textContent = data?.error ?? t('ess.gagalSimpan');
      err.classList.remove('hidden');
      return;
    }

    if (video_url) State.videos[destination_id] = video_url;
    else delete State.videos[destination_id];
    note.textContent = video_url
      ? t('ess.videoTersimpan')
      : t('ess.videoDihapus');
    Toast.show(video_url ? t('ess.videoDisimpan') : t('ess.videoDihapusLabel'));
    Destinations.refresh();
  },

  async clearVideo() {
    const { dest, url, note, err } = this.videoEls();
    if (!dest.value) return;
    url.value = '';
    this.saveVideo();
  },

  async logout() {
    await api('/api/auth/logout', { method: 'POST' });
    location.href = '/';
  },

  forceLogout() {
    Toast.show(t('ess.sesiBerakhir'));
    setTimeout(() => { location.href = '/'; }, 1500);
  },
};

/* ------------------------------------------------------------------
   BOOTSTRAP
------------------------------------------------------------------ */
function boot() {
  ImageFallback.bindAll();
  Reveal.init();
  Auth.init();
  Navbar.init();
  MomentSlider.init();
  Destinations.init();
  Hotels.init();
  Gallery.init();
  ESS.init();
  Router.init(); // last: every view must exist before the first route renders
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
