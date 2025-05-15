import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment Variables Status:', {
  'VITE_SUPABASE_URL': supabaseUrl ? 'Present' : 'Missing',
  'VITE_SUPABASE_ANON_KEY': supabaseAnonKey ? 'Present' : 'Missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables:', {
    'VITE_SUPABASE_URL': !!supabaseUrl,
    'VITE_SUPABASE_ANON_KEY': !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);