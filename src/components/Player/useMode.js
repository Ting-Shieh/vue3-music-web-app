import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant.js'
export default function useMode () {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence ? 'icon-sequence' : playModeVal === PLAY_MODE.random ? 'icon-random' : 'icon-loop'
  })

  const changeMode = () => {
    const mode = (playMode.value + 1) % 3 //  0 1 2 間
    // 提交action
    store.dispatch('changeMode', mode)
  }

  return {
    modeIcon,
    changeMode
  }
}
