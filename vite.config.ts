import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    // Allow Arena preview hosts like https://{port}-{sandboxId}.e2b.app
    allowedHosts: true,
    hmr: {
      host: '0.0.0.0',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  ssr: {
    external: ['react', 'react-dom', 'react-router-dom', 'react-router', 'react-helmet-async'],
  },
});
