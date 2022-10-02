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
