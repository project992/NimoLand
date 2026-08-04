# Nimo Group

Platform pemesanan tiket wisata alam — Astro 5 (SSR) + Tailwind v4 + Supabase.

## Menjalankan

```bash
npm install
cp .env.example .env          # lalu isi nilainya
npm run dev                   # http://localhost:4321
```

Sebelum jalan pertama kali:

1. Jalankan `supabase-schema.sql` di Supabase Dashboard → SQL Editor.
   Aman dijalankan berulang, dan aman di database yang sudah berisi tabel
   versi lama — skrip itu menambahkan kolom yang kurang lewat `alter table`.

   > Kalau database Anda sudah berisi tabel versi lama: kolom `employees.password`
   > (teks polos) dibuang oleh skrip ini. Password lama tidak bisa dimigrasikan
   > ke scrypt lewat SQL, dan lagipula sudah harus dianggap bocor. Akun karyawan
   > lama jadi tidak bisa login sampai dibuat ulang di langkah 3. Cek sisanya:
   > `select nik, full_name from employees where password_hash is null;`
2. Isi `.env`:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API)
   - `SESSION_SECRET` — minimal 32 karakter:
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Buat akun karyawan ESS: `npm run seed:employees -- NIK-0001 "Idris" "Staff Tiket / Gate" <password>`
4. Isi rating resmi di tabel `destination_ratings` (lihat bagian Rating di bawah).

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi ke `dist/` |
| `npm start` | Jalankan hasil build (`node ./dist/server/entry.mjs`) |
| `npm test` | Uji password, sesi, rate limit, harga (`node --test`) |
| `npm run icons` | Regenerasi `src/lib/icons.js` dari `@lucide/astro` |

---

## 1. Panduan UI — sistem desain

Semua token ada di `src/styles/global.css` blok `@theme`. **Jangan** menulis
warna hex langsung di komponen; pakai token.

### Palet

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `canvas` | `#FBFAF7` | Latar halaman (off-white hangat) |
| `surface` | `#FFFFFF` | Kartu |
| `paper` | `#F3F1EB` | Panel cekung, header tabel |
| `bark` / `bark-soft` | `#333D37` / `#46524A` | Section gelap, footer, header e-tiket |
| `sage` / `sage-deep` / `sage-tint` | `#7E9B85` / `#5E7A66` / `#EBF1EC` | Aksi utama |
| `clay` / `clay-deep` / `clay-tint` | `#B08D65` / `#94734E` / `#F5EEE5` | Aksen (tombol beli, badge rating) |
| `ink` / `muted` | `#2B322D` / `#6E7B72` | Teks |
| `line` / `line-soft` | `#E4E1D9` / `#EFEDE7` | Garis, border |

Status: `ok`, `info`, `warn`, `danger` — masing-masing punya varian `-tint`.

### Aturan

1. **Tanpa gradient.** Tidak ada `linear-gradient`, `radial-gradient`, atau
   `bg-gradient-to-*` di mana pun. Kedalaman datang dari tint solid, border
   setipis rambut, dan satu skala bayangan (`--shadow-soft`, `--shadow-lift`).
   Overlay di atas foto memakai warna solid transparan (`bg-bark/55`), bukan
   gradient bertingkat.
2. **Tanpa emoji.** Semua ikon dari Lucide.
3. **Warna lembut saja.** Hindari warna jenuh. Merah/hijau status pun
   didesaturasi (`--color-danger: #A35A52`, bukan `#EF4444`).

### Kelas komponen

Pakai kelas ini, bukan menyusun ulang utility tiap kali:

```
.btn-primary  .btn-accent  .btn-dark  .btn-outline  .btn-ghost-light
.card  .card-hover
.field  .label  .field-error
.note-info  .note-warn  .note-error
.pill              /* filter; status aktif lewat aria-pressed="true" */
.eyebrow           /* label kecil di atas judul section */
.img-shell         /* placeholder gambar, tint datar */
```

> Catatan Tailwind v4: `@apply` **tidak bisa** memakai kelas kustom. Basis
> bersama ditulis sebagai daftar selector
> (`.btn, .btn-primary, .btn-accent { … }`), bukan `@apply btn`.

### Ikon

Dua jalur, satu sumber (Lucide):

- **Markup server (`.astro`)** — impor komponennya:
  ```astro
  import MapPin from '@lucide/astro/icons/map-pin';
  <MapPin class="w-4 h-4" />
  ```
- **Markup klien (template string di `app.js`)** — pakai helper:
  ```js
  import { icon } from '../lib/icons.js';
  icon('map-pin', 'w-4 h-4')
  ```
  `src/lib/icons.js` dibuat otomatis oleh `npm run icons`. Menambah ikon:
  masukkan namanya ke daftar di `scripts/gen-icons.mjs`, lalu jalankan ulang.

Pengecualian: logo merek (WhatsApp, Instagram, TikTok) ada di
`src/components/BrandIcon.astro` — Lucide sudah tidak menyediakan ikon merek.

---

## 2. Rating resmi

Sumbernya tabel `destination_ratings`, dibaca read-only oleh `src/lib/ratings.js`
(cache 5 menit) dan dirender oleh `src/components/RatingBadge.astro`.

**Kalau sebuah destinasi tidak punya baris di tabel itu, badge rating tidak
dirender sama sekali.** Ini disengaja: angka rating tidak boleh dikarang.
Isi tabelnya dengan angka resmi Anda:

```sql
update destination_ratings
   set rating = 4.6, review_count = 12431, source = 'Google Maps', updated_at = now()
 where destination_id = 'nimo-highland';
```

`destination_id` harus cocok dengan `id` di `src/lib/data.js`.

---

## 3. Keamanan

### Rate limiting

`src/lib/rateLimit.js` — jendela tetap, **5 percobaan per menit**, diterapkan di
`/api/auth/login`, `/api/auth/register`, `/api/ess/login`.

Login memakai dua ember sekaligus, karena keduanya menahan serangan berbeda:

- **per IP** — satu host menyapu banyak akun
- **per akun** — botnet menyapu satu akun dari banyak host

Hitungan direset setelah login berhasil. Respons yang diblokir mengirim `429`
beserta header `Retry-After`.

> Penyimpanannya `Map` in-process — benar untuk satu proses Node. Kalau kelak
> berjalan di banyak instance di belakang load balancer, tiap instance punya
> hitungan sendiri; ganti penyimpanannya ke Redis/Supabase (tanda tangan
> `check()` tetap sama).

> `TRUST_PROXY=1` **hanya** jika benar-benar ada reverse proxy yang mengeset
> `X-Forwarded-For`. Tanpa proxy, klien bisa memalsukan IP-nya sendiri dan
> melewati rate limiter.

### Sesi

`src/lib/session.js` — payload JSON bertanda tangan HMAC-SHA256, disimpan di
cookie **HTTP-only** (`SameSite=Lax`, `Secure` saat produksi, umur 7 hari).
Tidak ada dependensi JWT: satu-satunya algoritma yang dipakai adalah
HMAC-SHA256, dan `node:crypto` sudah menyediakannya — sekaligus menutup celah
`alg: none`.

Karena cookie HTTP-only, JavaScript tidak bisa membacanya. Klien mengetahui
identitasnya dari blob JSON yang dirender server, dan bisa menyegarkan lewat
`GET /api/auth/me`.

**Trigger saat login berhasil** (`src/pages/api/auth/login.js`) melakukan tiga
hal dalam satu respons: memasang cookie sesi, mereset penghitung rate limit, dan
mengembalikan identitas + peran + tujuan redirect — sehingga klien tidak perlu
permintaan susulan.

`src/middleware.js` memverifikasi cookie sekali per permintaan dan menaruh
hasilnya di `Astro.locals.user` / `locals.isCustomer` / `locals.isEmployee`.

### Password

`src/lib/password.js` — scrypt dari `node:crypto` (N=2¹⁵, r=8, p=1, ±150–400 ms).
Parameter ikut tersimpan di dalam string hash, jadi menaikkannya nanti tetap
bisa memverifikasi password lama. Login memakai perbandingan
`timingSafeEqual`, dan akun yang tidak ada tetap dihitung terhadap hash boneka
supaya waktu responsnya sama — kalau tidak, waktu respons membocorkan email mana
yang terdaftar.

### Kontrol akses pemesanan

Berlapis, dan lapisan terluar bukan yang menentukan:

1. **UI** — klik "Beli Tiket" saat belum masuk memunculkan `AuthGateModal`,
   menyimpan niat pemesanan ke `sessionStorage`, lalu mengarahkan ke
   `/login?next=…`. Setelah masuk, pengguna kembali ke halaman yang sama dan
   form pemesanan terbuka otomatis.
2. **Middleware** — `/booking`, `/akun` mengarahkan ke login;
   `/api/bookings` menolak `401`. Daftarnya terpusat di `src/middleware.js`
   supaya rute baru tidak bisa lolos karena lupa dipasangi penjaga.
3. **Endpoint** — `POST /api/bookings` menghitung ulang seluruh harga dari
   `src/lib/data.js`. Klien mengirim *pilihan* pengunjung, tidak pernah
   *nominalnya*. Total yang dikirim klien akan diabaikan.

`?next=` selalu melewati `safeNext()` (`src/lib/redirect.js`) sehingga hanya
path di situs ini yang diterima — tanpa itu, tautan phishing bisa memindahkan
pengguna ke situs lain tepat setelah login asli.

### Yang diperbaiki dari versi sebelumnya

| Sebelum | Sesudah |
|---|---|
| Password karyawan teks polos, dengan policy `employees public select` — siapa pun bisa membacanya dari console browser | Hash scrypt, RLS tanpa policy publik, verifikasi di server |
| Login ESS mencocokkan password di browser dengan anon key | `POST /api/ess/login`, rate limited |
| `tickets` punya policy select/insert/update publik — nama & nominal seluruh pelanggan terbuka | RLS tanpa policy; akses hanya lewat server yang memakai service role |
| Anon key Supabase ter-commit di `src/pages/index.astro` | Tidak ada kunci di klien; server memakai service role dari `.env` |
| Kode booking dari `Math.random()` | `crypto.randomInt()` |
| Pemesanan tanpa akun, harga dari klien | Wajib login, harga dihitung server |

> **Rotasi kunci:** anon key lama (`jimqvdpazvsfaqpheopf`) ada di riwayat Git.
> Rotasi kunci proyek Supabase Anda, dan ganti semua password karyawan yang
> pernah tersimpan sebagai teks polos.

---

## Struktur

```
src/
  layouts/Base.astro            kerangka HTML + blob sesi
  components/                   Navbar, Footer, RatingBadge, views/, modals/, ess/
  pages/
    index.astro                 SPA (hash routing)
    login.astro  register.astro  akun.astro
    api/auth/                   login, register, logout, me
    api/ess/                    login, tickets, verify
    api/bookings.js             pemesanan (wajib sesi pelanggan)
  lib/
    data.js                     konten + aturan harga (dipakai klien & server)
    password.js session.js rateLimit.js redirect.js serialize.js
    supabase.js ratings.js http.js icons.js (auto-generated)
  middleware.js                 sesi → locals, penjaga rute
  scripts/app.js                logika SPA
scripts/                        gen-icons.mjs, seed-employees.mjs
```
