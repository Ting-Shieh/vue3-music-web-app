<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <div class="search-content" v-show="!query">
      <div class="hot-keys">
        <h1 class="title">熱門搜索</h1>
        <ul>
          <li class="item" v-for="item in hotKeys" :key="item.id" @click="addQuery(item.key)">
            <span>{{item.key}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" @select-song="selectSong" @select-singer="selectSinger"/>
    </div>
    <!-- 二級路由 -->
    <router-view v-slot="{ Component }">
      <!-- appear 一進入就有動畫 -->
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import SearchInput from '@/components/SearchInput'
import Suggest from '@/components/SearchInput/Suggest'
import { getHotKeys } from '@/service/search.js'
import { SINGER_KEY } from '@/assets/js/constant.js'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// fake data
const fakeData = [{ key: '张杰' }, { key: '125' }, { key: '789' }, { key: '658' }, { key: '55' }]
// data
const query = ref('')
const hotKeys = ref([])
const selectedSinger = ref(null)
// vuex
const store = useStore()
// router
const router = useRouter()
//
getHotKeys().then((res) => {
  console.log('getHotKeys:', res)
  hotKeys.value = res && res.hotKeys ? res.hotKeys : fakeData
})
// methods
const addQuery = (key) => {
  query.value = key
}
const selectSong = (song) => {
  // 派發action selectSinger
  store.dispatch('addSong', song)
}
const selectSinger = (singer) => {
  selectedSinger.value = singer
  cacheSinger(singer)
  // 跳轉歌手詳情頁
  router.push({
    path: `/search/${singer.mid}`
  })
}
const cacheSinger = (singer) => {
  /**
   * 緩存對象
   * JSON.stringify()  JSON.parse()
   */
  sessionStorage.setItem(SINGER_KEY, JSON.stringify(singer))
}
</script>
<style lang="scss" scoped>
.search{
  box-sizing: border-box;  // try
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper{
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
  }
  .search-result {
      flex: 1;
      overflow: hidden;
    }
}
</style>
