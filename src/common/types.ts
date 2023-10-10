export interface Report {
  total: number
  totalPassed: number
  totalFailed: number
  totalSuites: number
  suites: Suite[]
  startedAt: string
  endedAt: string
  duration: number
  browserName: string
  browserVersion: string
  cypressVersion: string
}

export interface Suite {
  name: string
  path: string
  tests: Test[]
}

export interface Test {
  status: TestStatus
  name: string
  percentage: number
  failureThreshold: number
  specPath: string
  specFilename: string
  baselinePath: string
  diffPath: string
  comparisonPath: string
}

export type TestStatus = 'pass' | 'fail'

export interface ResolvedReport extends Report {
  suites: ResolvedSuite[]
}

export interface ResolvedSuite extends Suite {
  tests: ResolvedTest[]
  passed: number
  failed: number
  id: string
}

export interface ResolvedTest extends Test {
  passed: number
  failed: number
}

export type RunMode = 'static' | 'served'

export interface InjectedData {
  report: ResolvedReport
  mode?: RunMode
}

export interface TestIdentity {
  suiteId: string
  name: string
}

interface InlineConfig {
  /**
   * Specify config file, will be overwritten by other config options if provided, relative to the process.cwd()
   */
  configFile?: string
}

interface SharedConfig {
  /**
   * Specify the input json file, relative to the process.cwd()
   */
  inputJsonPath?: string
  /**
   * Specify the base directory for all the interal paths in the input json, relative to the process.cwd()
   */
  baseDir?: string
}

interface GenerateConfig extends SharedConfig {
  /**
   * Set the output directory of the generated HTML report, relative to the process.cwd()
   */
  outputDir?: string
  /**
   * Whether to inline all screenshots to base64 for the generated HTML
   */
  inlineAssets?: boolean
}

interface StartConfig extends SharedConfig {
  /**
   * Open the HTML report in the default browser as soon as the server starts
   */
  autoOpen?: boolean
  /**
   * Set the port of the local server
   */
  serverPort?: number
}

export interface GenerateInlineConfig extends GenerateConfig, InlineConfig {}

export interface StartInlineConfig extends StartConfig, InlineConfig {}

export interface UserConfig extends GenerateConfig, StartConfig {}

export interface ResolvedUserConfig extends Required<UserConfig> {}
