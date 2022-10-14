import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import VueLazyLoad from 'vue3-lazyload'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/Base/Loading/directive.js'
import noResultDirective from '@/components/Base/NoResult/directive.js'
import { load, saveAll } from '@/assets/js/array-store.js'
import { FAVORITE_KEY, PLAY_KEY } from '@/assets/js/constant.js'
import { processSongs } from '@/service/song.js'
// 全局樣式
import '@/assets/scss/index.scss'

// 更新本地數據 => url會過期
const favoriteSongs = load(FAVORITE_KEY)
if (favoriteSongs.length) {
  processSongs(favoriteSongs).then(songs => {
    store.commit('setFavoriteList', songs)
    saveAll(songs, FAVORITE_KEY)
  })
}
const historySongs = load(PLAY_KEY)
if (historySongs.length) {
  processSongs(historySongs).then(songs => {
    store.commit('setPlayHistory', songs)
    saveAll(songs, PLAY_KEY)
  })
}
const app = createApp(App)
app
  .use(lazyPlugin, {
  loading: require('./assets/images/default.png')
  })
  .use(store)
  .use(router)
  .directive('loading', loadingDirective)
  .directive('no-result', noResultDirective)
  .mount('#app')
