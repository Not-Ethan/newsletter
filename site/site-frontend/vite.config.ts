import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 5173,      // Ensure the port matches your Docker mapping
    strictPort: true, // Fail if the port is already in use
    proxy: {
      "/api/": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false
      }
    }

  }
});
