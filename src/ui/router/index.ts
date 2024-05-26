import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import { localRoutes, ciRoutes } from './routes'

const routerOptions =
  window.__injectedData__.mode === 'ci'
    ? {
        history: createWebHistory(),
        routes: ciRoutes,
        scrollBehavior() {
          return { top: 0 }
        }
      }
    : {
        history: createWebHashHistory(),
        routes: localRoutes,
        scrollBehavior() {
          return { top: 0 }
        }
      }

const router = createRouter(routerOptions)

export default router
