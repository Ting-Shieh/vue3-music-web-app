/** CD 飛躍動畫 (小到大叫進入|大到小叫離開)
 * ↗ : enter
 * ↙ : leave
 * */
import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation () {
  const cdWrapperRef = ref(null)

  // hook
  function enter (el, done) {
    const { x, y, scale } = getPostAndScale()
    const animation = {
      // 小cd
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      // 大cd
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }
    // this creates the animation above
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })
    // then run it
    // el, 'move', function
    // 調用done函數才能進入 afterEnter()
    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }
  function afterEnter () {
    // 清理 animation
    animations.unregisterAnimation('move')
    cdWrapperRef.value.animation = ''
  }
  function leave () {
  }
  function afterLeave () {
  }
  function getPostAndScale () {
    const targetWidth = 40 // 小CD 40px
    const width = window.innerWidth * 0.8 // 大CD 整個螢幕寬度的80%
    const paddingLeft = 40 // 20+20
    const paddingBottom = 30 // 20+10
    const paddingTop = 80 // .middle 上方距離
    // ↽ + ⇃ = ↙
    const x = -((window.innerWidth / 2) - paddingLeft)
    const y = window.innerHeight - paddingTop - (width / 2) - paddingBottom
    const scale = targetWidth / width
    return { x, y, scale }
  }
  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave,
    getPostAndScale
  }
}
