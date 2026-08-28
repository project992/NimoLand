import { handler, json } from '../../../lib/http.js';
import { requireSupabase, withTimeout } from '../../../lib/supabase.js';

export const prerender = false;

/* Riwayat pesanan kamar pelanggan yang login. Customer-gated. */
export const GET = handler(async ({ locals }) => {
  const db = requireSupabase();
  const uid = locals.user.id;

  const rooms = await withTimeout(
    db.from('room_bookings')
      .select('id, booking_code, hotel_name, room_name, check_in, check_out, nights, rooms, guests, total_price, status')
      .eq('customer_id', uid).order('created_at', { ascending: false }).limit(100),
    2000,
  ).catch(() => ({ data: [] }));

  return json({ rooms: rooms.data ?? [] });
});
