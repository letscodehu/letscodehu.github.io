import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
//
// Tailwind is here for one consumer only: the State of AI Dev report under
// src/components/report/, whose styling is entirely utility classes. The rest of
// the site is hand-written CSS. See src/components/report/report.css for how the
// reset is kept from leaking into those pages.
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    // Static asset optimization; app is a static SPA deployed to GitHub Pages
    sourcemap: false,
  },
})
