import { WorkflowInstance, ResolvedReport, TestIdentity } from '@commonTypes'

export { getReports, updateTest }

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

async function updateTest(testId: TestIdentity): Promise<void> {
  try {
    const response = await fetch('/api/reports', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testId)
    })
    if (!response.ok) throw Error('Network response was not OK')
  } catch (err) {
    throw Error((err as Error).message)
  }
}
