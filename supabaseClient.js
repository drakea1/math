import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://broulmbvphzixjfctasr.supabase.co';
const supabaseAnonKey = 'sb_publishable_0FclZB1UZrAa3tByQezN9Q_bzdgUZIb';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});