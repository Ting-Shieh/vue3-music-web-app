import MusicList from '@/components/MusicList'
import { processSongs } from '@/service/song.js'
// 1. 拷貝自SingerDetail.vue
// 2. 變量抽出
export default function createDetailComponent (name, key, fetch) {
  return {
    name,
    components: { MusicList },
    props: {
      data: Object
    },
    data () {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      computedData () {
        let ret = null
        const data = this.data
        // debugger
        if (data) {
          // 點進來的
          ret = data
        } else {
          // 非點進來，像刷新
          const cached = JSON.parse(sessionStorage.getItem(key))
          console.log('$route.params:', this.$route.params)
          // cached.id + '' : 數字轉換成字符串
          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            // 當前頁刷新渲染
            ret = cached
          }
        }
        return ret
      },
      pic () {
        // 利用緩存不要多次觸發依賴收集
        const data = this.computedData
        return data && data.pic
      },
      title () {
        const data = this.computedData
        return data && (data.name || data.title)
      }
    },
    async created () {
      // 減少依賴收集，執行緩存
      const data = this.computedData
      // 保護尚未拿到computedData，可能亂改id 所以找不到資料
      if (!data) {
        // 退回一級路由
        // console.log('this.$route', this.$route)
        const path = this.$route.matched[0].path
        this.$router.push({ path })
        return
      }
      const res = await fetch(data)
      this.songs = await processSongs(res.songs)
      this.loading = false
    }
  }
}
