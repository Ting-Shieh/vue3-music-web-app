import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import VueLazyLoad from 'vue3-lazyload'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/Base/Loading/directive.js'
import noResultDirective from '@/components/Base/NoResult/directive.js'
// 全局樣式
import '@/assets/scss/index.scss'
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
