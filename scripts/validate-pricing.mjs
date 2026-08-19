/* Validasi harga saat build — jalan otomatis lewat `prebuild` (npm run build).

   Yang dicek:
   1. Harga anak > harga dewasa pada kategori sama (paket tiket) -> PERINGATAN.
   2. Harga (tiket / eye / kamar) bernilai negatif -> PERINGATAN.

   Tidak menghentikan build; hanya menampilkan peringatan di console.
   Sumber data: src/data/pricing.json (satu-satunya sumber harga). */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'pricing.json');

let pricing;
try {
  pricing = JSON.parse(readFileSync(file, 'utf8'));
} catch (err) {
  console.warn('[pricing] PERINGATAN: tidak dapat membaca src/data/pricing.json:', err.message);
  process.exit(0);
}

let problems = 0;
const warn = (...args) => {
  problems += 1;
  console.warn('[pricing] PERINGATAN:', ...args);
};

for (const p of pricing.packs || []) {
  for (const [nationality, band] of Object.entries(p.price || {})) {
    const adult = band.adult || [];
    const child = band.child || [];
    if (!adult.length || !child.length) continue;
    for (let i = 0; i < Math.min(adult.length, child.length); i++) {
      if (child[i] != null && adult[i] != null && child[i] > adult[i]) {
        warn(
          `Paket "${p.name}" (${nationality}): harga anak Rp ${child[i]} LEBIH BESAR dari harga dewasa Rp ${adult[i]} (hari ke-${i + 1}). Periksa ke tim finance.`,
        );
      }
    }
  }
}

const scan = (obj, label) => {
  for (const [k, v] of Object.entries(obj)) {
    if (v === null) continue;
    if (typeof v === 'object') scan(v, `${label}.${k}`);
    else if (typeof v === 'number' && v < 0) warn(`Harga negatif pada ${label}.${k} = ${v}.`);
  }
};
scan(pricing.packs, 'packs');
scan(pricing.eye_tariffs, 'eye_tariffs');
scan(pricing.hotel_rates, 'hotel_rates');

console.log(
  '[pricing] Validasi selesai:',
  problems ? problems + ' peringatan ditemukan.' : 'aman — tidak ada peringatan.',
);