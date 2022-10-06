import { PLAY_MODE } from '@/assets/js/constant.js'
import { shuffle } from '@/assets/js/util.js'

/** actions: 對多個mutation 進行封裝 */

/**
 * 基本播放
 * @param {*} param0
 * @param {*} param1
 */
export function selectPlay({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', list)
  commit('setCurrentIndex', index)
}

/**
 * 隨機撥放
 * @param {*} param0
 * @param {*} list
 */
export function randomPlay({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', shuffle(list))
  commit('setCurrentIndex', 0)
}
/**
 * 切換播放模式
 * @param {*} param0
 * @param {*} mode
 */
export function changeMode ({ commit, state, getters }, mode) {
  // 改變播放列表，但不改變當前撥放歌曲
  const currentId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    // 播放列表需要隨機化
    commit('setPlayList', shuffle(state.sequenceList))
  } else {
    // 順序播放
    commit('setPlayList', state.sequenceList)
  }
  // 當前播放歌曲，在新列表中的位置
  const index = state.playList.findIndex(song => song.id === currentId)
  commit('setCurrentIndex', index)
  // 改變播放模式
  commit('setPlayMode', mode)
}
