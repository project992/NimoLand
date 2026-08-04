import { h as handler, j as json } from '../../../chunks/http_BFk9SMn6.mjs';
import { r as requireSupabase } from '../../../chunks/supabase_BiwT-ogX.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;

/* Ticket list for the ESS dashboard.

   Employee-gated by middleware (EMPLOYEE_API). Previously the browser read the
   whole `tickets` table with the anon key under a `using (true)` policy, which
   exposed every customer's name and spend to anyone who opened devtools. */
const GET = handler(async () => {
  const db = requireSupabase();
  const { data, error } = await db
    .from('tickets')
    .select('booking_code, customer_name, ticket_type, quantity, total_price, visit_date, expiry_date, status, created_at')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[ess-tickets] load failed:', error.message);
    return json({ error: 'Gagal memuat data tiket.' }, 500);
  }
  return json({ tickets: data ?? [] });
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
