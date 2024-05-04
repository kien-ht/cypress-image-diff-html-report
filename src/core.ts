import fs from 'fs-extra'
import path from 'path'
import { GenerateInlineConfig, StartInlineConfig } from './common/types.js'
import {
  getResolvedConfig,
  getReportHtmlAfterPopulatingData,
  getResolvedReportJson
} from './common/utils.js'
import { App } from './local-server/index.js'
import http from 'http'

export async function generate(
  inlineConfig?: GenerateInlineConfig
): Promise<void> {
  const config = await getResolvedConfig(inlineConfig)
  const json = await getResolvedReportJson(config, 'static')
  const html = await getReportHtmlAfterPopulatingData(json)

  try {
    const target = path.join(process.cwd(), config.outputDir, 'index.html')

    await fs.ensureFile(target)
    await fs.writeFile(target, html)
  } catch (err) {
    throw Error((err as Error).message)
  }
}

export async function startServer(
  inlineConfig?: StartInlineConfig
): Promise<http.Server> {
  const config = await getResolvedConfig(inlineConfig)
  const app = new App(config)
  return app.listen()
}
