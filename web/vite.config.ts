import crypto from 'node:crypto';
if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = crypto;
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(() => {
  const base = process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS ? '/MasaPhone/' : '/');
  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png', 'favicon.svg', 'apple-touch-icon.png', 'phone_transparent_hd.png', 'masaphone_brand_hd.png'],
        manifest: {
          name: 'MasaPhone - Masaniello Money Management',
          short_name: 'MasaPhone',
          description: 'Gestione del capitale e calcolo progressioni Masaniello e Multi-Masaniello per scommesse e trading.',
          theme_color: '#121212',
          background_color: '#121212',
          display: 'standalone',
          orientation: 'portrait',
          scope: base,
          start_url: base,
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ]
  };
});
