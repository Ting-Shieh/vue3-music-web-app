import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, ref, onActivated, onDeactivated } from 'vue'
BScroll.use(ObserveDOM)
export default function useScroll (wrapperRef, options, emit) {
  const scroll = ref(null)

  onMounted(() => {
    // 不要每次調用，使用緩存
    const scrollVal = scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
    if (options.probeType > 0) {
      // 監聽scroll事件
      scrollVal.on('scroll', (pos) => {
        // 透過事件派發，給外部拿到值
        // console.log('pos:', pos)
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })
  // ===== Start使用keep-alive 組件 ========
  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })

  onDeactivated(() => {
    scroll.value.disable()
  })
  // ===== End 使用keep-alive 組件 ========
  return scroll
}
