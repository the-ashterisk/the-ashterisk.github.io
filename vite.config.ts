/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { toolkitPages, TOOLKIT_CLIENT_ENTRY } from './build/toolkitPages.ts'

const page = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  base: '/',
  plugins: [react(), toolkitPages()],
  build: {
    rollupOptions: {
      // Multi-page: each legal page is a real HTML file so /privacy/ and
      // /terms/ work on GitHub Pages without a SPA 404 redirect hack.
      input: {
        main: page('./index.html'),
        privacy: page('./privacy/index.html'),
        terms: page('./terms/index.html'),
        // JS/CSS for the prerendered /toolkit pages; the toolkitPages plugin emits their HTML.
        toolkit: page(`./${TOOLKIT_CLIENT_ENTRY}`),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
})
