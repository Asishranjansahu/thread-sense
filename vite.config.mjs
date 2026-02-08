import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Base path for GitHub Pages
  base: '/thread-sense/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ThreadSense',
        short_name: 'ThreadSense',
        start_url: './',
        display: 'standalone',
        background_color: '#030303',
        theme_color: '#00f3ff',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    strictPort: true,
    host: true
  }
})
