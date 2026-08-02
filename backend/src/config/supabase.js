const { createClient } = require('@supabase/supabase-js');

/**
 * Service-role Supabase client — used server-side only.
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the frontend.
 */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

module.exports = supabase;
