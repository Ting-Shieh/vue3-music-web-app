<template>
  <div class="music-list">
    <!-- 返回鍵 -->
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <!-- 上方大標 -->
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <!-- 隨機撥放 -->
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" v-show="songs.length>0" @click="random">
          <i class="icon-play"></i>
          <span class="text">隨機撥放全部</span>
        </div>
      </div>
      <!-- 圖片蒙板 -->
      <div class="filter" :style="filterStyle"></div>
    </div>
    <wrap-scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
    </wrap-scroll>
    <!-- 版本1: 非使用高階組件 -->
    <!-- <base-scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
    </base-scroll> -->
  </div>
</template>
<script>
import SongList from '@/components/Base/SongList'
import WrapScroll from '@/components/WrapScroll/index.js'
// import BaseScroll from '@/components/Base/Scroll' // 非使用高階組件
import { mapActions, mapState } from 'vuex'
const RESERVED_HEIGHT = 40
export default {
  name: 'MusicList',
  components: {
    SongList,
    // BaseScroll,
    WrapScroll
  },
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    title: String,
    pic: String,
    // 該組件無數據獲取邏輯
    loading: Boolean,
    // 無相關資料時的字樣
    noResultText: {
      type: String,
      default: '抱歉，沒有找到可撥放歌曲。'
    },
    rank: Boolean
  },
  data () {
    return {
      imageHeight: 0,
      scrollY: 0, // 需要知道滾動的Y軸距離
      maxTranslateY: 0 // 最大可以滾動距離
    }
  },
  computed: {
    ...mapState([
      'playList'
    ]),
    bgImageStyle () {
      // 默認背景層
      const scrollY = this.scrollY
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      let translateZ = 0 // 處理ios 移動端兼容問題
      if (scrollY > this.maxTranslateY) {
        console.log('!!!')
        // 當滾動超過該位置 => 向上滑
        zIndex = 10 // 很重要
        paddingTop = 0
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1
      }
      let scale = 1
      if (scrollY < 0) {
        // 向下滑 背景放大
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }
      return {
        zIndex,
        paddingTop,
        height,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale}) translateZ(${translateZ}px)`
      }
    },
    scrollStyle () {
      const bottom = this.playList.length ? '60px' : '0'
      return {
        top: `${this.imageHeight}px`,
        bottom
      }
    },
    filterStyle () {
      let blur = 0
      /**
       * [技巧]
       * 計算屬性調用this值 "大於1次"
       * 依賴收集過程會發生多次
       * 利用局部變量緩存
       * 性能差異會有差
       */
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight
      if (scrollY >= 0) {
        // 往上推
        blur = Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 20
      }
      return {
        backdropFilter: `blur(${blur}px)`
      }
    },
    noResult () {
      return !this.loading && !this.songs.length
    },
    playBtnStyle () {
      let display = ''
      // 滾動到最上方
      if (this.scrollY >= this.maxTranslateY) {
        display = 'none'
      }
      return {
        display
      }
    }
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    // 可以滾動的最大高度
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    onScroll (pos) {
      this.scrollY = -pos.y
    },
    selectItem ({ song, index }) {
      // 派發actions
      this.selectPlay({ list: this.songs, index })
    },
    random () {
      // 派發actions
      this.randomPlay(this.songs)
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  }

}
</script>
<style lang="scss" scoped>
.music-list{
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      font-size: $font-size-large-x;
      color: $color-theme;
      padding: 10px;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    background-size: cover;
    transform-origin: top;
    // 一个 CSS 技巧，通过设置 height: 0; padding-top:xxx 让宽高按一定比例展示
    // https://juejin.cn/post/6844904070679887886
    // height:0;
    // padding-top:70%;
    .play-btn-wrapper{
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn{
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute !important;
    bottom: 0;
    width: 100%;
    z-index: 0;
    // overflow: hidden; // 效果會保留上方背景圖 v1
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
