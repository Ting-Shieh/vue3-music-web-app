import Scroll from '@/components/Base/Scroll'
import { h, mergeProps, withCtx, renderSlot, ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render (ctx) {
    return h(Scroll, mergeProps({ ref: 'scrollRef' }, ctx.$props, {
      onScroll: (e) => {
        ctx.$emit('scroll', e)
      }
    }), {
      default: withCtx(() => {
        return [renderSlot(ctx.$slots, 'default')]
      })
    })
  },
  setup () {
    // console.log('wrap-scroll:', Scroll)
    const scrollRef = ref(null)
    const scroll = computed(() => scrollRef.value.scroll)
    const store = useStore()
    const playList = computed(() => store.state.playList)

    watch(playList, async () => {
      await nextTick()
      scrollRef.value.scroll.refresh()
    })
    return {
      scrollRef,
      scroll
    }
  }
}
