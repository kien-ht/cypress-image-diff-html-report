import { Report } from '@commonTypes'

export { getReports }

async function getReports(): Promise<Report> {
  try {
    const response = await fetch('/api/reports')
    return await response.json()
  } catch {
    return {
      total: 0,
      totalPassed: 0,
      totalFailed: 0,
      totalSuites: 0,
      suites: [],
      startedAt: '',
      endedAt: '',
      duration: 0,
      browserName: '',
      browserVersion: '',
      cypressVersion: ''
    }
  }
}
