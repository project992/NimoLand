/* =====================================================================
   Nimo Land Group — client SPA

   00. State      — session + data injected by the server
   01. Utilities  — image fallback, dates, toast, reveal
   02. Auth       — session state, logout, the booking auth gate
   03. Router     — path routing (/destinasi, /penginapan/…)
   04. Navbar     — scroll state + mobile menu
   05. Hero / MomentSlider
   06. Wahana / Destinations / Hotels / Gallery / FAQ
   07. Booking    — ticket & room, priced by the server
   08. ESS        — employee portal against /api/ess/*
   ===================================================================== */
import {
  DESTINATIONS, DEST_FILTERS, HOTELS, ROOM_TYPES, CATEGORIES, WAHANA,
  MOMENTS, GALLERY, PACKAGES, FAQ_DATA, RULES,
  allRooms, parseISODate, addDays, toISODate, priceTicket, rupiah, localSrc,
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
    return `<video class="${className}" src="${esc(src)}" muted playsinline loop autoplay
                   preload="metadata" aria-label="Video ${esc(d.name)}"></video>`;
  }
  return `<img src="${localSrc(d.img)}" data-fallback="${localSrc(d.fb)}" alt="${esc(d.name)}"
               class="${className}" ${className.includes('w-full') ? 'loading="lazy"' : ''}>`;
}

/** Star row for rating badges built in template strings. */
function ratingBadge(destId, tone = 'dark') {
  const r = State.ratings[destId];
  if (!r) return '';
  const score = r.rating.toFixed(1).replace('.', ',');
  const count = Number(r.count).toLocaleString(State.locale === 'en' ? 'en-US' : 'id-ID');
  const label = State.locale === 'en'
    ? `Official rating ${score} out of 5, based on ${count} reviews${r.source ? ` on ${r.source}` : ''}`
    : `Rating resmi ${score} dari 5, berdasarkan ${count} ulasan${r.source ? ` di ${r.source}` : ''}`;
  const skin = tone === 'light'
    ? 'bg-white/15 border-white/25 text-white'
    : 'bg-clay-tint border-clay/25 text-ink';
  return `<span class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-heading ${skin}"
                title="${esc(label)}" aria-label="${esc(label)}">
      ${icon('star', 'w-3.5 h-3.5 fill-clay text-clay shrink-0')}
      <span class="font-bold">${score}</span>
      <span class="opacity-70">(${count})</span>
    </span>`;
}

/* ------------------------------------------------------------------
   02. AUTH — session state and the booking gate
------------------------------------------------------------------ */
const INTENT_KEY = 'nimo:booking-intent';

const Auth = {
  init() {
    document.querySelectorAll('[data-logout]').forEach(b =>
      b.addEventListener('click', () => this.logout()));

    document.querySelectorAll('[data-close-authgate]').forEach(b =>
      b.addEventListener('click', () => this.closeGate()));

    const gate = document.getElementById('authGateModal');
    gate?.addEventListener('click', e => { if (e.target === gate) this.closeGate(); });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !gate?.classList.contains('hidden')) this.closeGate();
    });

    // Coming back from a successful login with a stored intent? Resume it.
    if (isCustomer()) this.resumeIntent();
  },

  /**
   * The client-side half of the booking gate. The authoritative check is in
   * src/middleware.js and POST /api/bookings — this only saves the visitor a
   * wasted round trip and remembers what they were trying to do.
   * @returns {boolean} true when the caller may proceed
   */
  requireCustomer(intent) {
    if (isCustomer()) return true;

    try {
      sessionStorage.setItem(INTENT_KEY, JSON.stringify(intent));
    } catch { /* private mode: the gate still works, the resume just won't */ }

    // Return the visitor to this exact page, hash and all, after login.
    const next = location.pathname + location.search + location.hash;
    const q = `?next=${encodeURIComponent(next)}`;
    document.getElementById('authGateLogin').href = '/login' + q;
    document.getElementById('authGateRegister').href = '/register' + q;

    document.getElementById('authGateModal').classList.remove('hidden');
    lockScroll(true);
    return false;
  },

  closeGate() {
    document.getElementById('authGateModal').classList.add('hidden');
    lockScroll(false);
  },

  resumeIntent() {
    let intent = null;
    try {
      const raw = sessionStorage.getItem(INTENT_KEY);
      if (!raw) return;
      sessionStorage.removeItem(INTENT_KEY);
      intent = JSON.parse(raw);
    } catch {
      return;
    }
    if (!intent) return;

    // Wait for Booking.init() to have wired everything up.
    setTimeout(() => {
      if (intent.kind === 'room' && intent.roomId) Booking.openRoom(intent.roomId, { skipGate: true });
      else Booking.open(intent.tab ?? 'ticket', { skipGate: true });
      Toast.show(t('sukses.selamatDatang') + ' — ' + (State.locale === 'en' ? 'continue your booking' : 'lanjutkan pemesanan Anda'));
    }, 150);
  },

  async logout() {
    await api('/api/auth/logout', { method: 'POST' });
    // Full reload so every server-rendered fragment (navbar, booking header)
    // re-renders from the now-absent session.
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
  beranda: 'Nimo Land Group — Embrace the Serene Breeze',
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

    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
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
      if (e.target.closest('[data-route], [data-open-booking], [data-open-ess], [data-logout]')) close();
    });
  },
};

/* ------------------------------------------------------------------
   05. HERO + MOMENT SLIDER
------------------------------------------------------------------ */
const HeroCarousel = {
  init() {
    const track = document.getElementById('heroTrack');
    const dotsWrap = document.getElementById('heroDots');
    const slides = [...track.querySelectorAll('.hero-slide')];
    if (slides.length === 0) return;

    let index = 0;
    let timer = null;

    dotsWrap.innerHTML = slides.map((_, i) =>
      `<button type="button" aria-label="Slide ${i + 1}" data-dot="${i}"
               class="h-1.5 rounded-full bg-white/40 transition-all duration-300" style="width:20px"></button>`,
    ).join('');
    const dots = [...dotsWrap.children];

    const go = i => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('active', n === index));
      dots.forEach((d, n) => {
        d.classList.toggle('bg-white', n === index);
        d.classList.toggle('bg-white/40', n !== index);
        d.style.width = n === index ? '40px' : '20px';
      });
    };
    const restart = () => { clearInterval(timer); timer = setInterval(() => go(index + 1), 6000); };

    dots.forEach(d => d.addEventListener('click', () => { go(Number(d.dataset.dot)); restart(); }));
    document.getElementById('heroPrev').addEventListener('click', () => { go(index - 1); restart(); });
    document.getElementById('heroNext').addEventListener('click', () => { go(index + 1); restart(); });

    go(0);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) restart();
  },
};

const MomentSlider = {
  init() {
    const wrap = document.getElementById('momentSlider');
    let index = 0;

    wrap.innerHTML = MOMENTS.map((m, i) => `
      <div class="moment-slide absolute inset-0 transition-opacity duration-700 ${i === 0 ? 'opacity-100' : 'opacity-0'}">
        <img class="w-full h-full object-cover" alt=""
             src="${localSrc(m.img)}" data-fallback="${localSrc(m.fb)}" loading="lazy">
      </div>`).join('')
      + `<div class="absolute bottom-5 right-5 z-20 flex gap-2">${
        MOMENTS.map((_, i) =>
          `<button type="button" aria-label="Foto ${i + 1}" data-mdot="${i}"
                   class="w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/40'} transition-all"></button>`,
        ).join('')}</div>`;

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
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => go(index + 1), 5000);
  },
};

/* ------------------------------------------------------------------
   06a. WAHANA
------------------------------------------------------------------ */
const WahanaFilter = {
  init() {
    const tabsWrap = document.getElementById('filterTabs');
    const grid = document.getElementById('wahanaGrid');
    const countEl = document.getElementById('filterCount');
    const emptyEl = document.getElementById('wahanaEmpty');

    grid.innerHTML = WAHANA.map(w => `
      <article class="wahana-card group card card-hover overflow-hidden" data-cat="${w.cat}">
        <div class="aspect-[4/3] img-shell overflow-hidden">
          <img src="${localSrc(w.img)}" data-fallback="${localSrc(w.fb)}" alt="${esc(w.name)}" loading="lazy"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <div class="p-4">
          <p class="font-heading font-semibold text-ink text-sm">${esc(w.name)}</p>
          <p class="text-xs text-muted mt-1">${esc(w.note)}</p>
        </div>
      </article>`).join('');
    ImageFallback.bindAll(grid);

    tabsWrap.innerHTML = CATEGORIES.map(c => `
      <button type="button" data-cat="${c.id}" aria-pressed="false" class="pill inline-flex items-center gap-2">
        ${icon(c.icon, 'w-4 h-4')}${esc(c.label)}
      </button>`).join('');

    const tabs = [...tabsWrap.querySelectorAll('[data-cat]')];
    const cards = [...grid.querySelectorAll('.wahana-card')];

    const apply = cat => {
      tabs.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.cat === cat)));
      let visible = 0;
      cards.forEach(c => {
        const match = cat === 'semua' || c.dataset.cat === cat;
        c.classList.toggle('hidden', !match);
        if (match) visible++;
      });
      countEl.textContent = State.locale === 'en' ? `Showing ${visible} of ${cards.length} attractions` : `Menampilkan ${visible} dari ${cards.length} wahana`;
      emptyEl.classList.toggle('hidden', visible > 0);
    };

    tabs.forEach(t => t.addEventListener('click', () => apply(t.dataset.cat)));
    apply('semua');
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
        </div>
        <div class="p-5 flex flex-col flex-1">
          <div class="flex items-start justify-between gap-3">
            <p class="font-heading font-bold text-ink text-lg">${esc(d.name)}</p>
            ${ratingBadge(d.id)}
          </div>
          <p class="text-xs text-muted mt-1 flex items-center gap-1.5">
            ${icon('map-pin', 'w-3.5 h-3.5 shrink-0')}${esc(d.area)}
          </p>
          <p class="text-sm text-muted leading-relaxed mt-3 flex-1">${esc(d.desc.slice(0, 110))}…</p>
          <div class="flex items-center justify-between mt-5 pt-4 border-t border-line-soft">
            <span class="text-sm font-heading font-semibold text-ink">${esc(d.price)}</span>
            <button type="button" data-dest-detail="${d.id}"
                    class="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-sage-deep border-b-2 border-sage pb-0.5 transition-colors">
              ${State.locale === 'en' ? 'View details' : 'Lihat detail'} ${icon('arrow-right', 'w-3.5 h-3.5')}
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
    const rating = State.ratings[d.id];

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
            ${ratingBadge(d.id, 'light')}
          </div>
          <p class="text-white/75 text-xs mt-1 flex items-center gap-1.5">
            ${icon('map-pin', 'w-3.5 h-3.5')}${esc(d.area)}
          </p>
        </div>
      </div>
      <div class="p-6 sm:p-7">
        ${rating ? `
          <div class="flex items-center gap-3 mb-5 pb-5 border-b border-line-soft">
            ${ratingBadge(d.id)}
            <span class="text-xs text-muted">
              ${State.locale === 'en' ? 'Official rating' : 'Rating resmi'}${rating.source ? ` · ${esc(rating.source)}` : ''}
            </span>
          </div>` : ''}

        <p class="text-sm text-muted leading-relaxed">${esc(d.desc)}</p>

        <p class="font-heading font-semibold text-ink text-sm mt-6 mb-3">${State.locale === 'en' ? 'Highlights' : 'Sorotan'}</p>
        <div class="flex flex-wrap gap-2">
          ${d.highlights.map(h =>
            `<span class="text-xs bg-paper border border-line-soft text-muted px-3 py-1.5 rounded-full">${esc(h)}</span>`).join('')}
        </div>

        <p class="font-heading font-semibold text-ink text-sm mt-6 mb-3">${State.locale === 'en' ? 'Gallery' : 'Galeri'}</p>
        <div class="grid grid-cols-2 gap-3">
          ${d.gallery.map((g, i) => `
            <div class="aspect-[4/3] rounded-xl overflow-hidden img-shell">
              <img src="${localSrc(g)}" data-fallback="${localSrc(d.fb)}" alt="${esc(d.name)} ${i + 1}" loading="lazy"
                   class="w-full h-full object-cover">
            </div>`).join('')}
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-7">
          ${d.bookable
            ? `<button type="button" data-dest-book class="btn-accent flex-1 py-3.5">
                 ${icon('ticket', 'w-4 h-4')} ${State.locale === 'en' ? 'Buy Ticket' : 'Beli Tiket'} ${esc(d.name)}
               </button>`
            : `<a href="https://wa.me/6281111121162" target="_blank" rel="noopener" class="btn-accent flex-1 py-3.5">
                 ${State.locale === 'en' ? 'Check Availability' : 'Tanya Ketersediaan'}
               </a>`}
          <button type="button" data-close-dest class="btn-outline py-3.5">${State.locale === 'en' ? 'Close' : 'Tutup'}</button>
        </div>
      </div>`;

    ImageFallback.bindAll(body);
    body.querySelector('[data-dest-book]')?.addEventListener('click', () => {
      this.closeDetail();
      Booking.open('ticket');
    });

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
            ${r.rate
              ? `<button type="button" data-book-room="${r.id}"
                         class="bg-clay hover:bg-clay-deep text-white font-heading font-semibold text-sm px-5 py-2.5 rounded-full transition-colors">${State.locale === 'en' ? 'Book Room' : 'Booking Kamar'}</button>`
              : `<a href="https://wa.me/6281111121162" target="_blank" rel="noopener"
                    class="inline-flex items-center gap-2 border border-line text-sage-deep font-heading font-semibold text-sm px-5 py-2.5 rounded-full transition-colors">${State.locale === 'en' ? 'Contact WhatsApp' : 'Hubungi WhatsApp'}</a>`}
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
            <a href="https://wa.me/6281111121162" target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 bg-clay hover:bg-clay-deep text-white font-heading font-semibold text-sm px-5 py-2.5 rounded-full transition-colors">${State.locale === 'en' ? 'Contact Reservation Team' : 'Hubungi Tim Reservasi'}</a>
          </div>
        </div>
      </article>`).join('');

    grid.innerHTML = roomCards + hotelCards;

    ImageFallback.bindAll(grid);
    grid.querySelectorAll('[data-book-room]').forEach(b =>
      b.addEventListener('click', () => Booking.openRoom(b.dataset.bookRoom)));
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

    grid.innerHTML = GALLERY.map((g, i) => `
      <button type="button" data-index="${i}"
              class="gallery-item group relative aspect-square rounded-xl overflow-hidden img-shell">
        <img src="${localSrc(g.img)}" data-fallback="${localSrc(g.fb)}" alt="" loading="lazy"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <span class="absolute inset-0 bg-bark/0 group-hover:bg-bark/40 transition-colors flex items-center justify-center">
          <span class="opacity-0 group-hover:opacity-100 transition-opacity text-white">
            ${icon('zoom-in', 'w-8 h-8')}
          </span>
        </span>
      </button>`).join('');
    ImageFallback.bindAll(grid);
    ImageFallback.bind(lbImg);

    const render = () => {
      const item = GALLERY[current];
      lbImg.src = localSrc(item.img);
      lbImg.dataset.fallback = localSrc(item.fb);
      lbImg.alt = '';
      lbImg.style.visibility = '';
      document.getElementById('lightboxTitle').textContent = '';
      document.getElementById('lightboxCounter').textContent = `${current + 1} / ${GALLERY.length}`;
    };
    const open = i => { current = i; render(); lightbox.classList.remove('hidden'); lockScroll(true); };
    const close = () => { lightbox.classList.add('hidden'); lockScroll(false); };
    const next = () => { current = (current + 1) % GALLERY.length; render(); };
    const prev = () => { current = (current - 1 + GALLERY.length) % GALLERY.length; render(); };

    grid.querySelectorAll('.gallery-item').forEach(el =>
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
   06e. FAQ
------------------------------------------------------------------ */
const FAQ = {
  init() {
    const list = document.getElementById('faqList');
    list.innerHTML = FAQ_DATA.map((f, i) => `
      <div class="faq-item border border-line rounded-xl overflow-hidden bg-surface">
        <button type="button" aria-expanded="false" aria-controls="faq-panel-${i}"
                class="faq-trigger w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-heading font-semibold text-ink text-sm sm:text-base hover:bg-paper transition-colors">
          ${esc(f.q)}
          <span class="faq-chevron shrink-0 text-muted">${icon('chevron-down', 'w-4 h-4')}</span>
        </button>
        <div id="faq-panel-${i}" class="faq-panel">
          <p class="px-5 pb-5 pt-1 text-sm text-muted leading-relaxed">${esc(f.a)}</p>
        </div>
      </div>`).join('');

    const items = [...list.querySelectorAll('.faq-item')];
    items.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      const panel = item.querySelector('.faq-panel');
      const chevron = item.querySelector('.faq-chevron');

      trigger.addEventListener('click', () => {
        const isOpen = panel.classList.contains('open');
        items.forEach(o => {
          const p = o.querySelector('.faq-panel');
          p.classList.remove('open');
          p.style.maxHeight = '0px';
          o.querySelector('.faq-chevron').style.transform = '';
          o.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          panel.classList.add('open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
          chevron.style.transform = 'rotate(180deg)';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });

    window.addEventListener('resize', () =>
      list.querySelectorAll('.faq-panel.open').forEach(p => { p.style.maxHeight = p.scrollHeight + 'px'; }));
  },
};

/* ------------------------------------------------------------------
   07. BOOKING
------------------------------------------------------------------ */
const Booking = {
  tab: 'ticket',
  ticket: { packageId: 'regular', nationality: 'domestik', adult: 1, child: 0, date: '' },
  room: { roomId: null, checkIn: '', checkOut: '', rooms: 1, guests: 2 },

  init() {
    const modal = document.getElementById('bookingModal');

    document.querySelectorAll('.btab').forEach(b =>
      b.addEventListener('click', () => this.setTab(b.dataset.btab)));

    /* ---------- Ticket ---------- */
    const minDate = DateUtil.addDays(DateUtil.today(), RULES.MIN_LEAD_DAYS);
    const arrival = document.getElementById('arrivalDate');
    arrival.min = DateUtil.toISO(minDate);
    arrival.value = '';
    document.getElementById('dateHint').textContent =
      t('booking.dateHint') + DateUtil.long(minDate) + '.';

    document.querySelectorAll('input[name="pkg"]').forEach(r =>
      r.addEventListener('change', e => { this.ticket.packageId = e.target.value; this.updateTicket(); }));
    document.querySelectorAll('input[name="nationality"]').forEach(r =>
      r.addEventListener('change', e => { this.ticket.nationality = e.target.value; this.updateTicket(); }));
    ['change', 'input'].forEach(ev =>
      arrival.addEventListener(ev, () => { this.ticket.date = arrival.value; this.updateTicket(); }));

    document.querySelectorAll('[data-step]').forEach(btn =>
      btn.addEventListener('click', () => {
        const key = btn.dataset.step;
        const min = key === 'adult' ? 1 : 0;
        const next = this.ticket[key] + Number(btn.dataset.delta);
        if (next < min || next > RULES.MAX_TICKETS) return;
        this.ticket[key] = next;
        this.updateTicket();
      }));
    document.getElementById('payButton').addEventListener('click', () => this.checkoutTicket());

    /* ---------- Room ---------- */
    const roomSelect = document.getElementById('roomSelect');
    this.room.roomId = allRooms()[0].id;
    roomSelect.value = this.room.roomId;

    const ci = document.getElementById('checkInDate');
    const co = document.getElementById('checkOutDate');
    ci.min = DateUtil.toISO(minDate);
    co.min = DateUtil.toISO(DateUtil.addDays(minDate, 1));
    document.getElementById('stayHint').textContent =
      t('booking.checkinHint') + DateUtil.long(minDate) + t('booking.checkinMinNight');

    roomSelect.addEventListener('change', e => { this.room.roomId = e.target.value; this.updateRoom(); });
    ['change', 'input'].forEach(ev => {
      ci.addEventListener(ev, () => { this.room.checkIn = ci.value; this.syncCheckout(); this.updateRoom(); });
      co.addEventListener(ev, () => { this.room.checkOut = co.value; this.updateRoom(); });
    });
    document.querySelectorAll('[data-rstep]').forEach(btn =>
      btn.addEventListener('click', () => {
        const key = btn.dataset.rstep;
        const max = key === 'rooms' ? RULES.MAX_ROOMS : RULES.MAX_GUESTS;
        const next = this.room[key] + Number(btn.dataset.delta);
        if (next < 1 || next > max) return;
        this.room[key] = next;
        this.updateRoom();
      }));
    document.getElementById('roomPayButton').addEventListener('click', () => this.checkoutRoom());

    /* ---------- Open / close ---------- */
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-open-booking]');
      if (b && !e.target.closest('#destModal')) this.open(b.dataset.openBooking || 'ticket');
    });
    document.getElementById('closeBooking').addEventListener('click', () => this.close());
    modal.addEventListener('click', e => { if (e.target === modal) this.close(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) this.close();
    });
    document.getElementById('closeSuccess').addEventListener('click', () => {
      document.getElementById('successModal').classList.add('hidden');
      lockScroll(false);
    });

    this.initEticketActions();
    this.setTab('ticket');
    this.updateTicket();
    this.updateRoom();
  },

  setTab(tab) {
    this.tab = tab;
    document.getElementById('tabTicket').classList.toggle('hidden', tab !== 'ticket');
    document.getElementById('tabRoom').classList.toggle('hidden', tab !== 'room');
    document.querySelectorAll('.btab').forEach(b => {
      const on = b.dataset.btab === tab;
      b.classList.toggle('text-ink', on);
      b.classList.toggle('border-sage', on);
      b.classList.toggle('text-muted', !on);
      b.classList.toggle('border-transparent', !on);
    });
  },

  /** The booking gate. `skipGate` is only set when resuming after a login. */
  open(tab = 'ticket', { skipGate = false } = {}) {
    if (!skipGate && !Auth.requireCustomer({ kind: 'ticket', tab })) return;
    this.setTab(tab);
    document.getElementById('bookingModal').classList.remove('hidden');
    lockScroll(true);
  },

  close() {
    document.getElementById('bookingModal').classList.add('hidden');
    lockScroll(false);
  },

  openRoom(roomId, { skipGate = false } = {}) {
    if (!skipGate && !Auth.requireCustomer({ kind: 'room', roomId })) return;
    this.room.roomId = roomId;
    document.getElementById('roomSelect').value = roomId;
    this.updateRoom();
    this.open('room', { skipGate: true });
  },

  /* ================= TICKET ================= */
  getPackage() { return PACKAGES.find(p => p.id === this.ticket.packageId); },

  updateTicket() {
    const tk = this.ticket;
    const arrivalInput = document.getElementById('arrivalDate');
    const dateError = document.getElementById('dateError');
    const expiryNotice = document.getElementById('expiryNotice');
    const expirySpacer = document.getElementById('expirySpacer');

    document.getElementById('adultCount').textContent = tk.adult;
    document.getElementById('childCount').textContent = tk.child;
    document.querySelectorAll('[data-step]').forEach(btn => {
      const key = btn.dataset.step;
      const delta = Number(btn.dataset.delta);
      const min = key === 'adult' ? 1 : 0;
      btn.disabled = (delta < 0 && tk[key] <= min) || (delta > 0 && tk[key] >= RULES.MAX_TICKETS);
    });

    // --- H-1 validation ---
    let valid = false;
    let arrival = null;
    if (tk.date) {
      arrival = DateUtil.parseISO(tk.date);
      const min = DateUtil.addDays(DateUtil.today(), RULES.MIN_LEAD_DAYS);
      if (!arrival) {
        dateError.textContent = t('booking.tglTidakTerbaca');
        dateError.classList.remove('hidden');
      } else if (arrival < min) {
        dateError.textContent = t('booking.tglMinH1');
        dateError.classList.remove('hidden');
        arrivalInput.value = '';
        tk.date = '';
        arrival = null;
      } else {
        dateError.classList.add('hidden');
        valid = true;
      }
    } else {
      dateError.classList.add('hidden');
    }

    const quote = priceTicket({
      packageId: tk.packageId,
      nationality: tk.nationality,
      adult: tk.adult,
      child: tk.child,
      arrival: arrival ?? DateUtil.today(),
    });

    document.getElementById('adultPriceLabel').textContent = rupiah(quote.adultUnit) + ' ' + t('booking.perOrang');
    document.getElementById('childPriceLabel').textContent = rupiah(quote.childUnit) + ' ' + t('booking.perOrang');

    expiryNotice.classList.toggle('hidden', !valid);
    expirySpacer.classList.toggle('hidden', valid);
    if (valid) {
      document.getElementById('expiryValue').textContent =
        DateUtil.long(quote.expiry) + ` (${t('booking.kedatangan')} ${RULES.TICKET_VALID_DAYS} ${State.locale === 'en' ? 'days' : 'hari'})`;
    }

    document.getElementById('sumPackage').textContent =
      this.getPackage().name + (tk.nationality === 'manca' ? ' · ' + t('booking.mancanegara') : ' · ' + t('booking.domestik'));
    document.getElementById('sumArrival').textContent = valid
      ? DateUtil.long(arrival) + ' · ' + (DateUtil.isWeekend(arrival) ? t('booking.weekend') : t('booking.weekday'))
      : t('booking.belumDipilih');
    document.getElementById('sumExpiry').textContent = valid ? DateUtil.long(quote.expiry) : t('booking.belumDipilih');
    document.getElementById('sumAdult').textContent =
      `${tk.adult} × ${rupiah(quote.adultUnit)} = ${rupiah(quote.adultUnit * tk.adult)}`;
    document.getElementById('sumChild').textContent = tk.child === 0
      ? '—'
      : `${tk.child} × ${rupiah(quote.childUnit)} = ${rupiah(quote.childUnit * tk.child)}`;
    document.getElementById('sumTotal').textContent = rupiah(valid ? quote.total : 0);

    document.getElementById('payButton').disabled = !valid || quote.total <= 0;
    this._ticket = { valid, arrival, expiry: quote.expiry, total: quote.total };
  },

  async checkoutTicket() {
    const r = this._ticket;
    if (!r?.valid) return;

    const tk = this.ticket;
    const btn = document.getElementById('payButton');
    const errEl = document.getElementById('ticketApiError');
    const modal = document.getElementById('eticketModal');
    const loading = document.getElementById('eticketLoading');
    const body = document.getElementById('eticketBody');

    errEl.classList.add('hidden');
    btn.disabled = true;

    this.close();
    modal.classList.remove('hidden');
    loading.classList.remove('hidden');
    body.classList.add('hidden');
    lockScroll(true);
    document.getElementById('eticketLoadingText').textContent = t('booking.memprosesPembayaran');

    // The server recomputes the price from src/lib/data.js and returns the
    // stored record. Nothing about the amount is taken from this request.
    const { ok, status, data } = await api('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        kind: 'ticket',
        packageId: tk.packageId,
        nationality: tk.nationality,
        adult: tk.adult,
        child: tk.child,
        arrival: tk.date,
      }),
    });

    btn.disabled = false;

    if (!ok) {
      modal.classList.add('hidden');
      lockScroll(false);
      if (status === 401) {
        // Session expired between opening the form and paying.
        State.user = null;
        Auth.requireCustomer({ kind: 'ticket', tab: 'ticket' });
        return;
      }
      this.open('ticket', { skipGate: true });
      errEl.textContent = data?.error ?? t('booking.pemesananGagal');
      errEl.classList.remove('hidden');
      return;
    }

    if (data.payment?.midtrans) {
      const paid = await this.payViaSnap(data.payment);
      if (paid) {
        const fresh = await this.fetchTicketByOrder(data.payment.order_id);
        this.renderEticket(fresh ?? data.booking);
        loading.classList.add('hidden');
        body.classList.remove('hidden');
        Toast.show(t('booking.pembayaranBerhasil'));
        return;
      }
      modal.classList.add('hidden');
      lockScroll(false);
      this.open('ticket', { skipGate: true });
      errEl.textContent = t('booking.pembayaranBelumSelesai');
      errEl.classList.remove('hidden');
      return;
    }

    this.renderEticket(data.booking);
    loading.classList.add('hidden');
    body.classList.remove('hidden');
    Toast.show(t('booking.pembayaranBerhasil'));
  },

  /* ============ SNAP (MIDTRANS) ============ */
  _snapReady: null,

  async ensureSnap(base, clientKey) {
    if (window.snap) return;
    if (this._snapReady) return this._snapReady;
    this._snapReady = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = `${base}/snap/snap.js?client_key=${encodeURIComponent(clientKey)}`;
      s.async = true;
      s.onload = res;
      s.onerror = () => { this._snapReady = null; rej(new Error('snap load failed')); };
      document.head.appendChild(s);
    });
    return this._snapReady;
  },

  /** Buka Snap, lalu tunggu sampai webhook melunasi tiketnya. */
  async payViaSnap(p) {
    try {
      await this.ensureSnap(p.snap_base, p.client_key);
    } catch (err) {
      console.error('[pay] snap load failed:', err);
      return false;
    }
    return new Promise(resolve => {
      let settled = false;
      const done = v => { if (!settled) { settled = true; resolve(v); } };
      window.snap.pay(p.token, {
        onSuccess: () => done(this.waitTicketPaid(p.order_id)),
        onPending: () => done(this.waitTicketPaid(p.order_id)),
        onError: () => done(this.waitTicketPaid(p.order_id, 8)),
        onClose: () => done(this.waitTicketPaid(p.order_id, 8)),
      });
      // Pengaman: kalau callback Snap tak pernah datang, putuskan setelah 90 dtk.
      setTimeout(() => done(this.waitTicketPaid(p.order_id, 6)), 90_000);
    });
  },

  async fetchTicketByOrder(orderId) {
    const { ok, data } = await api(`/api/payments/${encodeURIComponent(orderId)}/status`);
    return ok ? data.ticket : null;
  },

  /** Polling status pembayaran sampai lunas / batal / habis percobaan. */
  waitTicketPaid(orderId, tries = 30, delay = 2000) {
    return new Promise(resolve => {
      const poll = async (n) => {
        const { ok, data } = await api(`/api/payments/${encodeURIComponent(orderId)}/status`);
        if (ok && data.ticket?.status === 'LUNAS') return resolve(true);
        if (ok && ['CANCELED', 'EXPIRED', 'FAILED'].includes(data.payment?.status)) return resolve(false);
        if (n <= 0) return resolve(false);
        setTimeout(() => poll(n - 1), delay);
      };
      poll(tries);
    });
  },

  renderEticket(b) {
    const arrival = DateUtil.parseISO(b.visit_date);
    const expiry = DateUtil.parseISO(b.expiry_date);
    const tk = this.ticket;

    document.getElementById('ticketCode').textContent = b.booking_code;
    document.getElementById('ticketName').textContent = b.customer_name;
    document.getElementById('ticketType').textContent = b.ticket_type;
    document.getElementById('ticketQty').textContent =
      `${b.quantity} ${State.locale === 'en' ? 'persons' : 'orang'} (${tk.adult} ${t('booking.dewasaLabel')}${tk.child ? ' + ' + tk.child + ' ' + t('booking.anakLabel') : ''})`;
    document.getElementById('ticketTotal').textContent = rupiah(Number(b.total_price));
    document.getElementById('ticketArrival').textContent = arrival ? DateUtil.long(arrival) : '—';
    document.getElementById('ticketExpiry').textContent = expiry ? DateUtil.long(expiry) : '—';

    const qr = document.getElementById('ticketQR');
    qr.src = 'https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=' +
      encodeURIComponent(b.booking_code);
    qr.alt = 'QR Code ' + b.booking_code;
  },

  /* ================= E-TICKET ACTIONS ================= */
  async downloadTicket() {
    const card = document.getElementById('ticketCard');
    const btn = document.getElementById('eticketPrint');
    const original = btn.innerHTML;

    btn.disabled = true;
    btn.textContent = t('booking.menyiapkanFile');

    try {
      // Loaded on demand: ~200 kB that only matters if someone hits download.
      const { default: html2canvas } = await import('html2canvas');

      const qr = document.getElementById('ticketQR');
      if (!qr.complete || qr.naturalWidth === 0) {
        await new Promise(resolve => {
          qr.addEventListener('load', resolve, { once: true });
          qr.addEventListener('error', resolve, { once: true });
        });
      }

      const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = 'E-Ticket-Nimo-' +
        document.getElementById('ticketCode').textContent.replace(/[^\w-]/g, '') + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('[eticket] download failed:', err);
      Toast.show(t('booking.gagalFile'));
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
    }
  },

  shareWhatsApp() {
    const get = id => document.getElementById(id).textContent;
    const lines = [
      t('booking.haloNimo'),
      '',
      `*${t('booking.kotaBooking')}:* ${get('ticketCode')}`,
      `*${t('booking.nama')}:* ${get('ticketName')}`,
      `*${t('booking.tipeTiket')}:* ${get('ticketType')}`,
      `*${t('booking.jumlah')}:* ${get('ticketQty')}`,
      `*${t('booking.total')}:* ${get('ticketTotal')}`,
      `*${t('booking.checkinLabel')}:* ${get('ticketArrival')}`,
      `*${t('booking.berlakuSampai')}:* ${get('ticketExpiry')}`,
      '',
      t('booking.tiketBerlakuHari') + ' ' + RULES.TICKET_VALID_DAYS + ' ' + t('booking.tiketBerlakuSuffix'),
    ];
    window.open('https://wa.me/6281111121162?text=' + encodeURIComponent(lines.join('\n')), '_blank');
  },

  initEticketActions() {
    document.getElementById('closeEticket').addEventListener('click', () => this.closeEticket());
    document.getElementById('eticketModal').addEventListener('click', e => {
      if (e.target === e.currentTarget) this.closeEticket();
    });
    document.getElementById('eticketPrint').addEventListener('click', () => this.downloadTicket());
    document.getElementById('eticketWhatsapp').addEventListener('click', () => this.shareWhatsApp());
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !document.getElementById('eticketModal').classList.contains('hidden')) {
        this.closeEticket();
      }
    });
  },

  closeEticket() {
    document.getElementById('eticketModal').classList.add('hidden');
    document.body.classList.remove('printing');
    lockScroll(false);
  },

  /* ================= ROOM ================= */
  getRoom() { return allRooms().find(r => r.id === this.room.roomId); },

  syncCheckout() {
    const s = this.room;
    const co = document.getElementById('checkOutDate');
    if (!s.checkIn) return;
    const inDate = DateUtil.parseISO(s.checkIn);
    if (!inDate) return;
    const minOut = DateUtil.addDays(inDate, 1);
    co.min = DateUtil.toISO(minOut);
    const out = DateUtil.parseISO(s.checkOut);
    if (!out || out <= inDate) {
      co.value = DateUtil.toISO(minOut);
      s.checkOut = co.value;
    }
  },

  updateRoom() {
    const s = this.room;
    const room = this.getRoom();
    const stayError = document.getElementById('stayError');
    const capWarn = document.getElementById('capacityWarn');
    const capSpacer = document.getElementById('capacitySpacer');

    if (!room.rate) {
      document.getElementById('roomMeta').textContent =
        `${room.hotelName} · ${room.area} · ${t('booking.kapasitasTotal')} ${room.cap} ${t('booking.orang')} · ${t('booking.tarifBelumPub')}`;
      document.getElementById('roomRateLabel').textContent = t('booking.hubungiTimReservasi');
      document.getElementById('guestCapLabel').textContent = `${t('booking.kapasitasTotal')} ${room.cap * s.rooms} ${t('booking.orang')}`;
      document.getElementById('roomsCount').textContent = s.rooms;
      document.getElementById('guestsCount').textContent = s.guests;
      document.querySelectorAll('[data-rstep]').forEach(btn => { btn.disabled = true; });
      capWarn.classList.add('hidden');
      capSpacer.classList.remove('hidden');
      stayError.textContent = t('booking.tarifBelumPubDetail');
      stayError.classList.remove('hidden');
      document.getElementById('rsumHotel').textContent = room.hotelName;
      document.getElementById('rsumRoom').textContent = `${room.name} · ${room.type}`;
      document.getElementById('rsumIn').textContent = t('booking.tidakTersedia');
      document.getElementById('rsumOut').textContent = t('booking.tidakTersedia');
      document.getElementById('rsumNights').textContent = '—';
      document.getElementById('rsumGuests').textContent = '—';
      document.getElementById('rsumCalc').textContent = '—';
      document.getElementById('rsumTotal').textContent = 'Rp 0';
      document.getElementById('roomPayButton').disabled = true;
      this._room = { valid: false };
      return;
    }

    document.getElementById('roomMeta').textContent =
      `${room.hotelName} · ${room.area} · ${t('booking.kapasitasTotal')} ${room.cap} ${t('booking.orang')} · ${rupiah(room.rate)} ${State.locale === 'en' ? 'per night' : 'per malam'}`;
    document.getElementById('roomRateLabel').textContent = rupiah(room.rate) + ' ' + t('booking.perKamarMalam');
    document.getElementById('guestCapLabel').textContent = `${t('booking.kapasitasTotal')} ${room.cap * s.rooms} ${t('booking.orang')}`;

    document.getElementById('roomsCount').textContent = s.rooms;
    document.getElementById('guestsCount').textContent = s.guests;
    document.querySelectorAll('[data-rstep]').forEach(btn => {
      const key = btn.dataset.rstep;
      const delta = Number(btn.dataset.delta);
      const max = key === 'rooms' ? RULES.MAX_ROOMS : RULES.MAX_GUESTS;
      btn.disabled = (delta < 0 && s[key] <= 1) || (delta > 0 && s[key] >= max);
    });

    let valid = false;
    let inDate = null;
    let outDate = null;
    let nights = 0;

    if (s.checkIn && s.checkOut) {
      inDate = DateUtil.parseISO(s.checkIn);
      outDate = DateUtil.parseISO(s.checkOut);
      const min = DateUtil.addDays(DateUtil.today(), RULES.MIN_LEAD_DAYS);

      if (!inDate || !outDate) {
        stayError.textContent = t('booking.tglTidakTerbaca');
        stayError.classList.remove('hidden');
      } else if (inDate < min) {
        stayError.textContent = t('booking.checkinMinBesok');
        stayError.classList.remove('hidden');
        document.getElementById('checkInDate').value = '';
        s.checkIn = '';
      } else if (outDate <= inDate) {
        stayError.textContent = t('booking.checkoutSetelahCheckin');
        stayError.classList.remove('hidden');
      } else {
        stayError.classList.add('hidden');
        valid = true;
        nights = DateUtil.nights(inDate, outDate);
      }
    } else {
      stayError.classList.add('hidden');
    }

    const overCap = s.guests > room.cap * s.rooms;
    capWarn.classList.toggle('hidden', !overCap);
    capSpacer.classList.toggle('hidden', overCap);
    if (overCap) {
      capWarn.textContent =
        `${s.guests} ${t('booking.tamu')} ${t('booking.tamuMelebihiKapasitas')} ${room.cap * s.rooms} ${t('booking.orang')}. ${t('booking.tambahKamar')}`;
    }

    const total = valid ? room.rate * nights * s.rooms : 0;

    document.getElementById('rsumHotel').textContent = room.hotelName;
    document.getElementById('rsumRoom').textContent = `${room.name} · ${room.type}`;
    document.getElementById('rsumIn').textContent = valid ? DateUtil.long(inDate) : t('booking.belumDipilih');
    document.getElementById('rsumOut').textContent = valid ? DateUtil.long(outDate) : t('booking.belumDipilih');
    document.getElementById('rsumNights').textContent = valid ? `${nights} ${t('booking.malam')}` : '—';
    document.getElementById('rsumGuests').textContent = `${s.guests} ${t('booking.tamu')} · ${s.rooms} ${t('booking.kamar')}`;
    document.getElementById('rsumCalc').textContent =
      valid ? `${rupiah(room.rate)} × ${nights} ${t('booking.malam')} × ${s.rooms} ${t('booking.kamar')}` : '—';
    document.getElementById('rsumTotal').textContent = rupiah(total);

    document.getElementById('roomPayButton').disabled = !valid || overCap || total <= 0;
    this._room = { valid, inDate, outDate, nights, total };
  },

  async checkoutRoom() {
    const r = this._room;
    if (!r?.valid) return;

    const s = this.room;
    const btn = document.getElementById('roomPayButton');
    const errEl = document.getElementById('roomApiError');

    errEl.classList.add('hidden');
    btn.disabled = true;

    const { ok, status, data } = await api('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        kind: 'room',
        roomId: s.roomId,
        checkIn: s.checkIn,
        checkOut: s.checkOut,
        rooms: s.rooms,
        guests: s.guests,
      }),
    });

    btn.disabled = false;

    if (!ok) {
      if (status === 401) {
        State.user = null;
        this.close();
        Auth.requireCustomer({ kind: 'room', roomId: s.roomId });
        return;
      }
      errEl.textContent = data?.error ?? t('booking.pemesananGagal');
      errEl.classList.remove('hidden');
      return;
    }

    const b = data.booking;
    document.getElementById('successTitle').textContent = t('booking.pemesananKamarBerhasilTitle');
    document.getElementById('successDetail').textContent =
      `${b.rooms} × ${b.room_name} ${State.locale === 'en' ? 'at' : 'di'} ${b.hotel_name} ${t('booking.untuk')} ${b.guests} ${t('booking.tamu')}, ` +
      `${DateUtil.short(DateUtil.parseISO(b.check_in))} – ${DateUtil.short(DateUtil.parseISO(b.check_out))} ` +
      `(${b.nights} ${t('booking.malam')}). ${t('booking.totalLabel')} ${rupiah(Number(b.total_price))}.`;
    document.getElementById('bookingCode').textContent = b.booking_code;

    this.close();
    document.getElementById('successModal').classList.remove('hidden');
    lockScroll(true);
    Toast.show(t('booking.pemesananKamarBerhasil'));
  },
};

/* ------------------------------------------------------------------
   08. ESS — Employee Self-Service
------------------------------------------------------------------ */
const ESS = {
  user: null,
  tickets: [],
  verifyTarget: null,
  pollTimer: null,

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
    document.getElementById('essSearch').addEventListener('input', () => this.renderTickets());
    document.getElementById('essFilter').addEventListener('change', () => this.renderTickets());
    document.getElementById('essLogoutBtn').addEventListener('click', () => this.logout());
    document.getElementById('essVerifyCancel').addEventListener('click', () => this.closeVerify());
    document.getElementById('essVerifyConfirm').addEventListener('click', () => this.confirmVerify());

    document.getElementById('essVideoForm').addEventListener('submit', e => {
      e.preventDefault();
      this.saveVideo();
    });
    document.getElementById('essVideoClear').addEventListener('click', () => this.clearVideo());
    document.getElementById('essVideoDest').addEventListener('change', () => this.previewVideo());
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { this.closeLogin(); this.closeVerify(); }
    });

    // The server already rendered the dashboard visible for a signed-in
    // employee; just start pulling data. Di /ess, tampilkan login bila belum
    // ada sesi karyawan.
    if (State.user?.kind === 'employee') {
      this.user = State.user;
      this.startPolling();
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
    this.startPolling();
  },

  /* ponytail: 20s polling instead of Supabase Realtime. Realtime needed the
     anon key in the browser, which meant a public read policy on `tickets` —
     every customer name and total, readable by anyone. If gate staff need
     sub-second updates, add a server-sent-events endpoint behind the same
     employee session check. */
  startPolling() {
    this.loadTickets();
    clearInterval(this.pollTimer);
    this.pollTimer = setInterval(() => {
      if (!document.hidden) this.loadTickets();
    }, 20_000);
  },

  async loadTickets() {
    const { ok, status, data } = await api('/api/ess/tickets');
    if (!ok) {
      if (status === 401) { this.forceLogout(); return; }
      document.getElementById('essSyncNote').textContent =
        (State.locale === 'en' ? 'Failed to load data: ' : 'Gagal memuat data: ') + (data?.error ?? (State.locale === 'en' ? 'network error' : 'kesalahan jaringan'));
      return;
    }
    this.tickets = data.tickets ?? [];
    this.renderTickets();
  },

  effectiveStatus(t) {
    if (t.status === 'TERPAKAI' || t.status === 'EXPIRED') return t.status;
    const exp = DateUtil.parseISO(t.expiry_date);
    const today = DateUtil.today();
    return exp && exp < today ? 'EXPIRED' : 'LUNAS';
  },

  renderTickets() {
    const query = document.getElementById('essSearch').value.trim().toLowerCase();
    const filter = document.getElementById('essFilter').value;
    const q = query.replace('#', '');

    const withStatus = this.tickets.map(t => ({ ...t, status: this.effectiveStatus(t) }));
    const list = withStatus.filter(t => {
      const matchText = !query ||
        t.booking_code.toLowerCase().includes(q) ||
        t.customer_name.toLowerCase().includes(query);
      return matchText && (filter === 'SEMUA' || t.status === filter);
    });

    document.getElementById('essStatTotal').textContent = withStatus.length;
    document.getElementById('essStatLunas').textContent = withStatus.filter(t => t.status === 'LUNAS').length;
    document.getElementById('essStatUsed').textContent = withStatus.filter(t => t.status === 'TERPAKAI').length;
    document.getElementById('essStatExpired').textContent = withStatus.filter(t => t.status === 'EXPIRED').length;

    document.getElementById('essTicketBody').innerHTML = list.map(t => {
      const visit = DateUtil.parseISO(t.visit_date);
      const expiry = DateUtil.parseISO(t.expiry_date);
      const action = t.status === 'LUNAS'
        ? `<button type="button" data-verify="${esc(t.booking_code)}"
             class="inline-flex items-center gap-1.5 bg-sage hover:bg-sage-deep text-white font-heading font-semibold text-xs px-3 py-2 rounded-full transition-colors">
             ${icon('badge-check', 'w-3.5 h-3.5')} ${t('ess.verifikasi')}</button>`
        : '<span class="text-[11px] text-muted">—</span>';

      return `
        <tr class="hover:bg-paper/70 transition-colors">
          <td class="px-4 py-3 font-heading font-semibold text-ink text-xs whitespace-nowrap">${esc(t.booking_code)}</td>
          <td class="px-4 py-3 font-medium text-ink">${esc(t.customer_name)}</td>
          <td class="px-4 py-3 text-muted text-xs">${esc(t.ticket_type)}</td>
          <td class="px-4 py-3 text-muted text-xs whitespace-nowrap">${visit ? DateUtil.short(visit) : '—'}</td>
          <td class="px-4 py-3 text-muted text-xs whitespace-nowrap">${expiry ? DateUtil.short(expiry) : '—'}</td>
          <td class="px-4 py-3 text-muted text-xs">${esc(t.quantity)}</td>
          <td class="px-4 py-3 font-heading font-semibold text-ink text-xs whitespace-nowrap">${rupiah(Number(t.total_price))}</td>
          <td class="px-4 py-3">${this.statusBadge(t.status)}</td>
          <td class="px-4 py-3">${action}</td>
        </tr>`;
    }).join('');

    document.getElementById('essTicketEmpty').classList.toggle('hidden', list.length > 0);

    document.getElementById('essTicketBody').querySelectorAll('[data-verify]').forEach(b =>
      b.addEventListener('click', () => this.openVerify(b.dataset.verify)));

    document.getElementById('essSyncNote').textContent =
      t('ess.diperbarui') + ' ' + new Date().toLocaleTimeString(State.locale === 'en' ? 'en-US' : 'id-ID') + ' · ' + t('ess.menyegarkan');
  },

  statusBadge(s) {
    const map = {
      LUNAS:    'bg-ok-tint text-ok border-ok/25',
      TERPAKAI: 'bg-info-tint text-info border-info/25',
      EXPIRED:  'bg-danger-tint text-danger border-danger/25',
    };
    const cls = map[s] ?? 'bg-paper text-muted border-line';
    return `<span class="inline-flex items-center gap-1 text-[11px] font-heading font-semibold border px-2.5 py-1 rounded-full whitespace-nowrap ${cls}">${
      s === 'TERPAKAI' ? t('ess.terpakai') : esc(s)}</span>`;
  },

  openVerify(bookingCode) {
    const t = this.tickets.find(x => x.booking_code === bookingCode);
    if (!t) return;
    this.verifyTarget = t;
    document.getElementById('essVerifyCode').textContent = t.booking_code;
    document.getElementById('essVerifyName').textContent = t.customer_name;
    document.getElementById('essVerifyModal').classList.remove('hidden');
  },

  closeVerify() {
    this.verifyTarget = null;
    document.getElementById('essVerifyModal').classList.add('hidden');
  },

  async confirmVerify() {
    const verifyTicket = this.verifyTarget;
    if (!verifyTicket) return;

    const btn = document.getElementById('essVerifyConfirm');
    btn.disabled = true;

    const { ok, status, data } = await api('/api/ess/verify', {
      method: 'POST',
      body: JSON.stringify({ booking_code: verifyTicket.booking_code }),
    });

    btn.disabled = false;

    if (!ok) {
      if (status === 401) { this.forceLogout(); return; }
      Toast.show(data?.error ?? t('ess.gagalUpdateStatus'));
      this.closeVerify();
      await this.loadTickets();
      return;
    }

    this.closeVerify();
    await this.loadTickets();
    Toast.show(`${t('ess.tiketDitandai')} ${verifyTicket.booking_code} ${t('ess.ditandai')} TERPAKAI`);
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
    clearInterval(this.pollTimer);
    await api('/api/auth/logout', { method: 'POST' });
    location.href = '/';
  },

  forceLogout() {
    clearInterval(this.pollTimer);
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
  HeroCarousel.init();
  MomentSlider.init();
  WahanaFilter.init();
  Destinations.init();
  Hotels.init();
  Gallery.init();
  FAQ.init();
  Booking.init();
  ESS.init();
  Router.init(); // last: every view must exist before the first route renders
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
