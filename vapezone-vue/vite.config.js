import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/items':         'http://localhost:3000',
      '/admin':         'http://localhost:3000',
      '/createAppMini': 'http://localhost:3000',
    }
  }
})
