// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        chat: resolve(__dirname, 'chat.html'),
        color: resolve(__dirname, 'color.html'),
        stat: resolve(__dirname, 'stat.html')
      }
    }
  }
})