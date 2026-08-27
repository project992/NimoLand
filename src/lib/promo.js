/* Promo logic, shared by the booking endpoint and (thinned) by the browser.

   The authoritative store is the `promos` table in Supabase, editable only by
   the ESS admin (Ami) via POST /api/ess/promos. This module provides:

   - listActivePromos(db)          -> fetch currently-applicable promos
   - computePromo(cfg, ctx)        -> decide bonus/discount for one booking
   - applyPromo(cfg, ctx)          -> mutate the row the booking will insert

   Principle (same as pricing): the browser never decides the price or the
   bonus. It sends what the visitor *chose* (package, qty); this module — called
   server-side during booking — computes the authoritative total and free qty.
*/
import { RULES } from './data.js';
import { withTimeout } from './supabase.js';

/** Fetch promos that are currently in effect (active + within date range).
    Sticky promos are returned first so the checkout can highlight them. */
export async function listActivePromos(db) {
  const { data, error } = await withTimeout(
    db.from('promos')
      .select('id, code, title, description, promo_type, buy_qty, free_qty, discount_pct, discount_amount, target_package, sticky, starts_on, ends_on')
      .eq('active', true),
    1500,
  ).catch(() => ({ data: null, error: { message: 'timeout' } }));

  if (error || !data) return [];

  // Filter by date range in JS — supabase's .or() over nullable dates gets
  // ambiguous; comparing ISO strings is exact for DATE columns.
  const today = new Date().toISOString().slice(0, 10);
  const active = data.filter(p => {
    if (p.starts_on && String(p.starts_on).slice(0, 10) > today) return false;
    if (p.ends_on && String(p.ends_on).slice(0, 10) < today) return false;
    return true;
  });

  return active.sort((a, b) => (b.sticky ? 1 : 0) - (a.sticky ? 1 : 0));
}

/** Matches a promo to a specific ticket package. */
export function promoMatches(promo, packageId) {
  if (promo.promo_type === 'percentage' || promo.promo_type === 'flat') return false; // not enabled in UI
  const t = promo.target_package;
  return !t || t === packageId;
}

/**
 * Decide how many free tickets and how much discount a promo grants.
 * @param {object} promo  one row from listActivePromos
 * @param {{packageId:string, adult:number, child:number}} ctx
 * @returns {{bonusQty:number, saleQty:number}}
 */
export function computePromo(promo, ctx) {
  if (!promo || !promoMatches(promo, ctx.packageId)) return { bonusQty: 0, saleQty: 0, applied: false };

  const paid = Math.min(ctx.adult + ctx.child, RULES.MAX_TICKETS);

  if (promo.promo_type === 'buy_n_get_m') {
    const buy = Math.max(1, Number(promo.buy_qty) || 1);
    const each = Math.max(1, Number(promo.free_qty) || 1);
    const sets = Math.floor(paid / buy);
    const bonus = Math.min(sets * each, RULES.MAX_TICKETS - paid);
    return { bonusQty: bonus, saleQty: paid, applied: bonus > 0 };
  }

  return { bonusQty: 0, saleQty: paid, applied: false };
}

/**
 * Add the promo's free qty to a quantities object and return a display note.
 * qtyTotal = jumlah yang terbayar + bonus gratis.
 */
export function applyPromoToBooking(promo, ctx) {
  const { bonusQty, applied } = computePromo(promo, ctx);
  return {
    promoCode: applied ? promo.code : null,
    promoNote: applied ? promoNoteText(promo) : null,
    bonusQty,
    applied,
  };
}

export function promoNoteText(promo) {
  if (promo.promo_type === 'buy_n_get_m') {
    return `${promo.title} — beli ${promo.buy_qty} gratis ${promo.free_qty}`;
  }
  return promo.title;
}
