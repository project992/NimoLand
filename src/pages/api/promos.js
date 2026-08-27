import { handler, json } from '../../lib/http.js';
import { requireSupabase } from '../../lib/supabase.js';
import { listActivePromos } from '../../lib/promo.js';

export const prerender = false;

/* Public read of currently-active promos, shown on the checkout page.
   Because it's public, it exposes only the fields a visitor needs — never
   anything sensitive. */
export const GET = handler(async () => {
  const db = requireSupabase();
  const promos = await listActivePromos(db);
  const slim = promos.map(p => ({
    code: p.code,
    title: p.title,
    description: p.description,
    promo_type: p.promo_type,
    buy_qty: p.buy_qty,
    free_qty: p.free_qty,
    sticky: p.sticky,
    target_package: p.target_package,
  }));
  return json({ promos: slim });
});
