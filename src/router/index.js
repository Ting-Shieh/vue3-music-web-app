import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/singer',
    name: 'Singer',
    component: () => import('../views/Singer.vue'),
    children: [
      {
        path: ':id',
        component: () => import('../views/SingerDetail.vue')
      }
    ]
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import('../views/Recommend.vue')
  },
  {
    path: '/top-list',
    name: 'TopList',
    component: () => import('../views/TopList.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
