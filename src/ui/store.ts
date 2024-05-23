import { defineStore } from 'pinia'
import { getReports } from '@/service'
import { WorkflowInstance, ResolvedTest, ResolvedReport } from '@commonTypes'

export const useMainStore = defineStore('main', {
  state: () => ({
    report: window.__injectedData__.report,
    mode: window.__injectedData__.mode,
    isLoadingReport: false,
    selectedTests: new Map<string, ResolvedTest[]>()
  }),

  getters: {
    displayReport: (state) =>
      ({
        ...state.report,
        suites:
          state.report?.suites.map((suite) => ({
            ...suite,
            tests: suite.tests.map((test) => ({
              ...test,
              baselineDataUrl: test.baselineDataUrl ?? test.baselinePath,
              diffDataUrl: test.diffDataUrl ?? test.diffPath,
              comparisonDataUrl: test.comparisonDataUrl ?? test.comparisonPath
            }))
          })) ?? []
      }) as ResolvedReport,
    selectedTestsFlatten: (state) =>
      Array.from(state.selectedTests.values()).flat()
  },

  actions: {
    async fetchReport(instance?: WorkflowInstance) {
      if (this.mode === 'static') return

      this.isLoadingReport = true
      try {
        this.report = await getReports(instance)
      } catch (err) {
        Promise.reject(err)
      }
      this.isLoadingReport = false
    }
  }
})
