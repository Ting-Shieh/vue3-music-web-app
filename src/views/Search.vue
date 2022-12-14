<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <wrap-scroll ref="scrollRef" class="search-content" v-show="!query">
      <div class="">
        <div class="hot-keys">
          <h1 class="title">熱門搜索</h1>
          <ul>
            <li class="item" v-for="item in hotKeys" :key="item.id" @click="addQuery(item.key)">
              <span>{{item.key}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索歷史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <Confirm
            ref="confirmRef"
            text="是否清空所有搜索歷史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          >
          </Confirm>
          <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearch"/>
        </div>
      </div>
    </wrap-scroll>
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
import WrapScroll from '@/components/WrapScroll'
import Confirm from '@/components/Base/Confirm'
import SearchInput from '@/components/SearchInput'
import Suggest from '@/components/SearchInput/Suggest'
import SearchList from '@/components/Base/SearchList'
import { getHotKeys } from '@/service/search.js'
import { SINGER_KEY } from '@/assets/js/constant.js'
import useSearchHistory from '@/components/SearchInput/useSearchHistory.js'
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// fake data
const fakeData = [{ key: '张杰' }, { key: '125' }, { key: '789' }, { key: '658' }, { key: '55' }]
// data
const query = ref('')
const hotKeys = ref([])
const selectedSinger = ref(null)
const scrollRef = ref(null)
const confirmRef = ref(null)
// vuex
const store = useStore()
const searchHistory = computed(() => store.state.searchHistory)
// router
const router = useRouter()
// hooks
const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()
//
getHotKeys().then((res) => {
  console.log('getHotKeys:', res)
  hotKeys.value = res && res.hotKeys ? res.hotKeys : fakeData
})
// watch
watch(query, async (newQuery) => {
  if (!newQuery) {
    await nextTick()
    reFreshScroll()
  }
})
// methods
const addQuery = (key) => {
  query.value = key
}
const selectSong = (song) => {
  saveSearch(query.value)
  // 派發action selectSinger
  store.dispatch('addSong', song)
}
const selectSinger = (singer) => {
  saveSearch(query.value)
  selectedSinger.value = singer
  cacheSinger(singer)
  // 跳轉歌手詳情頁
  router.push({
    path: `/search/${singer.mid}`
  })
}
function cacheSinger (singer) {
  /**
   * 緩存對象
   * JSON.stringify()  JSON.parse()
   */
  sessionStorage.setItem(SINGER_KEY, JSON.stringify(singer))
}
function reFreshScroll () {
  scrollRef.value.scroll.refresh()
}
function showConfirm () {
  confirmRef.value.show()
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
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
  .search-result {
      flex: 1;
      overflow: hidden;
    }
}
</style>
