import {
  createLambdaFunction,
  createProbot,
  ApplicationFunction
} from '@probot/adapter-aws-lambda-serverless'
import { appFn } from '../probot-app'

// Replace escaped newlines to fix this octokit bug
// Error: secretOrPrivateKey must be an asymmetric key when using RS256
// See more here https://github.com/octokit/auth-app.js/issues/465
process.env.PRIVATE_KEY = process.env.PRIVATE_KEY!.replace(/\\n/g, '\n')

export const handler = createLambdaFunction(
  appFn as unknown as ApplicationFunction,
  { probot: createProbot() }
)
