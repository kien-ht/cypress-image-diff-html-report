import express from 'express'
import path from 'path'
import open from 'open'
import chalk from 'chalk'
import { __dirname } from '../common/utils-cjs.js'
import { getUserConfigFile } from '../common/utils.js'
import router from './router.js'

const app = express()

app.use(express.static(path.join(__dirname(import.meta.url), '../ui')))
app.use(express.json())
app.use(router)

export async function startServer(): Promise<void> {
  const { serverPort, autoOpen } = await getUserConfigFile()

  app.listen(serverPort, async () => {
    const link = `http://127.0.0.1:${serverPort}`
    console.log(
      '[cypress-image-diff-html-report]: 🚀 Server running on',
      chalk.cyan.underline(link)
    )

    if (autoOpen) {
      await open(link)
    }
  })
}
