import { handler, json } from '../../../lib/http.js';
import { requireSupabase, withTimeout } from '../../../lib/supabase.js';
import { verifyNotificationSignature, interpretStatus } from '../../../lib/midtrans.js';
import { logActivity } from '../../../lib/payments.js';
import { sendEticketEmail } from '../../../lib/mailer.js';

export const prerender = false;

/* Webhook notifikasi status pembayaran Midtrans (Core API).

   DIPANGGIL OLEH MIDTRANS, bukan browser — endpoint ini TIDAK butuh cookie
   sesi. Keamanan:
   - signature_key Midtrans diverifikasi (SHA512 server key + order+status+amount).
   - order_id harus ketemu di tabel payments, kalau tidak -> tolak.
   - idempoten: pembayaran yang sudah PAID diabaikan (200) supaya retry dari
     Midtrans tidak memproses ulang.
   - Selalu balas 200 setelah diproses supaya Midtrans tidak mengulang tanpa batas.

   FASE 3: status berubah -> PULA ticket:
     settlement/capture -> PENDING->LUNAS + kirim e-tiket ke email pemesan
     deny/cancel/expire  -> ticket dibatalkan (CANCELED) */
export const POST = handler(async ({ request }) => {
  const db = requireSupabase();

  const raw = await request.text();
  let n = {};
  try { n = JSON.parse(raw || '{}'); } catch { /* treat as invalid below */ }

  const orderId = String(n.order_id ?? '').trim();
  const transactionStatus = String(n.transaction_status ?? '').trim();

  if (!orderId || !verifyNotificationSignature(n)) {
    console.warn('[payments-notification] signature/order invalid:', orderId);
    return json({ status: 'ignored', reason: 'invalid signature' }, 200);
  }

  // Cari pembayaran terkait.
  const { data: pay, error: payErr } = await withTimeout(
    db.from('payments').select('*').eq('order_id', orderId).maybeSingle(),
    1500,
  ).catch(() => ({ data: null, error: { message: 'timeout' } }));

  if (payErr || !pay) {
    // Order asing/tidak dikenal — jangan balas error, cegah retry loop.
    console.warn('[payments-notification] order tidak dikenal:', orderId);
    return json({ status: 'ok' }, 200);
  }

  // Idempoten: abaikan event setelah berhasil dibayar.
  if (pay.status === 'PAID') return json({ status: 'ok', already: true }, 200);

  const ourStatus = interpretStatus(transactionStatus);
  const now = new Date().toISOString();

  // Rekam status pembayaran + isi webhook utk audit.
  await withTimeout(
    db.from('payments').update({
      status: ourStatus,
      midtrans_status: transactionStatus,
      midtrans_transaction_id: String(n.transaction_id ?? ''),
      method: String(n.payment_type ?? ''),
      raw_fields: n,
      paid_at: ourStatus === 'PAID' ? now : null,
    }).eq('id', pay.id),
    1500,
  ).catch(() => null);

  // Update ticket yang terpaut.
  if (ourStatus === 'PAID') {
    await withTimeout(
      db.from('tickets')
        .update({ status: 'LUNAS', paid_at: now, payment_method: 'midtrans' })
        .eq('booking_code', pay.booking_code)
        .eq('status', 'PENDING'),
      1500,
    ).catch(() => null);

    // Kirim e-tiket otomatis (best-effort; gagal tidak menggagalkan pesanan).
    const { data: booking } = await withTimeout(
      db.from('tickets').select('*').eq('booking_code', pay.booking_code).maybeSingle(),
      1500,
    ).catch(() => ({ data: null }));
    if (booking) {
      const sent = await sendEticketEmail({ booking, email: booking.customer_email });
      console.log('[payments-notification] paid:', pay.order_id, 'email:', sent.skipped ? 'skipped' : 'sent');
    }

    await logActivity(db, { actor_nik: 'system', action: 'PAYMENT', booking_code: pay.booking_code, meta: { order_id: orderId, status: 'PAID' } });
  } else if (['CANCELED', 'EXPIRED', 'FAILED'].includes(ourStatus)) {
    await withTimeout(
      db.from('tickets')
        .update({ status: 'CANCELED' })
        .eq('booking_code', pay.booking_code)
        .eq('status', 'PENDING'),
      1500,
    ).catch(() => null);
    await logActivity(db, { actor_nik: 'system', action: `PAYMENT_${ourStatus}`, booking_code: pay.booking_code, meta: { order_id: orderId } });
  }

  return json({ status: 'ok' }, 200);
});