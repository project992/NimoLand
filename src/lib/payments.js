/* Helpers server untuk transaksi pembayaran, kuota harian, dan log aktivitas.
   Khusus dipakai endpoint/api — TIDAK boleh diimport dari kode browser. */

import { randomInt } from 'node:crypto';
import { withTimeout } from './supabase.js';
import { toISODate } from './data.js';

/** @param {string} prefix */
export function orderId(prefix = 'NIMO') {
  return `${prefix}-${Date.now()}-${randomInt(100_000_000, 1_000_000_000)}`;
}

/**
 * Reservasi slot kuota harian SENTAHU. Mengurangi overbooking ujung pekan:
 * dua pesanan yang masuk bersamaan ditolak bila melebihi kuota (atomic guard
 * di `daily_slots.used + qty <= quota`).
 *
 * @param {object} db  supabase client
 * @param {string} visitDate ISO date (YYYY-MM-DD)
 * @param {number} qty  jumlah tiket yang mau dipesan
 * @returns {Promise<{ok:boolean, quota:number|null, used:number, reason?:string}>}
 */
export async function reserveDailySlot(db, visitDate, qty) {
  const day = toISODate(visitDate);

  // Baca kuota (NULL = unlimited).
  const { data: quotaRow } = await withTimeout(
    db.from('daily_quotas').select('quota').eq('visit_date', day).maybeSingle(),
    1500,
  ).catch(() => ({ data: null, error: null }));
  const quota = quotaRow?.quota ?? null;

  if (quota != null && Number(quota) <= 0) {
    return { ok: false, quota, used: 0, reason: 'Kuota ditutup' };
  }

  // Pemanggilan RPC = satu transaksi atomik di PostgreSQL (fungsi
  // reserve_daily_slot di supabase-schema.sql). Data kosong ==> kuota penuh.
  const { data, error } = await withTimeout(
    db.rpc('reserve_daily_slot', { _date: day, _qty: Number(qty), _quota: quota }),
    1500,
  ).catch(() => ({ data: null, error: { message: 'timeout' } }));

  if (error) {
    if (/unique|syntax/.test(error.message)) {
      return { ok: true, quota, used: null };
    }
    return { ok: false, quota, used: null, reason: 'Gagal menghitung kuota' };
  }
  if (!Array.isArray(data) || data.length === 0) {
    return { ok: false, quota, used: null, reason: 'Kuota tidak mencukupi' };
  }
  return { ok: true, quota, used: Number(data[0].used) };
}

export function logActivity(db, { actor_nik, actor_name, action, booking_code, meta }) {
  return withTimeout(
    db.from('activity_log').insert({
      actor_nik,
      actor_name: actor_name ?? null,
      action,
      booking_code: booking_code ?? null,
      meta: meta ?? null,
    }),
    1500,
  ).catch(() => null);
}