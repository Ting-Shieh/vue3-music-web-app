import { get } from './base'

export function getSingerList() {
  return get('/api/getSingerList')
}

/**
 * 獲取歌手詳細訊息
 * @param { } singer
 * @returns
 */
export function getSingerDetail(singer) {
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}
