import { handler, json, HttpError } from '../../../../lib/http.js';
import { requireSupabase, withTimeout } from '../../../../lib/supabase.js';
import { publicClientKey, snapBase } from '../../../../lib/midtrans.js';

export const prerender = false;

/* Cek status pembayaran untuk order milik pelanggan yang login.

   Digunakan klien untuk memutuskan kapan e-tiket bisa ditampilkan setelah
   menutup Snap (polling). Hanya order milik user ini yang bisa dibaca. */
export const GET = handler(async ({ params, locals }) => {
  if (!locals.user?.kind === 'customer') throw new HttpError(401, 'Silakan masuk terlebih dahulu.');

  const orderId = String(params.orderId ?? '');
  if (!orderId || orderId.length > 64) throw new HttpError(400, 'Order tidak valid.');

  const db = requireSupabase();

  const { data: pay } = await withTimeout(
    db.from('payments').select('order_id, booking_code, amount, status, midtrans_status, method, paid_at')
      .eq('order_id', orderId).maybeSingle(),
    1500,
  ).catch(() => ({ data: null }));
  if (!pay) throw new HttpError(404, 'Pembayaran tidak ditemukan.');

  // Jangan bocorkan status order orang lain: cek kepemilikan lewat tiket.
  const { data: ticket } = await withTimeout(
    db.from('tickets').select('booking_code, ticket_type, customer_name, quantity, total_price, visit_date, expiry_date, status, customer_id')
      .eq('booking_code', pay.booking_code).eq('customer_id', locals.user.id).maybeSingle(),
    1500,
  ).catch(() => ({ data: null }));
  if (!ticket) throw new HttpError(404, 'Pembayaran tidak ditemukan.');

  return json({ payment: pay, ticket, client_key: publicClientKey(), snap_base: snapBase() });
});