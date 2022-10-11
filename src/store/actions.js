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

/**
 * 移除歌曲
 * @param {*} param0
 * @param {*} song
 */
export function removeSong ({ commit, state }, song) {
  // 獲得副本 => vuex 修改state 一釘得用提交mutations方式
  const sequenceList = state.sequenceList.slice()
  const playList = state.playList.slice()
  // 找索引
  const sequenceIndex = findArrayIndex(sequenceList, song)
  const playIndex = findArrayIndex(playList, song)
  if (playIndex < 0 || sequenceIndex < 0) {
    return
  }

  // 刪除
  sequenceList.splice(sequenceIndex, 1)
  playList.splice(playIndex, 1)

  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playList.length) {
    // 整個列表長度已經變了
    currentIndex--
  }

  // 提交副本
  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  commit('setCurrentIndex', currentIndex)
}

function findArrayIndex (list, song) {
  return list.findIndex(item => item.id === song.id)
}
