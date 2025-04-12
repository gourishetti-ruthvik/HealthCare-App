// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // --- Add this server configuration ---
  server: {
    proxy: {
      // Proxy requests starting with /api to your backend server
      '/api': {
        target: 'http://localhost:5000', // <-- Change this to your backend server address
        changeOrigin: true, // Recommended for virtual hosted sites
        // Optionally rewrite path if your backend doesn't expect '/api' prefix
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    // Optional: Define the port Vite runs on if needed
    // port: 3000,
  },
  // --- End of server configuration ---
})
