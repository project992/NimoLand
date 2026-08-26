# SEO — Google Search Console (langkah manual)

Semua prasyarat teknis sudah ada di repo: halaman `robots.txt`, `sitemap.xml`, URL
kanonik, meta+Open Graph, dan data terstruktur JSON-LD. Yang tersisa hanyalah
registrasi manual di Search Console oleh pemilik nama domain.

## 1. Prasyarat

- Proyek sudah ter-deploy ke **Vercel** dan domain terhubung. `SITE.url` di
  `src/lib/site.js` harus persis dengan domain produksi (`https://nimo-land.vercel.app`).
- Buka `https://<domain>/sitemap.xml` dan `https://<domain>/robots.txt` — keduanya
  harus bernilai 200.

## 2. Tambahkan properti di Search Console

1. Buka https://search.google.com/search-console → **Add property** → pilih
   jenis **Domain** (verifikasi di tingkat DNS, berlaku untuk semua subdomain)
   atau **URL prefix** (`https://nimo-land.vercel.app/`).
2. Ikuti verifikasi kepemilikan:
   - **Domain:** tambahkan catatan TXT DNS yang ditampilkan di penyedia domain.
   - **URL prefix:** pilih *HTML tag* lalu salin meta `google-site-verification`
     ke `<head>` di `src/layouts/Base.astro`, atau upload file HTML ke `public/`.
     Contoh tag:
     ```html
     <meta name="google-site-verification" content="GOOGLE_PUNYA_KODE_INI" />
     ```
3. Setelah terverifikasi, Search Console mulai merayap.

## 3. Kirim sitemap

1. Di Search Console: **Sitemaps** → ketik `sitemap.xml` → **Submit**.
   - `sitemap.xml.ts` sudah men-generate semua URL statis + detail
     `/destinasi/*` dan `/penginapan/*` + halaman legal dari data yang sama.
2. Cek status: *Success*, jumlah URL ditemukan. Bila ada *Couldn't fetch*,
   pastikan file diakses tanpa login (SSR akan berjalan normal di Vercel).

## 4. Periksa apa yang diket

1. **Page indexing** → *View page indexing* — daftar URL terindeks + alasan
   tidak diindeks. Halaman `/login`, `/register`, `/akun` sengaja `noindex`
   (robots directive), jadi wajar tidak muncul.
2. **URL Inspection** — masukkan `https://domain/` lalu *Request indexing* supaya
   Google merayap ulang lebih cepat setelah selesai migrasi gambar.
3. Butuh kenaikan data tren **Performance** (LCP, CLS, INP) yang diukur Google
   terhadap pengguna nyata — skor "lab" Lighthouse hanya salah satu indikator.

## Catatan rilis

- Setelah setiap deploy ulang yang mengubah struktur URL, periksa kembali di
  halaman *Sitemaps* dan *Page indexing*; perubahan `robots.txt` butuh beberapa
  hari agar dicatat ulang.