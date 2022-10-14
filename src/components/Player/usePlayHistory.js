import { useStore } from 'vuex'
import { PLAY_KEY } from '@/assets/js/constant.js'
import { save } from '@/assets/js/array-store.js'
export default function usePlayHistory () {
  const maxLen = 100
  const store = useStore()

  function savePlay (song) {
    const songs = save(song, PLAY_KEY, (item) => { return item.id === song.id }, maxLen)
    store.commit('setPlayHistory', songs)
  }

  return {
    savePlay
  }
}
