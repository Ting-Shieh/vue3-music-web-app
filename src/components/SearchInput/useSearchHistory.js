import { save } from '@/assets/js/array-store.js'
import { SEARCH_KEY } from '@/assets/js/constant.js'
import { useStore } from 'vuex'
export default function useSearchHistory () {
  const store = useStore()
  const maxLen = 200
  function saveSearch (query) {
    function compare (item) {
      return item === query
    }
    // 將搜索記錄保存 收藏
    const searches = save(query, SEARCH_KEY, compare, maxLen)
    store.commit('setSearchHistory', searches)
  }
  return {
    saveSearch
  }
}
