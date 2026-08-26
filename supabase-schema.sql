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

-- ---------- TIKET PELANGGAN ----------
create table if not exists tickets (
  id            uuid primary key default gen_random_uuid(),
  booking_code  text unique not null,
  customer_name text not null,
  ticket_type   text not null,
  quantity      integer not null default 1,
  total_price   numeric not null default 0,
  visit_date    date not null,
  expiry_date   date not null,
  status        text not null default 'LUNAS',
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
-- Dibaca read-only oleh src/lib/ratings.js. Badge rating tidak dirender sama
-- sekali kalau barisnya tidak ada — angka rating tidak boleh dikarang.
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

-- ---------- tickets ----------
alter table tickets add column if not exists customer_id uuid;
alter table tickets add column if not exists verified_at timestamptz;
alter table tickets add column if not exists verified_by text;
alter table tickets add column if not exists created_at  timestamptz not null default now();

-- ---------- room_bookings ----------
alter table room_bookings add column if not exists customer_id uuid;


-- =====================================================================
-- BAGIAN 3 — FOREIGN KEY, CONSTRAINT, INDEX
-- `drop ... if exists` dulu supaya seluruh blok aman dijalankan berulang:
-- Postgres tidak punya `add constraint if not exists`.
-- =====================================================================

-- ---------- Foreign key ke customers ----------
alter table tickets       drop constraint if exists tickets_customer_id_fkey;
alter table tickets       add  constraint tickets_customer_id_fkey
  foreign key (customer_id) references customers (id) on delete set null;

alter table room_bookings drop constraint if exists room_bookings_customer_id_fkey;
alter table room_bookings add  constraint room_bookings_customer_id_fkey
  foreign key (customer_id) references customers (id) on delete set null;

-- ---------- Aturan data ----------
-- `not valid` = baris yang sudah ada tidak diperiksa, baris baru diperiksa.
-- Dipakai supaya satu baris lama yang menyimpang tidak menggagalkan seluruh
-- skrip ini. Untuk memeriksa data lama, jalankan manual:
--   alter table tickets validate constraint tickets_quantity_positive;
alter table tickets drop constraint if exists tickets_quantity_positive;
alter table tickets add  constraint tickets_quantity_positive
  check (quantity > 0) not valid;

alter table tickets drop constraint if exists tickets_price_non_negative;
alter table tickets add  constraint tickets_price_non_negative
  check (total_price >= 0) not valid;

alter table tickets drop constraint if exists tickets_status_valid;
alter table tickets add  constraint tickets_status_valid
  check (status in ('LUNAS', 'TERPAKAI', 'EXPIRED')) not valid;

alter table tickets drop constraint if exists tickets_expiry_after_visit;
alter table tickets add  constraint tickets_expiry_after_visit
  check (expiry_date >= visit_date) not valid;

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
create index if not exists idx_tickets_booking          on tickets (booking_code);
create index if not exists idx_tickets_status           on tickets (status);
create index if not exists idx_tickets_customer         on tickets (customer_id);
create index if not exists idx_room_bookings_customer   on room_bookings (customer_id);


-- =====================================================================
-- BAGIAN 4 — ROW LEVEL SECURITY
-- Aktif, tanpa policy: anon & authenticated tidak punya akses apa pun.
-- Service role (dipakai server) melewati RLS.
-- =====================================================================
alter table customers            enable row level security;
alter table employees            enable row level security;
alter table tickets              enable row level security;
alter table room_bookings        enable row level security;
alter table destination_ratings  enable row level security;
alter table destination_videos   enable row level security;

-- Hapus policy publik dari skema lama.
-- Ini yang dulu membuat seluruh password karyawan dan seluruh nama serta
-- nominal pesanan pelanggan bisa dibaca siapa saja dari console browser.
drop policy if exists "tickets public select"   on tickets;
drop policy if exists "tickets public insert"   on tickets;
drop policy if exists "tickets public update"   on tickets;
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
--   npm run seed:employees -- NIK-0001 "Idris" "Staff Tiket / Gate" <password>
-- Jalankan setelah mengisi .env. Lihat scripts/seed-employees.mjs.


-- =====================================================================
-- CEK HASIL — jalankan setelah skrip di atas selesai.
-- Harus mengembalikan 3 baris: customer_id, verified_at, verified_by.
-- =====================================================================
-- select column_name
--   from information_schema.columns
--  where table_name = 'tickets'
--    and column_name in ('customer_id', 'verified_at', 'verified_by');

-- Karyawan yang masih perlu di-seed ulang (password_hash kosong):
-- select nik, full_name from employees where password_hash is null;


-- =====================================================================
-- BAGIAN 6 — FASE 3: PEMBAYARAN NYATA + QR DATABASE + KUOTA + LOG
-- =====================================================================

-- ---------- payments (Midtrans) ----------
create table if not exists payments (
  id                   uuid primary key default gen_random_uuid(),
  order_id             text unique not null,       -- order id di Midtrans
  booking_code         text not null,              -- tiket kaitannya (booking_code)
  amount               numeric not null,
  currency             text not null default 'IDR',
  method               text,                       -- qris / bank_transfer / echannel / dll (dari webhook)
  status               text not null default 'PENDING',
  midtrans_status      text,                       -- settlement / capture / deny / cancel / expire
  midtrans_transaction_id text,
  raw_fields          jsonb,                       -- snapshot isi webhook utk audit
  paid_at             timestamptz,
  created_at          timestamptz not null default now()
);

-- ---------- Kuota harian (admin set dari ESS) ----------
-- quota NULL = tanpa batas (unlimited). Ini jumlah tiket maksimum per tanggal.
create table if not exists daily_quotas (
  visit_date date primary key,
  quota      integer,                              -- NULL = tidak dibatasi
  note       text,
  updated_at timestamptz not null default now()
);

-- ---------- Penghitung slot yang sudah dipesan (reservasi atomik) ----------
create table if not exists daily_slots (
  visit_date date primary key,
  used       integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Reservasi atomik dan anti-overbooking. Satu pemanggilan = satu transaksi:
--   _quota NULL   -> selalu diterima, hitung digunakan
--   _quota angka  -> ditolak bila used + qty > quota (update tak menyentuh baris)
-- Pakai RPC dari server: supabase.rpc('reserve_daily_slot', {_date, _qty, _quota}).
create or replace function reserve_daily_slot(_date date, _qty integer, _quota integer)
returns table (used bigint)
language sql
as $$
  insert into daily_slots (visit_date, used) values (_date, 0)
  on conflict (visit_date) do nothing;
  update daily_slots
     set used = used + _qty, updated_at = now()
   where visit_date = _date
     and (_quota is null or used + _qty <= _quota)
  returning used;
$$;

-- ---------- Log aktivitas (siapa verifikasi tiket apa & kapan) ----------
create table if not exists activity_log (
  id          uuid primary key default gen_random_uuid(),
  actor_nik   text not null,
  actor_name  text,
  action      text not null,      -- MISAL 'VERIFY_OK','VERIFY_REUSE','VERIFY_EXPIRED','LOGIN','QUOTA_SET','PAYMENT'
  booking_code text,
  meta        jsonb,
  created_at  timestamptz not null default now()
);

-- ---------- MIGRASI kolom baru tickets ----------
alter table tickets add column if not exists customer_email text;
alter table tickets add column if not exists paid_at       timestamptz;
alter table tickets add column if not exists payment_method text;   -- 'midtrans' | null
alter table tickets add column if not exists order_id       text;   -- order_id Midtrans utk pembayarannya

-- Status baru: PENDING (belum bayar) dan CANCELED (gagal/batal). Ditambahkan
-- dengan drop+add supaya aman dijalankan berulang (PG tidak punya alter).
alter table tickets drop constraint if exists tickets_status_valid;
alter table tickets add  constraint tickets_status_valid
  check (status in ('PENDING','LUNAS','TERPAKAI','EXPIRED','CANCELED')) not valid;

-- ---------- Foreign key & index ----------
alter table payments drop constraint if exists payments_booking_fkey;
alter table payments add  constraint payments_booking_fkey
  foreign key (booking_code) references tickets (booking_code) on delete cascade;

create index if not exists idx_tickets_order_id    on tickets (order_id);
create index if not exists idx_payments_order      on payments (order_id);
create index if not exists idx_payments_status     on payments (status);
create index if not exists idx_activity_created    on activity_log (created_at desc);
create index if not exists idx_activity_actor      on activity_log (actor_nik);

-- ---------- Row Level Security ----------
alter table payments      enable row level security;
alter table daily_quotas  enable row level security;
alter table daily_slots   enable row level security;
alter table activity_log  enable row level security;

-- Semua tabel tetap tanpa policy: server memakai SERVICE ROLE, dan
-- RLS aktif tanpa policy berarti anon/authenticated tidak punya akses.


-- =====================================================================
-- CATATAN
-- 1. Realtime tidak lagi dipakai. Dashboard ESS menarik data lewat
--    GET /api/ess/tickets (butuh sesi karyawan) dan me-refresh berkala.
-- 2. Anon key TIDAK lagi dipakai di mana pun. Server memakai
--    SUPABASE_SERVICE_ROLE_KEY (lihat .env.example).
-- 3. FASE 3:
--    - Status tiket sekarang meliputi PENDING (belum bayar) dan CANCELED.
--    - Kode unik tiket = booking_code (tersimpan, unik, menjadi isi QR).
--    - Pembayaran nyata lewat Midtrans: /api/payments/notification.
--    - Kuota harian: daily_quotas + daily_slots (reservasi atomik).
-- =====================================================================
