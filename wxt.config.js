import { defineConfig } from 'wxt';
import path from 'path';
import { compression } from 'vite-plugin-compression2';
console.log(path.resolve(__dirname, './src'));

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: '__MSG_extName__',
    permissions: ['contextMenus'],
    action: {},
    icons: {
      "16": "favicon.ico",
      "48": "logo192.png",
      "128": "logo512.png"
    },
    "web_accessible_resources": [
      {
        "resources": ["ext.html"],
        "matches": ['*://*/*']
      }
    ],
    default_locale: 'en',
  },
  vite: () => ({
    esbuild: {
      pure: ['console.log'], // 删除 console.log
      drop: ['debugger'], // 删除 debugger
    },
    plugins: [
      // Gzip 压缩
      compression({
        algorithm: 'gzip',
        exclude: [/\.(br)$/, /\.(gz)$/],
        threshold: 1024,
        deleteOriginFile: false
      }),
      // Brotli 压缩
      compression({
        algorithm: 'brotliCompress',
        exclude: [/\.(br)$/, /\.(gz)$/],
        threshold: 1024,
        deleteOriginFile: false
      })
    ]
  }),
  alias: {
    '@src': path.resolve(__dirname, './src'),
  },
  runner: {
    startUrls: ["https://developer.mozilla.org/en-US/docs/Web/CSS/perspective"],
  },
});