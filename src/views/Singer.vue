<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers" @select="selectSinger"></index-list>
    <!-- 乘載2級路由 -->
    <!-- <router-view :singer="selectedSinger"></router-view> -->
    <router-view v-slot="{ Component }">
      <!-- appear 一進入就有動畫 -->
      <transition appear name="slide">
        <component :is="Component" :singer="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>
<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/IndexList'
import { SINGER_KEY } from '@/assets/js/constant.js'
export default {
  name: 'Singer',
  components: {
    IndexList
  },
  data() {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  async created () {
    const result = await getSingerList()
    // console.log(result)
    this.singers = result.singers
  },
  methods: {
    selectSinger (singer) {
      this.selectedSinger = singer
      this.cacheSinger(singer)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    cacheSinger (singer) {
      /**
       * 緩存對象
       * JSON.stringify()  JSON.parse()
       */
      sessionStorage.setItem(SINGER_KEY, JSON.stringify(singer))
    }
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
