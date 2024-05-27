import { Handler } from '@netlify/functions'
import { UpdateBaselines, WorkflowInstance } from '../../common/types'
import { CiController } from '../controller'
import { PATH_TO_SERVERLESS_FUNCTIONS } from '../../common/constants'

// Replace escaped newlines to fix this octokit bug
// Error: secretOrPrivateKey must be an asymmetric key when using RS256
// See more here https://github.com/octokit/auth-app.js/issues/465
process.env.PRIVATE_KEY = process.env.PRIVATE_KEY!.replace(/\\n/g, '\n')

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const getReportsHandler: Handler = async (event) => {
  try {
    const controller = new CiController()
    const json = await controller.getReports(
      event.queryStringParameters as unknown as WorkflowInstance
    )
    return {
      statusCode: 200,
      body: JSON.stringify(json)
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: err.message ?? err })
    }
  }
}

const updateReportsHandler: Handler = async (event) => {
  try {
    const controller = new CiController()
    await controller.updateBaselines(
      JSON.parse(event.body!) as unknown as UpdateBaselines
    )
    return {
      statusCode: 200
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: err.message ?? err })
    }
  }
}

export const handler = redirectRoutes({
  '/api/reports': {
    GET: getReportsHandler,
    PATCH: updateReportsHandler
  }
})

function redirectRoutes(
  routes: Record<string, Partial<Record<HttpMethod, Handler>>>
): Handler {
  return (event, context) => {
    const { path, httpMethod } = event
    const endpoint = path.replace(PATH_TO_SERVERLESS_FUNCTIONS, '')

    if (routes[endpoint] && routes[endpoint][httpMethod])
      return routes[endpoint][httpMethod](event, context)

    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not found' })
    }
  }
}
