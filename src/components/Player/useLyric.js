/**
 * 歌詞相關hook
 */
import { getLyric } from '@/service/song.js'
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import Lyric from 'lyric-parser'

/**
 * 歌詞相關hook
 * @param {*} songReady: 歌曲是否已緩衝好 | currentTime: 當前播放時間
 * @returns
 */
export default function useLyric ({ songReady, currentTime }) {
  // data
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  // vuex
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    // 不合法的歌曲
    if (!newSong.url && !newSong.id) {
      return
    }

    // 切換歌曲前先暫停播放歌詞(此時是上首歌)
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0

    // 獲取歌詞
    const lyric = await getLyric(newSong)
    // console.log(lyric)
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
    // 2個異步過程 (1)await getLyric(newSong)。(2) 播放過程中會觸發:audio @canplay。
    currentLyric.value = new Lyric(lyric, handleLyric)
    if (songReady.value) {
      playLyric()
    }
  })
  /**
   * 一行行翻譯
   */
  function handleLyric ({ lineNum }) {
    currentLineNum.value = lineNum

    // 組件實例
    const scrollComp = lyricScrollRef.value
    // list element dom
    const listEl = lyricListRef.value

    // v-if="currentLyric" 控制，故可能為空
    if (!listEl) {
      return
    }

    //
    if (lineNum > 5) {
      if (lineNum > 5) {
        const lineEl = listEl.children[lineNum - 5] // - 5 位置偏中間
        // 滾動到特定 Element, 1秒
        scrollComp.scroll.scrollToElement(lineEl, 1000)
      } else {
        // 滾動到頂部
        scrollComp.scroll.scrollTo(0, 0, 1000)
      }
    }
  }
  /**
   * 播放歌詞
   */
  function playLyric () {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }
  /** 暫停歌詞 */
  function stopLyric () {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }
  return {
    currentLyric,
    currentLineNum,
    playLyric, // 防止 songReady.value = false，audio @canplay="ready"會偵測觸發 songReady.value = true，再次執行playLyric()
    stopLyric,
    lyricScrollRef,
    lyricListRef
  }
}
