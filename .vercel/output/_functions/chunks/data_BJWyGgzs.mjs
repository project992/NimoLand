/* Content + pricing data, shared by the server and the client SPA.

   Pricing lives here specifically so the booking endpoint can recompute totals
   server-side. The browser's number is a display convenience; the server's is
   the one that gets charged. */

const G = 'https://lh3.googleusercontent.com/sitesv/';

const IMG = {
  hero:     G + 'AG8ngQXtuSJsYKZFz6bbT0yuxXltbqSpRwQLG6VUsIZ5mzRF2_xpk6o-M20YnrPZ19VcqxNloh0sEYqyXfbj9h6DRkm-jOiQGpft_XhHVAgP6AzFpTiMxglpHzNuEugRmXw2CxKHxh_jCcQ-baunoTbj1shUjJC9pMFBzQ-MTZRFHHLMnfV7Y9SJnGOP4AUU4DRtAWNCGk556t6_igc3x7lgIwp1UKBJiblKRvS4WSMQpFo=w1280',
  mist:     G + 'AG8ngQXNdn0p5bIfI3ZjSiln6IpBETUcW9bYb0f4gCHzr15_QWOqq3zqFCQWihVrLGzQbXB7T6PrLcVWLmunG1cCYv34e5E1k24Rp3tYiB1EI9RVvhaWNX9Onz08dqb-7oddNjdUxdq1YGJduiY0xAoFqHzNkwuPnDKx5Vg1YJAGjRIn7pi_kijMPnIJL9z-OUjyA349nX3_ikiX9SPJI1GxUYTa327anPzTUcEhtZs1Kw8=w1280',
  light:    G + 'AG8ngQVfOhjkBOYGWSaTE0J6Tg22zyF-5uvX6nACNdQioHL8snh70eBuFI5Lpr4vw02Q7ABKwzLDm0AMvhFp3PVaK6nLFyBtUdoUisiF8eaTOBjzfpdxQcmsb1RAkDZf-Sg5EHn9HyaPw9OSzZO_sxFA_jPTcW4hjIEZjhsoKCsyUL4Ay-kMQhaKxnSl68fTnirw46L9oyCCS7tv9Trm5Ho8qBhDe7Vd8q3EKfw-vDbeZ4Q=w1280',
  epic:     G + 'AG8ngQUdTWK9ndJi8kc7mOkA15GMibih_s4rXe4zFqs3sGBbazbZYKvh7vLLb1VJkYN-TSM9CX2ZA0jpDHLWlx5223mr5ZkwjbJ5M9EWSK0PGWIDcxhlixP0ZtTXXiwzKq3Tj7jaj5YiGfv07HCTv-n7rjflFcsYY0lcTJK4QhX_3zw1X4twAdaqU0JAmK_8KRvUwj5fqOjyhjWODm1tubc5UzjFMIgaLtT0Dfft3bOvGvI=w1280',
  sunrise:  G + 'AG8ngQVEI4tW2pkLhi6D0bTTEBYosjT-12943AeJpQfLKbqdWB-mC26xlF7lcg27tOdDNaHqba2Fas6FSKmghwOXzwu9mHz4yhBaGYyg5k-N93kX3KpYzK6XtO5b6rFhdunRDyd6THL_OuaZYxdF8-vz3dnJYVPb7Edzy_7RB0UyhNRjZyFDTGxG3EL_FJOUA6vFnwF9ON80Xz7wYssmP4aQ0gBEnF8PUYxXqPGmCGSB=w1280',
  act7:     G + 'AG8ngQWF-PfEICxm6jVsUtrOhMCcX4ggl2lGkwICLJtDKI7l0nWWczvsY4WtP-_bLIskpBEZb8pr9dJNo_dVKuXdQ6kwmrsYOjgB20lbMqKjoqQew5CrKBNcsuKrxgDg6-4L_oMsqp89icJ8uRXJvYqNvUGwpVYK3Mv6dU_xxNDjCAThwaQ6ewx8d1SyshWJnRoGJ0P6EzLN6Rz77uPXmITbrwY03BXc00EY3xPCReA8=w1280',
  zoo:      G + 'AG8ngQVFa4IzIZ2hmBNc1Gma8LZcp8M0QkOAMoY1FJyTtNcInnut8qV6JdfXSKhEiBArV3vgTP-ziSqPeciF2SaAiX57BexU6yUUuAaaBEP1UNRez8bJDYkHNiBG235aVTVsaNaPxgIjjCfpdNMS56ADe8tHcnvBqcnWogOISfGDmT6o50CO6Y3H0Qsd4QJjxzATiDHZlN8KsVw40qFghCoOD_wtmW4KPscWEajxYA=w1280',
  zooFun:   G + 'AG8ngQVVv5-VbQY0fg2y18xtUoSudNscKYiCVwsdobmYRSiiKL8NZOdvLUn88g6lmePzH6ZSXSePhIccvR2ap0E3LbBMxg9RsLendJT-CWMOW2e_OTkal8Eu1Ssgz0-NL1wLl4Rj341DI3eSHRe4pLpojHVpIhC84WNHkOByeN1vpPcJFWRovwNa7BlQEb7gvTr-N6LQxaLozlN2MhxBbcSpvKU9eNCDBxthQNH3nc68qxk=w1280',
  fac1:     G + 'AG8ngQUP5RVuGqSOcR-c21jEFzTaNn11qkY37pACBVLsMceuzlwdWHyVOyXN2E_ghmWRQ754Mww0SiIyEWVhr5qOWlQqt3016v88mgVTiVhRYkg-qDdSmcjRw5VPJ5m1mMayarBTfq3-QwD6qkMYygxoW7uyhbY6EGSADhF3nzCJ-iwBOS0-AEVkvjIvWyyiXweCLndq_KFr-iXSeXsaLmjmMalLybhpuXVOtorsweJJPzg=w1280',
  fac2:     G + 'AG8ngQVa9CCe8IULu-jy3HVtXKy1LZ_Fwp3YtXm8_QK15JpxZOMsGlfDMPOK6Df1CWnbJGu73lXzQb6Te1RF38WSfg44REuDR2BEDIDKSWZUw1WZn1e1khSAECKUnmQvgOTDkjAROGbgNB5PGcI3XxBUKHxqlqNBUDFL51Td7sUVM5Hpy6Qhm3QC8oIGuV4m8OxWWmCgKxgm4D_k80le4vwDMq9HivV1dAnqbJSfpyTvJus=w1280',
  fac3:     G + 'AG8ngQW_QM4Z7IsQq2u_WN3f8bxMJrAev1nF3pKcjXws9F4YlyLo0ZWZGFilHRE3CdWkb447Ld5Nbh2Un6OsU4vgvRvwtrkJTxyIsV2cc9MtnYi2GpS7WhYrMAsh5kvy1m2KFpxudve7wPLVLm6mjG5UAoC4aYJE9u0eBpzCDxizFxVGfkuqJyFpL1nPyoiab0hLjAki-lMwpt9MMBQk-emNvcj-YYAKgOlHLk2KnrVa=w1280',
  fac4:     G + 'AG8ngQVNUfV856YBdJuduSC71m7A1KvHD8Y_XvXBKBCEH7ySYfCJXa4oThFkHKZq11NjtBtf7JlAo9w-RwcmxZH-5f9tXMfIT2uA6BfEI6ICHgV5_97-PL8kKfWpGxF70NHo4Q9C_I7bQ0DVHYUQI8WJjE5zPYfxErr2WsfW53hiBuTirprGDtU13P1NQXzSIpWTiEw4Nq81WoCPstBQf3i2k8Br3z1Z4johGP1aK0zD=w1280',
  fac5:     G + 'AG8ngQWLIfB-ZXk4TzI-wsCS_BraLiRNmXD_zehOgFKlo2sf23pdScxAwGWAaz0Me7JoHsDph1QxcYPQQYuEIhrWqlQeHiFohplSj179ebZ4gYifmSuxTn_t_Ka_4NoF-1eUVLUk4J8j_IYLG6fwhz5AE81XsObadebUW-sAUx__DGDD-KgqPYX8HYI6Ek3mglj4lx8AdcZJY1qRJw7yxcAxDtSqOpgw2ESXeA03FsAX9gY=w1280',
  fac6:     G + 'AG8ngQUqZJec4JF4hNW5AKAoG11ApECr3oD0eeE0RVEufAzf69jl1eNCSqJDhS7o8q2EMa2CGQyNWXqK8Js9ouzAFjKuOPzPnNLwf4T5WNpxofGJ1IeDwvW_XQCda_Hy9H_uZxTxpShZFhuAgm3Z_CuBqXvsvZUg2vDkaUWDOjCE_-vVReEkZVNAUxB36lz9JAg7x_cSRzp4XSv0Ab5vcEV9eGSctgBrbitrOxstoGGtKt0=w1280',
  eye:      G + 'AG8ngQUwEPwzNxunv3bGCPZJxERv1o4HBTdP52V51A8xRhKP0ynUWHoxGy50rsVsibdxrBvddCpNDI3saAwUznP6jB2dkKBX6tSkqHynqM-MSkFdroLaQnFcJmlGbaOQrOXY9D8qbqLD2yEHJv1kiOCpqyR2ELGEIUmRARJCKemNmBc2NA-uY74DWXV_Vim6bQs=w1280',
  eyeCabin: G + 'AG8ngQVgfa26qCjrN5MNXIo2eRqnEeDVUtmeryg3aTFTvVqwUzeGvaPoG-WjICIgCdqN4_CFgOEcSVYCtpBFyMH2VILLch1HqyLaMsRLl2UNsiWFj99L6YrKSYEwpWRN1C5xF2HE9ecHTktNmzckXZOfQjvsbdm6w54HwBw3AFXSkzk0tD9ZAI0PURwH-57Qirnd00_5d_RSgEfivKy9edk8IxKZkrpP4kPkMFfaDDL2=w1280',
};

// Fallback HD stock imagery, also used as the main image for destinations that
// have no official asset yet. Replace with real photos when available.
const U = id => 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=1400&q=80';
const FB = {
  tea:     U('1470071459604-3b5ec3a7fe05'),
  mist:    U('1464822759023-fed622ff2c3b'),
  sunrise: U('1506905925346-21bda4d32df4'),
  forest:  U('1441974231531-c6227db76b6e'),
  peak:    U('1501785888041-af3ef285b470'),
  valley:  U('1426604966848-d7adac402bff'),
  trail:   U('1447752875215-b2761acb3c5d'),
  water:   U('1502680390469-be75c86b636f'),
  lake:    U('1439066615861-d1af74d74000'),
  cabin:   U('1520250497591-112f2f40a3f4'),
  camp:    U('1504280390367-361c6d9f38f4'),
  villa:   U('1571003123894-1f0594d2b5d9'),
};

const DESTINATIONS = [
  { id:'nimo-highland', name:'Nimo Group', type:'alam', area:'Pangalengan, Bandung',
    tag:'Unggulan', img:IMG.hero, fb:FB.tea,
    desc:'Kebun teh dengan Sky Bridge berbentuk U dan panorama 360°. Datang subuh untuk menyaksikan kabut yang perlahan larut oleh matahari terbit.',
    highlights:['Glass Sky Bridge','Sunrise Point','ATV & Flying Fox','Nimo Zoo'],
    gallery:[IMG.hero, IMG.mist, IMG.light, IMG.epic], price:'Mulai Rp 40.000', bookable:true },

  { id:'nimo-eye', name:'Nimo Eye', type:'alam', area:'Pangalengan, Bandung',
    tag:'Rekor MURI', img:IMG.eye, fb:FB.peak,
    desc:'Bianglala tertinggi di Indonesia pada ketinggian sekitar 1.400 mdpl, dengan pemandangan kebun teh dari ketinggian ekstrem.',
    highlights:['Kabin Regular & VIP','Karaoke in the Sky','Dine in the Sky','360° view'],
    gallery:[IMG.eye, IMG.eyeCabin], price:'Mulai Rp 55.000', bookable:true },

  { id:'nimo-water-forest', name:'Nimo Water Forest', type:'air', area:'Jawa Barat',
    img:FB.water, fb:FB.water,
    desc:'Taman air keluarga dengan konsep hutan, memadukan wahana basah dan area teduh untuk bersantai.',
    highlights:['Kolam anak','Wahana air','Area piknik'], gallery:[FB.water, FB.forest], price:'Info di lokasi' },

  { id:'bogor-aqua-game', name:'Bogor Aqua Game', type:'air', area:'Bogor',
    img:FB.lake, fb:FB.lake,
    desc:'Wahana watersport pertama di Indonesia yang menghadirkan permainan inflatable premium Wibit dari Jerman.',
    highlights:['Wibit inflatable','Boqu War','Wahana interaktif'], gallery:[FB.lake, FB.water], price:'Info di lokasi' },

  { id:'malang-skyland', name:'Malang Skyland', type:'alam', area:'Kabupaten Malang',
    img:FB.peak, fb:FB.peak,
    desc:'Destinasi modern di ketinggian dengan sunrise, sunset, dan pemandangan 360° di sekelilingnya.',
    highlights:['Sunrise & sunset','360° view','Spot foto'], gallery:[FB.peak, FB.valley], price:'Info di lokasi' },

  { id:'pinaru-park', name:'Pinaru Park', type:'keluarga', area:'Jawa Barat',
    img:FB.forest, fb:FB.forest,
    desc:'Taman rekreasi keluarga dengan area bermain dan ruang hijau yang luas.',
    highlights:['Playground','Area piknik','Spot foto'], gallery:[FB.forest, FB.trail], price:'Info di lokasi' },

  { id:'nimo-kaldera-toba', name:'Nimo Kaldera Toba', type:'alam', area:'Danau Toba, Sumut',
    img:FB.lake, fb:FB.lake,
    desc:'Destinasi di kawasan kaldera Danau Toba dengan panorama danau vulkanik terbesar di dunia.',
    highlights:['Pemandangan danau','Spot foto','Udara sejuk'], gallery:[FB.lake, FB.peak], price:'Info di lokasi' },

  { id:'nimo-zoo', name:'Nimo Zoo', type:'keluarga', area:'Area Nimo Land',
    img:IMG.zoo, fb:FB.forest,
    desc:'Area edukasi satwa dengan interactive storytelling dan sesi feeding time yang aman untuk anak.',
    highlights:['Interactive storytelling','Feeding time','Edukasi satwa'],
    gallery:[IMG.zoo, IMG.zooFun], price:'Mulai Rp 25.000' },

  { id:'punceling-park', name:'Punceling Park', type:'air', area:'Ciwidey, Bandung',
    img:FB.trail, fb:FB.trail,
    desc:'Oase ketenangan di Ciwidey — berkemah, berenang, dan bersantai di tengah hutan pinus dengan suara sungai.',
    highlights:['Camping','Kolam air panas','Hutan pinus'], gallery:[FB.trail, FB.forest], price:'Info di lokasi' },

  { id:'nimo-ecomarine', name:'Nimo Ecomarine', type:'air', area:'Bali',
    img:FB.water, fb:FB.water,
    desc:'Petualangan air terbaru di Bali sebagai bagian dari keluarga besar Nimo.',
    highlights:['Wahana air','Area pantai','Baru dibuka'], gallery:[FB.water, FB.lake], price:'Info di lokasi' },

  { id:'maros-highland', name:'Maros Highland', type:'alam', area:'Maros, Sulsel',
    img:FB.valley, fb:FB.valley,
    desc:'Perosotan pelangi terpanjang di Indonesia dengan latar sunset dan panorama kota Makassar.',
    highlights:['Rainbow slide','Sunset point','Spot foto'], gallery:[FB.valley, FB.sunrise], price:'Info di lokasi' },
];

/* ---- Accommodation ----
   NOTE: nightly rates are not officially published. The figures below are
   placeholders — confirm with the reservations team before going live. */
const HOTELS = [
  {
    id:'nimo-tea-resort', name:'Nimo Tea Resort', area:'Gunung Nini, Pangalengan',
    desc:'Kamar berbalkon dengan pemandangan 360° kebun teh dan pegunungan. Titik terbaik untuk sunrise maupun sunset, tepat di dalam kawasan Nimo Group.',
    facilities:['Restoran semi-outdoor','Balkon pribadi','Air panas','Wi-Fi','Parkir','Akses langsung Nimo Group'],
    rooms:[
      { id:'lavaza', type:'Villa', name:'Lavaza Room', cap:6, rate:2500000,
        desc:'Villa 2 lantai berkonsep kayu futuristik dengan sentuhan mewah dan pemandangan kebun teh.',
        img:IMG.fac2, fb:FB.villa },
      { id:'arjuna', type:'Villa', name:'Arjuna Room', cap:6, rate:2250000,
        desc:'Villa kayu 2 lantai dengan suasana hangat dan panorama pegunungan kebun teh.',
        img:IMG.fac3, fb:FB.cabin },
      { id:'tea-cabin', type:'Cabin', name:'Tea Cabin', cap:2, rate:1200000,
        desc:'Cabin kompak untuk pasangan, berbalkon langsung menghadap perkebunan.',
        img:IMG.fac4, fb:FB.cabin },
    ]
  },
  {
    id:'nimoza-glamping', name:'Nimoza Glamping', area:'Kawasan Nimo Land',
    desc:'Menginap di tenda mewah tanpa repot menyiapkan perlengkapan kemah. Cocok untuk yang ingin dekat dengan alam tapi tetap nyaman.',
    facilities:['Tenda ber-AC','Kamar mandi dalam','Api unggun','Sarapan','Wi-Fi area umum'],
    rooms:[
      { id:'lux-camp', type:'Luxury Camp', name:'Luxury Camp Deluxe', cap:4, rate:1500000,
        desc:'Tenda glamping ukuran besar dengan ranjang king dan teras pribadi menghadap bukit.',
        img:IMG.fac5, fb:FB.camp },
      { id:'std-camp', type:'Luxury Camp', name:'Camp Standard', cap:2, rate:950000,
        desc:'Tenda glamping untuk dua orang, lengkap dengan kamar mandi dalam.',
        img:IMG.fac6, fb:FB.camp },
    ]
  },
  {
    id:'nimo-resort-ciater', name:'Nimo Resort Ciater', area:'Ciater, Subang',
    desc:'Resort di kawasan Ciater yang dikenal dengan sumber air panas alaminya, dikelilingi kebun teh dan udara sejuk.',
    facilities:['Kolam air panas','Restoran','Area bermain anak','Parkir luas','Wi-Fi'],
    rooms:[
      { id:'ciater-villa', type:'Villa', name:'Ciater Family Villa', cap:8, rate:2800000,
        desc:'Villa keluarga dengan beberapa kamar dan ruang berkumpul yang lapang.',
        img:IMG.fac1, fb:FB.villa },
      { id:'ciater-cabin', type:'Cabin', name:'Hot Spring Cabin', cap:3, rate:1100000,
        desc:'Cabin dengan akses langsung ke area kolam air panas.',
        img:IMG.act7, fb:FB.cabin },
    ]
  },
];

/** Flat list of every room with its parent hotel folded in. */
function allRooms() {
  return HOTELS.flatMap(h =>
    h.rooms.map(r => ({ ...r, hotelId: h.id, hotelName: h.name, area: h.area, facilities: h.facilities })),
  );
}

const HERO_SLIDES = [
  { img:IMG.hero,    fb:FB.tea,     alt:'Panorama kebun teh Nimo Group' },
  { img:IMG.mist,    fb:FB.mist,    alt:'Kabut pagi menyelimuti kebun teh' },
  { img:IMG.light,   fb:FB.sunrise, alt:'Golden hour di puncak Nimo Group' },
  { img:IMG.sunrise, fb:FB.peak,    alt:'Sunrise di atas hamparan kebun teh' },
];

/* ---- Ticket pricing (source: official site) ----
   Each price is [weekday, weekend]. */
const PACKAGES = [
  { id:'regular', name:'Tiket Masuk Regular',
    desc:'Akses area kebun teh, Sky Bridge, dan spot foto.',
    price:{ domestik:{ adult:[40000,45000], child:[45000,35000] },
            manca:   { adult:[80000,90000], child:[60000,70000] } } },
  { id:'combo', name:'Tiket Premium / Wahana Combo',
    desc:'Tiket masuk + akses wahana pilihan (ATV, Flying Fox, Paintball).',
    // Combo rates are not officially published — placeholder.
    price:{ domestik:{ adult:[95000,110000], child:[75000,85000] },
            manca:   { adult:[190000,220000], child:[140000,160000] } } },
  { id:'eye', name:'Tiket Nimo Eye (Bianglala)',
    desc:'Kabin regular 4 pax, 1 putaran ± 10 menit.',
    price:{ domestik:{ adult:[55000,60000], child:[55000,60000] },
            manca:   { adult:[55000,60000], child:[55000,60000] } } },
];

/* ---- Booking rules, in one place so the client and server agree ---- */
const RULES = {
  MIN_LEAD_DAYS: 1,     // earliest arrival is tomorrow (H-1)
  TICKET_VALID_DAYS: 3, // ticket usable for 3 days from arrival
  MAX_TICKETS: 50,
  MAX_ROOMS: 10,
  MAX_GUESTS: 40,
};

const isWeekend = date => date.getDay() === 0 || date.getDay() === 6;

/** Parse a YYYY-MM-DD string as local midnight. Returns null if unparseable. */
function parseISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value + 'T00:00:00');
  return Number.isNaN(date.getTime()) ? null : date;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function toISODate(d) {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

/**
 * Unit price for one visitor.
 * @param {string} packageId @param {'domestik'|'manca'} nationality
 * @param {'adult'|'child'} who @param {Date|null} arrival
 */
function unitPrice(packageId, nationality, who, arrival) {
  const pkg = PACKAGES.find(p => p.id === packageId);
  if (!pkg) throw new Error('Paket tiket tidak dikenal: ' + packageId);
  const band = pkg.price[nationality];
  if (!band) throw new Error('Kategori pengunjung tidak dikenal: ' + nationality);
  return band[who][arrival && isWeekend(arrival) ? 1 : 0];
}

/**
 * Authoritative ticket total. Called by the browser for display and by the
 * booking endpoint for the amount actually recorded.
 * @returns {{total: number, adultUnit: number, childUnit: number, expiry: Date}}
 */
function priceTicket({ packageId, nationality, adult, child, arrival }) {
  const adultUnit = unitPrice(packageId, nationality, 'adult', arrival);
  const childUnit = unitPrice(packageId, nationality, 'child', arrival);
  return {
    adultUnit,
    childUnit,
    total: adultUnit * adult + childUnit * child,
    expiry: addDays(arrival, RULES.TICKET_VALID_DAYS),
  };
}

const rupiah = n => 'Rp ' + Number(n).toLocaleString('id-ID');

export { DESTINATIONS as D, HOTELS as H, IMG as I, PACKAGES as P, RULES as R, priceTicket as a, allRooms as b, addDays as c, HERO_SLIDES as d, parseISODate as p, rupiah as r, toISODate as t };
