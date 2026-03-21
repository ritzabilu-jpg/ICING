import { createClient } from '@supabase/supabase-js';

// Fallback prevents build-time crash when env vars are not yet injected
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Client-side Supabase client (uses anon key, respects RLS)
// Safe to use in Client Components and browser code
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client (uses service role key, bypasses RLS)
// ONLY use in API Routes and Server Components — NEVER import in client components
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error('Supabase env vars are not configured');
  }
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
