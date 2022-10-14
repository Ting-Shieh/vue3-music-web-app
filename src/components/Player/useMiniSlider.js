import { ref, onMounted, onUnmounted, computed, watch, nextTick, onActivated, onDeactivated } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
// 多次註冊OK
BScroll.use(Slide)
export default function useMiniSlider () {
  // data
  const sliderWrapperRef = ref(null)
  const slider = ref(null)
  // vuex
  const store = useStore()
  const playList = computed(() => store.state.playList)
  const fullScreen = computed(() => store.state.fullScreen)
  const currentIndex = computed(() => store.state.currentIndex)
  // computed
  const sliderShow = computed(() => !fullScreen.value && !!playList.value) // !!:轉成 Boolean 類型

  onMounted(() => {
    let sliderVal
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick()
        // MiniPlayer 出現時才初始化 BScroll 插件
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
          sliderVal.on('slidePageChanged', ({ pageX }) => {
            store.commit('setCurrentIndex', pageX)
            // 刪除歌曲時，不想觸發 setPlayingState
          })
        } else {
          sliderVal.refresh()
        }
        // https://better-scroll.github.io/docs/zh-CN/plugins/slide.html#%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95
        // (横向滚动到对应索引的 Page, 纵向滚动到对应索引的 Page, 动画时长)
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })
    //
    watch(currentIndex, (newIndex) => {
      // MiniPlayer 未顯示，則執行goToPage() 無意義
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })
    watch(playList, async (newList) => {
      // newList.length > 0 => refresh() 才不會出錯。否則清空播放列表會出現CloneNode錯誤。
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })
  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })
  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })
  onDeactivated(() => {
    slider.value.disable()
  })
  return {
    sliderWrapperRef,
    slider
  }
}
