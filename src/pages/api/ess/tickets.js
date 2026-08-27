import { handler, json } from '../../../lib/http.js';
import { requireSupabase } from '../../../lib/supabase.js';

export const prerender = false;

/* Ticket list for the ESS dashboard.

   Employee-gated by middleware (EMPLOYEE_API). Previously the browser read the
   whole `tickets` table with the anon key under a `using (true)` policy, which
   exposed every customer's name and spend to anyone who opened devtools. */
export const GET = handler(async () => {
  const db = requireSupabase();
  const { data, error } = await db
    .from('tickets')
    .select('booking_code, customer_name, ticket_type, quantity, total_price, visit_date, expiry_date, status, created_at, promo_code, promo_bonus_qty, promo_note')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[ess-tickets] load failed:', error.message);
    return json({ error: 'Gagal memuat data tiket.' }, 500);
  }
  return json({ tickets: data ?? [] });
});
