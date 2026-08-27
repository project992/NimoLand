import { handler, json } from '../../../lib/http.js';
import { requireSupabase, withTimeout } from '../../../lib/supabase.js';

export const prerender = false;

/* Riwayat pesanan pelanggan yang login (tiket + kamar). Customer-gated. */
export const GET = handler(async ({ locals }) => {
  const db = requireSupabase();
  const uid = locals.user.id;

  const [tickets, rooms] = await Promise.all([
    withTimeout(
      db.from('tickets')
        .select('id, booking_code, ticket_type, quantity, total_price, visit_date, expiry_date, status, paid_at, payment_method, promo_code, promo_bonus_qty, promo_note')
        .eq('customer_id', uid).order('created_at', { ascending: false }).limit(100),
      2000,
    ).catch(() => ({ data: [] })),
    withTimeout(
      db.from('room_bookings')
        .select('id, booking_code, hotel_name, room_name, check_in, check_out, nights, rooms, guests, total_price, status')
        .eq('customer_id', uid).order('created_at', { ascending: false }).limit(100),
      2000,
    ).catch(() => ({ data: [] })),
  ]);

  return json({ tickets: tickets.data ?? [], rooms: rooms.data ?? [] });
});