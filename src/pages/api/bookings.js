import { handler, json, readJson, HttpError } from '../../lib/http.js';
import { requireSupabase } from '../../lib/supabase.js';
import { randomInt } from 'node:crypto';
import {
  PACKAGES, RULES, allRooms, parseISODate, addDays, toISODate, priceTicket,
} from '../../lib/data.js';

export const prerender = false;

/* Creates a booking for the signed-in customer.

   Middleware has already rejected anonymous callers (PROTECTED_API), so
   `locals.user` is guaranteed here.

   Every price and date is recomputed from src/lib/data.js. The client sends
   what the visitor *chose*, never what it *costs* — a posted total would let
   anyone buy a Rp 285.000 ticket for Rp 1. */
export const POST = handler(async ({ request, locals }) => {
  const body = await readJson(request);
  const db = requireSupabase();

  const record = body.kind === 'room'
    ? buildRoomBooking(body, locals.user)
    : buildTicketBooking(body, locals.user);

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

/** Earliest permitted arrival: local midnight tomorrow. */
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

function buildTicketBooking(body, user) {
  const packageId = String(body.packageId ?? '');
  if (!PACKAGES.some(p => p.id === packageId)) throw new HttpError(400, 'Paket tiket tidak dikenal.');

  const nationality = body.nationality === 'manca' ? 'manca' : 'domestik';
  const adult = intInRange(body.adult, 1, RULES.MAX_TICKETS, 'Jumlah tiket dewasa');
  const child = intInRange(body.child ?? 0, 0, RULES.MAX_TICKETS, 'Jumlah tiket anak');

  const arrival = parseISODate(body.arrival);
  if (!arrival) throw new HttpError(400, 'Tanggal kedatangan tidak valid.');
  if (arrival < earliestArrival()) {
    throw new HttpError(400, 'Tanggal kedatangan minimal H-1 dari hari ini.');
  }

  const { total, expiry } = priceTicket({ packageId, nationality, adult, child, arrival });
  const pkg = PACKAGES.find(p => p.id === packageId);
  const label = `${pkg.name} · ${nationality === 'manca' ? 'Mancanegara' : 'Domestik'}`;

  return {
    table: 'tickets',
    row: {
      booking_code: bookingCode('NIMO'),
      customer_id: user.id,
      customer_name: user.name,
      ticket_type: label,
      quantity: adult + child,
      total_price: total,
      visit_date: toISODate(arrival),
      expiry_date: toISODate(expiry),
      status: 'LUNAS',
    },
  };
}

function buildRoomBooking(body, user) {
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
      booking_code: bookingCode('NH-R'),
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

/* Cryptographically random, not Math.random(): a guessable booking code is a
   guessable ticket, and the code is the only thing shown at the gate. */
function bookingCode(prefix) {
  return `${prefix}-${randomInt(10_000_000, 100_000_000)}`;
}
