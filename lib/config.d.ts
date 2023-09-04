declare namespace config {
  const inputJson: any
  const inputJsonDir: string
  const output: {
    reportDir: string
    reportFilename: string
    inlineAssets: boolean
    overwrite: boolean
  }
  const autoOpen: boolean
}

export = config
