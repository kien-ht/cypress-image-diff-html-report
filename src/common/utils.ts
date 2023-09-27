import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import merge from 'lodash/merge.js'
import {
  UserConfig,
  ResolvedUserConfig,
  Report,
  GenerateInlineConfig,
  StartInlineConfig
} from './types.js'
import { DEFAULT_CONFIG, DEFAULT_CONFIG_PATH } from './constants.js'
import { __dirname } from './utils-cjs.js'

export function defineConfig(config: UserConfig): UserConfig {
  return config
}

export async function getResolvedConfig({
  configFile,
  ...config
}: GenerateInlineConfig | StartInlineConfig = {}): Promise<ResolvedUserConfig> {
  try {
    const userConfig: { default: UserConfig } = await import(
      path.join(process.cwd(), configFile ?? DEFAULT_CONFIG_PATH)
    )

    return merge({}, DEFAULT_CONFIG, userConfig.default, config)
  } catch (e) {
    return merge({}, DEFAULT_CONFIG, config)
  }
}

export async function getInputJson(filePath: string): Promise<Report> {
  const sourcePath = path.join(process.cwd(), filePath)
  try {
    const report = await fs.readFile(sourcePath, { encoding: 'utf8' })
    return JSON.parse(report)
  } catch (err) {
    console.log(
      chalk.red(
        `[cypress-image-diff-html-report]: Cannot find the input json. Are you sure the given path is correct?
        \n${sourcePath}`
      )
    )
    throw Error((err as Error).message)
  }
}

export async function getReportHtmlAfterPopulatingInput(
  json: Report
): Promise<string> {
  try {
    const htmlFilePath = path.join(
      __dirname(import.meta.url),
      '../ui/index.html'
    )
    const html = await fs.readFile(htmlFilePath, { encoding: 'utf8' })

    return html.replace(
      '<script id="input-json"></script>',
      `<script id="input-json">window.__input_json__ = ${JSON.stringify(
        json
      )}</script>`
    )
  } catch (err) {
    throw Error((err as Error).message)
  }
}

export function changeCwdToPlayground() {
  try {
    const target = path.resolve('playground')
    process.chdir(target)
  } catch (err) {
    console.log(chalk.magenta(err))
  }
}
