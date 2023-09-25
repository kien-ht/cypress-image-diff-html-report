import arg from 'arg'
import chalk from 'chalk'
import { generate, startServer } from './core.js'

export async function cli(args: string[]) {
  const options = parseArgumentsIntoOptions(args)

  if (options.generate) {
    await generate()
    console.log(
      chalk.green(`[cypress-image-diff-html-report]: Generated successfully!`)
    )
  }

  if (options.start) {
    await startServer()
  }
}

function parseArgumentsIntoOptions(rawArgs: string[]) {
  const args = arg(
    {
      '--generate': Boolean,
      '-g': '--generate',
      '--start': Boolean,
      '-s': '--start'
    },
    { argv: rawArgs.slice(2) }
  )
  return {
    generate: args['--generate'] || false,
    start: args['--start'] || false
  }
}
