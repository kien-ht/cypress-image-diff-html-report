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
  status: string
  name: string
  percentage: number
  failureThreshold: number
  specPath: string
  specFilename: string
  baselinePath: string
  diffPath: string
  comparisonPath: string
}

export interface InlineConfig {
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
}

interface GenerateConfig extends SharedConfig {
  /**
   * Set the output directory of the generated HTML report, relative to the process.cwd()
   */
  outputDir?: string
  /**
   * Development stage, available soon
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
