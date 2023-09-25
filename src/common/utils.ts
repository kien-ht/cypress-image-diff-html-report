import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import merge from 'lodash/merge.js'
import { UserConfig, ResolvedUserConfig, Report } from './types.js'
import { DEFAULT_CONFIG, DEFAULT_CONFIG_PATH } from './constants.js'
import { __dirname } from './utils-cjs.js'

export async function getUserConfigFile(
  filePath: string = DEFAULT_CONFIG_PATH
): Promise<ResolvedUserConfig> {
  try {
    const userConfig: { default: UserConfig } = await import(
      path.join(process.cwd(), filePath)
    )
    return merge(DEFAULT_CONFIG, userConfig.default)
  } catch (e) {
    return DEFAULT_CONFIG
  }
}

export async function getInputJson(filePath: string = ''): Promise<Report> {
  const userConfig = await getUserConfigFile()
  const sourcePath = path.join(
    process.cwd(),
    filePath || userConfig.inputJsonPath
  )
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

export function defineConfig(config: UserConfig): UserConfig {
  return config
}

export function changeCwdToPlayground() {
  try {
    const target = path.resolve('playground')
    process.chdir(target)
  } catch (err) {
    console.log(chalk.magenta(err))
  }
}

export async function generate(): Promise<void> {
  const html = await getReportHtmlAfterPopulatingInput()
  const config = await getUserConfigFile()

  try {
    const target = path.join(process.cwd(), config.outputDir, 'index.html')
    await writeFileSafe(target, html)
  } catch (err) {
    console.log(chalk.red(`[cypress-image-diff-html-report]: ${err}`))
  }
}

async function getReportHtmlAfterPopulatingInput(): Promise<string> {
  const json = await getInputJson()

  try {
    const htmlFilePath = path.join(
      __dirname(import.meta.url),
      '../ui/index.html'
    )
    const html = await fs.readFile(htmlFilePath, { encoding: 'utf8' })

    return html.replace(
      '<script id="input-json"></script>',
      `<script>window.__input_json__ = ${JSON.stringify(json)}</script>`
    )
  } catch (err) {
    throw Error((err as Error).message)
  }
}

async function writeFileSafe(pathname: string, data: string): Promise<void> {
  const dir = path.dirname(pathname)

  try {
    const exists = await fs.exists(dir)
    if (exists === false) {
      await fs.mkdir(dir, { recursive: true })
    }

    await fs.writeFile(pathname, data)
  } catch (err) {
    throw Error((err as Error).message)
  }
}
