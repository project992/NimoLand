-- =====================================================================
-- NIMO HIGHLAND — Skema Database Supabase
-- Jalankan seluruh blok ini di Supabase Dashboard -> SQL Editor
-- =====================================================================

-- ---------- Tabel KARYAWAN (ESS) ----------
create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  nik text unique not null,
  password text not null,
  full_name text not null,
  role text not null default 'Staff'
);

-- ---------- Tabel TIKET PELANGGAN ----------
create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  booking_code text unique not null,
  customer_name text not null,
  ticket_type text not null,
  quantity integer not null default 1,
  total_price numeric not null default 0,
  visit_date date not null,
  expiry_date date not null,
  status text not null default 'LUNAS',
  created_at timestamptz not null default now()
);

-- Indeks untuk pencarian & filter cepat
create index if not exists idx_tickets_booking on tickets (booking_code);
create index if not exists idx_tickets_status on tickets (status);

-- ---------- Row Level Security ----------
alter table tickets enable row level security;
alter table employees enable row level security;

create policy "tickets public select" on tickets for select using (true);
create policy "tickets public insert" on tickets for insert with check (true);
create policy "tickets public update" on tickets for update using (true);

create policy "employees public select" on employees for select using (true);

-- ---------- Data awal (password plain untuk demo) ----------
insert into employees (nik, password, full_name, role) values
  ('NIK-0001', 'admin123',   'Budi Santoso',    'Staff Tiket / Gate'),
  ('NIK-0002', 'manager123', 'Sari Wulandari',  'Supervisor')
on conflict (nik) do nothing;

-- ---------- Contoh data tiket (opsional) ----------
insert into tickets (booking_code, customer_name, ticket_type, quantity, total_price, visit_date, expiry_date, status) values
  ('#NIMO-20260001', 'Andi Prasetyo', 'Tiket Masuk Regular · Domestik', 2, 85000,  current_date + 1, current_date + 4, 'LUNAS'),
  ('#NIMO-20260002', 'Rina Kartika',  'Tiket Nimo Eye · Domestik',      1, 55000,  current_date - 1, current_date + 2, 'TERPAKAI'),
  ('#NIMO-20260003', 'Maya Rahayu',   'Tiket Premium · Domestik',       3, 285000, current_date - 7, current_date - 4, 'EXPIRED')
on conflict (booking_code) do nothing;

-- =====================================================================
-- CATATAN PENTING
-- 1. Setelah tabel dibuat, aktifkan REALTIME:
--    Dashboard -> Database -> Replication -> "tickets" (Enable).
-- 2. Salin URL Project & anon key ke dalam kode ESS di
--    src/pages/index.astro (konstanta SUPABASE_URL & SUPABASE_ANON_KEY).
-- 3. Untuk produksi, simpan password karyawan sebagai HASH (bcrypt/argon2)
--    dan pindahkan login ke Edge Function Supabase.
-- =====================================================================
