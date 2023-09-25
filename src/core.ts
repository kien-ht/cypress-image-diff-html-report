import path from 'path'
import { GenerateInlineConfig, StartInlineConfig } from './common/types.js'
import {
  getResolvedConfig,
  getReportHtmlAfterPopulatingInput,
  getInputJson,
  writeFileSafe
} from './common/utils.js'
import { App } from './server/index.js'

export async function generate(
  inlineConfig?: GenerateInlineConfig
): Promise<void> {
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

export async function startServer(inlineConfig?: StartInlineConfig) {
  const config = await getResolvedConfig(inlineConfig)
  const app = new App(config)

  try {
    return app.listen()
  } catch (err) {
    throw Error((err as Error).message)
  }
}
