/* Rewrite src/lib/data.js IMG block so every key points to the CURRENT images
   served live on www.nimoland.com (captured by scripts/download-images.mjs).
   Runs after: node scripts/download-images.mjs  (needs public/images/live/MAPPING.txt)

   The old Google tokens in data.js are dead (403); this keeps the same keys
   (hero, mist, light, ... act*, fac*, eye, eyeCabin) but switches their URLs to
   the live tokens so <NimoImage> / IMG_KEYS resolve them to local files (after
   the copy step) or to live remote URLs.

   Run:  node scripts/apply-live-images.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MAPPING = join(ROOT, 'public', 'images', 'live', 'MAPPING.txt');

// key -> live file number (assignment table)
const IMG_LIVE = {
  hero: 15, mist: 1, light: 2, epic: 4, sunrise: 5,
  act1: 3, act2: 6, act3: 7, act4: 8, act5: 9, act6: 10, act7: 11,
  zoo: 12, zooFun: 13,
  fac1: 14, fac2: 1, fac3: 2, fac4: 16, fac5: 17, fac6: 18, fac7: 19,
  eye: 9, eyeCabin: 10,
};

// FB fallback keys start from the same real photos instead of stock imagery.
const FB_LIVE = {
  tea: 15, mist: 1, sunrise: 5, forest: 17, peak: 16, valley: 18,
  trail: 12, food: 10, water: 15, lake: 15, cabin: 19, camp: 17, villa: 19,
};

// file number -> live URL from MAPPING.txt (first column, full drive URL).
const byNo = new Map();
for (const line of readFileSync(MAPPING, 'utf8').split('\n')) {
  const m = line.match(/^([^\t]+?)\t->\t(\d+)-[^\t.]+\.[a-z]+\t/);
  if (m) byNo.set(Number(m[2]), m[1]);
}

const dataPath = join(ROOT, 'src', 'lib', 'data.js');
let src = readFileSync(dataPath, 'utf8');

const genBlock = (live) => {
  const keys = Object.keys(live);
  const pad = Math.max(...keys.map(k => k.length)) + 2;
  return keys.map(k => {
    const url = byNo.get(live[k]);
    if (!url) throw new Error(`Tidak ada URL live untuk file ${live[k]} (${k})`);
    const token = url.split('/sitesv/')[1].split('=')[0];
    const w = [15, 16, 17, 18, 19].includes(live[k]) ? '16383' : '1280';
    return `  ${k.padEnd(pad)}: G + '${token}=w${w}',`;
  });
};

const oldImg = src.match(/export const IMG = \{[\s\S]*?\n\};/);
if (!oldImg) { console.error('Blok IMG tidak ditemukan di data.js.'); process.exit(1); }
src = src.replace(oldImg[0], 'export const IMG = {\n' + genBlock(IMG_LIVE).join('\n') + '\n};');

const oldFb = src.match(/export const FB = \{[\s\S]*?\n\};/);
if (!oldFb) { console.error('Blok FB tidak ditemukan di data.js.'); process.exit(1); }
src = src.replace(oldFb[0], 'export const FB = {\n' + genBlock(FB_LIVE).join('\n') + '\n};');

writeFileSync(dataPath, src);
console.log('Blok IMG + FB diperbarui ke token live.');
for (const [key, no] of Object.entries(IMG_LIVE)) console.log(`  IMG.${key.padEnd(10)} -> file ${no}`);
for (const [key, no] of Object.entries(FB_LIVE)) console.log(`  FB.${key.padEnd(10)}  -> file ${no}`);