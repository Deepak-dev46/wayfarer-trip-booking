import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'ec2-34-239-245-63.compute-1.amazonaws.com'
    ]
  }
})
