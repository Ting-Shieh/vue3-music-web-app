export const currentSong = (state) => {
  // 初始時取不到給予空對象
  return state.playList[state.currentIndex] || {}
}
