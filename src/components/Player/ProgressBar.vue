<template>
  <div class="progress-bar" @click="onClick">
    <!-- 整個bar 底色灰色-->
    <div class="bar-inner">
      <!-- 黃色進度 -->
      <div class="progress" :style="progressStyle" ref="progressRef"></div>
      <!-- 拖動按鈕 -->
      <div
      class="progress-btn-wrapper "
      :style="btnStyle"
      @touchstart.prevent="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
const progressBtnWidth = 16
export default {
  name: 'ProgressBar',
  emits: ['progress-changing', 'progress-changed'],
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 偏移量
      offset: 0
    }
  },
  computed: {
    progressStyle () {
      return {
        width: `${this.offset}px`
      }
    },
    btnStyle () {
      return {
        transform: `translate3d(${this.offset}px, 0, 0)`
      }
    }
  },
  watch: {
    // 組件渲染後
    progress (newProgress) {
      // 整個進度條寬度
      // 當fullScreen=false，normal-player dom 會display=none，該情快下調用this.$el api 計算clientWidth會出錯
      const barWidth = this.$el.clientWidth - progressBtnWidth
      this.offset = barWidth * newProgress
    }
  },
  methods: {
    onTouchStart (e) {
      // 起點位置 & 黃色進度條寬度
      this.touch.x1 = e.touches[0].pageX
      this.touch.beginWidth = this.$refs.progressRef.clientWidth
    },
    onTouchMove (e) {
      // 相對初始位置偏移多少
      const delta = e.touches[0].pageX - this.touch.x1
      const tempWidth = this.touch.beginWidth + delta
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 限定在0~1
      const progress = Math.min(1, Math.max((tempWidth / barWidth), 0))
      this.offset = barWidth * progress
      // 拖移btn時，同時影響歌曲
      this.$emit('progress-changing', progress)
    },
    onTouchEnd () {
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 左側進度條寬度
      const progress = this.$refs.progressRef.clientWidth / barWidth
      // 拖移btn結束時，同時影響歌曲
      this.$emit('progress-changed', progress)
    },
    onClick (e) {
      console.log('$el:', this.$el)
      console.log('e.pageX:', e.pageX)
      console.log('$el.getBoundingClientRect():', this.$el.getBoundingClientRect())
      // https://shubo.io/get-bounding-client-rect/
      // 獲取點擊在進度條上的位置(從進度條左邊起點到點擊位置的距離)
      const rect = this.$el.getBoundingClientRect()
      const offset = e.pageX - rect.left
      console.log('$el.clientWidth:', this.$el.clientWidth)
      console.log('progressBtnWidth:', progressBtnWidth)
      console.log('offset:', offset)

      //
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = offset / barWidth
      console.log('barWidth:', barWidth)
      console.log('progress:', progress)
      //
      this.$emit('progress-changed', progress)
    }
  },
  created () {
    // 不需要觀測響應，只需共享，故不用設在data
    // 不會造成性能浪費
    this.touch = {}
  }
}
</script>
<style lang="scss" scoped>
.progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px; // v-bind(progressBtnWidth)+'px';
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
