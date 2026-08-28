/* Helpers server untuk log aktivitas. Khusus dipakai endpoint/api — TIDAK
   boleh diimport dari kode browser. */

import { withTimeout } from './supabase.js';

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
