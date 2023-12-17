import { defineConfig } from 'cypress'
import getCompareSnapshotsPlugin from 'cypress-image-diff-js/plugin'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:2345',

    setupNodeEvents(on, config) {
      return getCompareSnapshotsPlugin(on, config)
    }
  }
})
