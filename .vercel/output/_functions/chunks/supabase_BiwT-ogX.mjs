import { createClient } from '@supabase/supabase-js';

const url = "https://jimqvdpazvsfaqpheopf.supabase.co";
const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbXF2ZHBhenZzZmFxcGhlb3BmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTY4NTczOCwiZXhwIjoyMTAxMjYxNzM4fQ.g7oTu0SzSsRS-T202UrlAZ_ICCOGfqjr-yRBppyWoGw";
const supabaseReady = Boolean(serviceKey);
const supabase = supabaseReady ? createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env — see .env.example."
    );
  }
  return supabase;
}

export { requireSupabase as r, supabase as s };
