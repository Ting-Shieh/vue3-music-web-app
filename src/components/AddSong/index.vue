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
          <Switches v-model="currentIndex" :items="COMMON_STR.switches_options"/>
        </div>
        <div class="list-wrapper">
          <base-scroll ref="scrollRef" v-if="currentIndex === 0" class="list-scroll">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSongBySongList"></song-list>
            </div>
          </base-scroll>
          <base-scroll ref="scrollRef" v-if="currentIndex === 1" class="list-scroll">
            <div class="list-inner">
              <search-list :searches="searchHistory" :show-delete="false" @select="addQuery"></search-list>
            </div>
          </base-scroll>
        </div>
        <div class="search-result" v-show="query">
          <suggest :show-singer="false" :query="query" :select-song="selectSongBySuggest"></suggest>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script setup>
import SearchInput from '@/components/SearchInput'
import Suggest from '@/components/SearchInput/Suggest.vue'
import Switches from '@/components/Base/Switches'
import SongList from '@/components/Base/SongList'
import SearchList from '@/components/Base/SearchList'
import BaseScroll from '@/components/Base/Scroll'
import { COMMON_STR } from '@/assets/js/constant.js'
import { ref, defineExpose, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import useSearchHistory from '@/components/SearchInput/useSearchHistory.js'
// data
const query = ref('')
const visible = ref(false)
const currentIndex = ref(0)
const scrollRef = ref(null)
// vuex
const store = useStore()
const searchHistory = computed(() => store.state.searchHistory)
const playHistory = computed(() => store.state.playHistory)
// hooks
const { saveSearch } = useSearchHistory()
// watch
watch(query, async () => {
  await nextTick()
  refreshScroll()
})
// methods
async function show () {
  visible.value = true
  await nextTick()
  refreshScroll()
}
function hide () {
  visible.value = false
}
function refreshScroll () {
  scrollRef.value.scroll.refresh()
}
function addQuery (s) {
  query.value = s
}
function selectSongBySongList ({ song }) {
  addSong(song)
}
function addSong (song) {
  store.dispatch('addSong', song)
}
function selectSongBySuggest (song) {
  addSong(song)
  saveSearch(query.value)
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
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}
</style>
