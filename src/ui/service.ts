import { ResolvedReport } from '@commonTypes'

export { getReports }

async function getReports(): Promise<ResolvedReport> {
  try {
    const response = await fetch('/api/reports')
    return await response.json()
  } catch {
    throw Error()
  }
}
