import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/** Public content only. Admin authentication will use a separate server-side client. */
export function createPublicContentClient() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
