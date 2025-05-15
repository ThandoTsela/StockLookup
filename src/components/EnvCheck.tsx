import { useEffect } from 'react';

export const EnvCheck = () => {
  useEffect(() => {
    console.log('Environment Variables Check:', {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'Present' : 'Missing',
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
      VITE_ALPHA_VANTAGE_API_KEY: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY ? 'Present' : 'Missing',
    });
  }, []);

  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center">
        ⚠️ Environment variables are missing. Please check the console for details.
      </div>
    );
  }

  return null;
};
