<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-input-wrapper">
          <search-input v-model="query" placeholder="搜索歌曲"></search-input>
        </div>
        <!-- v-show="!query" -->
        <div >
          <Switches :items="['Tab1','Tab2']"/>
        </div>
        <div class="search-result" v-show="query">
          <suggest :show-singer="false" :query="query"></suggest>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script setup>
import SearchInput from '@/components/SearchInput'
import Suggest from '@/components/SearchInput/Suggest.vue'
import Switches from '@/components/Base/Switches'
import { ref, defineExpose } from 'vue'

// data
const query = ref('')
const visible = ref(false)
// vuex

// computed
// methods
function show () {
  visible.value = true
}
function hide () {
  visible.value = false
}
defineExpose({ show })
</script>
<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}
</style>
