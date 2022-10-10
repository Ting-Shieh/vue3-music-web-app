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
      <div>
        <h2 class="name">{{currentSong.name}}</h2>
        <p class="desc">{{currentSong.singer}}</p>
      </div>
      <!-- <div class="slider-wrapper">
        <div class="slider-group">
          <div class="slider-page">
            <h2 class="name">{{currentSong.name}}</h2>
            <p class="desc">{{currentSong.singer}}</p>
          </div>
        </div>
      </div> -->
      <!-- <div class="control"></div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div> -->
    </div>
  </transition>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import useCD from './useCD.js'
//  vuex
const store = useStore()
const fullScreen = computed(() => store.state.fullScreen)
const currentSong = computed(() => store.getters.currentSong)
// hook
const { cdCls, cdRef, cdImageRef } = useCD()

const showNormalPlayer = () => {
  store.commit('setFullScreen', true)
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
  &.mini-enter-active, &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from, &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0) // 下往上冒出
  }
 }
</style>
