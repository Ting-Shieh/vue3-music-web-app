<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
  </div>
</template>

<script setup>
import SearchInput from '@/components/SearchInput'
import { ref } from 'vue'

const query = ref('')
</script>
<style lang="scss" scoped>
.search{
  box-sizing: border-box;  // try
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper{
    margin: 20px;
  }
}
</style>
