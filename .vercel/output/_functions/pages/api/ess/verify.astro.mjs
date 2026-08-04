import { h as handler, r as readJson, H as HttpError, j as json } from '../../../chunks/http_BFk9SMn6.mjs';
import { r as requireSupabase } from '../../../chunks/supabase_BiwT-ogX.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;

/* Mark a ticket as used at the gate. Employee-gated by middleware. */
const POST = handler(async ({ request, locals }) => {
  const body = await readJson(request);
  const code = typeof body.booking_code === 'string' ? body.booking_code.trim() : '';
  if (!code || code.length > 40) throw new HttpError(400, 'Kode booking tidak valid.');

  const db = requireSupabase();

  // Conditional on status = LUNAS so scanning the same ticket twice cannot
  // silently re-verify it — the second scan matches no rows and reports back.
  const { data, error } = await db
    .from('tickets')
    .update({
      status: 'TERPAKAI',
      verified_at: new Date().toISOString(),
      verified_by: locals.user.nik,
    })
    .eq('booking_code', code)
    .eq('status', 'LUNAS')
    .select('booking_code, customer_name, status');

  if (error) {
    console.error('[ess-verify] update failed:', error.message);
    throw new HttpError(500, 'Gagal memperbarui status tiket.');
  }
  if (!data || data.length === 0) {
    throw new HttpError(409, 'Tiket tidak ditemukan atau sudah terpakai/kedaluwarsa.');
  }

  return json({ ticket: data[0] });
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
