<template>
  <teleport to="body">
    <transition name="list-fade">
      <div
        class="playlist"
        v-show="visible && playList.length"
        @click="hide"
      >
        <div class="list-wrapper" @click.stop>
          <!-- 頂部 -->
          <div class="list-header">
            <h1 class="title">
              <!-- 播放模式按鈕 -->
              <i
               class="icon"
               :class="modeIcon"
               @click="changeMode"
              ></i>
              <span class="text">{{modeText}}</span>
              <!-- 清空彈窗 -->
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <!-- 中間 -->
          <base-scroll
            class="list-content"
            ref="scrollRef"
          >
            <transition-group
              ref="listRef"
              name="list"
              tag="ul"
            >
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
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
                <!-- 刪除 -->
                <span class="delete" :class="{'disable': removing}" @click.stop="removeSong(song)">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </base-scroll>
          <!--  -->
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到列表</span>
            </div>
          </div>
          <!-- 底部 -->
          <div class="list-footer" @click.stop="hide">
            <span>關閉</span>
          </div>
          <!-- Confirm -->
          <Confirm ref="confirmRef" :text="confirmText" confirmBtnText="清空" @confirm="confirmClear"/>
          <!-- add-song -->
          <add-song ref="addSongRef"/>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script setup>
import BaseScroll from '@/components/Base/Scroll'
import Confirm from '@/components/Base/Confirm'
import AddSong from '@/components/AddSong'
import useMode from './useMode.js'
import useFavorite from './useFavorite.js'
import { computed, ref, defineExpose, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
// const
const listFadeAnimationDuration = 0.3
const listFadeAnimationDurationStr = `${listFadeAnimationDuration}s`
const confirmText = '是否清空撥放列表?'
// data
const visible = ref(false)
const removing = ref(false) // 控制刪除
const scrollRef = ref(null)
const listRef = ref(null)
const confirmRef = ref(null)
const addSongRef = ref(null)
// vuex
const store = useStore()
const sequenceList = computed(() => store.state.sequenceList)
const playList = computed(() => store.state.playList)
const currentSong = computed(() => store.getters.currentSong)

// hook
const { modeIcon, modeText, changeMode } = useMode()
const { getFavoriteIcon, toggleFavorite } = useFavorite()

// watch
watch(currentSong, async (newSong) => {
  // 刪除歌曲點太快可能造成 !newSong.id
  if (!visible.value || !newSong.id) {
    return
  }
  await nextTick()
  scrollToCurrent()
})
// methods
const hide = () => {
  visible.value = false
}
const getCurrentIcon = (song) => {
  if (song.id === currentSong.value.id) {
    return 'icon-play'
  }
}

/** 點擊刪除後，scroll組件重新計算渲染 */
const refreshScroll = () => {
  scrollRef.value.scroll.refresh()
}

const show = async() => {
  visible.value = true
  await nextTick()
  refreshScroll()
  scrollToCurrent()
}

/** 滾動到指定的歌曲element */
const scrollToCurrent = () => {
  const index = sequenceList.value.findIndex(song => {
    return song.id === currentSong.value.id
  })
  if (index === -1) {
    return
  }
  // li element
  // const target = listRef.value.children[index]
  // 換成transition-group，listRef 指向的就是組件實例，對應的 DOM 就是 $el
  const target = listRef.value.$el.children[index]
  scrollRef.value.scroll.scrollToElement(target, 300)
}

/** 選擇歌曲 */
const selectItem = (song) => {
  const index = playList.value.findIndex(item => {
    return item.id === song.id
  })

  store.commit('setCurrentIndex', index)
  store.commit('setPlayingState', true) // 可能那時候是暫停播放狀態
}

/** 刪除歌曲 */
const removeSong = (song) => {
  if (removing.value) {
    return
  }
  removing.value = true
  store.dispatch('removeSong', song)
  if (!playList.value.length) {
    hide()
  }
  // 動畫 300ms
  setTimeout(() => {
    removing.value = false
  }, listFadeAnimationDuration * 1000)
}

/** 顯示Confirm彈窗 */
const showConfirm = () => {
  confirmRef.value.show()
}
/** 執行清空播放列表 */
const confirmClear = () => {
  store.dispatch('clearSongList')
  hide()
}
const showAddSong = () => {
  addSongRef.value.show()
}
/** 主要給外部用 vue3 一定要爆露才能用ref拿到 */
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
    transition: opacity v-bind(listFadeAnimationDurationStr); // opacity .3s;
    .list-wrapper {
      transition:  all v-bind(listFadeAnimationDurationStr) // all .3s;
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
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
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
