import fs from 'fs-extra'
import path from 'path'
import { cac } from 'cac'
import chalk from 'chalk'
import { generate, startServer } from './core.js'
import { __dirname } from './common/utils-cjs.js'
import { GenerateInlineConfig, StartInlineConfig } from './common/types.js'

const cli = cac('cypress-image-diff-html-report')

cli
  .option(
    '-c, --configFile <file>',
    'Specify config file, will be overwritten by other config options if provided, relative to the process.cwd()'
  )
  .option(
    '-i, --inputJsonPath <file>',
    'Specify the input json file, relative to the process.cwd()'
  )

cli
  .command('generate', 'Generate HTML report')
  // .option(
  //   '-o, --outputDir <dir>',
  //   'Set the output directory of the generated HTML report, relative to the process.cwd()'
  // )
  .action(async (options: GenerateInlineConfig) => {
    try {
      await generate(options)
      console.log(
        chalk.green(`[cypress-image-diff-html-report]: Generated successfully!`)
      )
    } catch (err) {
      console.log(
        chalk.red(`[cypress-image-diff-html-report]: ${(err as Error).message}`)
      )
      process.exit(1)
    }
  })

cli
  .command('start', 'Start the local server')
  .option(
    '--autoOpen',
    'Open the HTML report in the default browser as soon as the server starts'
  )
  .option('--serverPort <port>', 'Set the port of the local server')
  .action(async (options: StartInlineConfig) => {
    try {
      await startServer(options)
    } catch (err) {
      console.log(
        chalk.red(`[cypress-image-diff-html-report]: ${(err as Error).message}`)
      )
      process.exit(1)
    }
  })

const { version } = JSON.parse(
  fs
    .readFileSync(path.join(__dirname(import.meta.url), '../package.json'))
    .toString()
)

cli.help()
cli.version(version)

export function run() {
  try {
    cli.parse()
  } catch (err) {
    console.log(
      chalk.red(`[cypress-image-diff-html-report]: ${(err as Error).message}`)
    )
    cli.outputHelp()
    process.exit(1)
  }
}
