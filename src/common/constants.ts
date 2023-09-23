import { ResolvedUserConfig } from './types.js'

export const DEFAULT_CONFIG_PATH = 'cypress-image-diff-html-report.config.js'

export const DEFAULT_CONFIG: ResolvedUserConfig = {
  inputJsonPath: 'cypress-image-diff-html-report.input.json',
  outputDir: 'cypress-image-diff-html-report',
  inlineAssets: false,
  autoOpen: false,
  serverPort: 6868
}
