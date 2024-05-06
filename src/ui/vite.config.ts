import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { changeCwdToPlayground, getResolvedConfig } from '../common/utils'
import { __dirname } from '../common/utils-cjs'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { RunMode } from '@commonTypes'

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  let serverPort = 0

  if (mode === 'development') {
    changeCwdToPlayground()
    serverPort = (await getResolvedConfig()).serverPort
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
      !process.env.BUILD_MODE && viteSingleFile(),
      {
        name: 'index-html-data-injection',
        transformIndexHtml: {
          order: 'pre',
          async transform(html) {
            const buildMode: RunMode =
              process.env.BUILD_MODE === 'ci' ? 'ci' : 'local'
            return html.replace(
              '<script id="injected-data"></script>',
              `<script>window.__injectedData__=${JSON.stringify({
                mode: buildMode
              })}</script>
              <script id="injected-data"></script>
              `
            )
          }
        }
      }
    ],

    root: __dirname(import.meta.url),

    publicDir: mode === 'development' ? '../../playground' : false,

    build: {
      outDir:
        process.env.BUILD_MODE === 'ci' ? '../../dist/ui-ci' : '../../dist/ui',
      emptyOutDir: true
    },

    server: {
      port: 6867,
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${serverPort}`,
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
