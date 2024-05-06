import { defineStore } from 'pinia'
import { getReports, updateTest } from '@/service'
import { TestIdentity } from '@commonTypes'
import { DEFAULT_FITLER_STATUS } from '@/constants'

export const useMainStore = defineStore('main', {
  state: () => ({
    report: window.__injectedData__.report,
    mode: window.__injectedData__.mode,
    filter: {
      status: DEFAULT_FITLER_STATUS
    }
  }),

  getters: {
    displayReport: (state) => ({
      ...state.report,
      suites: state.report.suites.map((suite) => ({
        ...suite,
        tests: suite.tests.filter((test) =>
          state.filter.status.includes(test.status)
        )
      }))
    })
  },

  actions: {
    async fetchReport() {
      try {
        this.report = await getReports()
        this.mode = 'local'
      } catch {
        this.mode = 'static'

        ElNotification({
          message: 'You are viewing the report in the static mode.',
          type: 'info',
          duration: 3000
        })
      }
    },

    async updateTest(testId: TestIdentity) {
      try {
        await updateTest(testId)
        await this.fetchReport()
        this.mode = 'local'
      } catch {
        this.mode = 'static'

        ElNotification({
          message: 'You are viewing the report in the static mode.',
          type: 'info',
          duration: 3000
        })
      }
    }
  }
})
