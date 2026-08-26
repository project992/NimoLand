/* Server-only Supabase client.

   This uses the SERVICE ROLE key and must never be imported into anything that
   ships to the browser. Every table it touches (customers, employees, tickets)
   now has RLS with no public policy, so the anon key can no longer read
   password hashes or the customer list the way the old client-side code did.

   Astro only bundles this into the server build because it is imported solely
   from `src/pages/api/**` and `src/middleware.js`. */
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env?.SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = import.meta.env?.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when the server is configured to talk to Supabase at all. */
export const supabaseReady = Boolean(url && serviceKey);

export const supabase = supabaseReady
  ? createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

/** Throws a clear error instead of a null-deref deep inside a handler. */
export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env — see .env.example.',
    );
  }
  return supabase;
}

/**
 * Hard timeout for a promise. Everything the public SSR pages await is bounded
 * by this so a slow or unreachable database can never hold the homepage's
 * first byte hostage (this happened in the field: an unresponsive Supabase
 * added ~15 s of TTFB). On timeout the caller just degrades to its fallback.
 *
 * @template T
 * @param {Promise<T>} promise
 * @param {number} [ms]
 * @returns {Promise<T>}
 */
export async function withTimeout(promise, ms = 2000) {
  let timer;
  const guard = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`db timeout after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([promise, guard]);
  } finally {
    clearTimeout(timer);
  }
}
