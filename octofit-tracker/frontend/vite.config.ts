import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    'import.meta.env.VITE_CODESPACE_NAME': JSON.stringify(process.env.CODESPACE_NAME),
    'import.meta.env.VITE_API_PORT': JSON.stringify(process.env.API_PORT || '8000')
  }
})
