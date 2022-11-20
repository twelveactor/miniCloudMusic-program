// pages/detail-video/detail-video.js
import {videoDetail,videoDetailInfo,videoMvRelate} from '../../services/video'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    videoUrl:'',
    videoDetails:{},
    videoRelate:[]
  },

  onLoad(options) {
    // 拿到跳转前页面传递的 id 数据
    this.setData({ id:options.id })

    // 发送网络请求获取视频播放 url 地址
    // if (id === '' || id === undefined) {
    //   console.log('sss');
    //   wx.showToast({
    //     title: '视频数据获取失败，刷新重试！',
    //     icon:'error',
    //     duration: 2000
    //   })
    //   return
    // }
    this.fetchVideoDetail()
    this.fetchVideoDetailIndo()
    this.fetchMvRelated()
  },
  async fetchVideoDetail(){
    const res = await videoDetail(this.data.id)
    console.log(res);
    const {url} = res.data
    this.setData({
      videoUrl:url
    })
  },
  async fetchVideoDetailIndo(){
    const res = await videoDetailInfo(this.data.id)
    console.log(res);
    this.setData({
      videoDetails:res.data
    })
  },
  async fetchMvRelated(){
    const res = await videoMvRelate(this.data.id)
    this.setData({
      videoRelate:res.data
    })
  },
  onvideoClick(e){
    console.log(e);
    console.log(this.data.videoRelate);
  }
})