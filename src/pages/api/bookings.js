import { handler, json, readJson, HttpError } from '../../lib/http.js';
import { requireSupabase } from '../../lib/supabase.js';
import { randomInt } from 'node:crypto';
import * as rateLimit from '../../lib/rateLimit.js';
import { allRooms, parseISODate, addDays, toISODate, RULES } from '../../lib/data.js';

export const prerender = false;

/* Creates a hotel/room booking for the signed-in customer.

   Middleware has already rejected anonymous callers (PROTECTED_API), so
   `locals.user` is guaranteed here.

   Every price is recomputed server-side from the room rate; the client sends
   only what the visitor *chose* (room id, dates, counts), never a posted total.

   - Rate limited (per user + per IP).
   - Rooms are confirmed directly (no payment gateway),
     matching the official day-to-day flow. */
export const POST = handler(async ({ request, locals, clientAddress }) => {
  const body = await readJson(request);

  for (const key of [`booking:user:${locals.user.id}`, `booking:ip:${rateLimit.clientKey(request, clientAddress)}`]) {
    const gate = rateLimit.check(key, 10, 60_000);
    if (!gate.ok) {
      return json({ error: 'Terlalu banyak pemesanan. Coba lagi nanti.' }, 429, {
        'Retry-After': String(gate.retryAfter),
      });
    }
  }

  const db = requireSupabase();
  const record = await buildRoomBooking(body, locals.user);

  const { data, error } = await db
    .from(record.table)
    .insert(record.row)
    .select()
    .single();

  if (error) {
    console.error('[bookings] insert failed:', error.message);
    throw new HttpError(500, 'Pemesanan gagal disimpan. Coba lagi.');
  }

  return json({ booking: data }, 201);
});

/** Earliest permitted check-in: local midnight tomorrow (H-1). */
function earliestArrival() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return addDays(today, RULES.MIN_LEAD_DAYS);
}

function intInRange(value, min, max, label) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new HttpError(400, `${label} harus berupa angka antara ${min} dan ${max}.`);
  }
  return n;
}

async function buildRoomBooking(body, user) {
  const room = allRooms().find(r => r.id === body.roomId);
  if (!room) throw new HttpError(400, 'Tipe kamar tidak dikenal.');

  const checkIn = parseISODate(body.checkIn);
  const checkOut = parseISODate(body.checkOut);
  if (!checkIn || !checkOut) throw new HttpError(400, 'Tanggal menginap tidak valid.');
  if (checkIn < earliestArrival()) throw new HttpError(400, 'Check-in paling cepat besok (H-1).');
  if (checkOut <= checkIn) throw new HttpError(400, 'Check-out harus setelah check-in.');

  const rooms = intInRange(body.rooms, 1, RULES.MAX_ROOMS, 'Jumlah kamar');
  const guests = intInRange(body.guests, 1, RULES.MAX_GUESTS, 'Jumlah tamu');
  if (guests > room.cap * rooms) {
    throw new HttpError(400, `Jumlah tamu melebihi kapasitas ${room.cap * rooms} orang.`);
  }

  const nights = Math.round((checkOut - checkIn) / 86_400_000);
  return {
    table: 'room_bookings',
    row: {
      booking_code: bookingCode8('NH-R'),
      customer_id: user.id,
      customer_name: user.name,
      hotel_id: room.hotelId,
      hotel_name: room.hotelName,
      room_id: room.id,
      room_name: room.name,
      check_in: toISODate(checkIn),
      check_out: toISODate(checkOut),
      nights,
      rooms,
      guests,
      total_price: room.rate * nights * rooms,
      status: 'DIKONFIRMASI',
    },
  };
}

/* Cryptographically random booking code. */
function bookingCode8(prefix) {
  return `${prefix}-${randomInt(10_000_000, 100_000_000)}`;
}
