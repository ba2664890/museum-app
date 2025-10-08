import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // ← écoute toutes les interfaces
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://backend:8000',   // ← service Docker, pas localhost
        changeOrigin: true,
      },
      '/media': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
    },
  },
})