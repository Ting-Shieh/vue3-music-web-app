import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY, PLAY_KEY } from '@/assets/js/constant.js'
import { load } from '@/assets/js/array-store.js'
const state = {
  sequenceList: [],
  // 播放列表
  playList: [],
  // 是否正在撥放
  playing: false,
  // 播放模式
  playMode: PLAY_MODE.sequence,
  // 當前播放索引
  currentIndex: 0,
  // 播放狀態
  fullScreen: false,
  // 收藏列表
  favoriteList: load(FAVORITE_KEY),
  // 搜索歷史紀錄
  searchHistory: load(SEARCH_KEY),
  // 播放歷史
  playHistory: load(PLAY_KEY)
}

export default state
