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
const emit = defineEmits(['scroll'])
const rootRef = ref(null)
// eslint-disable-next-line
const scroll = useScroll(rootRef, props, emit)
defineExpose({ scroll })
</script>
<style lang="scss" scoped>

</style>
