import { defineStore } from 'pinia'
import { getReports, updateTest } from '@/service'
import { CheckRunInstance, TestIdentity } from '@commonTypes'
import { DEFAULT_FITLER_STATUS } from '@/constants'

export const useMainStore = defineStore('main', {
  state: () => ({
    report: window.__injectedData__.report,
    mode: window.__injectedData__.mode,
    filter: {
      status: DEFAULT_FITLER_STATUS
    },
    isLoadingReport: false
  }),

  getters: {
    displayReport: (state) => ({
      ...state.report,
      suites:
        state.report?.suites.map((suite) => ({
          ...suite,
          tests: suite.tests.filter((test) =>
            state.filter.status.includes(test.status)
          )
        })) ?? []
    })
  },

  actions: {
    async fetchReport(instance?: CheckRunInstance) {
      if (this.mode === 'static') return

      this.isLoadingReport = true
      try {
        this.report = await getReports(instance)
      } catch (err) {
        Promise.reject(err)
      }
      this.isLoadingReport = false
    },

    async updateTest(testId: TestIdentity) {
      try {
        await updateTest(testId)
        await this.fetchReport()
      } catch (err) {
        Promise.reject(err)
      }
    }
  }
})
