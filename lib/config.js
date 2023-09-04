const path = require('path')
const merge = require('lodash/merge')
const chalk = require('chalk')

const defaultConfig = {
  inputJsonDir: '',
  output: {
    reportDir: './report',
    reportFilename: 'report.html',
    inlineAssets: false,
    overwrite: true
  },
  autoOpen: true
}

const config = merge(defaultConfig, getUserConfigFile())
const inputJson = getInputJson(config.inputJsonDir)

module.exports = {
  ...config,
  inputJson
}

function getUserConfigFile() {
  try {
    return require(
      path.join(__dirname, '../cypress-image-diff-html-report.config.js')
    )
  } catch {
    return {}
  }
}

function getInputJson(filePath) {
  try {
    return require(path.join(__dirname, '../', filePath))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(
      chalk.red(
        `[cypress-image-diff-html-report]: Cannot find the input json. Are you sure the given path is correct?
        \n${path.join(__dirname, '../', filePath)}`
      )
    )
    return {}
  }
}
