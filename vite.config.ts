import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PWA (manifest + service worker) se añade en la Fase 5.
export default defineConfig({
  plugins: [react()],
})
