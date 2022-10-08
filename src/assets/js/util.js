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

/**
 * 將毫秒格式化為mm:ss
 * @param {*} interval 毫秒
 */
export function formatTime(interval) {
  // 向下取整
  interval = interval | 0
  // mm
  const minute = ((interval / 60 | 0) + '').padStart(2, '0') // +'' 轉成字符串
  const second = ((interval % 60) + '').padStart(2, '0')
  return `${minute}:${second}`
}
