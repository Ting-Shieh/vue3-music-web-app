import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import('../views/Recommend.vue'),
    children: [
      {
        path: ':id',
        component: () => import('../views/Album.vue')
      }
    ]
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
    component: () => import('../views/Search.vue'),
    children: [
      {
        path: ':id',
        component: () => import('../views/SingerDetail.vue')
      }
    ]
  },
  {
    path: '/top-list',
    name: 'TopList',
    component: () => import('../views/TopList.vue'),
    children: [
      {
        path: ':id',
        component: () => import('../views/TopDetail.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    components: {
      // key name 來自 App.vue router-view name="user"
      user: () => import('../views/UserCenter.vue')
    }
    // component: () => import('../views/UserCenter.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
