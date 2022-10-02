// 對state做修改
const mutations = {
  // 修改播放狀態
  setPlayingState(state, playing) {
    state.playing = playing
  },
  // 設置順序播放列表
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  // 設置播放列表
  setPlayList(state, list) {
    state.playList = list
  },
  // 修改播放模式
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  // 設置當前播放索引
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  // 設置是否全螢幕播放
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  }
}

export default mutations
