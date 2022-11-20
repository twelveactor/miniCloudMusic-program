import { hyRequest } from './index'

/**
 * 获取 video 视频数据
 * @param {String} limit 限制获取条数，默认 20 
 * @param {String} offset 偏移量 ，默认 0
 * @returns 返回一个异步函数
 */
export function pageVideoData(offset = 0,limit = 20 ) {
  return hyRequest.get({
    url:'/top/mv',
    data:{
      limit:limit,
      offset:limit * offset
    }
  })
}

/**
 * 音乐播放url
 * @param {Number} id  id 
 */
export function videoDetail(id) {
  return hyRequest.get({
    url:'/mv/url',
    data:{
      id
    }
  })
}

/**
 * 音乐播放详细信息
 * @param {Number} mvid  mvid
 */
export function videoDetailInfo(mvid) {
  return hyRequest.get({
    url:'/mv/detail',
    data:{
      mvid
    }
  })
}

/**
 * 相关视频
 * @param {Number} id  id
 */
export function videoMvRelate(id) {
  return hyRequest.get({
    url:'/related/allvideo',
    data:{
      id
    }
  })
}