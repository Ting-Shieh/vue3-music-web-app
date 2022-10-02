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
    const name = Comp.name // v2
    // 加入相對定位樣式，先拿到dom style
    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    // // 組件上只有一個指令而已 v1
    // el.appendChild(el.instance.$el)
    el.appendChild(el[name].instance.$el)
  }
  function remove (el) {
    const name = Comp.name
    removeClass(el, relativeCls)
    // // v1
    // el.removeChild(el.instance.$el)
    el.removeChild(el[name].instance.$el)
   }
  return {
    // 組建構載後觸發
    mounted (el, binding) {
      // 新建vue實例
      const app = createApp(Comp)
      // 拿實例
      const instance = app.mount(document.createElement('div'))
      // // loading 組件實例 (組件上只有一個指令而已 v1)
      // el.instance = instance
      // 同時處理不同組件
      const name = Comp.name
      // console.log('binding:==>', binding, '--', name)
      // console.log('Comp:==>', Comp)
      // console.log('el[name]:==>', el[name])
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance
      // console.log('el[name].instance:==>', el[name].instance)
      // 動態參數
      const title = binding.arg
      if (typeof title !== 'undefined') {
        // // 組件的method V1
        // el.instance.setTitle(title)
        el[name].instance.setTitle(title)
      }
      // 執行掛載操作
      if (binding.value) {
        append(el)
      }
     },
    updated (el, binding) {
      const title = binding.arg
      const name = Comp.name
      if (typeof title !== 'undefined') {
        // // 組件上只有一個指令而已 v1
        // el.instance.setTitle(title)
        // v2
        el[name].instance.setTitle(title)
      }
      // 前後不一致
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }
}
