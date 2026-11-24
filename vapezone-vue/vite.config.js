import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      // API маршруты
      '/items':         'http://localhost:3000',
      '/admin':         'http://localhost:3000',
      '/createAppMini': 'http://localhost:3000',

      // ВСЕ картинки из папки image/ проксируем на backend
      // Это работает для ЛЮБОГО пути, начинающегося с /
      // Backend уже настроен отдавать статику из папки image/
      '^/(?!api|@|node_modules|src|public).*\\.(png|jpg|jpeg|gif|svg|webp)$': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
