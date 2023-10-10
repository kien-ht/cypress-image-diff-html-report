import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import merge from 'lodash/merge.js'
import {
  UserConfig,
  ResolvedUserConfig,
  Report,
  ResolvedReport,
  GenerateInlineConfig,
  StartInlineConfig,
  RunMode,
  InjectedData
} from './types.js'
import { DEFAULT_CONFIG, DEFAULT_CONFIG_PATH } from './constants.js'
import { __dirname, dynamicImport } from './utils-cjs.js'

export function defineConfig(config: UserConfig): UserConfig {
  return config
}

export async function getResolvedConfig({
  configFile,
  ...config
}: GenerateInlineConfig | StartInlineConfig = {}): Promise<ResolvedUserConfig> {
  try {
    const userConfig: { default: UserConfig } = await dynamicImport(
      path.join(process.cwd(), configFile ?? DEFAULT_CONFIG_PATH)
    )

    return merge({}, DEFAULT_CONFIG, userConfig.default, config)
  } catch (e) {
    return merge({}, DEFAULT_CONFIG, config)
  }
}

export async function getResolvedInputJson(
  config: ResolvedUserConfig,
  mode: RunMode = 'served'
): Promise<ResolvedReport> {
  const json = await getInputJson(config.inputJsonPath)

  return {
    ...json,
    suites: (
      await Promise.all(
        json.suites.map(async (suite) => ({
          ...suite,
          tests: await Promise.all(
            suite.tests.map(async (test) => ({
              ...test,
              passed: test.status === 'pass' ? 1 : 0,
              failed: test.status === 'fail' ? 1 : 0,
              specPath: getNormalisedPath(test.specPath, config, mode),
              baselinePath: await getResolvedScreenshotPath(
                test.baselinePath,
                config,
                mode
              ),
              diffPath: await getResolvedScreenshotPath(
                test.diffPath,
                config,
                mode
              ),
              comparisonPath: await getResolvedScreenshotPath(
                test.comparisonPath,
                config,
                mode
              )
            }))
          )
        }))
      )
    ).map((suite) => ({
      ...suite,
      id: suite.path,
      passed: suite.tests.reduce((s, i) => s + i.passed, 0),
      failed: suite.tests.reduce((s, i) => s + i.failed, 0),
      path: getNormalisedPath(suite.path, config, mode)
    }))
  }
}

export async function getReportHtmlAfterPopulatingData(
  json: ResolvedReport
): Promise<string> {
  try {
    const htmlFilePath = path.join(
      __dirname(import.meta.url),
      '../ui/index.html'
    )
    const html = await fs.readFile(htmlFilePath, { encoding: 'utf8' })
    const injectedData: InjectedData = {
      report: json,
      mode: 'static'
    }

    return html.replace(
      '<script id="injected-data"></script>',
      `<script id="injected-data">window.__injectedData__ = ${JSON.stringify(
        injectedData
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

async function getResolvedScreenshotPath(
  pathname: string,
  config: ResolvedUserConfig,
  mode: RunMode
): Promise<string> {
  if (config.inlineAssets && mode === 'static')
    return await toBase64(pathname, config)

  return getNormalisedPath(pathname, config, mode)
}

function getNormalisedPath(
  pathname: string,
  config: ResolvedUserConfig,
  mode: RunMode
): string {
  if (pathname === '') return ''

  if (mode === 'served') return path.join(config.baseDir, pathname)

  const absolutePath = path.join(process.cwd(), config.baseDir, pathname)
  return path.relative(config.outputDir, absolutePath)
}

async function toBase64(
  pathname: string,
  config: ResolvedUserConfig
): Promise<string> {
  if (pathname === '') return ''

  const absolutePath = path.join(process.cwd(), config.baseDir, pathname)
  try {
    const content = await fs.readFile(absolutePath, { encoding: 'base64' })
    return `data:image/png;base64,${content}`
  } catch (err) {
    throw Error((err as Error).message)
  }
}
