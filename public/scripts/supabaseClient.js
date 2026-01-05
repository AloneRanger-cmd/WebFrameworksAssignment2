import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
  throw new Error("Supabase env vars missing");
}

export const supabase = createClient(
  window.PUBLIC_SUPABASE_URL,
  window.PUBLIC_SUPABASE_ANON_KEY
);
