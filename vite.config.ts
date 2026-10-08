import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    rolldownOptions: {
      onwarn(warning, warn) {
        // Suppress eval warning from page-controller library
        if (warning.code === 'EVAL') return
        // Suppress chunk size warning
        if (warning.message?.includes('Some chunks are larger than 500 kB')) return
        warn(warning)
      },
    },
  },
})
