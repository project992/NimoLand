import { handler, json, readJson, HttpError } from '../../../lib/http.js';
import { requireSupabase, withTimeout } from '../../../lib/supabase.js';
import { logActivity } from '../../../lib/payments.js';

export const prerender = false;

/* Menandai tiket TERPAKAI di gerbang. Employee-gated oleh middleware.

   FASE 3 — aturan di server (bukan hanya di UI):
   - anti-reuse : update kondisional pada status = LUNAS; scan kedua tak menemukan
                  baris -> ditolak 409.
   - expiry     : tiket yang lewat expiry_date otomatis jadi EXPIRED (diperiksa di
                  sini, jadi bukan cuma tampilan). Scan tiket EXPIRED -> 410.
   - log        : tiap verifikasi dicatat di activity_log (siapa, tiket apa, kapan). */
export const POST = handler(async ({ request, locals }) => {
  const body = await readJson(request);
  const code = typeof body.booking_code === 'string' ? body.booking_code.trim() : '';
  if (!code || code.length > 40) throw new HttpError(400, 'Kode booking tidak valid.');

  const db = requireSupabase();
  const today = startOfToday().toISOString().slice(0, 10);

  // Baca tiket dulu untuk tahu sangat menentukan tanggapan (belum dipakai? lewat masa?).
  const { data: before } = await withTimeout(
    db.from('tickets').select('booking_code, customer_name, status, expiry_date')
      .eq('booking_code', code).maybeSingle(),
    1500,
  ).catch(() => ({ data: null }));

  const actor = { actor_nik: locals.user.nik, actor_name: locals.user.name };

  if (before && String(before.expiry_date) < today && before.status === 'LUNAS') {
    // Lewat masa berlaku -> otomatis EXPIRED (persist).
    await withTimeout(
      db.from('tickets').update({ status: 'EXPIRED' })
        .eq('booking_code', code).eq('status', 'LUNAS'),
      1500,
    ).catch(() => null);
    await logActivity(db, { ...actor, action: 'VERIFY_EXPIRED', booking_code: code });
    throw new HttpError(410, 'Tiket sudah melewati masa berlaku (EXPIRED).');
  }

  if (before && before.status !== 'LUNAS') {
    await logActivity(db, { ...actor, action: 'VERIFY_REUSE', booking_code: code, meta: { status: before.status } });
    throw new HttpError(409, 'Tiket tidak dapat dipakai ulang.');
  }

  // Conditional on status = LUNAS so scanning the same ticket twice cannot
  // silently re-verify it — the second scan matches no rows and reports back.
  const { data, error } = await withTimeout(
    db.from('tickets')
      .update({
        status: 'TERPAKAI',
        verified_at: new Date().toISOString(),
        verified_by: locals.user.nik,
      })
      .eq('booking_code', code)
      .eq('status', 'LUNAS')
      .select('booking_code, customer_name, status'),
    1500,
  ).catch(() => ({ data: null, error: { message: 'timeout' } }));

  if (error) {
    console.error('[ess-verify] update failed:', error.message);
    throw new HttpError(500, 'Gagal memperbarui status tiket.');
  }
  if (!data || data.length === 0) {
    await logActivity(db, { ...actor, action: 'VERIFY_REUSE', booking_code: code });
    throw new HttpError(409, 'Tiket tidak ditemukan atau sudah terpakai/kedaluwarsa.');
  }

  await logActivity(db, { ...actor, action: 'VERIFY_OK', booking_code: code });
  return json({ ticket: data[0] });
});

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}