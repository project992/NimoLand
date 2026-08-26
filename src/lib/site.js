/* Single place for site-wide constants used by <head>, Open Graph, JSON-LD,
   sitemap and robots. Imported by server pages only (never by the client). */
export const SITE = {
  name: 'Nimo Land Group',
  title: 'Nimo Land Group — Jaringan Destinasi Wisata Nasional',
  titleEn: 'Nimo Land Group — Indonesia\'s Nationwide Tourism Network',
  description:
    'Nimo Land Group mengelola destinasi wisata & resort di seluruh Indonesia — dari kebun teh Pangalengan hingga Danau Toba. Pesan tiket dan kamar online.',
  descriptionEn:
    'Nimo Land Group manages tourist destinations & resorts across Indonesia — from Bandung tea plantations to Lake Toba. Book tickets and rooms online.',
  url: 'https://nimo-land.vercel.app',
  lang: 'id',
  email: 'official@nimoenterprise.com',
  phoneDisplay: '0811-1112-1162',
  phoneWa: '6281111121162',
  // Absolute URL shown when a page is shared on WhatsApp / Instagram.
  // Points at the local copy of the hero photo (mirrored by
  // scripts/seed-live-assets.mjs into public/aimg/).
  ogImage: 'https://nimo-land.vercel.app/aimg/tAG8ngQWBpj62NH-sryt3zUUZ3FH7.jpg',
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

/** Site title/description per locale. */
export function siteTitle(locale) {
  return locale === 'en' ? SITE.titleEn : SITE.title;
}
export function siteDescription(locale) {
  return locale === 'en' ? SITE.descriptionEn : SITE.description;
}

/** Absolute URL helper for canonical links and the sitemap. */
export const u = path => SITE.url + (path === '/' ? '/' : path);