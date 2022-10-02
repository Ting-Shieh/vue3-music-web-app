import { createStore, createLogger } from 'vuex'
import state from './state'
import mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

// 定開發環境
const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  getters,
  mutations,
  actions,
  // 開啟嚴格模式有性能損耗
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
