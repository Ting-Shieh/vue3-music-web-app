import { get } from './base.js'

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result) => {
    const map = result.map
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      console.log('song conatain: ', song)
      return song.url // && song.url.indexOf('vkey') > -1
      // return song.url && song.url.indexOf('vkey') > -1
    })
  })
}

const lyricMap = {}
/**
 * 獲取歌詞
 * @param {*} song
 * @returns
 */
export function getLyric (song) {
  // 優先:歌曲對象本身找
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  // 次之:不同對象可能代表同一首歌
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }

  return get('/api/getLyric', {
    mid
  }).then((result) => {
    const lyric = result ? result.lyric : '[00:00:00]該歌曲暫時無法獲取歌詞'
    lyricMap[mid] = lyric
    return lyric
  })
}
