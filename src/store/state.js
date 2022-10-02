import { PLAY_MODE } from '@/assets/js/constant.js'
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
  fullScreen: false
}

export default state
