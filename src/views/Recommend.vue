<template>
  <div class="recommend" v-loading:[loadingText]="loading">
    <!--
      base-scroll[版本1]: 非使用高階組件
      wrap-scroll[版本2]: 使用高階組件
    -->
    <wrap-scroll class="recommend-content">
      <div class="">
        <div class="slider-wrapper">
            <div class="slider-content">
              <base-slider v-if="sliders.length" :sliders="sliders"/>
            </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">熱門歌曲推薦</h1>
          <ul>
            <li v-for="item in albums" :key="item.id" class="item" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.pic" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name">{{ item.username }}</h2>
                <p class="title">{{item.title}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </wrap-scroll>
    <router-view v-slot="{ Component }">
      <!-- appear 一進入就有動畫 -->
      <transition appear name="slide">
        <component :is="Component" :data="selectedAlbum"/>
      </transition>
    </router-view>
  </div>
</template>
<script setup>
import { getRecommend } from '@/service/recommend.js'
import { ALBUM_KEY } from '@/assets/js/constant.js'
import WrapScroll from '@/components/WrapScroll/index.js'
// import BaseScroll from '@/components/Base/Scroll' // 非使用高階組件
import BaseSlider from '@/components/Base/Slider'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// router
const router = useRouter()
// data
const sliders = ref([])
const albums = ref([])
const selectedAlbum = ref(null)
// computed
const loadingText = ref('正在載入..')
const loading = computed(() => !sliders.value.length && !albums.value.length)

// methods
const initData = async () => {
  const res = await getRecommend()
  sliders.value = res.sliders
  albums.value = res.albums
}
const selectItem = (album) => {
  selectedAlbum.value = album
  cacheAlbum(album)
  router.push({
    path: `/recommend/${album.id}`
  })
}

const cacheAlbum = (album) => {
  /**
 * 緩存對象
 * JSON.stringify()  JSON.parse()
 */
  sessionStorage.setItem(ALBUM_KEY, JSON.stringify(album))
}
// 執行
initData()
</script>
<style lang="scss" scoped>
.recommend{
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper{
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list{
      .list-title{
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item{
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 10px 20px;
        // padding: 0 20px 20px 20px;
        .icon{
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
          img{}

        }
        .text{
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          font-size: $font-size-medium;
          overflow: hidden;
          .name{
            margin-bottom: 10px;
            color: $color-text;
          }
          .title{
            color: $color-text-d;
          }
        }
      }
    }
  }
}
</style>
