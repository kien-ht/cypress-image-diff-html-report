import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import merge from 'lodash/merge.js'
import maxBy from 'lodash/maxBy.js'
import {
  UserConfig,
  ResolvedUserConfig,
  Report,
  ResolvedReport,
  GenerateInlineConfig,
  StartInlineConfig,
  RunMode,
  InjectedData,
  ProbotLogLevel
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
  let userConfig: { default: UserConfig }
  try {
    userConfig = await dynamicImport(
      path.join(process.cwd(), configFile ?? DEFAULT_CONFIG_PATH)
    )
  } catch (err) {
    return await getResolvedReportJsonPath(merge({}, DEFAULT_CONFIG, config))
  }

  return await getResolvedReportJsonPath(
    merge({}, DEFAULT_CONFIG, userConfig.default, config)
  )
}

export async function getResolvedReportJson(
  config: ResolvedUserConfig,
  mode: RunMode = 'served'
): Promise<ResolvedReport> {
  const json = await getReportJson(config.reportJsonFilePath)
  const jsonWithTotalStats = getReportJsonWithTotalStats(json)

  return {
    ...jsonWithTotalStats,
    suites: await Promise.all(
      jsonWithTotalStats.suites.map(async (suite) => ({
        ...suite,
        tests: await Promise.all(
          suite.tests.map(async (test) => ({
            ...test,
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
  }
}

export function getReportJsonWithTotalStats(json: Report): ResolvedReport {
  return {
    ...json,
    suites: json.suites
      .map((suite) => ({
        ...suite,
        tests: suite.tests.map((test) => ({
          ...test,
          passed: test.status === 'pass' ? 1 : 0,
          failed: test.status === 'fail' ? 1 : 0
        }))
      }))
      .map((suite) => ({
        ...suite,
        id: suite.path,
        passed: suite.tests.reduce((s, i) => s + i.passed, 0),
        failed: suite.tests.reduce((s, i) => s + i.failed, 0)
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

export async function getReportJson(filePath: string): Promise<Report> {
  const sourcePath = path.join(process.cwd(), filePath)
  try {
    const report = await fs.readFile(sourcePath, { encoding: 'utf8' })
    return JSON.parse(report)
  } catch (err) {
    console.log(
      chalk.red(
        `[cypress-image-diff-html-report]: Cannot find the report json. Are you sure the given path exists?
        \n${sourcePath}`
      )
    )
    throw Error()
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
  if (pathname.startsWith('data:image/png;base64,')) return pathname

  const absolutePath = path.join(process.cwd(), config.baseDir, pathname)
  try {
    const content = await fs.readFile(absolutePath, { encoding: 'base64' })
    return `data:image/png;base64,${content}`
  } catch (err) {
    throw Error((err as Error).message)
  }
}

async function getResolvedReportJsonPath(
  config: UserConfig
): Promise<ResolvedUserConfig> {
  const resolvedConfig = { ...config }

  if (resolvedConfig.reportJsonFilePath === undefined) {
    const latestReport = await getLatestJsonFromDir(
      resolvedConfig.reportJsonDir!
    )
    resolvedConfig.reportJsonFilePath = latestReport
  }

  delete resolvedConfig.reportJsonDir

  console.log(
    chalk.green(
      `[cypress-image-diff-html-report]: Found a report json at ${path.join(
        process.cwd(),
        resolvedConfig.reportJsonFilePath!
      )}`
    )
  )
  return resolvedConfig as ResolvedUserConfig
}

async function getLatestJsonFromDir(dir: string): Promise<string | undefined> {
  try {
    const fullPath = path.join(process.cwd(), dir)
    if (fs.existsSync(fullPath) === false) {
      throw Error(
        `Given reportJsonDir does not exist ${fullPath}. Make sure you specify a valid reportJsonDir or reportJsonFilePath`
      )
    }
    const reports = (await fs.readdir(fullPath))
      .filter((r) => path.extname(r) === '.json')
      .map((r) => path.join(fullPath, r))

    const latestJson = maxBy(reports, (r) => fs.statSync(r).ctimeMs)
    if (latestJson === undefined) {
      throw Error(`Cannot find any report json in this directory ${fullPath}`)
    }

    return path.relative(process.cwd(), latestJson)
  } catch (err) {
    throw Error((err as Error).message)
  }
}

export function getProbotConfig() {
  return {
    appId: process.env.APP_ID!,
    privateKey: process.env.PRIVATE_KEY!,
    secret: process.env.WEBHOOK_SECRET!,
    logLevel: process.env.LOG_LEVEL! as ProbotLogLevel
  }
}
