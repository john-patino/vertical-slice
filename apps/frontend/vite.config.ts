import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// La URL de la API llega por variable de entorno para que el mismo código
// funcione dentro de Docker (http://backend:5000) y fuera (http://localhost:5000).
const apiTarget = process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:5000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Necesario para exponer el dev server desde el contenedor
    port: 5173,
    watch: {
      // Windows + volumen montado: sin polling el hot reload no detecta cambios.
      usePolling: true,
      interval: 300,
    },
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
})
