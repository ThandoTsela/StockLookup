import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'VITE_',
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  base: '/StockLookup/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
