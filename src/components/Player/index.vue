<template>
  <div class='player' v-show="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <!-- normal-player dom -->
      <div class="normal-player" v-show="fullScreen">
        <template v-if="currentSong">
          <div class="background">
            <img :src="currentSong.pic">
          </div>
          <!-- 頭部 -->
          <div class="top">
            <div class="back" @click="goBack">
              <i class="icon-back"></i>
            </div>
            <h1 class="title">{{currentSong.name}}</h1>
            <h2 class="subtitle">{{currentSong.singer}}</h2>
          </div>
          <div
            class="middle"
            @touchstart.prevent="onMiddleTouchStart"
            @touchmove.prevent="onMiddleTouchMove"
            @touchend.prevent="onMiddleTouchEnd"
          >
            <!-- 中間視圖層手指交互-唱片 -->
            <div class="middle-l" :style="middleLStyle">
              <div ref="cdWrapperRef" class="cd-wrapper">
                <div ref="cdRef" class="cd">
                  <img ref="cdImageRef" :src="currentSong.pic" class="image" :class="cdCls">
                </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{playingLyric}}</div>
              </div>
            </div>
            <!-- 中間視圖層手指交互-歌詞 -->
            <base-scroll class="middle-r" :style="middleRStyle" ref="lyricScrollRef">
              <div class="lyric-wrapper">
                <div v-if="currentLyric" ref="lyricListRef">
                  <p
                    class="text"
                    :class="{'current': currentLineNum === index}"
                    v-for="(line, index) in currentLyric.lines"
                    :key="line.num"
                  >
                  {{line.txt}}
                  </p>
                </div>
              </div>
              <!-- 純音樂無歌詞的情況 -->
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{pureMusicLyric}}</p>
              </div>
            </base-scroll>
          </div>
          <!-- 底部功能列 -->
          <div class="bottom">
            <!-- 左右移動層標示(中間視圖層手指交互) -->
            <div class="dot-wrapper">
              <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
              <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
            </div>
            <!-- progress -->
            <div class="progress-wrapper">
              <span class="time time-l">{{formatTime(currentTime)}}</span>
              <div class="progress-bar-wrapper">
                <progress-bar ref="barRef" :progress="progress" @progress-changing="onProgressChanging" @progress-changed="onProgressChanged"></progress-bar>
              </div>
              <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
            </div>
            <div class="operators">
              <div class="icon i-left">
                <i @click="changeMode" :class="modeIcon"></i>
              </div>
              <div class="icon i-left" :class="disableCls">
                <i @click="prev" class="icon-prev"></i>
              </div>
              <div class="icon i-center" :class="disableCls">
                <i @click="togglePlay" :class="playIcon"></i>
              </div>
              <div class="icon i-right" :class="disableCls">
                <i @click="next" class="icon-next"></i>
              </div>
              <div class="icon i-right">
                <i @click.prevent="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
              </div>
            </div>
          </div>
        </template>
      </div>
    </transition>
    <mini-player :progress="progress" :togglePlay="togglePlay"></mini-player>
    <audio ref="audioRef" @canplay="ready" @pause="pause" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script setup>
import { computed, watch, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import useMode from './useMode.js'
import useFavorite from './useFavorite.js'
import useCD from './useCD.js'
import useLyric from './useLyric.js'
import useMiddleInteractive from './useMiddleInteractive.js'
import useAnimation from './useAnimation.js'
import usePlayHistory from './usePlayHistory.js'
import ProgressBar from './ProgressBar.vue'
import MiniPlayer from './MiniPlayer.vue'
import BaseScroll from '@/components/Base/Scroll'
import { formatTime } from '@/assets/js/util.js'
import { PLAY_MODE } from '@/assets/js/constant.js'
//
import testSound from '@/assets/music/test-song-1.mp3'
// data
const audioRef = ref(null)
const barRef = ref(null)
const songReady = ref(false)
const currentTime = ref(0) // 當前歌曲撥放時長
let progressChanging = false
// vuex
const store = useStore()
const fullScreen = computed(() => store.state.fullScreen)
const currentSong = computed(() => store.getters.currentSong)
const playing = computed(() => store.state.playing)
const currentIndex = computed(() => store.state.currentIndex)
const playMode = computed(() => store.state.playMode)
const playList = computed(() => store.state.playList)
// hooks
const { modeIcon, changeMode } = useMode()
const { getFavoriteIcon, toggleFavorite } = useFavorite()
const { cdCls, cdRef, cdImageRef } = useCD() // cdRef, cdImageRef 定義在鉤子裡面
const { currentLyric, currentLineNum, playLyric, stopLyric, lyricScrollRef, lyricListRef, pureMusicLyric, playingLyric } = useLyric({ songReady, currentTime })
const { currentShow, middleLStyle, middleRStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd } = useMiddleInteractive()
const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation()
const { savePlay } = usePlayHistory()
// computed
const playIcon = computed(() => playing.value ? 'icon-pause' : 'icon-play')
const disableCls = computed(() => songReady.value ? '' : 'disable')
const progress = computed(() => currentTime.value / currentSong.value.duration)
// watch
watch(currentSong, (newSong) => {
  if (!newSong.id || !newSong.url) {
    return
  }
  // 歌曲發生變化
  currentTime.value = 0
  songReady.value = false
  const audioEl = audioRef.value
  // console.log('newSong', newSong)
  // audioEl.src = 'http://soundbible.com/mp3/muscle-car-daniel_simon.mp3' // newSong.url
  // audioEl.src = newSong.url
  audioEl.src = testSound
  audioEl.muted = false
  audioEl.play()
  // 歌曲切換即觸發
  store.commit('setPlayingState', true)
})
watch(playing, (newPlaying) => {
  if (!songReady.value) {
    return
  }
  const audioEl = audioRef.value
  if (newPlaying) {
    audioEl.play()
    playLyric()
  } else {
    audioEl.pause()
    stopLyric()
  }
})
watch(fullScreen, async (newFullScreen) => {
  if (newFullScreen) {
    // [注意] vue 數據更改到dom變化是隔nextTick => data change -> nextTick -> dom變化
    // setOffset 內部為訪問dom
    await nextTick()
    barRef.value.setOffset(progress.value)
  }
})
// methods
const ready = () => {
  if (songReady.value) {
    return
  }
  songReady.value = true
  playLyric()
  // 保存播放歷史紀錄
  savePlay(currentSong.value)
}
const error = () => {
  songReady.value = true
}
const goBack = () => {
  store.commit('setFullScreen', false)
}
const togglePlay = () => {
  if (!songReady.value) {
    return
  }
  store.commit('setPlayingState', !playing.value)
}
const pause = () => {
  store.commit('setPlayingState', false)
}
const prev = () => {
  const list = playList.value
  if (!songReady.value || !list.length) {
    // 列表無任何數據
    return
  }
  if (list.length === 1) {
    // 只有一首歌 => 循環播放
    loop()
  } else {
    let index = currentIndex.value - 1
    if (index === -1) {
      // 播放最後一首歌
      index = list.length - 1
    }
    store.commit('setCurrentIndex', index)
  }
}
const next = () => {
  const list = playList.value
  if (!songReady.value || !list.length) {
    // 列表無任何數據
    return
  }
  if (list.length === 1) {
    // 只有一首歌 => 循環播放
    loop()
  } else {
    let index = currentIndex.value + 1
    if (index === list.length) {
      // 播放第一首歌
      index = 0
    }
    store.commit('setCurrentIndex', index)
  }
}
const updateTime = (e) => {
  // 不是拖曳狀態才執行修改
  if (!progressChanging) {
    currentTime.value = e.target.currentTime
  }
}
// 歌曲播放完成
const end = () => {
  currentTime.value = 0
  if (playMode.value === PLAY_MODE.loop) {
    loop()
  } else {
    next()
  }
}
/** 循環播放當前歌曲 */
const loop = () => {
  // get dom
  const audioEl = audioRef.value
  // 當前播放歌曲時間為0
  audioEl.currentTime = 0
  audioEl.play()
  store.commit('setPlayingState', true)
}

// ProgressBar cpt
// 注意:
// 歌曲正在撥放中本身就會觸法updateTime() 修改 currentTime.value
// 在拖動同時觸發onProgressChanging() 修改 currentTime.value
/**
 * 時時修改進度
 * @param {*} progress
 */
const onProgressChanging = (progress) => {
  // 時時修改進度
  progressChanging = true
  currentTime.value = currentSong.value.duration * progress
  // 進度條"變動中"先暫停歌詞
  playLyric() // 先偏移到當前拖動位置(因playLyric()來自currentTime.做計算)
  stopLyric() // 不鬆開手指前，則保留在該位置
}
/**
 * 放開按鈕修改播放時間
 * @param {*} progress
 */
const onProgressChanged = (progress) => {
  // 修改播放時間
  progressChanging = false
  audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
  // 若為暫停模式變為撥放
  if (!playing.value) {
    store.commit('setPlayingState', true)
  }
  // 進度條"停止變動"繼續播放歌詞，並更新到新位置
  playLyric()
}
</script>

<style scoped lang='scss'>
.player{
  .normal-player{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top{
      position: relative;
      margin-bottom: 25px;
      .back{
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back{
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title{
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle{
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle{
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        position: relative;
        width: 100%;
        //
        height: 0;
        padding-top: 80%;
        //
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          box-sizing: border-box;
          width: 80%;
          height: 100%;
          .cd{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
              position: absolute;
              left: 0;
              top: 0;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            // 旋轉動畫
            .playing {
              animation: rotate 20s linear infinite
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r{
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper{
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }

      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-right {
          text-align: left
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active, &.normal-leave-active {
      transition: all .6s;
      .top, .bottom {
        transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from, &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0); // 上到下
      }
      .bottom {
        transform: translate3d(0, 100px, 0); // 下到上
      }
    }
  }
}
</style>
