import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Uncomment and set base path when deploying to GitHub Pages
  base: '/teleparty-chat-app/',
})
