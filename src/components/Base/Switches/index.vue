<template>
  <div class="switches">
    <li
      class="switch-item"
      v-for="(item, index) in items"
      :key="item"
      :class="{'active': modelValue === index}"
      @click="switchItem(index)"
    >
      <span>{{item}}</span>
    </li>
    <div class="active-bar" :style="activeStyle"></div>
  </div>
</template>
<script>
const TABS_WIDTH = 240
const TAB_ITEM_COUNT = 2
const TAB_ITEM_WIDTH = TABS_WIDTH / TAB_ITEM_COUNT
export default {
  name: 'Switches',
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
    // 索引值
    modelValue: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 測試vue3 css v-bind() 新寫法
      TABS_WIDTH_STR: TABS_WIDTH + 'px',
      TAB_ITEM_WIDTH_STR: TAB_ITEM_WIDTH + 'px'
    }
  },
  computed: {
    activeStyle () {
      const x = TAB_ITEM_WIDTH * this.modelValue
      return {
        transform: `translate3d(${x}px, 0, 0)`
      }
    }
  },
  methods: {
    switchItem (index) {
      this.$emit('update:modelValue', index)
    }
  }
}
</script>
<style lang="scss" scoped>
.switches{
  display: flex;
  position: relative;
  align-items: center;
  width: v-bind(TABS_WIDTH_STR); // 240px;
  margin: 0 auto;
  border: 1px solid $color-highlight-background;
  border-radius: 5px;
  .switch-item{
    position: relative;
    z-index: 10;
    flex: 1;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: $font-size-medium;
    color: $color-text-d;
    &.active {
      color: $color-text
    }
  }
  .active-bar{
    position: absolute;
    left: 0;
    top: 0;
    width: v-bind(TAB_ITEM_WIDTH_STR); // calc( 240px / 2 );
    height: 30px;
    border-radius: 5px;
    background: $color-highlight-background;
    transition: transform 0.3s;
  }
}
</style>
