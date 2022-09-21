import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeCls = 'g-relative'

/** vue2 構造 */
export default function createLoadingLikeDirective (Comp) {
  /**
   * 掛載
   * @param {*} el 指定dom
   */
  function append (el) {
    // 加入相對定位樣式，先拿到dom style
    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    el.appendChild(el.instance.$el)
  }
  function remove (el) {
    removeClass(el, relativeCls)
    el.removeChild(el.instance.$el)
   }
  return {
    // 組建構載後觸發
    mounted (el, binding) {
      // 新建vue實例
      const app = createApp(Comp)
      // 拿實例
      const instance = app.mount(document.createElement('div'))
      // loading 組件實例
      el.instance = instance
      // 動態參數
      const title = binding.arg
      if (typeof title !== 'undefined') {
        // 組件的method
        el.instance.setTitle(title)
      }
      // 執行掛載操作
      if (binding.value) {
        append(el)
      }
     },
    updated (el, binding) {
      const title = binding.arg
      if (typeof title !== 'undefined') {
        el.instance.setTitle(title)
      }
      // 前後不一致
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }
}
