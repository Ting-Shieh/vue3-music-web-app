/**
 * 歌詞相關hook
 */
import { getLyric } from '@/service/song.js'
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import Lyric from 'lyric-parser'
export default function useLyric () {
  const currentLyric = ref(null)
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    // 不合法的歌曲
    if (!newSong.url && !newSong.id) {
      return
    }

    // 獲取歌詞
    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', { song: newSong, lyric })

    // [注意!!]
    // 異步獲取歌詞後，可能又會切換歌曲
    // getLyric() 過程中再切換歌曲，currentSong 會發生變化
    // getLyric() 請求結束回來後
    // currentSong newSong 已為不同歌曲
    // 故要中斷過程
    if (currentSong.value.lyric !== lyric) {
      return
    }
    // 解析歌詞
    currentLyric.value = new Lyric(lyric, handleLyric)
    // console.log(lyric)
  })

  function handleLyric () {}
}
