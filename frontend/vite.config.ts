import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Bind to all interfaces (not just localhost) so the dev server is
    // reachable from other devices on the LAN, e.g. an iPad at the Mac's IP.
    host: true,
  },
})
