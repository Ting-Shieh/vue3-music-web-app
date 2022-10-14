/**
 * 拿取localStorage 的key 所對應的value，無則預設[]
 * @param {*} key localStorage key
 * @param {*} defaultVal 預設value
 * @returns
 */
function getLocalStorageNullAndSetDefault (key, defaultVal = []) {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, JSON.stringify(defaultVal))
  }
  return JSON.parse(localStorage.getItem(key))
}

function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  // 存在
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 插入前面
  arr.unshift(val)
  // 有傳maxLen且arr長度大於maxLen，將第一個元素刪除
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    // 存在
    arr.splice(index, 1)
  }
}

/**
 * 符合compare條件，加入arr(=item)
 * @param {*} item 存localStorage 的key 所所對應的value (Array Type)
 * @param {*} key 存localStorage 的key
 * @param {*} compare 由外部傳入比對函數
 * @param {*} maxLen list 可保留的最大長度
 */
export function save (item, key, compare, maxLen) {
  // 沒有，默認為[]
  // if (localStorage.getItem(key) === null) {
  //   localStorage.setItem(key, JSON.stringify([]))
  // }
  // const items = JSON.parse(localStorage.getItem(key))
  const items = getLocalStorageNullAndSetDefault(key, [])
  //
  insertArray(items, item, compare, maxLen)
  // 保存到localStorage
  localStorage.setItem(key, JSON.stringify(items))
  return items
}

export function remove (key, compare) {
  // 沒有，默認為[]
  // if (localStorage.getItem(key) === null) {
  //   localStorage.setItem(key, JSON.stringify([]))
  // }
  // const items = JSON.parse(localStorage.getItem(key))
  const items = getLocalStorageNullAndSetDefault(key, [])
  //
  deleteFromArray(items, compare)
  // 保存到localStorage
  localStorage.setItem(key, JSON.stringify(items))
  return items
}

/**
 * 拿取localStorage 的key 所對應的value，無責預設[]
 * @param {*} key
 * @returns
 */
export function load (key) {
  // if (localStorage.getItem(key) === null) {
  //   localStorage.setItem(key, JSON.stringify([]))
  // }
  // return JSON.parse(localStorage.getItem(key))
  return getLocalStorageNullAndSetDefault(key)
}

export function clear (key) {
  localStorage.removeItem(key)
  return []
}
