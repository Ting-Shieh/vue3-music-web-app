<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers"></index-list>
  </div>
</template>
<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/IndexList'
export default {
  name: 'singer',
  components: {
    IndexList
  },
  data() {
    return {
      singers: []
      // selectedSinger: null
    }
  },
  async created () {
    const result = await getSingerList()
    // console.log(result)
    this.singers = result.singers
  }
}
</script>
<style lang="scss" scoped>
.singer{
  position: fixed;
  top: 88px;
  width: 100%;
  bottom: 0px;
}
</style>
