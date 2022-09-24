import { computed, nextTick, ref, watch } from 'vue'

/**
 * 求解列表高度
 * 每一組高度區間
 */
export default function useFixed (props) {
  const TITLE_HEIGHT = 30
  const groupRef = ref(null)
  const listHeights = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0) // 當前渲染組的索引
  const distance = ref(0) // 當前組與下一容器組的距離
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0, ${diff}px, 0)`
    }
  })
  /**
   * 數據變化後，該watch 回調函數內部dom未發生變化
   * dom發生變化 會在nextTick 之後
   */
  watch(() => props.data, async () => {
    await nextTick()
    calculate()
  })

  function calculate () {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0
    // 初始化，起始高度為0
    listHeightsVal.length = 0
    listHeightsVal.push(height)
    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }
  watch(scrollY, (nV) => {
    const listHeightsVal = listHeights.value
    // 初始化即push 一個0，故長度大一個
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      // 區間底部與頂部做對比
      // const heightTop = listHeightsVal[i]
      // const heightBottom = listHeightsVal[i + 1]
      // 是否落在該區間內
      if (nV >= listHeightsVal[i] && nV <= listHeightsVal[i + 1]) {
        currentIndex.value = i
        distance.value = listHeightsVal[i + 1] - nV
      }
    }
  })

  // 鉤子函數拿到=>onScroll 派發 pos 參數
  function onScroll (pos) {
    // console.log('onScroll !!:', -pos)
    scrollY.value = -(pos.y) // 負負得正
  }
  return {
    groupRef,
    onScroll,
    fixedTitle,
    currentIndex,
    fixedStyle
  }
}
