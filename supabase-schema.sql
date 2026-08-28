-- =====================================================================
-- Nimo Group — Skema Database Supabase
-- Jalankan seluruh blok ini di Supabase Dashboard -> SQL Editor.
--
-- AMAN DIJALANKAN BERULANG, dan aman dijalankan di database yang sudah
-- berisi tabel versi lama. Itulah sebabnya ada bagian MIGRASI di bawah:
-- `create table if not exists` TIDAK menambah kolom pada tabel yang sudah
-- ada — ia hanya melewatinya diam-diam. Jadi kolom baru (customer_id,
-- password_hash, dst.) harus ditambahkan lewat `alter table`.
--
-- MODEL KEAMANAN
-- Seluruh akses database berjalan lewat server Astro memakai SERVICE ROLE
-- key (service role melewati RLS). Karena itu setiap tabel di bawah
-- mengaktifkan RLS TANPA policy apa pun: anon key yang terekspos di browser
-- tidak bisa membaca atau menulis apa pun.
--
-- CATATAN PER 2026-08-28
-- Sistem booking tiket, pembayaran (Midtrans), kuota harian, dan verifikasi
-- tiket telah DIHAPUS dari aplikasi. Skema di bawah hanya mencakup reservasi
-- kamar + akun pelanggan/karyawan + konten destinasi + log aktivitas ESS.
-- Tabel lama (tickets, payments, daily_quotas, daily_slots) yang sudah ada
-- di database TIDAK dihapus oleh skrip ini; berhenti dikelola oleh kode.
-- =====================================================================


-- =====================================================================
-- BAGIAN 1 — TABEL
-- Untuk database kosong, bagian ini saja sudah lengkap.
-- Untuk database lama, Bagian 2 yang melengkapinya.
-- =====================================================================

-- ---------- PELANGGAN (akun booking) ----------
create table if not exists customers (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,          -- scrypt, lihat src/lib/password.js
  full_name     text not null,
  phone         text,
  role          text not null default 'customer',
  created_at    timestamptz not null default now()
);

-- ---------- KARYAWAN (Portal ESS) ----------
create table if not exists employees (
  id            uuid primary key default gen_random_uuid(),
  nik           text unique not null,
  password_hash text,                   -- scrypt, BUKAN teks polos
  full_name     text not null,
  role          text not null default 'Staff',
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ---------- PEMESANAN KAMAR ----------
create table if not exists room_bookings (
  id            uuid primary key default gen_random_uuid(),
  booking_code  text unique not null,
  customer_name text not null,
  hotel_id      text not null,
  hotel_name    text not null,
  room_id       text not null,
  room_name     text not null,
  check_in      date not null,
  check_out     date not null,
  nights        integer not null,
  rooms         integer not null,
  guests        integer not null,
  total_price   numeric not null default 0,
  status        text not null default 'DIKONFIRMASI',
  created_at    timestamptz not null default now()
);

-- ---------- RATING RESMI DESTINASI ----------
-- Angka agregat resmi per destinasi (mis. dari Google Maps / kanal resmi).
create table if not exists destination_ratings (
  destination_id text primary key,      -- cocokkan dengan id di src/lib/data.js
  rating         numeric(2,1) not null,
  review_count   integer not null,
  source         text,                  -- mis. 'Google Maps'
  source_url     text,
  updated_at     timestamptz not null default now()
);

-- ---------- VIDEO DESTINASI ----------
-- URL video (mp4/webm) untuk kartu destinasi. NULL = tidak ada video sehingga
-- kartu tetap memakai gambar. HANYA karyawan yang bisa mengisi/mengubah lewat
-- POST /api/ess/videos (dilindungi middleware EMPLOYEE_API); semua pengunjung
-- membacanya lewat rute server (`src/lib/videos.js`), bukan policy publik.
create table if not exists destination_videos (
  destination_id text primary key,      -- cocokkan dengan id di src/lib/data.js
  video_url      text not null,
  updated_at     timestamptz not null default now()
);

-- ---------- LOG AKTIVITAS ESS ----------
-- Log siapa (NIK) melakukan aksi apa di Portal ESS (mis. LOGIN, mengelola
-- akun karyawan). Ditulis lewat src/lib/payments.js -> logActivity(...).
create table if not exists activity_log (
  id          uuid primary key default gen_random_uuid(),
  actor_nik   text not null,
  actor_name  text,
  action      text not null,            -- MISAL 'LOGIN', 'ACCOUNT_CREATE', 'ACCOUNT_UPDATE'
  booking_code text,
  meta        jsonb,
  created_at  timestamptz not null default now()
);


-- =====================================================================
-- BAGIAN 2 — MIGRASI
-- Menambahkan kolom yang belum ada pada tabel lama. Tidak berefek apa pun
-- pada database yang baru dibuat di Bagian 1.
-- =====================================================================

-- ---------- customers ----------
alter table customers add column if not exists phone      text;
alter table customers add column if not exists role       text not null default 'customer';
alter table customers add column if not exists created_at timestamptz not null default now();

-- ---------- employees ----------
alter table employees add column if not exists password_hash text;
alter table employees add column if not exists active        boolean not null default true;
alter table employees add column if not exists created_at    timestamptz not null default now();

-- Kolom password teks polos dari skema lama dibuang.
--
-- Password lama TIDAK bisa dimigrasikan: scrypt tidak bisa dihitung di dalam
-- SQL, dan password itu memang sudah harus dianggap bocor — kolomnya bisa
-- dibaca publik lewat policy "employees public select" di skema lama.
--
-- Setelah ini, akun karyawan lama tidak punya password_hash sehingga tidak
-- bisa login sama sekali (bukan gagal-terbuka: src/lib/password.js
-- mengembalikan false untuk hash kosong). Buat ulang akunnya dengan:
--   npm run seed:employees -- NIK-0001 "Nama" "Jabatan" <password-baru>
alter table employees drop column if exists password;

-- ---------- room_bookings ----------
alter table room_bookings add column if not exists customer_id uuid;


-- =====================================================================
-- BAGIAN 3 — FOREIGN KEY, CONSTRAINT, INDEX
-- `drop ... if exists` dulu supaya seluruh blok aman dijalankan berulang:
-- Postgres tidak punya `add constraint if not exists`.
-- =====================================================================

-- ---------- Foreign key ke customers ----------
alter table room_bookings drop constraint if exists room_bookings_customer_id_fkey;
alter table room_bookings add  constraint room_bookings_customer_id_fkey
  foreign key (customer_id) references customers (id) on delete set null;

-- ---------- Aturan data ----------
-- `not valid` = baris yang sudah ada tidak diperiksa, baris baru diperiksa.
alter table room_bookings drop constraint if exists room_bookings_counts_positive;
alter table room_bookings add  constraint room_bookings_counts_positive
  check (nights > 0 and rooms > 0 and guests > 0) not valid;

alter table room_bookings drop constraint if exists room_bookings_checkout_after_checkin;
alter table room_bookings add  constraint room_bookings_checkout_after_checkin
  check (check_out > check_in) not valid;

alter table destination_ratings drop constraint if exists destination_ratings_rating_range;
alter table destination_ratings add  constraint destination_ratings_rating_range
  check (rating >= 0 and rating <= 5) not valid;

alter table destination_ratings drop constraint if exists destination_ratings_count_non_negative;
alter table destination_ratings add  constraint destination_ratings_count_non_negative
  check (review_count >= 0) not valid;

-- ---------- Index ----------
create index if not exists idx_customers_email          on customers (email);
create index if not exists idx_room_bookings_customer   on room_bookings (customer_id);
create index if not exists idx_activity_created         on activity_log (created_at desc);
create index if not exists idx_activity_actor           on activity_log (actor_nik);


-- =====================================================================
-- BAGIAN 4 — ROW LEVEL SECURITY
-- Aktif, tanpa policy: anon & authenticated tidak punya akses apa pun.
-- Service role (dipakai server) melewati RLS.
-- =====================================================================
alter table customers            enable row level security;
alter table employees            enable row level security;
alter table room_bookings        enable row level security;
alter table destination_ratings  enable row level security;
alter table destination_videos   enable row level security;
alter table activity_log         enable row level security;

-- Hapus policy publik dari skema lama.
-- Ini yang dulu membuat seluruh password karyawan dan seluruh nama serta
-- nominal pesanan pelanggan bisa dibaca siapa saja dari console browser.
drop policy if exists "employees public select" on employees;


-- =====================================================================
-- BAGIAN 5 — DATA AWAL
-- =====================================================================

-- ---------- Rating resmi ----------
-- !! GANTI ANGKA DI BAWAH DENGAN ANGKA RESMI ANDA SEBELUM PRODUKSI !!
-- Nilai ini contoh struktur, bukan data terverifikasi. Ambil angka asli dari
-- Google Business Profile / kanal resmi Nimo Land, lalu update baris ini.
-- Kalau belum ada angka resmi, hapus saja barisnya — UI akan menyembunyikan
-- badge rating, dan itu lebih baik daripada menampilkan angka karangan.
insert into destination_ratings (destination_id, rating, review_count, source, source_url) values
  ('nimo-highland', 4.5, 100, 'Google Maps', null),
  ('nimo-eye',      4.5, 100, 'Google Maps', null)
on conflict (destination_id) do update
  set rating       = excluded.rating,
      review_count = excluded.review_count,
      source       = excluded.source,
      source_url   = excluded.source_url,
      updated_at   = now();

-- ---------- Akun karyawan ----------
-- TIDAK diseed lewat SQL: password harus di-hash dengan scrypt, dan hash
-- tidak boleh ikut ter-commit ke repo.
--   npm run seed:employees -- NIK-0001 "Idris" "Staff" <password>
-- Jalankan setelah mengisi .env. Lihat scripts/seed-employees.mjs.


-- =====================================================================
-- CEK HASIL — jalankan setelah skrip di atas selesai.
--
-- Karyawan yang masih perlu di-seed ulang (password_hash kosong):
-- select nik, full_name from employees where password_hash is null;
-- =====================================================================
