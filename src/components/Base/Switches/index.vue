<template>
  <div class="switches">
    <li
    class="switch-item"
    v-for="(item, index) in items"
    :key="item"
    :class="{'active': modelValue === index}"
    >
      <span>{{item}}</span>
    </li>
    <div class="active-bar"></div>
  </div>
</template>
<script>
export default {
  name: 'Switches',
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
    modelValue: {
      type: Number,
      default: 0
    }
  },
  computed: {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.switches{
  display: flex;
  position: relative;
  align-items: center;
  width: 240px;
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
    width: calc( 240px / 2 );
    height: 30px;
    border-radius: 5px;
    background: $color-highlight-background;
    transition: transform 0.3s;
  }
}
</style>
