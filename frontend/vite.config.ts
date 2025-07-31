import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Vite 기준 프록시 설정
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8000', // 백엔드 서버 주소로 변경
        changeOrigin: true,
        secure: false,
      },
      '/reviews': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/bookmarks': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
