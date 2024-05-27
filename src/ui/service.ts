import {
  WorkflowInstance,
  ResolvedReport,
  TestIdentity,
  UpdateBaselines
} from '@commonTypes'
import { PATH_TO_SERVERLESS_FUNCTIONS } from '../common/constants'

export { getReports, updateTests, updateBaselines }

monkeyPatchWindowFetch()

async function getReports(
  instance?: WorkflowInstance
): Promise<ResolvedReport> {
  try {
    let url = '/api/reports'

    if (instance) {
      url += `?${new URLSearchParams(
        Object.entries(instance).map(([k, v]) => [k, String(v)])
      ).toString()}`
    }

    const response = await fetch(url)
    if (!response.ok) throw Error('Network response was not OK')

    return await response.json()
  } catch (err) {
    throw Error((err as Error).message)
  }
}

async function updateTests(testIds: TestIdentity[]): Promise<void> {
  try {
    const response = await fetch('/api/reports', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testIds)
    })
    if (!response.ok) throw Error('Network response was not OK')
  } catch (err) {
    throw Error((err as Error).message)
  }
}

async function updateBaselines(args: UpdateBaselines): Promise<void> {
  try {
    const response = await fetch('/api/reports', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(args)
    })
    if (!response.ok) throw Error('Network response was not OK')
  } catch (err) {
    throw Error((err as Error).message)
  }
}

function monkeyPatchWindowFetch() {
  const originalFetch = window.fetch
  window.fetch = function (url, config) {
    const requestUrl =
      window.__injectedData__.mode === 'ci'
        ? `${PATH_TO_SERVERLESS_FUNCTIONS}${url}`
        : url
    return originalFetch.call(this, requestUrl, config)
  }
}
