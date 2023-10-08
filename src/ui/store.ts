import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    report: window.__injectedData__.report,
    mode: window.__injectedData__.mode
  })
})
