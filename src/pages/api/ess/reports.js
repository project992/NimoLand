import { handler, json, HttpError } from '../../../lib/http.js';
import { requireSupabase, withTimeout } from '../../../lib/supabase.js';

export const prerender = false;

/* Laporan untuk SUPERVISOR: ringkasan tiket + log aktivitas.
   Middleware sudah memastikan role supervisor. */
export const GET = handler(async () => {
  const db = requireSupabase();

  const [byStatus, slotUse, recent] = await Promise.all([
    withTimeout(
      db.from('tickets').select('status').limit(5000),
      2000,
    ).catch(() => ({ data: [] })),
    withTimeout(
      db.from('daily_slots').select('visit_date, used').order('visit_date', { ascending: true }).limit(60),
      2000,
    ).catch(() => ({ data: [] })),
    withTimeout(
      db.from('activity_log').select('actor_nik, actor_name, action, booking_code, created_at')
        .order('created_at', { ascending: false }).limit(50),
      2000,
    ).catch(() => ({ data: [] })),
  ]);

  const counts = {};
  for (const t of byStatus.data ?? []) counts[t.status] = (counts[t.status] ?? 0) + 1;

  return json({
    counts,
    slot_usage: slotUse.data ?? [],
    activity: recent.data ?? [],
  });
});