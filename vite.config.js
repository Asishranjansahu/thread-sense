import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "ThreadSense",
        short_name: "ThreadSense",
        theme_color: "#000000",
        icons: [
          {
            src: "pwa-192.png",
            sizes: "192x192",
            type: "image/png"
          }
        ]
      }
    })
  ],
  server: {
    host: true
  }
});