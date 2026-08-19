import { handler, json, readJson, HttpError } from '../../../../../lib/http.js';
import { requireSupabase, withTimeout } from '../../../../../lib/supabase.js';
import { parseISODate, addDays, toISODate, RULES } from '../../../../../lib/data.js';
import { reserveDailySlot } from '../../../../../lib/payments.js';

export const prerender = false;

/* Ubah jadwal kunjungan tiket yang masih LUNAS (belum dipakai) milik user ini.
   Syarat: tiket milik user, status LUNAS, tanggal baru valid (H-1+, kuota cukup). */
export const POST = handler(async ({ request, params, locals }) => {
  const body = await readJson(request);
  const code = String(params.code ?? '');
  if (!code || code.length > 40) throw new HttpError(400, 'Kode booking tidak valid.');

  const newArrival = parseISODate(body.arrival);
  if (!newArrival) throw new HttpError(400, 'Tanggal kedatangan baru tidak valid.');

  const earliest = addDays(startOfToday(), RULES.MIN_LEAD_DAYS);
  if (newArrival < earliest) throw new HttpError(400, 'Tanggal kedatangan minimal H-1 dari hari ini.');

  const db = requireSupabase();

  const { data: ticket } = await withTimeout(
    db.from('tickets').select('*').eq('booking_code', code).eq('customer_id', locals.user.id).maybeSingle(),
    1500,
  ).catch(() => ({ data: null }));
  if (!ticket) throw new HttpError(404, 'Tiket tidak ditemukan.');
  if (ticket.status !== 'LUNAS') {
    throw new HttpError(409, 'Hanya tiket LUNAS yang bisa diubah jadwal.');
  }

  // Cek kuota untuk tanggal baru.
  const slot = await reserveDailySlot(db, toISODate(newArrival), ticket.quantity);
  if (!slot.ok) {
    throw new HttpError(409, 'Kuota untuk tanggal tersebut penuh.');
  }

  // Hitung ulang tanggal berlaku dari tanggal baru (berlaku RULES.TICKET_VALID_DAYS).
  const expiry = addDays(newArrival, RULES.TICKET_VALID_DAYS);

  const { data: updated, error } = await withTimeout(
    db.from('tickets')
      .update({ visit_date: toISODate(newArrival), expiry_date: toISODate(expiry) })
      .eq('booking_code', code)
      .select('booking_code, visit_date, expiry_date, status')
      .single(),
    1500,
  ).catch(() => ({ data: null, error: { message: 'timeout' } }));

  if (error || !updated) throw new HttpError(500, 'Gagal mengubah jadwal.');
  return json({ ticket: updated });
});

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}