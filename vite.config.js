import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    // PWA eklentisi bir index.html/istemci paketi üretir; SSR (prerender) derlemesinde atlanır.
    !isSsrBuild && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.svg', 'icons/icon-512.svg'],
      manifest: {
        name: 'HesapNokta - Finans, Sağlık, Matematik ve Zaman Hesaplayıcıları',
        short_name: 'HesapNokta',
        description: 'Kredi, KDV, yüzde, BMI, kalori, yaş ve tarih farkı gibi hesaplamaları anında yapın.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f6f7fb',
        theme_color: '#f9762f',
        lang: 'tr',
        icons: [
          { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
        categories: ['finance', 'health', 'productivity', 'utilities'],
      },
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{js,css,html,svg,png,xml,txt,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: { cacheName: 'hesapnokta-pages', expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 7 } },
          },
          {
            urlPattern: ({ request }) => ['script', 'style', 'image', 'font'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'hesapnokta-assets', expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 } },
          },
        ],
      },
    }),
  ].filter(Boolean),
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
}));
