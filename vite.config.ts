import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const base = isProduction ? '/ABC_Resturent_Frontend/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['file-saver'],  
    },
  },
});
