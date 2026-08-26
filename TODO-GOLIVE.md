# NimoLand Website — Checklist Prioritas Menuju 10/10

## P1: Placeholder & Simulasi (Wajib sebelum go-live)

- [ ] Isi nama badan hukum resmi di footer (ganti `[ISI DI SINI]`)
- [ ] Finalisasi harga kamar yang masih "Hubungi reservasi"
- [ ] Integrasikan payment gateway real (Midtrans/Xendit)
- [ ] E-tiket QR validation harus real-time, bukan simulasi
- [ ] Konfirmasi email otomatis setelah booking

## P2: Keamanan Panel Admin

- [ ] Pindah Portal ESS ke path/subdomain terpisah (`/ess` atau `ess.nimoland.id`)
- [ ] Pastikan endpoint API terproteksi (role check di semua endpoint employee/supervisor)
- [ ] Audit semua API endpoint — pastikan tidak ada yang exposed tanpa auth

## P3: Konten

- [ ] Isi data wahana untuk setiap kategori (hapus "Belum ada wahana")
- [ ] Isi konten FAQ section
- [ ] Tambahkan testimoni/review pengunjung
- [ ] Tambahkan alt text deskriptif di semua gambar

## P4: SEO & Performa

- [ ] Optimasi ukuran gambar (WebP/AVIF, lazy loading)
- [ ] Tambahkan alt text yang deskriptif
- [ ] Finalisasi sitemap.xml dengan hreflang
- [ ] Pastikan structured data TouristAttraction/LodgingBusiness lengkap

## P5: UX Booking

- [ ] Indikator ketersediaan real-time (tanggal penuh ditandai)
- [ ] Riwayat pesanan bisa diakses ulang oleh user
- [ ] Login/Register di-i18n (EN/ID)

## P6: Legalitas & Kepercayaan

- [ ] Halaman Syarat & Ketentuan — lengkap, bukan template
- [ ] Halaman Kebijakan Privasi — lengkap
- [ ] Tampilkan badge keamanan pembayaran (SSL, logo payment partner)

---

**Status saat ini: 8.5/10** — Fondasi sudah kuat. Selesaikan P1 dan P2 untuk naik ke 9-10/10.
