<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input
      class="input-inner"
      v-model="query"
      :placeholder="placeholder"
    />
    <i v-show="query" class="icon-dismiss" @click="clear"></i>
  </div>
</template>
<script>
import { debounce } from 'throttle-debounce'
export default {
  name: 'SearchInput',
  props: {
    // vue2 value: String
    modelValue: String,
    placeholder: {
      type: String,
      default: '搜尋歌曲、歌手'
    }
  },
  data () {
    return {
      query: this.modelValue
    }
  },
  methods: {
    clear () {
      this.query = ''
    }
  },
  created () {
    this.$watch('query', debounce(300, (newQuery) => {
      this.$emit('update:modelValue', newQuery.trim())
    }))
    // 外部也能主動修改 ex. 熱門搜索
    this.$watch('modelValue', (newVal) => {
      this.query = newVal
    })
  }
  // [思考]: debounce 不寫在watch 中
  // 寫在 watch 屬性對應的函數，那麼 debounce 中的 this 指向的是組件對象，而不是組件實例
  // watch: {
  //   query (newQuery) {
  //     this.$emit('update:modelValue', newQuery.trim())
  //   }
  // }
}
</script>

<style lang="scss" scoped>
  .search-input {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 32px;
    background: $color-highlight-background;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: $color-text-d;
    }
    .input-inner {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      outline: 0;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-text-d;
    }
  }
</style>
