/* Capture every image the live www.nimoland.com actually serves from Google
   Sites (lh3.googleusercontent.com) and save them for migration.

   Google returns 403 to anonymous/curl requests even with browser headers, but
   serves the images to a real Chrome session that visits the site (cookies +
   referer). We crawl the pages in Chrome, record each distinct Google image in
   first-seen order with its page/section context, and write the bodies to
   public/images/live/<nn>-<slug>.<ext> plus a MAPPING.txt.

   Run:  node scripts/download-images.mjs
   Safe to re-run (skips existing files).
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'images', 'live');
const SITE = 'https://www.nimoland.com';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(p => existsSync(p));
if (!CHROME) { console.error('Tidak menemukan Chrome/Edge.'); process.exit(1); }

const PAGES = [SITE + '/'];
for (const s of ['destinasi', 'penginapan', 'galeri', 'login']) PAGES.push(`${SITE}/${s}`);
for (const s of ['nimo-highland','nimo-eye','nimo-water-forest','bogor-aqua-game','malang-skyland',
  'pinaru-park','nimo-kaldera-toba','nimo-zoo','punceling-park','nimo-ecomarine']) PAGES.push(`${SITE}/destinasi/${s}`);
for (const s of ['nimo-tea-resort','nimo-resort-ciater','nimoza-glamping','new-dgyp-resort','savia-hotel-resort']) PAGES.push(`${SITE}/penginapan/${s}`);

const norm = u => { try { const p = new URL(u); return p.host + p.pathname; } catch { return u; } };

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36');

const order = [];            // distinct tokens in first-seen order
const seen = new Set();
let curPage = '';
const bodies = new Map();    // normalized url -> Buffer
const context = new Map();   // normalized url -> array of page labels

page.on('response', async res => {
  const url = res.url();
  if (!url.includes('googleusercontent.com')) return;
  if (!(res.headers()['content-type'] || '').startsWith('image/')) return;
  const n = norm(res.request()?.url() || url);
  if (!seen.has(n)) { seen.add(n); order.push(n); }
  if (curPage) { if (!context.has(n)) context.set(n, []); context.get(n).push(curPage.replace(SITE, '')); }
  try { const buf = await res.buffer(); if (buf.length) bodies.set(n, buf); } catch { /* skip */ }
});

const slugify = (i, url) => {
  const m = url.match(/AG8ngQ[A-Za-z0-9_-]+/);
  return String(i).padStart(2, '0') + '-' + (m ? m[0].slice(0, 28) : 'image');
};

for (const p of PAGES) {
  curPage = p;
  try {
    await page.goto(p, { waitUntil: 'networkidle2', timeout: 45000 });
    for (let y = 0; y < 9000; y += 500) {
      await page.evaluate(sy => window.scrollTo(0, sy), y);
      await new Promise(r => setTimeout(r, 220));
    }
    await new Promise(r => setTimeout(r, 1000));
  } catch (e) { console.log(`  halaman gagal: ${p} (${e.message})`); }
}
await browser.close();

console.log(`\n=== ${order.length} gambar unik dari situs ===`);
const mapping = ['Token -> URL -> file -> halaman', '='.repeat(70)];
let ok = 0, skip = 0, fail = 0;
for (const n of order) {
  const body = bodies.get(n);
  if (!body) { console.log(`  GAGAL (tanpa body) ${n}`); fail++; continue; }
  const i = order.indexOf(n) + 1;
  const name = `${slugify(i, n)}.${/png/i.test(body[0].toString(16)) ? 'png' : 'jpg'}`;
  const file = join(OUT, name);
  if (!existsSync(file)) { writeFileSync(file, body); ok++; } else skip++;
  const pages = (context.get(n) || []).join(', ');
  console.log(`  ${i.toString().padStart(2)}. ${n}  ->  ${name}   [${pages}]`);
  mapping.push(`${n}\t->\t${name}\t[${pages}]`);
}
writeFileSync(join(OUT, 'MAPPING.txt'), mapping.join('\n') + '\n');

console.log(`\nSelesai: ${ok} ditulis, ${skip} sudah ada, ${fail} gagal → ${OUT}`);