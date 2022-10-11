/** CD 飛躍動畫 (小CD到大CD叫進入|大CD到小CD叫離開)
 * ↗ : enter
 * ↙ : leave
 * [注意]: 動畫未完成即觸發另一個動畫
 * 情境: 用戶太快點擊所產生的Bug
 * */
import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation () {
  const cdWrapperRef = ref(null)
  let entering = false
  let leaving = false

  // hook
  /** 法1:使用函式庫，完成"進入"過渡動畫 */
  function enter (el, done) {
    // 離開過渡動畫尚未結束時
    if (leaving) {
      afterLeave()
    }
    entering = true
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
    entering = false
    // 清理 animation
    animations.unregisterAnimation('move')
    cdWrapperRef.value.animation = ''
  }
  /** 法2:使用原生方法，完成"離開"過渡動畫 */
  function leave (el, done) {
    // 進入過渡動畫尚未結束時
    if (entering) {
      afterEnter()
    }
    leaving = true
    const { x, y, scale } = getPostAndScale()
    const cdWrapperEl = cdWrapperRef.value

    cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    // 動畫結束事件
    cdWrapperEl.addEventListener('transitionend', next)

    function next () {
      // 動畫為主動綁定，所以結束後要親自解綁定。
      cdWrapperEl.removeEventListener('transitionend', next)
      done()
    }
  }
  function afterLeave () {
    leaving = false
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ''
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
    afterLeave
  }
}
