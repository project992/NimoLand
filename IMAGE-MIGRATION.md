# Migrasi Gambar (FASE 2.5)

Semua gambar situs saat ini **hotlink** dari Google Sites (`lh3.googleusercontent.com`)
atau Unsplash. Google memblokir unduhan otomatis (HTTP 403) — itu sebabnya pemindahan
dilakukan manual, dalam 3 langkah berikut.

## Langkah 1 — Lihat daftar lengkap URL

```bash
npm run images:lista
```

Output: **35 URL unik** + di mana setiap URL dipakai + nama file lokal yang disarankan
(`src/assets/nimo/<kunci>.jpg`). Daftar ini juga tertulis otomatis pada hasil script.

## Langkah 2 — Unduh file

```bash
npm run images:seed
```

- File **Unsplash** (prefix `fb-*`) langsung terunduh ke `src/assets/nimo/`.
- File **Google (lh3)** ditolak otomatis (403) dan dicatat di `ASSETS-UNDUH-MANUAL.txt`
  beserta URL-nya. Unduh file-file ini **dari editor Google Sites yang sudah login**
  (klik kanan gambar → *Save image as*), simpan dengan nama persis dari `ASSETS-UNDUH-MANUAL.txt`
  ke folder `src/assets/nimo/`.

Script juga menulis `src/assets/nimo/images.mjs` (peta kunci -> import) — jangan diedit
tangan; di-generate ulang tiap seed.

## Langkah 3 — Verifikasi

```bash
npm run build
```

## Bagaimana komponen bekerja

`src/components/NimoImage.astro` menggunakan `<Image>` dari `astro:assets`:

- **WebP** — `formats={['webp', 'avif', 'jpeg']}`; Astro/sharp mengonversi saat build.
- **Responsif** — `widths={[480, 768, 1280]}` + `sizes` menghasilkan `srcset`.
- **Lazy** — `loading="lazy"` default; khusus gambar di atas lipatan (LCP) beri `eager`.
- **Fallback aman** — selama file lokal belum ada, komponen otomatis memakai URL remote
  (`remote` prop), jadi situs tidak pernah rusak di tengah migrasi.

Cara pakai di komponen server (Astro):

```astro
<NimoImage remote={d.img} alt={d.name} fill eager sizes="(min-width:1024px) 30vw, 100vw" />
```

Kunci file diturunkan otomatis dari `remote` lewat `IMG_KEYS` di `src/lib/data.js`.
Setelah file lokal tersedia, komponen langsung memakai versi WebP teroptimasi tanpa
perubahan kode.

## Catatan teknis

- Halaman detail `/destinasi/[slug]` dan `/penginapan/[slug]`, plus login/register, sudah
  memakai `<NimoImage>` untuk gambar yang di-render server (paling penting untuk skor
  performa). Halaman yang di-render JavaScript (grid kartu, galeri, hero carousel) masih
  memakai string HTML di `src/scripts/app.js` — penggantian menyeluruh di sana adalah
  pekerjaan tindak lanjut yang direkomendasikan (lihat `coverMedia()`), karena manfaat
  WebP paling besar ada di gambar atas lipatan.
- `og:image` (Open Graph) tetap memakai URL absolut; setelah migrasi selesai, ganti
  `SITE.ogImage` di `src/lib/site.js` menjadi `SITE.url + '/images/og.jpg'` bila file
  diletakkan di `public/images/og.jpg`.