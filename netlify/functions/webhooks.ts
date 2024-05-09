import {
  createLambdaFunction,
  createProbot,
  ApplicationFunction
} from '@probot/adapter-aws-lambda-serverless'
import app from '../../src/github-ci-server/webhook'

export const webhooks = createLambdaFunction(
  app as unknown as ApplicationFunction,
  {
    probot: createProbot()
  }
)