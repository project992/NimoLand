/* Official ratings + review counts per destination.

   Source of truth is the `destination_ratings` view in Supabase (see
   supabase-schema.sql), which aggregates the `reviews` table. Read-only here:
   nothing in the app writes reviews yet.

   If Supabase is unreachable or unconfigured, this returns {} and every rating
   badge simply doesn't render — a missing rating must never be faked, and a
   database blip must never take down the homepage. */
import { supabase, withTimeout } from './supabase.js';

const CACHE_MS = 5 * 60 * 1000;
const DB_TIMEOUT_MS = 1500;
let cache = { at: 0, data: null };

/**
 * @returns {Promise<Record<string, {rating: number, count: number, source: string|null}>>}
 *          keyed by destination id, e.g. { 'nimo-highland': {...} }
 */
export async function getRatings() {
  if (cache.data && Date.now() - cache.at < CACHE_MS) return cache.data;

  if (!supabase) return {};

  let result;
  try {
    result = await withTimeout(
      supabase.from('destination_ratings').select('destination_id, rating, review_count, source'),
      DB_TIMEOUT_MS,
    );
  } catch (err) {
    console.error('[ratings] load failed (timeout or network):', err.message);
    // Negative cache: don't hammer an unreachable database on every pageview.
    cache = { at: Date.now(), data: cache.data ?? {} };
    return cache.data;
  }

  const { data, error } = result;

  if (error) {
    console.error('[ratings] load failed:', error.message);
    // Serve a stale cache rather than dropping the badges entirely.
    return cache.data ?? {};
  }

  const byId = {};
  for (const row of data ?? []) {
    if (row.rating == null || row.review_count == null) continue;
    byId[row.destination_id] = {
      rating: Number(row.rating),
      count: Number(row.review_count),
      source: row.source ?? null,
    };
  }

  cache = { at: Date.now(), data: byId };
  return byId;
}

/** Indonesian thousands separator: 12431 -> "12.431" */
export function formatCount(n) {
  return Number(n).toLocaleString('id-ID');
}

/** One decimal place, comma separator: 4.6 -> "4,6" */
export function formatRating(n) {
  return Number(n).toFixed(1).replace('.', ',');
}
