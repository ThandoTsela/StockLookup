import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// More detailed environment variable logging
console.log('Detailed Environment Variables Check:', {
  'VITE_SUPABASE_URL': {
    present: !!supabaseUrl,
    value: supabaseUrl,
    length: supabaseUrl?.length,
    type: typeof supabaseUrl
  },
  'VITE_SUPABASE_ANON_KEY': {
    present: !!supabaseAnonKey,
    // Show first/last 4 chars only for security
    value: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 4)}...${supabaseAnonKey.slice(-4)}` : null,
    length: supabaseAnonKey?.length,
    type: typeof supabaseAnonKey
  }
});

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

if (!isValidUrl(supabaseUrl)) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`);
}

if (supabaseAnonKey.length < 20) {
  throw new Error('Supabase Anon Key appears to be invalid (too short)');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);