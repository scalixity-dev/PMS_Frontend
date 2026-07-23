import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    devtools({ removeDevtoolsOnBuild: true }),
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Wildcard so any localtunnel/ngrok subdomain works without editing this
    // each time a new tunnel session gets a new random hostname (local DocuSign
    // embedded-signing testing only).
    allowedHosts: ['.loca.lt', '.ngrok-free.app', '.ngrok-free.dev'],
    hmr: {
      // When accessed through an HTTPS tunnel, the HMR client must reconnect
      // over 443 (the tunnel's public port), not the dev server's actual 5173.
      clientPort: 443,
    },
  },
  build: {
    // Warn earlier so large chunks don't silently regress.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Isolate heavy/rarely-changing libs into their own chunks so they're
        // cached separately and only loaded by the routes that need them.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          recharts: ['recharts'],
          'country-state-city': ['country-state-city'],
          tiptap: ['@tiptap/core', '@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-placeholder'],
          xlsx: ['xlsx'],
          stripe: ['@stripe/react-stripe-js', '@stripe/stripe-js'],
          'emoji-picker': ['emoji-picker-react'],
          dndkit: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        },
      },
    },
  },
})
