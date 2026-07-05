import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Ant Design
            if (id.includes('antd') || id.includes('@ant-design') || id.includes('rc-')) {
              return 'antd-vendor';
            }
            // Calendar
            if (id.includes('@fullcalendar')) {
              return 'calendar-vendor';
            }
            // Basic React chunks
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Swagger
            if (id.includes('swagger-ui-react')) {
              return 'swagger-vendor';
            }
            // all others
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: false,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.headers.host) {
              proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
            }
          });
        }
      },
      '/oauth2': {
        target: 'http://localhost:8080',
        changeOrigin: false,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.headers.host) {
              proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
            }
          });
        }
      },
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: false,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.headers.host) {
              proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
            }
          });
        }
      },
    },
  },
})