<template>
  <div class="suggest" v-loading:[loadingText]="!singer && !songs.length">
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{song.name}}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">
            {{song.singer}}-{{song.name}}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { processSongs } from '@/service/song.js'
import { search } from '@/service/search.js'
import { ref, defineProps, watch } from 'vue'
// 之後添加歌曲時，支持用戶作搜索
const props = defineProps({
  query: String,
  showSinger: {
    type: Boolean,
    default: true
  }
})

// data
const singer = ref(null)
const songs = ref([])
const hasMore = ref(true) // 是否顯示更多
const page = ref(1) // 頁碼
const loadingText = ref('')
// computed

// watch
/**
 * https://blog.csdn.net/chencaw/article/details/121246917
 * watch props 採用以下方式
 * () => getter 函數
 */
watch(() => props.query, async (newQuery) => {
  if (!newQuery) {
    return
  }
  await searchFirst()
})

// methods
/** 重置 */
const searchFirst = async () => {
  page.value = 1
  songs.value = []
  singer.value = null
  hasMore.value = true
  // api
  const res = await search(props.query, page.value, props.showSinger)
  songs.value = await processSongs(res.songs)
  singer.value = res.singer
  hasMore.value = res.hasMore
}
</script>
<style lang="scss" scoped>
.suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: 14px;
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;
          .text {
            @include no-wrap();
          }
        }
      }
    }
  }
</style>
