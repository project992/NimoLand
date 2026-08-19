/* Content + pricing data, shared by the server and the client SPA.

   ALL prices live in src/data/pricing.json (single source of truth),
   imported below. Nothing is ever hard-coded here or in any component.
   The booking endpoint recomputes totals server-side using the same data;
   the browser's numbers are a display convenience, the server's are the
   ones that get charged. */

import pricing from '../data/pricing.json' with { type: 'json' };

const PRICE = pricing.destinations;
const HOTEL_RATES = pricing.hotel_rates;

/** Master switch for the whole situs: while true, every "simulation / demo /
 *  placeholder" notice is shown (payment not connected, tariff not final,
 *  e-ticket simulated, badge name not filed). Flip to false on production. */
export const IS_DEMO_MODE = true;

/** Company details single source: the fill-in badges in the UI read from here
 *  instead of hard-coded strings, so going live is a one-line edit. */
export const COMPANY = {
  legalName: '[ISI DI SINI — contoh: PT Nimo Land Nusantara (sesuai akta perusahaan)]',
  email: 'official@nimoenterprise.com',
};

const G = 'https://lh3.googleusercontent.com/sitesv/';

export const IMG = {
  hero:     G + 'AG8ngQXtuSJsYKZFz6bbT0yuxXltbqSpRwQLG6VUsIZ5mzRF2_xpk6o-M20YnrPZ19VcqxNloh0sEYqyXfbj9h6DRkm-jOiQGpft_XhHVAgP6AzFpTiMxglpHzNuEugRmXw2CxKHxh_jCcQ-baunoTbj1shUjJC9pMFBzQ-MTZRFHHLMnfV7Y9SJnGOP4AUU4DRtAWNCGk556t6_igc3x7lgIwp1UKBJiblKRvS4WSMQpFo=w1280',
  mist:     G + 'AG8ngQXNdn0p5bIfI3ZjSiln6IpBETUcW9bYb0f4gCHzr15_QWOqq3zqFCQWihVrLGzQbXB7T6PrLcVWLmunG1cCYv34e5E1k24Rp3tYiB1EI9RVvhaWNX9Onz08dqb-7oddNjdUxdq1YGJduiY0xAoFqHzNkwuPnDKx5Vg1YJAGjRIn7pi_kijMPnIJL9z-OUjyA349nX3_ikiX9SPJI1GxUYTa327anPzTUcEhtZs1Kw8=w1280',
  light:    G + 'AG8ngQVfOhjkBOYGWSaTE0J6Tg22zyF-5uvX6nACNdQioHL8snh70eBuFI5Lpr4vw02Q7ABKwzLDm0AMvhFp3PVaK6nLFyBtUdoUisiF8eaTOBjzfpdxQcmsb1RAkDZf-Sg5EHn9HyaPw9OSzZO_sxFA_jPTcW4hjIEZjhsoKCsyUL4Ay-kMQhaKxnSl68fTnirw46L9oyCCS7tv9Trm5Ho8qBhDe7Vd8q3EKfw-vDbeZ4Q=w1280',
  epic:     G + 'AG8ngQUdTWK9ndJi8kc7mOkA15GMibih_s4rXe4zFqs3sGBbazbZYKvh7vLLb1VJkYN-TSM9CX2ZA0jpDHLWlx5223mr5ZkwjbJ5M9EWSK0PGWIDcxhlixP0ZtTXXiwzKq3Tj7jaj5YiGfv07HCTv-n7rjflFcsYY0lcTJK4QhX_3zw1X4twAdaqU0JAmK_8KRvUwj5fqOjyhjWODm1tubc5UzjFMIgaLtT0Dfft3bOvGvI=w1280',
  sunrise:  G + 'AG8ngQVEI4tW2pkLhi6D0bTTEBYosjT-12943AeJpQfLKbqdWB-mC26xlF7lcg27tOdDNaHqba2Fas6FSKmghwOXzwu9mHz4yhBaGYyg5k-N93kX3KpYzK6XtO5b6rFhdunRDyd6THL_OuaZYxdF8-vz3dnJYVPb7Edzy_7RB0UyhNRjZyFDTGxG3EL_FJOUA6vFnwF9ON80Xz7wYssmP4aQ0gBEnF8PUYxXqPGmCGSB=w1280',
  act1:     G + 'AG8ngQVpstytpfUcF49ROdWZd5bWesXP6Q3j2kzbLaE-cnAHDhy_U9YZp43dXOuxwJVdyFmSlJZ-gyj1slCT95d5M8zAA9_3vn1u23g36Hcf82MXPNoXUYdmhafV2UvcQfZ_PmL3zaMD3-WDENUl__g-1yYnZHih_yRItXeoDNAocIFPtRlIexdZy39BiKHaH1g-5DY0V1MiUXuOoeVhh9A6GbJsWqSBHSwSrw0fCSp5vZI=w1280',
  act2:     G + 'AG8ngQX7FTdt3TPGuc_JbqInv35xaxTrKTR-z8PqJysEf9pWbQSMdCTma_E-rRvwZiQLPY0KG_WNjIA6AK245nekDMhussOBSCBZIQGvrrYCfmmmpXPOUELqSOYnLuHN66ZU9_N_hd39KpNPKYywhV6VysU1_rir1KIPGxqZZkr4D2WjCxYcT9Hm6kHK2rYV-xG89ggJy5QJs0pBijtDnaN-sKNAUKEvVj4UCfxJPjCqzpM=w1280',
  act3:     G + 'AG8ngQVy8ZNM9arjrrjiaHhSGOf7nE1UpWovrtzPUZgOvzft--n_xr_GqeZgGz0ijNozHDmCvlFfnfURiX41lxAixbAVorGTVfL7_3d1wDqiq6D_0LPqC3WNjO4RHVTjAnboDcScJSep_Ul43ppH9vcCcyDRbPS1O9sYzUDcnrZbY0AFyKobeR3S7i8Jopbrdc2I599I2r7F4RJqKDpyL8TBbvUBRKZmRlUXNXtDr11951Y=w1280',
  act4:     G + 'AG8ngQWka9Vvx1e5MCMXvBss5oeQfO6oLnMDMWB47uWhfYsCmYwZdquYYT287AMcEB70uS6Qd-d5Nm8EPeL0QTGV4KMp0Qu-UYJn6ZzkGse1en6O4OcyIgbI9HbH5Ktr8dr1umbgdibQmP85lDhswpoJQhsdFd180foG0P4I00iG0CMjamyuMC_ZedY9T7tIhdGb4kAf8U8HccCwl4RAekXV6rrM8I4JJR62nnue_iSk=w1280',
  act5:     G + 'AG8ngQU_r0gTdUlaQ37ldGx-wbh4q2tdAraeSwFNdfeRRYEptC4HpxUcQmoJWFkAi2HpiTeZYcw7J70lPV-QSyH_XKSynycy0Pk7e91SGaW8AD_AUbS3Wi_tmTuRBLy6WOhEGeGLxjwOyu9vLSr15_GdvKeob2BYSDLLY_Ffj33i8Q7ngzr2u4cs4IpJaIlfA7-amzaNfiaNfa1kJdRfnMS6hrGbgJSSP7pgWc7PEmzV=w1280',
  act6:     G + 'AG8ngQWisPe6cQ2Y_EROLd1eH-ZH3kW3QWCwrTDULN1PzEZC7q9N_cdhDvqeMndiW1KhYwQr3ObPBMFWofQqdxcuXHJDgYbLQfXm7Hv42KYcpaPiXXSAWj0AalyqhW6CtfEjDKmubBgggdLimQQnNeXg5YavpVwlweCMPwm5FcRO9CHTknyCvNWxIw_HLg_3tr7Y71F5_E_vFTkaTGkuh11NBr8yvEBemg44cct63zC5kcI=w1280',
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
export const FB = {
  tea:     U('1470071459604-3b5ec3a7fe05'),
  mist:    U('1464822759023-fed622ff2c3b'),
  sunrise: U('1506905925346-21bda4d32df4'),
  forest:  U('1441974231531-c6227db76b6e'),
  peak:    U('1501785888041-af3ef285b470'),
  valley:  U('1426604966848-d7adac402bff'),
  trail:   U('1447752875215-b2761acb3c5d'),
  food:    U('1414235077428-338989a2e8c0'),
  water:   U('1502680390469-be75c86b636f'),
  lake:    U('1439066615861-d1af74d74000'),
  cabin:   U('1520250497591-112f2f40a3f4'),
  camp:    U('1504280390367-361c6d9f38f4'),
  villa:   U('1571003123894-1f0594d2b5d9'),
};

/* Reverse URL -> key so <NimoImage> can find the local copy of any image in
   src/assets/nimo/ (see scripts/images-seed.mjs) by URL alone. FB keys are
   prefixed "fb-" to stay unique against the Google IMG set. */
export const IMG_KEYS = {};
for (const [k, v] of Object.entries(IMG)) IMG_KEYS[v] = k;
for (const [k, v] of Object.entries(FB)) IMG_KEYS[v] = 'fb-' + k;

/* ---- Destinations ---- */
export const DEST_FILTERS = [
  { id: 'semua',    label: 'Semua',              icon: 'sparkles' },
  { id: 'alam',     label: 'Alam & Pegunungan',  icon: 'mountain' },
  { id: 'air',      label: 'Wisata Air',         icon: 'waves-horizontal' },
  { id: 'keluarga', label: 'Keluarga & Edukasi', icon: 'trees' },
];

export const DESTINATIONS = [
  { id:'nimo-highland', name:'Nimo Highland', type:'alam', area:'Pangalengan, Bandung',
    tag:'Unggulan', img:IMG.hero, fb:FB.tea,
    desc:'Kebun teh dengan Sky Bridge berbentuk U dan panorama 360°. Datang subuh untuk menyaksikan kabut yang perlahan larut oleh matahari terbit.',
    highlights:['Glass Sky Bridge','Sunrise Point','ATV & Flying Fox','Nimo Zoo'],
    gallery:[IMG.hero, IMG.mist, IMG.light, IMG.epic], price:PRICE['nimo-highland'], bookable:true },

  { id:'nimo-eye', name:'Nimo Eye', type:'alam', area:'Pangalengan, Bandung',
    tag:'Rekor MURI', img:IMG.eye, fb:FB.peak,
    desc:'Bianglala tertinggi di Indonesia pada ketinggian sekitar 1.400 mdpl, dengan pemandangan kebun teh dari ketinggian ekstrem.',
    highlights:['Kabin Regular & VIP','Karaoke in the Sky','Dine in the Sky','360° view'],
    gallery:[IMG.eye, IMG.eyeCabin], price:PRICE['nimo-eye'], bookable:true },

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

  { id:'nimo-zoo', name:'Nimo Zoo', type:'keluarga', area:'Area Nimo Highland',
    img:IMG.zoo, fb:FB.forest,
    desc:'Area edukasi satwa dengan interactive storytelling dan sesi feeding time yang aman untuk anak.',
    highlights:['Interactive storytelling','Feeding time','Edukasi satwa'],
    gallery:[IMG.zoo, IMG.zooFun], price:PRICE['nimo-zoo'] },

  { id:'punceling-park', name:'Punceling Park', type:'air', area:'Ciwidey, Bandung',
    img:FB.trail, fb:FB.trail,
    desc:'Oase ketenangan di Ciwidey — berkemah, berenang, dan bersantai di tengah hutan pinus dengan suara sungai.',
    highlights:['Camping','Kolam air panas','Hutan pinus'], gallery:[FB.trail, FB.forest], price:'Info di lokasi' },

  { id:'nimo-ecomarine', name:'Nimo Ecomarine', type:'air', area:'Bali',
    img:FB.water, fb:FB.water,
    desc:'Petualangan air terbaru di Bali sebagai bagian dari keluarga besar Nimo Land Group.',
    highlights:['Wahana air','Area pantai','Baru dibuka'], gallery:[FB.water, FB.lake], price:PRICE['nimo-ecomarine'] },
];

/* ---- Accommodation ----
   ROOM LISTS & DESCRIPTIONS follow the official site (nimoland.com).
   NIGHTLY RATES are not officially published yet: existing placeholder figures
   are kept in pricing.json (see IS_DEMO_MODE above) and marked for confirmation
   with the reservations team; rooms without an official rate use null and show
   "Hubungi reservasi". */
export const HOTELS = [
  {
    id:'nimo-tea-resort', name:'Nimo Tea Resort', area:'Gunung Nini, Pangalengan',
    img:IMG.fac2, fb:FB.villa,
    desc:'Kamar berbalkon dengan pemandangan 360° kebun teh dan pegunungan. Titik terbaik untuk sunrise maupun sunset, tepat di dalam kawasan Nimo Highland.',
    facilities:['Restoran semi-outdoor','Balkon pribadi','Air panas','Wi-Fi','Parkir','Akses langsung Nimo Highland'],
    rooms:[
      { id:'lavaza', type:'Villa', name:'Lavaza Room', cap:6, rate:HOTEL_RATES['lavaza'],
        desc:'Villa 2 lantai berkonsep kayu futuristik dengan sentuhan mewah, 65 m², dan pemandangan kebun teh.',
        img:IMG.fac2, fb:FB.villa },
      { id:'arjuna', type:'Villa', name:'Arjuna Room', cap:6, rate:HOTEL_RATES['arjuna'],
        desc:'Villa kayu 2 lantai seluas 65 m² dengan suasana hangat dan panorama pegunungan kebun teh.',
        img:IMG.fac3, fb:FB.cabin },
    ]
  },
  {
    id:'nimo-resort-ciater', name:'Nimo Resort Ciater', area:'Ciater, Subang',
    img:IMG.fac1, fb:FB.villa,
    desc:'Resort pertama di Ciater dengan konsep Nordic European yang elegan dan estetik, dilengkapi kolam renang air panas.',
    facilities:['Kolam air panas','Restoran','Area bermain anak','Parkir luas','Wi-Fi'],
    rooms:[
      { id:'ciat-superior', type:'Room', name:'Superior Room', cap:2, rate:HOTEL_RATES['ciat-superior'],
        desc:'Kamar 16 m² untuk 2 tamu.', img:IMG.fac1, fb:FB.villa },
      { id:'ciat-standard', type:'Room', name:'Standard Room', cap:2, rate:HOTEL_RATES['ciat-standard'],
        desc:'Kamar 16 m² untuk 2 tamu.', img:IMG.fac1, fb:FB.villa },
      { id:'ciat-deluxe-pool', type:'Room', name:'Deluxe Room Pool View', cap:2, rate:HOTEL_RATES['ciat-deluxe-pool'],
        desc:'Kamar 29 m² dengan pemandangan kolam.', img:IMG.fac1, fb:FB.villa },
      { id:'ciat-deluxe-triple', type:'Room', name:'Deluxe Triple Room', cap:3, rate:HOTEL_RATES['ciat-deluxe-triple'],
        desc:'Kamar 32 m² untuk 3 tamu.', img:IMG.fac1, fb:FB.villa },
      { id:'ciat-deluxe-queen', type:'Room', name:'Deluxe Room Double Queen', cap:4, rate:HOTEL_RATES['ciat-deluxe-queen'],
        desc:'Kamar 37 m² untuk 4 tamu dengan dua tempat tidur queen.', img:IMG.fac1, fb:FB.villa },
      { id:'ciat-exec-suite', type:'Suite', name:'Executive Suite 2 Bedroom', cap:4, rate:HOTEL_RATES['ciat-exec-suite'],
        desc:'Suite 35 m² dengan 2 kamar tidur.', img:IMG.fac1, fb:FB.villa },
      { id:'ciat-family-3', type:'Room', name:'Family Room 3', cap:6, rate:HOTEL_RATES['ciat-family-3'],
        desc:'Kamar keluarga 52 m² untuk 6 tamu.', img:IMG.fac1, fb:FB.villa },
      { id:'ciat-family-4', type:'Room', name:'Family Room 4', cap:8, rate:HOTEL_RATES['ciat-family-4'],
        desc:'Kamar keluarga 80 m² untuk 8 tamu.', img:IMG.fac1, fb:FB.villa },
      { id:'ciat-family-5', type:'Room', name:'Family Room 5', cap:10, rate:HOTEL_RATES['ciat-family-5'],
        desc:'Kamar keluarga 90 m² untuk 10 tamu.', img:IMG.fac1, fb:FB.villa },
    ]
  },
  {
    id:'nimoza-glamping', name:'Glamping Nimoza', area:'Kawasan Nimo Highland, Pangalengan',
    img:IMG.fac5, fb:FB.camp,
    desc:'Glamping dalam area Nimo Tea Resort — menginap di tenda mewah tanpa repot menyiapkan perlengkapan kemah.',
    facilities:['Tenda ber-AC','Kamar mandi dalam','Api unggun','Sarapan','Wi-Fi area umum'],
    rooms:[
      { id:'lux-camp', type:'Luxury Camp', name:'Luxury Camp Deluxe', cap:4, rate:HOTEL_RATES['lux-camp'],
        desc:'Tenda glamping ukuran besar dengan ranjang king dan teras pribadi menghadap bukit.',
        img:IMG.fac5, fb:FB.camp },
      { id:'std-camp', type:'Luxury Camp', name:'Camp Standard', cap:2, rate:HOTEL_RATES['std-camp'],
        desc:'Tenda glamping untuk dua orang, lengkap dengan kamar mandi dalam.',
        img:IMG.fac6, fb:FB.camp },
    ]
  },
  {
    id:'new-dgyp-resort', name:'New Dgyp Resort Ciater', area:'Ciater, Subang',
    img:IMG.fac6, fb:FB.cabin,
    desc:'Resort di Ciater dengan konsep vila bambu yang memadukan keindahan alam dan kenyamanan desain modern woody, satu kawasan dengan Pinaru Park.',
    facilities:['Area cottage rustic','Jakuzi','Aviary','Mini zoo','Water slide','ATV','Akses Pinaru Park'],
    rooms:[]
  },
  {
    id:'savia-hotel-resort', name:'Savia Hotel & Resort', area:'Ciater, Subang',
    img:IMG.fac4, fb:FB.villa,
    desc:'Hidden hillside resort di tengah sejuknya alam Ciater dengan perpaduan rustic villa, hotel building, dan modern cabin. Cocok untuk family getaway, honeymoon, hingga corporate gathering.',
    facilities:['Area meeting','Outbound','Ruang terbuka luas','Restoran','Parkir'],
    rooms:[
      { id:'savia-superior-room', type:'Room', name:'Superior Room', cap:2, rate:HOTEL_RATES['savia-superior-room'],
        desc:'Kamar bergaya hotel seluas 24 m² untuk 2 tamu.', img:IMG.fac1, fb:FB.villa },
      { id:'savia-superior-cabin', type:'Cabin', name:'Superior Cabin', cap:2, rate:HOTEL_RATES['savia-superior-cabin'],
        desc:'Cabin modern 30 m² dengan kaca depan luas yang menyatu dengan alam.', img:IMG.fac4, fb:FB.cabin },
      { id:'savia-deluxe-cottage', type:'Cottage', name:'Deluxe Cottage', cap:4, rate:HOTEL_RATES['savia-deluxe-cottage'],
        desc:'Cottage rustic dengan desain mezzanine seluas 29 m² untuk 4 tamu.', img:IMG.act1, fb:FB.cabin },
      { id:'savia-executive-cabin', type:'Cabin', name:'Executive Cabin', cap:4, rate:HOTEL_RATES['savia-executive-cabin'],
        desc:'Cabin modern 46 m² untuk 4 tamu, dilengkapi bathtub.', img:IMG.fac6, fb:FB.cabin },
      { id:'savia-suite-cabin', type:'Suite', name:'Suite Cabin', cap:4, rate:HOTEL_RATES['savia-suite-cabin'],
        desc:'Cabin eksklusif 46 m² dengan 2 kamar tidur untuk 4 tamu.', img:IMG.fac2, fb:FB.cabin },
      { id:'savia-grand-deluxe', type:'Suite', name:'Grand Deluxe', cap:5, rate:HOTEL_RATES['savia-grand-deluxe'],
        desc:'Kamar berdesain mezzanine seluas 55 m² hingga 5 tamu.', img:IMG.fac3, fb:FB.villa },
      { id:'savia-junior-suite', type:'Suite', name:'Junior Suite', cap:4, rate:HOTEL_RATES['savia-junior-suite'],
        desc:'Kamar keluarga seluas 42 m² untuk 4 tamu.', img:IMG.fac5, fb:FB.villa },
    ]
  },
];

export const ROOM_TYPES = ['Semua', 'Villa', 'Room', 'Cabin', 'Cottage', 'Suite', 'Luxury Camp'];

/** Flat list of every room with its parent hotel folded in. */
export function allRooms() {
  return HOTELS.flatMap(h =>
    h.rooms.map(r => ({ ...r, hotelId: h.id, hotelName: h.name, area: h.area, facilities: h.facilities })),
  );
}

/* ---- Attractions ---- */
export const CATEGORIES = [
  { id:'semua',   label:'Semua',           icon:'sparkles' },
  { id:'utama',   label:'Atraksi Utama',   icon:'mountain' },
  { id:'ekstrem', label:'Wahana Ekstrem',  icon:'waves-horizontal' },
  { id:'foto',    label:'Spot Foto',       icon:'camera' },
  { id:'kuliner', label:'Kuliner',         icon:'utensils' },
];

export const WAHANA = [
  { name:'Sunrise Point',       cat:'utama',   note:'Dawn awakening',        img:IMG.sunrise, fb:FB.sunrise },
  { name:'Sky Bridge',          cat:'utama',   note:'Ikon berbentuk U',      img:IMG.hero,    fb:FB.tea },
  { name:'Glass Sky Bridge',    cat:'ekstrem', note:'Lantai kaca',           img:IMG.act1,    fb:FB.peak },
  { name:'Nimo Eye',            cat:'utama',   note:'Bianglala MURI',        img:IMG.eye,     fb:FB.peak },
  { name:'ATV',                 cat:'ekstrem', note:'Off-road',              img:IMG.act2,    fb:FB.trail },
  { name:'Paintball',           cat:'ekstrem', note:'Permainan tim',         img:IMG.act3,    fb:FB.forest },
  { name:'Jimny Adventure',     cat:'ekstrem', note:'Jelajah bukit',         img:IMG.act4,    fb:FB.valley },
  { name:'Flying Fox',          cat:'ekstrem', note:'Adrenalin',             img:IMG.act5,    fb:FB.forest },
  { name:'Rafting',             cat:'ekstrem', note:'Arung jeram',           img:IMG.act6,    fb:FB.valley },
  { name:'Photo Ethnic Studio', cat:'foto',    note:'Busana etnik',          img:IMG.act7,    fb:FB.tea },
  { name:'Etnic Gallery',       cat:'foto',    note:'Galeri budaya',         img:IMG.fac1,    fb:FB.forest },
  { name:'Bean Bag & Net Area', cat:'foto',    note:'Santai di tepi bukit',  img:IMG.fac2,    fb:FB.mist },
  { name:'Virtual Reality',     cat:'utama',   note:'Fun games',             img:IMG.fac3,    fb:FB.trail },
  { name:'Nimo Zoo',            cat:'utama',   note:'Edukasi satwa',         img:IMG.zoo,     fb:FB.forest },
  { name:'Restaurant',          cat:'kuliner', note:'Area atas bukit',       img:IMG.fac4,    fb:FB.food },
  { name:'Food Court',          cat:'kuliner', note:'Area bawah bukit',      img:IMG.fac5,    fb:FB.food },
  { name:'F&B Stand',           cat:'kuliner', note:'Kopi & camilan',        img:IMG.fac6,    fb:FB.food },
];

export const HERO_SLIDES = [
  { img:IMG.hero,    fb:FB.tea,     alt:'Panorama kebun teh Nimo Highland' },
  { img:IMG.mist,    fb:FB.mist,    alt:'Kabut pagi menyelimuti kebun teh' },
  { img:IMG.light,   fb:FB.sunrise, alt:'Golden hour di puncak Nimo Highland' },
  { img:IMG.sunrise, fb:FB.peak,    alt:'Sunrise di atas hamparan kebun teh' },
];

export const MOMENTS = [
  { img:IMG.mist,  fb:FB.mist,    eyebrow:'The Mist',  title:'Kabut pagi di kebun teh' },
  { img:IMG.light, fb:FB.sunrise, eyebrow:'The Light', title:'Golden hour di puncak bukit' },
  { img:IMG.epic,  fb:FB.forest,  eyebrow:'The Epic',  title:'Keheningan sebelum matahari naik' },
];

export const GALLERY = [
  { title:'Panorama Kebun Teh', img:IMG.hero,     fb:FB.tea },
  { title:'The Mist',           img:IMG.mist,     fb:FB.mist },
  { title:'The Light',          img:IMG.light,    fb:FB.sunrise },
  { title:'The Epic',           img:IMG.epic,     fb:FB.forest },
  { title:'Epic Sunrise',       img:IMG.sunrise,  fb:FB.peak },
  { title:'Nimo Eye',           img:IMG.eye,      fb:FB.peak },
  { title:'Kabin Nimo Eye',     img:IMG.eyeCabin, fb:FB.valley },
  { title:'Nimo Zoo',           img:IMG.zooFun,   fb:FB.forest },
];

/* ---- Ticket pricing ----
   Read from src/data/pricing.json (single source of truth).
   The old "combo" package was removed: it is not listed on the official
   site. Each price value is [weekday, weekend]. */
export const PACKAGES = pricing.packs;

/* Nimo Eye display tariffs, taken from the official site (pricing.json). */
export const EYE_TARIFFS = pricing.eye_tariffs;

export const FAQ_DATA = [
  { q:'Apakah saya bisa membeli tiket untuk hari ini juga?',
    a:'Tidak. Pemesanan online paling cepat untuk keesokan hari (H-1). Tanggal hari ini dan tanggal yang sudah lewat otomatis terkunci pada date picker.' },
  { q:'Apakah saya harus punya akun untuk memesan tiket?',
    a:'Ya. Pemesanan tiket dan kamar memerlukan akun agar riwayat pesanan dan e-tiket Anda tersimpan dan bisa dibuka kembali kapan saja. Pendaftaran hanya butuh nama, email, dan password.' },
  { q:'Berapa lama tiket berlaku setelah dibeli?',
    a:'Tiket berlaku maksimal 3 hari sejak tanggal kedatangan yang dipilih. Contoh: memilih kedatangan tanggal 11, maka tiket masih bisa dipakai sampai tanggal 14.' },
  { q:'Apa saja pilihan paket tiketnya?',
    a:'Ada dua: Tiket Masuk Regular untuk akses kebun teh, Sky Bridge, dan spot foto; serta Tiket Nimo Eye untuk naik bianglala tertinggi di Indonesia.' },
  { q:'Bagaimana cara memesan kamar untuk menginap?',
    a:'Buka menu Hotels, pilih tipe kamar yang diinginkan, lalu klik "Booking Kamar". Form pemesanan kamar akan terbuka langsung di halaman ini dengan pilihan tanggal check-in, check-out, dan jumlah tamu.' },
  { q:'Bagaimana harga weekday dan weekend dihitung?',
    a:'Sabtu dan Minggu dihitung sebagai weekend, hari lainnya weekday. Kalkulator pada form pemesanan menyesuaikan tarif otomatis begitu tanggal kedatangan dipilih.' },
  { q:'Jam berapa Nimo Highland buka?',
    a:'Senin sampai Jumat buka 08.00–17.00. Sabtu dan Minggu buka lebih awal, mulai 05.00–17.00, supaya pengunjung bisa mengejar sunrise di puncak.' },
];

/* ---- Booking rules, in one place so the client and server agree ---- */
export const RULES = {
  MIN_LEAD_DAYS: 1,     // earliest arrival is tomorrow (H-1)
  TICKET_VALID_DAYS: 3, // ticket usable for 3 days from arrival
  MAX_TICKETS: 50,
  MAX_ROOMS: 10,
  MAX_GUESTS: 40,
};

const isWeekend = date => date.getDay() === 0 || date.getDay() === 6;

/** Parse a YYYY-MM-DD string as local midnight. Returns null if unparseable. */
export function parseISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value + 'T00:00:00');
  return Number.isNaN(date.getTime()) ? null : date;
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function toISODate(d) {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

/**
 * Unit price for one visitor.
 * @param {string} packageId @param {'domestik'|'manca'} nationality
 * @param {'adult'|'child'} who @param {Date|null} arrival
 */
export function unitPrice(packageId, nationality, who, arrival) {
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
export function priceTicket({ packageId, nationality, adult, child, arrival }) {
  const adultUnit = unitPrice(packageId, nationality, 'adult', arrival);
  const childUnit = unitPrice(packageId, nationality, 'child', arrival);
  return {
    adultUnit,
    childUnit,
    total: adultUnit * adult + childUnit * child,
    expiry: addDays(arrival, RULES.TICKET_VALID_DAYS),
  };
}

export const rupiah = n => 'Rp ' + Number(n).toLocaleString('id-ID');
