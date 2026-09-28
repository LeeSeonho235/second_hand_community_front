import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 백엔드 CORS 허용 Origin이 http://localhost:3000 이므로 포트를 고정합니다.
    port: 3000,
    strictPort: true,
    // 배포(vercel.json)와 같은 방식으로 /api 요청을 백엔드로 넘깁니다. 쿠키가 같은 사이트 쿠키가 됩니다.
    proxy: {
      '/api': { target: 'https://two026-java.onrender.com', changeOrigin: true },
    },
  },
})
