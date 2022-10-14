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
  },
  // 設置收藏列表
  setFavoriteList (state, list) {
    state.favoriteList = list
  },
  // 設置搜索歷史紀錄
  setSearchHistory (state, list) {
    state.searchHistory = list
  },
  // 設置播放歷史
  setPlayHistory (state, list) {
    state.playHistory = list
  },
  /**
   * 添加歌詞
   * playList, sequenceList 都會有lyric
   * 因為指向同一個對象
   * @param {*} state
   * @param {*} param1
   */
  addSongLyric (state, { song, lyric }) {
    // 拿到每一首歌
    state.sequenceList.map(item => {
      if (item.mid === song.mid) {
        // 匹配後，添加歌詞
        item.lyric = lyric
      }
      return item
    })
  }
}
/**
 * [思考!!]
 * 虽然两个数组指向不同，但是这两个数组内部的对象是同一份，这样的话即使是遍历其中一个数组去修改内部的对象，另一个也会跟着变化
 *  const obj = {a: '123'}; const arr1 = [obj]; const arr2 = [obj]; arr1.map(item => item.id = 1)
 *  console.log(arr1)
 *  console.log(arr2)
 *  console.log(obj)
 */

export default mutations
