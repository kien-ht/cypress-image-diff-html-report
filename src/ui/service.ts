import {
  WorkflowInstance,
  ResolvedReport,
  TestIdentity,
  UpdateBaselines
} from '@commonTypes'

export { getReports, updateTests, updateBaselines }

async function getReports(
  instance?: WorkflowInstance
): Promise<ResolvedReport> {
  try {
    let url = '/api/reports?'

    if (instance) {
      url += new URLSearchParams(
        Object.entries(instance).map(([k, v]) => [k, String(v)])
      ).toString()
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
