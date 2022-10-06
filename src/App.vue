<template>
  <m-header />
  <tab />
  <router-view></router-view>
  <!-- 全局組件 -->
  <player></player>
</template>
<script setup>
import MHeader from '@/components/header/Header.vue'
import Tab from '@/components/Tab'
import Player from '@/components/Player'
import { } from 'vue'
</script>
<style lang="scss">
.this{
  border: 1px solid red;
}
</style>
