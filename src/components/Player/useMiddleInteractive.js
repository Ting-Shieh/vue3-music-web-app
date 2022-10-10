/** 中間視圖層手指交互hook */

import { ref } from 'vue'

export default function useMiddleInteractive () {
  // data
  const currentShow = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  // 不須響應式
  const touch = {}
  const currentView = 'cd' // 最終當前視圖(拖曳過程中不發生變化)

  function onMiddleTouchStart (e) {
    touch.startX = e.touches[0].pageX
  }
  function onMiddleTouchMove (e) {
    // 手指拖動偏移距離(右->左為負值 | 左->右為正值)
    const deltaX = e.touches[0].pageX - touch.startX
    // 初始位移 0 or 屏幕寬度位移
    const left = currentView === 'cd' ? 0 : -window.innerWidth

    // 偏移量(須限制在0~1)
    // const offsetWidth = left + deltaX
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, (left + deltaX)))

    // [思考]:偏移多少開始發生變化? => 計算偏移比例
    touch.percent = Math.abs(offsetWidth / window.innerWidth)
    if (currentView === 'cd') {
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    // 修改樣式
    middleLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: '0ms'
    }
    middleRStyle.value = {
      transition: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: '0ms'
    }
  }
  function onMiddleTouchEnd () {
  }
  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
