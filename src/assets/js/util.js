/**
 * 隨機洗牌
 * @param {*} source
 */
export function shuffle (source) {
  // 緩存
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

function getRandomInt (max) {
  // 向下取整 0~max(含)
  return Math.floor(Math.random() * (max + 1))
}
function swap (arr, i, j) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}
