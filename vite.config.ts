import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
  import { devtools } from '@tanstack/devtools-vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [devtools(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
