<template>
  <div class="singer-detail">
    <music-list :songs="songs" :title="title" :pic="pic" :loading="loading" />
  </div>
</template>
<script>
import createDetailComponent from '@/assets/js/create-detail-component.js'
import { getSingerDetail } from '@/service/singer.js'
import { SINGER_KEY } from '@/assets/js/constant.js'
export default createDetailComponent('SingerDetail', SINGER_KEY, getSingerDetail)
</script>
<!-- v1: 以下功能轉換為create-detail-component.js，作為v2版本。 -->
<!-- <script >
import { getSingerDetail } from '@/service/singer.js'
import { processSongs } from '@/service/song.js'
import MusicList from '@/components/MusicList'
import { SINGER_KEY } from '@/assets/js/constant.js'
export default {
  name: 'SingerDetail',
  components: { MusicList },
  props: {
    singer: Object
  },
  data () {
    return {
      songs: [],
      loading: true
    }
  },
  computed: {
    computedSinger () {
      let ret = null
      const singer = this.singer
      if (singer) {
        // 點進來的
        ret = singer
      } else {
        // 非點進來，像刷新
        const cachedSinger = JSON.parse(sessionStorage.getItem(SINGER_KEY))
        console.log('$route.params:', this.$route.params)
        if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
          // 當前頁刷新渲染
          ret = cachedSinger
        }
      }
      return ret
    },
    pic () {
      // 利用緩存不要多次觸發依賴收集
      const singer = this.computedSinger
      return singer && singer.pic
    },
    title () {
      const singer = this.computedSinger
      return singer && singer.name
    }
  },
  async created () {
    // 保護尚未拿到computedSinger，可能亂改id 所以找不到資料
    if (!this.computedSinger) {
      // 退回一級路由
      // console.log('this.$route', this.$route)
      const path = this.$route.matched[0].path
      this.$router.push({ path })
      return
    }
    const res = await getSingerDetail(this.computedSinger)
    this.songs = await processSongs(res.songs)
    this.loading = false
  }
}
</script> -->
<style lang="scss" scoped>
.singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
