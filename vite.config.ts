import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/beancraft/',
  plugins: [react()],
  server: { proxy: { '/beancraft/api': { target: 'http://localhost:3001', rewrite: (p) => p.replace('/beancraft', '') } } },
})
