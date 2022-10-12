import { get } from './base'
/** 熱門搜索建詞 */
export function getHotKeys() {
  return get('/api/getHotKeys')
}

export function search(query, page, showSinger) {
  return get('/api/search', {
    query,
    page,
    showSinger
  })
}
