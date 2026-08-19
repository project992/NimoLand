# Konfigurasi Pembayaran Midtrans + Email E-Tiket (FASE 3)

Pemesanan tiket kini pembayaran sungguhan lewat **Midtrans Snap** (QRIS, VA,
e-wallet, bank transfer). Server hanya berjalan bila key terisi; bila kosong maka
berjalan di **mode demo** (tiket langsung `LUNAS` dan etiket terkirim via email
demo). Ikuti langkah di bawah untuk mengaktifkan pembayaran nyata.

## 1. Daftarkan merchant di Midtrans

1. Buka dashboard **sandbox/praktik**: <https://dashboard.sandbox.midtrans.com>
   (atau <https://dashboard.midtrans.com> untuk produksi) dan buat akun/buat
   merchant.
2. Di menu **Settings > Access Keys**, salin:
   - **Server Key** → `MIDTRANS_SERVER_KEY`
   - **Client Key** → `MIDTRANS_CLIENT_KEY`
3. Aktifkan metode pembayaran (QRIS, VA, e-wallet, dsb.) sesuai merchant
   dashboard **Settings > Payment Settings**.

> **Keamanan:** Server Key **tidak pernah** dikirim ke browser. Kode hanya
> dipakai di server (`src/lib/midtrans.js`) dan hanya API yang mengimpornya.
> Jangan menaruh Server Key di `src/` publik.

## 2. Isi variabel env

Salin `.env.example` menjadi `.env` (untuk lokal) serta set di dashboard Vercel
(**Project → Settings → Environment Variables**):

| Variabel | Contoh | Keterangan |
|---|---|---|
| `MIDTRANS_SERVER_KEY` | `SB-Mid-server-xxxx` | dari dashboard (jangan bocor) |
| `MIDTRANS_CLIENT_KEY` | `SB-Mid-client-xxxx` | dipakai browser oleh Snap |
| `MIDTRANS_IS_PRODUCTION` | `0` (sandbox) / `1` (produksi) | base URL gateway |
| `RESEND_API_KEY` | `re_xxxx` | key Resend untuk email etiket |
| `RESEND_FROM` | `nimo@yourdomain.com` | pengirim email (harus verified di Resend) |
| `SITE_URL` | `https://nimo.vercel.app` | tautan "Pesanan Saya" di body email |

Dengan `MIDTRANS_IS_PRODUCTION=0` semua transaksi memakai lingkungan sandbox.

## 3. Skema database

Jalankan `supabase-schema.sql` di SQL Editor Supabase. Menambah tabel
`payments`, `daily_quotas`, `daily_slots` + RPC `reserve_daily_slot`, dan kolom
`customer_email`, `paid_at`, `payment_method`, `order_id` pada `tickets`, plus
perekat status `PENDING/LUNAS/TERPAKAI/EXPIRED/CANCELED`.

> Skrip skema aman dijalankan berulang kali (pakai `... not valid` pada
> constraint + `IF NOT EXISTS`). Jangan jalankan dua kali sekaligus berbarengan.

## 4. Set webhook URL di dashboard Midtrans

1. Dashboard Midtrans → **Settings → Configuration → Payment Notification URL**
2. Set ke: `https://<domain>/api/payments/notification`
   - Sandbox: gunakan domain deployment Vercel preview/prod Anda.
3. Simpan. Midtrans akan POST status transaksi ke URL ini; server memverifikasi
   signature dan menandai tiket `LUNAS`/`CANCELED` + mengirim email etiket.

## 5. Repository Vercel + build

`npm run build` (skrip `astro build`, adapter `@astrojs/vercel`) menghasilkan
output fungsi serverless otomatis; tidak perlu konfigurasi `vercel.json`.
Setelah env tersedia, deploy. Midtrans hanya dapat memanggil URL yang **publik**
(bukan `localhost`).

## 6. Mode demo (email Resend belum diset)

Tanpa `RESEND_API_KEY`, email etiket **tidak** dikirim; tiket tetap bisa diunduh
PNG / dikirim via WhatsApp dari halaman **Pesanan Saya** (`/akun`). Setelah
`RESEND_API_KEY` ada, email etiket terkirim otomatis saat pembayaran
LUNAS/SETTLEMENT (dan pada alur demo di `bookings.js`).

## Catatan penting

- Tanda tangan webhook diverifikasi dengan SHA512 `serverKey+orderId+statusCode+grossAmount`
  + `timingSafeEqual`; handler idempoten dan selalu merespons `200`.
- Status `EXPIRED` otomatis bila melewati masa berlaku (dan dicegah saat scan).
- Kuota harian (`whitelist_date` di `daily_quotas`, diatur di **Portal ESS →
  Kuota Harian**) dipakai **atomik** via `reserve_daily_slot` agar tidak
  overbooking.