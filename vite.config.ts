import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
// svg 图标
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    Components({
      dts: false, //关闭自动生成.d.ts文件
      resolvers: [VantResolver({ importStyle: false })] //关闭按需导入样式,已全局导入
    }),
    createSvgIconsPlugin({
      // 指定图标文件夹，绝对路径（NODE代码）
      iconDirs: [path.resolve(process.cwd(), 'src/icons')]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: './',
  server: {
    // open: true,
    hmr: { overlay: false },
    host: '0.0.0.0',
    proxy: {
      '/wechat': {
        target: 'https://uniqueker.top/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wechat/, '')
      }
    }
  }
})
