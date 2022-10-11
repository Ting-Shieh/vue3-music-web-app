<template>
  <teleport to="body">
    <transition name="list-fade">
      <div
        class="playlist"
        v-show="visible && playList.length"
        @click="hide"
      >
        <div class="list-wrapper">
          <!-- 頂部 -->
          <div class="list-header">
            <h1 class="title">
              <!-- 播放模式按鈕 -->
              <i
               class="icon"
               :class="modeIcon"
               @click.stop="changeMode"
              ></i>
              <span class="text">{{modeText}}</span>
              <span class="clear"></span>
            </h1>
          </div>
          <!-- 中間 -->
          <base-scroll
            class="list-content"
            ref="scrollRef"
          >
            <ul>
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
              >
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{song.name}}</span>
                <!-- 收藏 -->
                <span
                  class="favorite"
                  @click.stop="toggleFavorite(song)"
                >
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
              </li>
            </ul>
          </base-scroll>
          <!-- 底部 -->
          <div class="list-footer" @click.stop="hide">
            <span>關閉</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script setup>
import BaseScroll from '@/components/Base/Scroll'
import useMode from './useMode.js'
import useFavorite from './useFavorite.js'
import { computed, ref, defineExpose, nextTick } from 'vue'
import { useStore } from 'vuex'
// data
const visible = ref(false)
const scrollRef = ref(null)
// vuex
const store = useStore()
const sequenceList = computed(() => store.state.sequenceList)
const playList = computed(() => store.state.playList)
const currentSong = computed(() => store.getters.currentSong)

// hook
const { modeIcon, modeText, changeMode } = useMode()
const { getFavoriteIcon, toggleFavorite } = useFavorite()

// computed
// const modeIcon = computed(() => )

// methods
const hide = () => {
  visible.value = false
}
const getCurrentIcon = (song) => {
  if (song.id === currentSong.value.id) {
    return 'icon-play'
  }
}
const refreshScroll = () => {
  scrollRef.value.scroll.refresh()
}
/** 主要給外部用 */
const show = async() => {
  visible.value = true
  await nextTick()
  refreshScroll()
}
defineExpose({ show })
</script>
<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity .3s;
    .list-wrapper {
      transition: all .3s;
    }
  }
  &.list-fade-enter-from, &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper{
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
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
    .list-content{
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-footer{
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }

}
</style>

<!--
  teleport:
  直接把元素指定渲染到特定部位 ex: body
  特別適用於全螢幕類型，彈層類
 -->