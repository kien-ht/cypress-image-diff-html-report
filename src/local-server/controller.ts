import fs from 'fs-extra'
import path from 'path'
import { getInputJson, getResolvedInputJson } from '../common/utils.js'
import {
  ResolvedUserConfig,
  Report,
  ResolvedReport,
  Test,
  TestIdentity
} from '../common/types.js'

export class Controller {
  constructor(private config: ResolvedUserConfig) {}

  async getReports(): Promise<ResolvedReport> {
    return await getResolvedInputJson(this.config, 'served')
  }

  async updateTest(testId: TestIdentity) {
    const originalReport = await getInputJson(this.config.reportJsonFilePath)
    const [suiteIndex, testIndex] = this.findTest(originalReport, testId)

    const foundTest = originalReport.suites[suiteIndex].tests[testIndex]
    await this.updateScreenshots(foundTest)

    originalReport.suites[suiteIndex].tests.splice(testIndex, 1, {
      ...foundTest,
      status: 'pass',
      percentage: 0,
      diffPath: ''
    })

    try {
      await fs.writeFile(
        path.join(process.cwd(), this.config.reportJsonFilePath),
        JSON.stringify(originalReport, null, 2)
      )
    } catch {
      throw Error('Cannot overwrite the report json file')
    }
  }

  private findTest(
    report: Report | ResolvedReport,
    { suiteId, name }: TestIdentity
  ): [suiteIndex: number, testIndex: number] {
    const foundSuiteIndex = report.suites.findIndex((s) => s.path === suiteId)
    if (foundSuiteIndex === -1) {
      throw Error(`Could not find the test with spec path ${suiteId}`)
    }

    const foundTestIndex = report.suites[foundSuiteIndex].tests.findIndex(
      (t) => t.name === name
    )
    if (foundTestIndex === -1) {
      throw Error(`Could not find the test with the name ${name}`)
    }

    return [foundSuiteIndex, foundTestIndex]
  }

  private async updateScreenshots(test: Test) {
    // copy comparison to baseline
    try {
      await fs.copyFile(
        path.join(process.cwd(), test.comparisonPath),
        path.join(process.cwd(), test.baselinePath)
      )
    } catch {
      throw Error('Cannot copy comparison to baseline screenshot')
    }

    // remove diff screenshot
    try {
      await fs.remove(path.join(process.cwd(), test.diffPath))
    } catch {
      throw Error('Cannot remove diff screenshot')
    }
  }
}
