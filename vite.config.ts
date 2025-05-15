import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // Explicitly define environment variables
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
    'import.meta.env.VITE_ALPHA_VANTAGE_API_KEY': JSON.stringify(process.env.VITE_ALPHA_VANTAGE_API_KEY),
  },
  base: '/StockLookup/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
