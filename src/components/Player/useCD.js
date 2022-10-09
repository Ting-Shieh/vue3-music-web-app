import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
/**
 * CD旋轉
 * play: 旋轉
 * pause: 旋轉暫停
 */
export default function useCD () {
  // data
  const cdRef = ref(null)
  const cdImageRef = ref(null)
  // vuex
  const store = useStore()
  const playing = computed(() => store.state.playing)
  // computed
  const cdCls = computed(() => playing.value ? 'playing' : '')

  // 觀測playing狀態變換，不同步旋轉角度
  watch(playing, (newPlaying) => {
    // 暫停狀態
    if (!newPlaying) {
      syncTransForm(cdRef.value, cdImageRef.value)
    }
  })

  /**
   * 同步旋轉角度
   * @param {*} cdRef
   * @param {*} cdImageRef
   */
  function syncTransForm (wrapper, inner) {
    // 外層圖片角度
    const wrapperTransform = getComputedStyle(wrapper).transform
    // 內層圖片角度
    const innerTransform = getComputedStyle(inner).transform
    // 同步外層角度
    // 外層角度相對於內層初始角度為0，暫停後再執行播放，變成初始值唯有角度狀態(非為0)
    // 非為則採疊加(字符串疊加 innerTransform.concat(' ', wrapperTransform) )
    // 字符串疊加: https://codepen.io/HaoyCn/pen/BZZrLd
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }
  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
