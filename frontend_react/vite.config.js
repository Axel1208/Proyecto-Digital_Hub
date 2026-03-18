import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:3001',
      '/portatil': 'http://localhost:3001',
      '/reportes': 'http://localhost:3001',
      '/ambiente': 'http://localhost:3001',
      '/ficha': 'http://localhost:3001',
      '/asignacion': 'http://localhost:3001'
    }
  }
})
