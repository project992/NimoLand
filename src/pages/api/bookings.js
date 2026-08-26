import { handler, json, readJson, HttpError } from '../../lib/http.js';
import { requireSupabase } from '../../lib/supabase.js';
import { randomInt } from 'node:crypto';
import * as rateLimit from '../../lib/rateLimit.js';
import { orderId, reserveDailySlot } from '../../lib/payments.js';
import { createSnapTransaction, publicClientKey, midtransReady, snapBase } from '../../lib/midtrans.js';
import {
  PACKAGES, RULES, allRooms, parseISODate, addDays, toISODate, priceTicket, IS_DEMO_MODE,
} from '../../lib/data.js';

export const prerender = false;

/* Creates a booking for the signed-in customer.

   Middleware has already rejected anonymous callers (PROTECTED_API), so
   `locals.user` is guaranteed here.

   Every price and date is recomputed from src/lib/data.js. The client sends
   what the visitor *chose*, never what it *costs* — a posted total would let
   anyone buy a Rp 285.000 ticket for Rp 1.

   FASE 3:
   - Rate limited (per pengguna + per IP), bukan cuma login.
   - Tiket dibuat PENDING lalu dikunci ke transaksi Midtrans; token Snap
     dikembalikan ke klien. Webhook /api/payments/notification melunaskannya.
   - Kuota harian dicek atomik (reserve_daily_slot).
   - Tanpa gateway pembayaran: fallback langsung LUNAS hanya di MODE DEMO.
*/
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

  const record = body.kind === 'room'
    ? await buildRoomBooking(body, locals.user)
    : await buildTicketBooking(body, locals.user, db);

  const { data, error } = await db
    .from(record.table)
    .insert(record.row)
    .select()
    .single();

  if (error) {
    console.error('[bookings] insert failed:', error.message);
    throw new HttpError(500, 'Pemesanan gagal disimpan. Coba lagi.');
  }

  // Kamar tidak memakai payment gateway: konfirmasi langsung.
  if (record.kind !== 'ticket') return json({ booking: data }, 201);

  // ---- Tiket: siapkan pembayaran ----
  const payment = record.payment;      // { token, redirect_url } saat midtrans
  const response = { booking: data };

  if (record.payment?.midtrans) {
    response.payment = {
      midtrans: true,
      token: payment.token,
      redirect_url: payment.redirect_url,
      client_key: publicClientKey(),
      snap_base: snapBase(),
      order_id: record.row.order_id,
      gross_amount: record.row.total_price,
    };
  }
  return json(response, 201);
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

async function buildTicketBooking(body, user, db) {
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

  const qty = adult + child;

  // ---- Kuota harian (anti-overbooking) ----
  const slot = await reserveDailySlot(db, toISODate(arrival), qty);
  if (!slot.ok) {
    throw new HttpError(
      409,
      slot.reason === 'Kuota ditutup'
        ? 'Kuota untuk tanggal tersebut sedang ditutup.'
        : `Kuota untuk tanggal tersebut sudah penuh${slot.quota != null ? ` (maks ${slot.quota} tiket)` : ''}.`,
    );
  }

  const { total, expiry } = priceTicket({ packageId, nationality, adult, child, arrival });
  const pkg = PACKAGES.find(p => p.id === packageId);
  const label = `${pkg.name} · ${nationality === 'manca' ? 'Mancanegara' : 'Domestik'}`;

  const bookingCode = bookingCode8('NIMO');
  const visitISO = toISODate(arrival);

  // ---- Pembayaran ----
  // Dua mode: Midtrans nyata, atau DEMO (kasih status LUNAS langsung). Di luar
  // demo tanpa gateway, tolak dengan jelas supaya tidak ada "seolah" sukses.
  let order_id = null;
  let payment = null;

  if (midtransReady) {
    order_id = orderId('NIMO');
    const snap = await createSnapTransaction({
      order_id,
      gross_amount: total,
      first_name: user.name,
      email: user.email,
    });
    payment = { midtrans: true, token: snap.token, redirect_url: snap.redirect_url };

    await db.from('payments').insert({
      order_id,
      booking_code: bookingCode,
      amount: total,
      currency: 'IDR',
      status: 'PENDING',
      created_at: new Date().toISOString(),
    }).maybeSingle();
  } else if (IS_DEMO_MODE) {
    // Demo tanpa payment gateway: terbitkan LUNAS seperti perilaku lama.
    await db.from('payments').insert({
      order_id: bookingCode + '-DEMO',
      booking_code: bookingCode,
      amount: total,
      currency: 'IDR',
      status: 'PAID',
      midtrans_status: 'demo',
      created_at: new Date().toISOString(),
    }).maybeSingle();
  } else {
    throw new HttpError(503, 'Payment gateway belum dikonfigurasi. Hubungi administrator.');
  }

  const status = payment?.midtrans ? 'PENDING' : 'LUNAS';

  return {
    kind: 'ticket',
    table: 'tickets',
    row: {
      booking_code: bookingCode,
      customer_id: user.id,
      customer_name: user.name,
      customer_email: user.email,
      ticket_type: label,
      quantity: qty,
      total_price: total,
      visit_date: visitISO,
      expiry_date: toISODate(expiry),
      status,
      order_id,
      payment_method: payment?.midtrans ? 'midtrans' : 'demo',
      paid_at: payment?.midtrans ? null : new Date().toISOString(),
    },
    payment,
  };
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
    kind: 'room',
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

/* Cryptographically random, not Math.random(): a guessable booking code is a
   guessable ticket, and the code is the only thing shown at the gate. */
function bookingCode8(prefix) {
  return `${prefix}-${randomInt(10_000_000, 100_000_000)}`;
}
