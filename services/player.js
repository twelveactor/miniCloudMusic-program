import {hyRequest} from './index'

/**
 * 获取歌曲详情
 * @param {Number} ids 歌曲id
 */
export function getSongDetail(ids) {
  return hyRequest.get({
    url:'/song/detail',
    data:{
      ids
    }
  })
}

/**
 * 获取歌词详情
 * @param {Number} id 歌曲id
 */
export function getSongLyric(id) {
  return hyRequest.get({
    url:'/lyric',
    data:{
      id
    }
  })
}