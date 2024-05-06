import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history:
    window.__injectedData__.mode === 'static'
      ? createWebHashHistory()
      : createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes
})

export default router
