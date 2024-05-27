import type { RouteRecordRaw } from 'vue-router'

export const ciRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'PageHome',
    component: () => import('@/pages/PageHome.vue')
  },
  {
    path: '/details',
    name: 'PageDetails',
    component: () => import('@/pages/PageDetails.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'PageHome' }
  }
]

export const localRoutes: RouteRecordRaw[] = [
  {
    path: '/details',
    name: 'PageDetails',
    component: () => import('@/pages/PageDetails.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'PageDetails' }
  }
]
