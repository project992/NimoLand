/* Email — provider-agnostic, env-gated, server-only.

   Implementasi bawaan memakai Resend (REST, tanpa SDK, node 18+ punya fetch).
   Aktif hanya kalau RESEND_API_KEY + RESEND_FROM terisi di environment Vercel.
   Tanpa itu, email dilewati dengan log — pemesanan TETAP sukses, karena e-tiket
   bisa diunduh/kirim WA dari "Pesanan Saya".

   Alternatif SMTP: ganti isi sendEmail() dengan nodemailer lalu set SMTP_*.
   Yang penting: kredensial hanya dari environment, jangan pernah di kode. */

const apiKey = import.meta.env?.RESEND_API_KEY || process.env.RESEND_API_KEY || '';
const from = import.meta.env?.RESEND_FROM || process.env.RESEND_FROM || '';

export const mailReady = Boolean(apiKey && from);

/**
 * @param {{to:string, subject:string, html:string}} m
 * @returns {Promise<{ok:boolean, skipped?:boolean}>}
 */
export async function sendEmail(m) {
  if (!mailReady) {
    console.warn('[mailer] RESEND_API_KEY/RESEND_FROM belum diatur — email dilewati.');
    return { ok: false, skipped: true };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from, to: [m.to], subject: m.subject, html: m.html }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error('[mailer] resend failed:', res.status, t.slice(0, 300));
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error('[mailer] send error:', err.message);
    return { ok: false };
  }
}

const rupiah = n => 'Rp ' + Number(n).toLocaleString('id-ID');

/** E-tiket sederhana untuk dikirim otomatis setelah pembayaran sukses. */
export async function sendEticketEmail({ booking, email }) {
  if (!email) return { ok: false, skipped: true };
  const site = import.meta.env?.SITE_URL || process.env.SITE_URL || '';
  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#222;background:#f5f3ef;margin:0;padding:24px">
  <div style="max-width:520px;margin:auto;background:#fff;border-radius:16px;overflow:hidden">
    <div style="background:#1c2b24;color:#fff;padding:24px">
      <strong style="letter-spacing:2px">NIMO</strong>
      <span style="opacity:.6;font-size:11px;margin-left:8px">Land Group</span>
    </div>
    <div style="padding:24px">
      <h2 style="margin:0 0 4px">Pembayaran Berhasil</h2>
      <p style="color:#666;margin:0 0 20px">Tiket digital Anda siap digunakan. Simpan kode ini — petugas gerbang memindai QR-nya.</p>
      <div style="background:#f5f3ef;border:1px dashed #ccc;border-radius:12px;padding:16px;margin-bottom:20px">
        <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px">Kode Booking</div>
        <div style="font-size:22px;font-weight:bold">${booking.booking_code}</div>
      </div>
      <table style="width:100%;font-size:13px;border-collapse:collapse">
        <tr><td style="padding:6px 0;color:#888">Nama</td><td style="text-align:right">${booking.customer_name}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Tiket</td><td style="text-align:right">${booking.ticket_type}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Kunjungan</td><td style="text-align:right">${booking.visit_date}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Total</td><td style="text-align:right;font-weight:bold">${rupiah(booking.total_price)}</td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:12px;color:#888">
        Masuk ke "Pesanan Saya" di ${site} untuk mengunduh ulang e-tiket atau kirim ke WhatsApp.
      </p>
    </div>
  </div></body></html>`;

  return sendEmail({
    to: email,
    subject: `E-Tiket Nimo Land Group — ${booking.booking_code}`,
    html,
  });
}