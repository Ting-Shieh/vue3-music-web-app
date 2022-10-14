<template>
  <div class="user-center">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <div class="switches-wrapper">
      <Switches
        :items="user_switches_options"
        v-model="currentIndex"
      ></Switches>
    </div>
    <div class="play-btn">
      <i class="icon-play"></i>
      <span class="text">隨機播放全部</span>
    </div>
    <div class="list-wrapper">
      <wrap-scroll class="list-scroll" v-if="currentIndex===0">
        <div class="list-inner">
          <song-list :songs="favoriteList"></song-list>
        </div>
      </wrap-scroll>
      <wrap-scroll class="list-scroll" v-if="currentIndex===1">
        <div class="list-inner">
          <song-list :songs="playHistory"></song-list>
        </div>
      </wrap-scroll>
    </div>
  </div>
</template>
<script>
import Switches from '@/components/Base/Switches'
import SongList from '@/components/Base/SongList'
import WrapScroll from '@/components/WrapScroll/index.js'
import { COMMON_STR } from '@/assets/js/constant.js'
import { mapState } from 'vuex'
export default {
  name: 'UserCenter',
  components: {
    Switches,
    WrapScroll,
    SongList
  },
  data () {
    return {
      currentIndex: 0,
      user_switches_options: COMMON_STR.user_switches_options
    }
  },
  computed: {
    ...mapState([
      'favoriteList',
      'playHistory'
    ])
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .switches-wrapper {
    margin: 10px 0 30px 0;
  }
  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    color: $color-text-l;
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
  .list-wrapper {
    position: absolute;
    top: 110px;
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
}
</style>
