import type { RouteRecordRaw } from 'vue-router'

import PageHome from '@/pages/PageHome.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'PageHome',
    component: PageHome
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'PageHome' }
  }
]
