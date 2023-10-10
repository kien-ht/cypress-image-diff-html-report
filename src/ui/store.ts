import { defineStore } from 'pinia'
import { getReports, updateTest } from '@/service'
import { TestIdentity } from '@commonTypes'

export const useMainStore = defineStore('main', {
  state: () => ({
    report: window.__injectedData__.report,
    mode: window.__injectedData__.mode
  }),

  actions: {
    async fetchReport() {
      try {
        this.report = await getReports()
        this.mode = 'served'
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
        this.mode = 'served'
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
