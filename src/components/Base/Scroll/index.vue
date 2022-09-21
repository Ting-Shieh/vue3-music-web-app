<template>
  <div ref="rootRef" class="">
    <slot></slot>
  </div>
</template>
<script setup>
import useScroll from './useScroll.js'
import { ref, defineProps } from 'vue'
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

const rootRef = ref(null)
useScroll(rootRef, props)

</script>
<style lang="scss" scoped>

</style>
