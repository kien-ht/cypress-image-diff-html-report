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
  baselineDataUrl?: string
  diffDataUrl?: string
  comparisonDataUrl?: string
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

export type RunMode = 'static' | 'local' | 'ci'

export interface InjectedData {
  readonly mode: RunMode
  report?: ResolvedReport
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
   * Specify the report json directory, relative to the process.cwd(). Cypress-image-diff-html-report will automatically look for the latest created json file in this directory
   */
  reportJsonDir?: string
  /**
   * Specify the report json file path, relative to the process.cwd(). If provided, reportJsonDir will be ignored
   */
  reportJsonFilePath?: string
  /**
   * Specify the base directory for all the interal paths in the report json, relative to the process.cwd(). (Note: This field does not have any effect on the configFile, reportJsonFilePath, reportJsonDir and outputDir)
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

export interface ResolvedUserConfig
  extends Required<Omit<UserConfig, 'reportJsonDir'>> {}

export interface CheckRunInstance {
  installationId: number
  owner: string
  repo: string
  sha: string
  ref: string
  workflowId: number
}

export interface DownloadArtifactsOptions {
  owner: string
  repo: string
  workflowId: number
}

export interface CiTestIdentity extends CheckRunInstance, TestIdentity {}

export type ProbotLogLevel =
  | 'trace'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal'
