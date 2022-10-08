import { computed } from 'vue'
import { useStore } from 'vuex'
import { save, remove } from '@/assets/js/array-store.js'
import { FAVORITE_KEY } from '@/assets/js/constant.js'
export default function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100
  function getFavoriteIcon (song) {
    // 判斷歌曲是否在favoriteList列表中
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function toggleFavorite (song) {
    function compare (item) {
      return item.id === song.id
    }
    // 將歌曲收藏或移除收藏列表
    let list
    if (isFavorite(song)) {
      // remove
      list = remove(FAVORITE_KEY, compare)
    } else {
      // add
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    store.commit('setFavoriteList', list)
  }

  function isFavorite (song) {
    return favoriteList.value.findIndex(item => item.id === song.id) > -1
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
