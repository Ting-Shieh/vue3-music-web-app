<template>
  <transition name="mini">
    <div
      class="mini-player"
      v-show="!fullScreen"
      @click="showNormalPlayer"
    >
      <div class="cd-wrapper">
        <div ref="cdRef" class="cd">
          <img ref="cdImageRef" :class="cdCls" :src="currentSong.pic" width="40" height="40"></div>
      </div>
      <!-- v1:無法左右滑動切割 -->
      <!-- <div>
        <h2 class="name">{{currentSong.name}}</h2>
        <p class="desc">{{currentSong.singer}}</p>
      </div> -->
      <div class="slider-wrapper" ref="sliderWrapperRef">
        <div class="slider-group">
          <div class="slider-page" v-for="song in playList" :key="song.id">
            <h2 class="name">{{song.name}}</h2>
            <p class="desc">{{song.singer}}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <progress-circle :radius="32" :progress="progress">
          <i class="icon-mini" :class="miniPlayIcon" @click.stop="togglePlay"></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="showPlayList">
        <i class="icon-playlist"></i>
      </div>
      <play-list-comp ref="playListRef" />
    </div>
  </transition>
</template>
<script setup>
import { computed, defineProps, ref } from 'vue'
import { useStore } from 'vuex'
import useCD from './useCD.js'
import useMiniSlider from './useMiniSlider.js'
import ProgressCircle from './ProgressCircle.vue'
import PlayListComp from './PlayList.vue'
// data
const playListRef = ref(null)
//  vuex
const store = useStore()
const fullScreen = computed(() => store.state.fullScreen)
const currentSong = computed(() => store.getters.currentSong)
const playing = computed(() => store.state.playing)
const playList = computed(() => store.state.playList)
// hook
const { cdCls, cdRef, cdImageRef } = useCD()
const { sliderWrapperRef } = useMiniSlider()
// computed
const miniPlayIcon = computed(() => playing.value ? 'icon-pause-mini' : 'icon-play-mini')
// props
defineProps({
  progress: {
    type: Number,
    default: 0
  },
  togglePlay: {
    type: Function
  }
})

// methods
const showNormalPlayer = () => {
  store.commit('setFullScreen', true)
}
const showPlayList = () => {
  playListRef.value.show()
}

</script>
<style lang="scss" scoped>
 .mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper{
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .controls{
    right: 0;
    position: absolute;
    display: flex;
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  // .name {
  //   margin-bottom: 2px;
  //   @include no-wrap();
  //   font-size: $font-size-medium;
  //   color: $color-text;
  // }
  // .desc {
  //   @include no-wrap();
  //   font-size: $font-size-small;
  //   color: $color-text-d;
  // }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      display: inline-block;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  &.mini-enter-active, &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from, &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0) // 下往上冒出
  }
 }
</style>
