<template>
  <!--
    base-scroll[版本1]: 非使用高階組件
    wrap-scroll[版本2]: 使用高階組件
  -->
  <wrap-scroll class="index-list" :probe-type="3" @scroll="onScroll" ref="scrollRef">
    <ul ref="groupRef">
      <li class="group" v-for="group in data" :key="group.title">
        <!-- 字幕排序 -->
        <h2 class="title">{{ group.title }}</h2>
        <ul>
          <li class="item" v-for="item in group.list" :key="item.id" @click="onItemClick(item)">
            <img class="avatar" v-lazy="item.pic" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed"
      v-show="fixedTitle"
      :style="fixedStyle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <!-- 字母選單 -->
    <div
      class="shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="item"
          :data-index="index"
          class="item"
          :class="{'current':currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
  </wrap-scroll>
</template>
<script setup>
import WrapScroll from '@/components/WrapScroll/index.js'
// import BaseScroll from '@/components/Base/Scroll' // 非使用高階組件
import useFixed from './useFixed.js'
import useShortcut from './useShortcut.js'
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
const { groupRef, onScroll, currentIndex, fixedTitle, fixedStyle } = useFixed(props)
const { shortcutList, onShortcutTouchStart, onShortcutTouchMove, scrollRef } = useShortcut(props, groupRef)
const emit = defineEmits(['select'])
const onItemClick = (item) => {
  // 派發給外部
  emit('select', item)
}
</script>
<style lang="scss" scoped>
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  ul {
    .group {
      padding-bottom: 30px;
      .title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
      .item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
  }
  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
  .shortcut {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: $color-background-d;
      font-family: Helvetica;
      .item {
        padding: 3px;
        line-height: 1;
        color: $color-text-l;
        font-size: $font-size-small;
        &.current {
          color: $color-theme
        }
      }
    }
}
</style>
<!--
  <script>
  import Scroll from '@/components/wrap-scroll/index'
  import useFixed from './use-fixed'
  import useShortcut from './use-shortcut'

  export default {
    name: 'index-list',
    components: { Scroll },
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    emits: ['select'],
    setup(props, { emit }) {
      const { groupRef, onScroll, fixedTitle, fixedStyle, currentIndex } = useFixed(props)
      const { shortcutList, scrollRef, onShortcutTouchStart, onShortcutTouchMove } = useShortcut(props, groupRef)

      function onItemClick(item) {
        emit('select', item)
      }

      return {
        onItemClick,
        // fixed
        groupRef,
        onScroll,
        fixedTitle,
        fixedStyle,
        currentIndex,
        // shortcut
        shortcutList,
        scrollRef,
        onShortcutTouchStart,
        onShortcutTouchMove
      }
    }
  }
</script>
-->
