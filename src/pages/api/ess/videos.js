import { handler, json, readJson, HttpError } from '../../../lib/http.js';
import { requireSupabase } from '../../../lib/supabase.js';

export const prerender = false;

/* Set or clear the promo video for a destination.

   Employee-gated by middleware (EMPLOYEE_API). Anyone who reaches this route is
   already verified as a signed-in employee via the HTTP-only session cookie. An
   empty/whitespace video_url removes the video so the card falls back to its
   static image.

   Only the URL string is stored here; the destination itself still lives in
   src/lib/data.js. This keeps "which video a destination shows" editable by
   staff at runtime without a code deploy. */
export const POST = handler(async ({ request }) => {
  const body = await readJson(request);

  const destinationId = typeof body.destination_id === 'string'
    ? body.destination_id.trim()
    : '';
  if (!destinationId || destinationId.length > 80) {
    throw new HttpError(400, 'Destinasi tidak valid.');
  }

  let videoUrl = typeof body.video_url === 'string' ? body.video_url.trim() : '';
  if (videoUrl.length > 2048) throw new HttpError(413, 'URL video terlalu panjang.');

  const db = requireSupabase();

  if (videoUrl === '') {
    // Remove any existing video.
    const { error } = await db
      .from('destination_videos')
      .delete()
      .eq('destination_id', destinationId);
    if (error) {
      console.error('[ess-videos] delete failed:', error.message);
      throw new HttpError(500, 'Gagal menghapus video.');
    }
    return json({ ok: true, video_url: null });
  }

  // Validate it looks like a video URL (http/https, common media extension).
  if (!/^https?:\/\/.+/i.test(videoUrl) || !/\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(videoUrl)) {
    throw new HttpError(400, 'URL video tidak valid. Gunakan link berakhiran .mp4, .webm, .ogg, .mov, atau .m4v.');
  }

  const { error } = await db.from('destination_videos').upsert(
    { destination_id: destinationId, video_url: videoUrl, updated_at: new Date().toISOString() },
    { onConflict: 'destination_id' },
  );
  if (error) {
    console.error('[ess-videos] upsert failed:', error.message);
    throw new HttpError(500, 'Gagal menyimpan video.');
  }

  return json({ ok: true, video_url: videoUrl });
});