/* Per-destination promo videos.

   Source of truth is the `destination_videos` table in Supabase (see
   supabase-schema.sql). Only employees write to it via POST /api/ess/videos;
   everyone reads it through this module on the server, so no public policy is
   needed and a DB blip must never take down the homepage.

   If Supabase is unreachable or unconfigured, this returns an empty map and
   every destination card simply falls back to its static image. */
import { supabase, withTimeout } from './supabase.js';

const CACHE_MS = 5 * 60 * 1000;
const DB_TIMEOUT_MS = 1500;
let cache = { at: 0, data: null };

/**
 * @returns {Promise<Record<string, string>>} destination_id -> video_url
 */
export async function getVideos() {
  if (cache.data && Date.now() - cache.at < CACHE_MS) return cache.data;

  if (!supabase) return {};

  let result;
  try {
    result = await withTimeout(
      supabase.from('destination_videos').select('destination_id, video_url'),
      DB_TIMEOUT_MS,
    );
  } catch (err) {
    console.error('[videos] load failed (timeout or network):', err.message);
    // Negative cache: don't hammer an unreachable database on every pageview.
    cache = { at: Date.now(), data: cache.data ?? {} };
    return cache.data;
  }

  const { data, error } = result;

  if (error) {
    console.error('[videos] load failed:', error.message);
    return cache.data ?? {};
  }

  const byId = {};
  for (const row of data ?? []) {
    if (row.video_url) byId[row.destination_id] = row.video_url;
  }

  cache = { at: Date.now(), data: byId };
  return byId;
}