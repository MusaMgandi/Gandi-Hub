import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Load environment variables based on mode
const env = dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
}).parsed;

export default defineConfig({
  define: {
    'process.env': env
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'training.html'
      }
    }
  }
});
