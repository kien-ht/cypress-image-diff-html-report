import { Report } from '@commonTypes'

export { getReports }

async function getReports(): Promise<Report> {
  const response = await fetch('/api/reports')
  const report: Report = await response.json()
  return report
}
