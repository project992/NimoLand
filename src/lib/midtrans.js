/* node:crypto dipakai untuk verifikasi signature webhook (server only). */
import { createHash, timingSafeEqual } from 'node:crypto';

/* Midtrans Snap / Core — server-only client.

   Keamanan kunci:
   - MIDTRANS_SERVER_KEY  -> server only, dipakai di sini, TIDAK pernah dibundle
     ke frontend. Bila kedapatan di paket klien berarti salah impor.
   - MIDTRANS_CLIENT_KEY  -> sengaja publik (Midtrans memang butuh ini di browser
     untuk membuka Snap). Tetap ditaruh di environment, disisipkan ke HTML lewat
     respons API, jangan hardcode di script.
   - Tidak ada import di sini dari src/scripts/* atau komponen yang dikirim
     ke browser, jadi kunci server tidak akan bocor.

   Mode: MIDTRANS_IS_PRODUCTION=1 memakai https://app.midtrans.com,
   selain itu sandbox https://app.sandbox.midtrans.com. */

const serverKey = import.meta.env?.MIDTRANS_SERVER_KEY || process.env.MIDTRANS_SERVER_KEY || '';
const clientKey = import.meta.env?.MIDTRANS_CLIENT_KEY || process.env.MIDTRANS_CLIENT_KEY || '';
const isProd = (import.meta.env?.MIDTRANS_IS_PRODUCTION || process.env.MIDTRANS_IS_PRODUCTION) === '1';

const API_BASE = isProd ? 'https://app.midtrans.com' : 'https://app.sandbox.midtrans.com';

/** True when the payment gateway is configured to create real transactions. */
export const midtransReady = Boolean(serverKey && clientKey);

/** Public key the browser needs to open Snap. Safe to expose. */
export function publicClientKey() {
  return clientKey;
}

/** The mode label used in the payment UI and logs. */
export function midtransEnv() {
  return isProd ? 'production' : 'sandbox';
}

/** Origin tempat Snap.js dimuat (untuk disisipkan ke respons API/skrip). */
export function snapBase() {
  return API_BASE;
}

/**
 * Create a Snap transaction. Returns the Snap token + redirect URL.
 * @param {{order_id:string, gross_amount:number, first_name:string, email:string,
 *          item_details?:Array, customer_details?:Object}} p
 */
export async function createSnapTransaction(p) {
  if (!midtransReady) {
    throw new Error('Payment gateway belum dikonfigurasi (MIDTRANS_SERVER_KEY/CLIENT_KEY).');
  }
  const auth = 'Basic ' + Buffer.from(serverKey + ':').toString('base64');
  const res = await fetch(`${API_BASE}/snap/v1/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: auth,
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: p.order_id,
        gross_amount: Math.round(p.gross_amount),
      },
      item_details: p.item_details ?? [{ id: 'ticket', price: Math.round(p.gross_amount), quantity: 1, name: 'Tiket Nimo Land Group' }],
      customer_details: {
        first_name: p.first_name,
        email: p.email,
      },
      expiry: { start_time: new Date().toISOString(), unit: 'minutes', duration: 60 },
    }),
  });

  if (!res.ok) {
    let detail = '';
    try { detail = await res.text(); } catch { /* ignore */ }
    throw new Error(`Midtrans ${res.status}: ${detail.slice(0, 300)}`);
  }
  return await res.json(); // { token, redirect_url }
}

/**
 * Verify the signature of a Core webhook notification.
 * Signature = SHA512(serverKey + orderId + statusCode + grossAmount).
 * @param {{order_id:string, status_code:string, gross_amount:string|number, signature_key:string}} n
 * @returns {boolean}
 */
export function verifyNotificationSignature(n) {
  if (!n.signature_key || !n.order_id || n.status_code == null || n.gross_amount == null) return false;
  const wanted = createHash('sha512')
    .update(`${serverKey}${n.order_id}${n.status_code}${String(n.gross_amount)}`)
    .digest('hex');
  const given = Buffer.from(String(n.signature_key));
  const expected = Buffer.from(wanted, 'utf8');
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Map Midtrans transaction status -> our payment status. */
export function interpretStatus(transactionStatus) {
  switch (transactionStatus) {
    case 'capture':
    case 'settlement': return 'PAID';
    case 'deny': return 'FAILED';
    case 'cancel': return 'CANCELED';
    case 'expire': return 'EXPIRED';
    case 'pending': return 'PENDING';
    default: return 'PENDING';
  }
}