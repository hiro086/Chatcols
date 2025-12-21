import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { compression } from 'vite-plugin-compression2'
// 根据需要修改环境变量
// import "./scripts/paid-sk.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'Chatcols',
        short_name: 'Chatcols',
        description: 'Multi-model chat, text-to-image',
        icons: [
          {
            src: 'logo192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      injectRegister: "auto",
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      }
    }),
    // Gzip 压缩
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024, // 只压缩大于 1KB 的文件
      deleteOriginFile: false // 保留原始文件
    }),
    // Brotli 压缩
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024,
      deleteOriginFile: false
    })
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    }
  },
  envPrefix: ['VITE_', 'AIBOX_'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['tdesign-react'],
          'markdown-vendor': ['react-markdown', 'remark-gfm', 'rehype-katex'],
          'syntax-highlighter': ['react-syntax-highlighter'],
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
