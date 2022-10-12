<template>
  <div ref="rootRef" class="">
    <slot></slot>
  </div>
</template>
<script setup>
import useScroll from './useScroll.js'
import { ref, defineProps, defineEmits, defineExpose } from 'vue'
const props = defineProps({
  click: {
    type: Boolean,
    default: true
  },
  probeType: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(['scroll'])
const rootRef = ref(null)
// eslint-disable-next-line
const scroll = useScroll(rootRef, props, emits)
// 因應改良高階組件WrapScroll :props, emits 暴露出去
defineExpose({ scroll, props, emits })
</script>
<style lang="scss" scoped>

</style>
