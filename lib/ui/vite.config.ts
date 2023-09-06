import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import { viteSingleFile } from 'vite-plugin-singlefile'
import { inputJson } from '../config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    // viteSingleFile(),
    {
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          return html.replace(
            /<!-- __INPUT_JSON__ -->/,
            `<script>
              window.__input_json__ = ${JSON.stringify(inputJson)}
            </script>`
          )
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
