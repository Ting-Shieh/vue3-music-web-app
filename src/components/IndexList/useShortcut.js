import { computed, ref } from 'vue'

export default function useShortcut (props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)
  const touch = {}
  const shortcutList = computed(() => {
    return props.data.map(group => {
      return group.title
    })
  })

  function onShortcutTouchStart (e) {
    console.log('onShortcutTouchStart e', e)
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.anchorIndex = anchorIndex
    touch.y1 = e.touches[0].pageY
    scrollTo(anchorIndex)
  }
  function onShortcutTouchMove (e) {
    // console.log('onShortcutTouchMove e', e.target)
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0 // 正數向下取整
    const anchorIndex = touch.anchorIndex + delta
    //
    scrollTo(anchorIndex)
  }
  function scrollTo (index) {
    // console.log('index:', index)
    // 點擊外框滑動會出現NaN，視為無效拖動
    if (isNaN(index)) {
      return
    }
    // 控制 index 區間限制
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }
  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    scrollRef
  }
}
