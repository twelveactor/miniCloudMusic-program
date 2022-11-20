import { hyRequest } from './index'

/**
 * 获取音乐界面 banner
 * @param {Number} type 0-PC 1-android 2-iphone 3-ipad 
 */
export function musicBanners(type = 2) {
  return hyRequest.get({
    url:'/banner',
    data:{
      type
    }
  })
}

/**
 * 推荐歌单数据
 * @param {Number} id id
 */
export function recommendPlayListDetail(id) {
  return hyRequest.get({
    url:'/playlist/detail',
    data:{
      id
    }
  })
}

/**
 * 热门歌单数据
 * @param {Number} offset 偏移量
 * @param {Number} limit 限制数量
 */
export function hotMenuList(cat = '全部',offset = 0,limit = 6) {
  return hyRequest.get({
    url:'/top/playlist',
    data:{
      cat,
      offset,
      limit
    }
  })
}

/**
 * 获取歌单分类
 * @param {Number} limit 限制数量
 */
export function allMenuTag() {
  return hyRequest.get({
    url:'/playlist/hot'
  })
}