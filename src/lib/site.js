/* Single place for site-wide constants used by <head>, Open Graph, JSON-LD,
   sitemap and robots. Imported by server pages only (never by the client). */
export const SITE = {
  name: 'Nimo Land Group',
  title: 'Nimo Land Group — Embrace the Serene Breeze',
  description:
    'Nimo Land Group — destinasi kebun teh, Sky Bridge 360°, Nimo Eye, destinasi & penginapan di seluruh Indonesia. Pesan tiket dan kamar online.',
  url: 'https://nimo-land.vercel.app',
  lang: 'id',
  email: 'official@nimoenterprise.com',
  phoneDisplay: '0811-1112-1162',
  phoneWa: '6281111121162',
  // Absolute URL shown when a page is shared on WhatsApp / Instagram.
  // TODO: after image migration, replace with `${SITE.url}/images/og.jpg`.
  ogImage:
    'https://lh3.googleusercontent.com/sitesv/AG8ngQXtuSJsYKZFz6bbT0yuxXltbqSpRwQLG6VUsIZ5mzRF2_xpk6o-M20YnrPZ19VcqxNloh0sEYqyXfbj9h6DRkm-jOiQGpft_XhHVAgP6AzFpTiMxglpHzNuEugRmXw2CxKHxh_jCcQ-baunoTbj1shUjJC9pMFBzQ-MTZRFHHLMnfV7Y9SJnGOP4AUU4DRtAWNCGk556t6_igc3x7lgIwp1UKBJiblKRvS4WSMQpFo=w1280',
  social: {
    instagram: 'https://www.instagram.com/nimohighland/',
    instagramEye: 'https://www.instagram.com/nimo_eye/',
    tiktok: 'https://www.tiktok.com/@nimohighland',
    youtube: 'https://www.youtube.com/@Nimo_Land_Group',
  },
  addressBandung: {
    street: 'Komplek Ruko Buahbatu Square Blk. A No.09',
    locality: 'Bojongsoang',
    region: 'Kabupaten Bandung',
    postalCode: '40267',
    country: 'ID',
  },
  addressJakarta: {
    street: 'Sequis Center Lt. 8 Kav 814, Jl. Jendral Sudirman No. 71',
    locality: 'Senayan, Jakarta Selatan',
    region: 'DKI Jakarta',
    postalCode: null,
    country: 'ID',
  },
  // Nimo Highland, the flagship destination (KontakView map embed).
  coordinate: { lat: -7.219462, lng: 107.57742 },
  addressHighland: 'Banjarsari, Pangalengan, Kabupaten Bandung, Jawa Barat 40378',
  hours: [
    { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
    { dayOfWeek: ['Saturday', 'Sunday'], opens: '05:00', closes: '17:00' },
  ],
};

/** Absolute URL helper for canonical links and the sitemap. */
export const u = path => SITE.url + (path === '/' ? '/' : path);