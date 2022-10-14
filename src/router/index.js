import { createRouter, createWebHashHistory } from 'vue-router'
// 異步加載
const Recommend = () => import('../views/Recommend.vue'/* webpackChunkName: "recommend" */)
const Album = () => import('../views/Album.vue'/* webpackChunkName: "album" */)
const Singer = () => import('../views/Singer.vue'/* webpackChunkName: "singer" */)
const SingerDetail = () => import('../views/SingerDetail.vue'/* webpackChunkName: "singer-detail" */)
const Search = () => import('../views/Search.vue'/* webpackChunkName: "search" */)
const TopList = () => import('../views/TopList.vue'/* webpackChunkName: "top-list" */)
const TopDetail = () => import('../views/TopDetail.vue'/* webpackChunkName: "top-detail" */)
const UserCenter = () => import('../views/UserCenter.vue'/* webpackChunkName: "user-center" */)
const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/singer',
    name: 'Singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/top-list',
    name: 'TopList',
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    components: {
      // key name 來自 App.vue router-view name="user"
      user: UserCenter
    }
    // component: () => import('../views/UserCenter.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
