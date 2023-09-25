import fs from 'fs/promises'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { changeCwdToPlayground } from '../common/utils'
import { __dirname } from '../common/utils-cjs'
import { DEFAULT_CONFIG } from '../common/constants'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(async ({ mode }) => {
  if (mode === 'development') {
    changeCwdToPlayground()
  }

  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue'],
        resolvers: [ElementPlusResolver()],
        dts: './auto-imports.d.ts'
      }),
      Components({
        dirs: './components',
        dts: './components.d.ts',
        resolvers: [ElementPlusResolver()]
      }),
      viteSingleFile(),

      // TODO: Inject __input_json__ for old version of the report in development only, will be removed when new report version comes out
      {
        async transformIndexHtml(html) {
          if (mode === 'development') {
            const json = await fs.readFile('./example.json', {
              encoding: 'utf8'
            })
            return html.replace(
              '<script id="input-json"></script>',
              `<script>window.__input_json__ = ${json}</script>`
            )
          }

          return html
        }
      }
    ],

    root: __dirname(import.meta.url),

    publicDir: mode === 'development' ? '../../playground' : false,
    copyPublicDir: false,

    build: {
      outDir: '../../dist/ui',
      emptyOutDir: true
    },

    server: {
      port: 6869,
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${DEFAULT_CONFIG.serverPort}`,
          changeOrigin: true
        }
      }
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
        '@commonTypes': fileURLToPath(
          new URL('../common/types.ts', import.meta.url)
        )
      }
    }
  }
})
