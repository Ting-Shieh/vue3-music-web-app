<template>
  <m-header />
  <tab />
  <router-view :style="viewStyle"></router-view>
  <!-- 全局組件 -->
  <player></player>
</template>
<script setup>
import MHeader from '@/components/header/Header.vue'
import Tab from '@/components/Tab'
import Player from '@/components/Player'
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const viewStyle = computed(() => {
  const bottom = store.state.playList.length ? '60px' : '0'
  return {
    bottom
  }
})
</script>
<style lang="scss">
.this{
  border: 1px solid red;
}
</style>
