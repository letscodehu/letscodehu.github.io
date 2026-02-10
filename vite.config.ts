import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // Static asset optimization; app is a static SPA deployed to GitHub Pages
    sourcemap: false,
  },
})
