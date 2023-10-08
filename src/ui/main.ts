import './styles/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { getReports } from '@/service'
;(async () => {
  try {
    window.__injectedData__ = {
      report: await getReports(),
      mode: 'served'
    }
  } catch {
    window.__injectedData__.mode = 'static'

    ElNotification({
      message: 'You are viewing the report in the static mode.',
      type: 'info',
      duration: 3000
    })
  }

  const app = createApp(App)
  app.use(createPinia())
  app.mount('#app')
})()
