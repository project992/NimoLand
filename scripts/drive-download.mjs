/* Download footage for Nimo Land destinations/hotels from public Google Drive.

   Manifest maps each destination/hotel id to its own footage files.
   Videos are saved to public/videos/<destId>/<kind><ext> and photos to
   public/images/pinaru/.

   Run:  node scripts/drive-download.mjs
   Re-run safe (skips existing files).
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VIDEO_MAX_BYTES = 90 * 1024 * 1024; // skip files > 90MB (GitHub limit 100MB)

const MANIFEST = [
  // New Dgyp Resort Ciater (DGYP)
  { dest: 'new-dgyp-resort', kind: 'aerial', id: '1RfAcS2a8P1E7eGNyAPg6XWm0iIFSxUrg', ext: '.mp4' },
  { dest: 'new-dgyp-resort', kind: 'ad',     id: '1VefeIC3wdt99t8OVDhHdmciIjpDllmMa', ext: '.mp4' },
  // Nimo Resort Ciater (NRC)
  { dest: 'nimo-resort-ciater', kind: 'aerial', id: '1kg7iwq-R7JkI-sCLlIFcISLbgW87okfg', ext: '.mp4' },
  { dest: 'nimo-resort-ciater', kind: 'ad',     id: '1DU10FpPKXgkyxMKgIodsCtqp23C0jAo6', ext: '.mp4' },
  // Nimo Tea Resort (NTR)
  { dest: 'nimo-tea-resort', kind: 'aerial', id: '187nEj-86o27wwLVv5-PvyckRhY4OLr_Y', ext: '.mp4' },
  { dest: 'nimo-tea-resort', kind: 'ad',     id: '1ptwzIZGN3TnCfFuMyRetArZG2CARQHhL', ext: '.mp4' },
  // Savia Hotel & Resort (SAVIA) — dji_0371 88MB (file 133MB lainnya > batas GitHub)
  { dest: 'savia-hotel-resort', kind: 'aerial', id: '1-Zy4TFzPTz4Tise69TJVcA88e83bGdZF', ext: '.mp4' },
  // Pinaru Park — aerial + a walking shot
  { dest: 'pinaru-park', kind: 'aerial', id: '1dzuFdTQXTVSHzIRmqWzO4B3xNhu_WPci', ext: '.MOV' },
];

// Pinaru Park photos -> public/images/pinaru/pinaru-<nn>.jpg
const PINARU_PHOTOS = [
  '1o82-_mWyEf0Rp1U4usbBmquVViyyupwr', '1b40PixzbPcjSdm3jFFb1FGboK2q57uAa',
  '1TDl80Wp27WMjSCMv-eByT5QCFped6pPk', '1vLlwG-g9Lo0rp2a0SCZCSJ-IILalfagn',
  '1UDKV5HliQ0fV-70OJcPWJCmOcd5ENsoJ', '1twBADHxVMCo3C3S2Kp89FOnbLtrDUwGc',
  '1vTPAyYfEjkc-wsruvQm8OsGzbespiDbJ', '1EbvjHXBA0IOrdyYrg5jKr5nJtMP-xPpl',
  '1EvWYBNGL1OQnz1Plu_bcvvW3LfBSlDoh', '1OL28gQld0XpomS0ASquHrYy38PtjpHA4',
  '16rMrWhCojY1mdXyEm-awCtTxBasZAI6s', '1uvMMNJ6h-1WVM8sklCYLDH6I-g66ps64',
  '1DHpt0zZz7IW4v6BXrTTYX4Se_ZnUN6pP', '1NXLVyrLHnP-N8in2GrVpRBfjtvkF4_ew',
  '1y_rEFDa528zMRYExFkVxgbumTjyzJYjK', '17WOxK-q6w0h9YSoM-10cve8YWf36FZJy',
  '1JVMcPibB0TM4f2EZ4NA7J-xl34aKdpGz', '1SfbRLNNtZWrgkDeU-fDVxIMBPqwdDian',
  '1W884gCxZq5VUO825-CjL0b9321UBmqD6', '1uGMLLxNpoVci_gf7rwLzz60ACRMEvhYL',
  '1Xt6g0y6lpOz61SUaF62pX5y-dkWHdczh', '1Nebi3HEFzCUQafgkVPSmcNu53zgnoKSV',
  '1iuYCAix85ua93tBmzz5cO-bxOL-Ts8MD', '1bn14e6eESw759uS9I9GJzjuLeBqjC_Mw',
  '1FhF30pmst-XpLhQmXxr9atLGJwez_09K', '10AmOUIehEJqyviVlxYOswKsxvcvKv5Xn',
];

const DL = id => 'https://drive.google.com/uc?export=download&id=' + id;

async function headSize(url) {
  try {
    const r = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (r.status >= 300 && r.status < 400) {
      const loc = r.headers.get('location') || '';
      if (loc.includes('confirm')) return 0;
    }
    return Number(r.headers.get('content-length') || 0);
  } catch { return 0; }
}

async function download(url, dest) {
  let r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const type = r.headers.get('content-type') || '';
  if (r.url.includes('confirm') || type.includes('text/html')) {
    // Virus-scan confirmation page: pull the confirm token and follow it.
    const html = await r.text();
    const m = html.match(/action="([^"]+)"/) || html.match(/name="confirm"\s+value="([^"]+)"/);
    const action = m && m[1] ? (m[1].startsWith('http') ? m[1] : 'https://drive.usercontent.google.com/download' + (m[1] || '')) : null;
    if (!action) throw new Error('confirm page tanpa token');
    const u = new URL(action);
    u.searchParams.set('confirm', 't');
    r = await fetch(u.toString(), { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
  }
  const buf = Buffer.from(await r.arrayBuffer());
  // Sanity: a video should not be a tiny HTML page.
  if (buf.length < 1024 && buf.slice(0, 5).toString('latin1').startsWith('<!DOC')) throw new Error('respon bukan file');
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, buf);
  return buf.length;
}

const mb = n => (n / 1048576).toFixed(1) + ' MB';

const all = MANIFEST.map(v => ({ ...v, out: join(ROOT, 'public', 'videos', v.dest, v.kind + v.ext), kind: v.kind }));
const photos = PINARU_PHOTOS.map((id, i) => ({
  out: join(ROOT, 'public', 'images', 'pinaru', `pinaru-${String(i + 1).padStart(2, '0')}.jpg`), id,
}));

let dl = 0, skip = 0, fail = 0, big = 0;
console.log('\n=== CHECK SIZES ===');
for (const f of all) {
  const size = await headSize(DL(f.id));
  console.log(`${f.dest}/${f.kind}  ${mb(size)}`);
  if (size > VIDEO_MAX_BYTES) { console.log('  !! > 90MB — dilewati'); big++; continue; }
  if (existsSync(f.out)) { console.log('  sudah ada — dilewati'); skip++; continue; }
  f._size = size;
}
for (const p of photos) {
  if (existsSync(p.out)) { console.log(p.out + ' sudah ada — dilewati'); skip++; continue; }
  p._pending = true;
}

console.log('\n=== DOWNLOAD VIDEOS ===');
for (const f of all) {
  if (f._size == null || existsSync(f.out)) continue;
  try {
    const n = await download(DL(f.id), f.out);
    console.log(`OK ${f.dest}/${f.kind}  (${mb(n)})`);
    dl++;
  } catch (e) {
    console.log(`GAGAL ${f.dest}/${f.kind} — ${e.message}`);
    fail++;
  }
}

console.log('\n=== DOWNLOAD PHOTOS ===');
for (const p of photos) {
  if (!p._pending) continue;
  try {
    const n = await download(DL(p.id), p.out);
    console.log(`OK ${p.out.split('pinaru/')[1]}  (${mb(n)})`);
    dl++;
  } catch (e) {
    console.log(`GAGAL ${p.out.split('pinaru/')[1]} — ${e.message}`);
    fail++;
  }
}

console.log(`\nSelesai: ${dl} diunduh, ${skip} sudah ada, ${fail} gagal, ${big} terlalu besar dilewati.`);