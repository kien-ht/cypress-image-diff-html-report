import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history:
    window.__injectedData__.mode === 'ci'
      ? createWebHistory()
      : createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes
})

export default router
