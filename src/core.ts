import path from 'path'
import { InlineConfig } from './common/types.js'
import {
  getResolvedConfig,
  getReportHtmlAfterPopulatingInput,
  getInputJson,
  writeFileSafe
} from './common/utils.js'
import { App } from './server/index.js'

export async function generate(inlineConfig?: InlineConfig): Promise<void> {
  const config = await getResolvedConfig(inlineConfig)
  const json = await getInputJson(config.inputJsonPath)
  const html = await getReportHtmlAfterPopulatingInput(json)

  try {
    const target = path.join(process.cwd(), config.outputDir, 'index.html')
    await writeFileSafe(target, html)
  } catch (err) {
    throw Error((err as Error).message)
  }
}

export async function startServer(inlineConfig?: InlineConfig) {
  const config = await getResolvedConfig(inlineConfig)
  const app = new App(config)

  try {
    return app.listen()
  } catch (err) {
    throw Error((err as Error).message)
  }
}
