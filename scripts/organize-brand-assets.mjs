/* Organize downloaded brand footage into per-brand folders and mirror them
   into public/ so the site serves them locally (lh3 hotlinks return 403).

   - src/assets/dgyp/        ... DGYP facility photos (converted to JPG)
   - public/brand/dgyp/      ... same photos, served as /brand/dgyp/...
   - src/assets/nimo highland/... Nimo Highland JPGs (already present)
   - public/brand/nimo-highland/ ... served as /brand/nimo-highland/...

   Run after:  node scripts/download-drive.mjs   (via gdown into ./DGYP)
              node scripts/apply-live-images.mjs
   Safe to re-run (skips existing files).
 */
import { mkdirSync, copyFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { basename, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url)) + '/..';
const SRC_DGYP = join(ROOT, 'DGYP');
const SRC_HI = join(ROOT, 'src', 'assets', 'nimo highland');
const OUT_DGYP = join(ROOT, 'src', 'assets', 'dgyp');
const PUB_DGYP = join(ROOT, 'public', 'brand', 'dgyp');
const PUB_HI = join(ROOT, 'public', 'brand', 'nimo-highland');

const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const noExt = f => f.slice(0, -extname(f).length);

mkdirSync(OUT_DGYP, { recursive: true });
mkdirSync(PUB_DGYP, { recursive: true });
mkdirSync(PUB_HI, { recursive: true });

const pngToJpg = f => f.slice(0, -4) + '.jpg';
const convertPng = (input, output) =>
  spawnSync('ffmpeg', ['-y', '-i', input, '-vf', 'scale=-2:1600', '-q:v', '4', output], { stdio: 'ignore' });

let done = 0, skipped = 0;

for (const dir of readdirSync(SRC_DGYP)) {
  const full = join(SRC_DGYP, dir);
  if (!statSync(full).isDirectory()) continue;
  const prefix = slug(dir);
  const files = readdirSync(full).filter(f => /\.png$/i.test(f)).sort((a, b) => a.localeCompare(b));
  files.forEach((f, i) => {
    const key = `${prefix}-${i + 1}`;
    const dest = join(OUT_DGYP, key + '.jpg');
    if (existsSync(dest)) { skipped++; return; }
    const out = convertPng(join(full, f), dest);
    if (out.status === 0 && existsSync(dest)) {
      copyFileSync(dest, join(PUB_DGYP, key + '.jpg')); done++;
    } else {
      console.log('GAGAL konversi:', join(full, f), out.stderr?.toString().slice(-160) || out.error?.message);
    }
  });
}
console.log(`DGYP: ${done} konversi baru, ${skipped} sudah ada.`);

let hiDone = 0, hiSkip = 0;
const hiFiles = readdirSync(SRC_HI).filter(f => /\.jpg$/i.test(f)).sort((a, b) => a.localeCompare(b));
hiFiles.forEach((f, i) => {
  const dest = join(PUB_HI, 'nh-' + String(i + 1).padStart(2, '0') + '.jpg');
  if (existsSync(dest)) { hiSkip++; return; }
  copyFileSync(join(SRC_HI, f), dest);
  hiDone++;
});
console.log(`Nimo Highland: ${hiDone} disalin, ${hiSkip} sudah ada.`);

console.log('Folder brand siap.');
console.log('  src/assets/dgyp/', readdirSync(OUT_DGYP).length, 'jpg');
console.log('  public/brand/dgyp/', readdirSync(PUB_DGYP).length, 'jpg');
console.log('  public/brand/nimo-highland/', readdirSync(PUB_HI).length, 'jpg');