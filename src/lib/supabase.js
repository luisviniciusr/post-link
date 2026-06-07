import { createClient } from '@supabase/supabase-js';

// Vite exposes env vars prefixed with VITE_ to the browser bundle.
// These are the PUBLIC (anon) credentials — safe to ship to the client.
// The service_role key is NEVER used here; it lives only in serverless functions.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Helpful console hint during local dev if .env isn't set up yet.
  console.warn(
    '[postadoria] Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
