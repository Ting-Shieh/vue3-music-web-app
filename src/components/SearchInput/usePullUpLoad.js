import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'
BScroll.use(PullUp)
BScroll.use(ObserveDOM)
export default function usePullUpLoad (requestData, preventPullUpLoad) {
  const scroll = ref(null)
  const rootRef = ref(null)
  const isPullUpLoad = ref(false)

  onMounted(() => {
    const scrollVal = scroll.value = new BScroll(rootRef.value, {
      pullUpLoad: true,
      ObserveDOM: true,
      click: true
    })
    // 派發事件
    scrollVal.on('pullingUp', pullingUpHandler)

    async function pullingUpHandler () {
      // 首次請求與 makeItScrollable()，不要觸發下拉加載
      if (preventPullUpLoad.value) {
        scrollVal.finishPullUp()
        return
      }
      isPullUpLoad.value = true
      // 由外部傳入實際請求
      await requestData()
      scrollVal.finishPullUp()
      scrollVal.refresh()
      isPullUpLoad.value = false
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })
  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })
  onDeactivated(() => {
    scroll.value.disable()
  })
  return {
    rootRef,
    scroll,
    isPullUpLoad
  }
}
