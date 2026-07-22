import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const browserDist = path.resolve('../../packages/decoder-qr-pago-movil/dist/decoder-qr-pago-movil.browser.js')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'decoder-qr-pago-movil': browserDist,
    },
  },
})
