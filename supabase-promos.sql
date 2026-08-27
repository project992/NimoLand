-- =====================================================================
-- MIGRASI — PROMO (Buy 1 Get 1, diskon, dll)
-- Jalankan blok ini di Supabase Dashboard -> SQL Editor (sekali saja).
-- Aman dijalankan berulang.
--
-- Tabel `promos` menyimpan konfigurasi promo yang dikelola dari ESS
-- (hanya akun Ami). Saat checkout tiket, promo aktif otomatis menambah
-- tiket gratis dan/atau memotong harga, lalu hasilnya disimpan di kolom
-- promo_* pada baris tiket supaya terlihat di monitor ESS.
-- =====================================================================

create table if not exists promos (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,          -- mis. 'B1G1', 'DISC10'
  title         text not null,                 -- nama tampilan, mis. 'Buy 1 Get 1'
  description   text,                          -- keterangan singkat
  promo_type    text not null default 'buy_n_get_m',  -- 'buy_n_get_m' | 'percentage' | 'flat'
  buy_qty       integer not null default 1,    -- jumlah dibeli untuk mendapat bonus
  free_qty      integer not null default 1,    -- jumlah gratis (buy_n_get_m)
  discount_pct  numeric,                       -- persen potongan (percentage): 10 = 10%
  discount_amount numeric,                     -- nominal potongan (flat), per tiket
  target_package text,                         -- NULL/'' = semua paket; atau id paket
  sticky        boolean not null default false,-- dipakai otomatis tanpa dipilih (mis. B1G1)
  active        boolean not null default true,
  starts_on     date,                          -- NULL = mulai sekarang
  ends_on       date,                          -- NULL = tanpa batas
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Alur verifikasi-promo (opsional): tangkapan siapa mengaktifkan/mengubah.
-- Strategi tetap satu baris per admin: last-write-wins + activity_log.

-- Kolom promo pada tiket (hasil terapan di waktu checkout).
alter table tickets add column if not exists promo_code    text;
alter table tickets add column if not exists promo_bonus_qty integer not null default 0;
alter table tickets add column if not exists promo_note    text;

-- Row Level Security: tanpa policy (akses hanya via SERVICE ROLE dari server).
alter table promos enable row level security;

-- Index ringan agar pencarian promo aktif cepat.
create index if not exists idx_promos_active on promos (active);
create index if not exists idx_tickets_promo  on tickets (promo_code);
