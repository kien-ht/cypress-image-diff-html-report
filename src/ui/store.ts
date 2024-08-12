import { defineStore } from 'pinia'
import { getReports, updateTest } from '@/service'
import { TestIdentity } from '@commonTypes'

export const useMainStore = defineStore('main', {
  state: () => ({
    report: window.__injectedData__.report,
    mode: window.__injectedData__.mode
  }),

  getters: {
    displayReport: (state) => ({
      ...state.report,
      suites:
        state.report?.suites.map((suite) => ({
          ...suite
        })) ?? []
    })
  },

  actions: {
    async fetchReport() {
      if (this.mode === 'static') return

      try {
        this.report = await getReports()
      } catch (err) {
        Promise.reject(err)
      }
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
