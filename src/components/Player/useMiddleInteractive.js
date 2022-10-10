/** 中間視圖層手指交互hook */

import { ref } from 'vue'

export default function useMiddleInteractive () {
  // data
  const currentShow = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  // 不須響應式
  const touch = {}
  let currentView = 'cd' // 最終當前視圖(拖曳過程中不發生變化)

  function onMiddleTouchStart (e) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY // 用於處理歌詞會斜向滑動問題
    touch.directionLocked = '' // 處理方向鎖
  }
  function onMiddleTouchMove (e) {
    // 手指拖動偏移距離(右->左為負值 | 左->右為正值)
    const deltaX = e.touches[0].pageX - touch.startX

    // 用於處理歌詞會斜向滑動問題
    const deltaY = e.touches[0].pageY - touch.startY

    // 對比
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }

    // 執行方向鎖
    if (touch.directionLocked === 'v') {
      return
    }

    // 初始位移 0 or 屏幕寬度位移
    const left = currentView === 'cd' ? 0 : -window.innerWidth

    // 偏移量(須限制在0~1)
    // const offsetWidth = left + deltaX
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, (left + deltaX)))

    // [思考]:偏移多少開始發生變化? => 計算偏移比例
    touch.percent = Math.abs(offsetWidth / window.innerWidth)
    console.log('touch.percent', touch.percent)
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
      opacity: 1 - touch.percent
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
    }
  }
  /** 鬆開手指，修改樣式 */
  function onMiddleTouchEnd () {
    let opacity
    let offsetWidth
    const duration = 300
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
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
