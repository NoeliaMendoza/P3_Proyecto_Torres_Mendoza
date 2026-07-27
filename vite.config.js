import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: { skipWaiting: true, clientsClaim: true },
      manifest: {
        short_name: 'ESPEConnect',
        name: 'ESPEConnect - Plataforma Universitaria',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        start_url: '.',
        display: 'standalone',
        theme_color: '#0f172a',
        background_color: 'white',
      },
    }),
  ],
  css: {
    preprocessorOptions: {},
  },
  optimizeDeps: {
    include: ['@heroui/react'],
  },
});
