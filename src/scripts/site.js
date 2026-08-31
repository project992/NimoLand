/* Navigation for standalone pages that don't mount the full SPA (app.js),
   e.g. the legal pages. data-route links cross-navigate to the SPA's real
   paths; the ESS trigger goes home where it lives. */
const ROUTE_PATHS = { beranda: '/', destinations: '/destinasi', hotels: '/penginapan', galeri: '/galeri', kontak: '/kontak' };

document.addEventListener('click', (e) => {
  const nav = e.target.closest('[data-route]');
  if (nav) {
    e.preventDefault();
    location.href = ROUTE_PATHS[nav.dataset.route] || '/';
    return;
  }

  const logout = e.target.closest('[data-logout]');
  if (logout) {
    e.preventDefault();
    fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
      .catch(() => {})
      .finally(() => { location.href = '/'; });
  }
});

const menuBtn = document.getElementById('mobileMenuBtn');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const menu = document.getElementById('mobileMenu');
    const open = document.getElementById('iconOpen');
    const close = document.getElementById('iconClose');
    const nowHidden = menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !nowHidden);
    open.classList.toggle('hidden', nowHidden);
    close.classList.toggle('hidden', !nowHidden);
    menuBtn.setAttribute('aria-expanded', String(nowHidden));
  });
}