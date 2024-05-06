import type { RouteRecordRaw } from 'vue-router'

import PageDetails from '@/pages/PageDetails.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/details',
    name: 'PageDetails',
    component: PageDetails
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'PageDetails' }
  }
]
