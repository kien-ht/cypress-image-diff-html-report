import express from 'express'
import path from 'path'
import { __dirname } from '../common/utils-cjs.js'
import router from './router.js'
import { ResolvedUserConfig } from '../common/types.js'
import chalk from 'chalk'
import open from 'open'
import type { Express } from 'express'

export class App {
  private server: Express

  constructor(private config: ResolvedUserConfig) {
    const server = express()

    server.use(express.static(path.join(__dirname(import.meta.url), '../ui')))
    server.use(express.static(process.cwd()))
    server.use(express.json())
    server.use(router(this.config))

    this.server = server
  }

  listen() {
    return this.server.listen(this.config.serverPort, async () => {
      const link = `http://127.0.0.1:${this.config.serverPort}`
      console.log(
        '[cypress-image-diff-html-report]: 🚀 Server running on',
        chalk.cyan.underline(link)
      )

      if (this.config.autoOpen) {
        await open(link)
      }
    })
  }
}
