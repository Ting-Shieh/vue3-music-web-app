<template>
  <div class="tab">
    <router-link class="tab-item" v-for="tab in tabs" :key="tab.path" :to="tab.path">
      <span class="tab-link">{{tab.name}}</span>
    </router-link>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
const tabs = reactive([
  {
    name: '推薦',
    path: '/recommend'
  },
  {
    name: '歌手',
    path: '/singer'
  },
  {
    name: '排行',
    path: '/top-list'
  },
  {
    name: '搜尋',
    path: '/search'
  }
])
</script>
<style lang="scss" scoped>
.tab{
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;
  .tab-item{
    text-align: center;
    flex: 1;
    .tab-link{
      padding-bottom: 5px;
      color: $color-text-l;
    }
    &.router-link-active {
      .tab-link{
        color: $color-theme!important;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
}
</style>
