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

export interface ResolvedUserConfig {
  inputJsonPath: string
  // assetsDir: string
  outputDir: string
  inlineAssets: boolean
  autoOpen: boolean
  serverPort: number
}

export interface UserConfig extends Partial<ResolvedUserConfig> {}