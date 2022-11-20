// pages/main-video/main-video.js
// import { hyRequest } from '../../services/index'
import { pageVideoData } from '../../services/video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList:[],
    offset:0,
    hasMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 请求 video 视频数据
    this.fetchTopMv()
  },
  async fetchTopMv(){
    const res = await pageVideoData(this.data.offset)
    const newVideoList = [...this.data.videoList, ...res.data]
    // const newVideoList = this.data.videoList.push(res.data)
    this.setData({
      videoList:newVideoList
    })
    this.data.offset += 1
    
    this.data.hasMore = res.hasMore
  },
  // 点击视频跳转携带 id 属性
  onVideoClick(e){
    const {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/detail-video/detail-video?id=${id}`,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 无更多数据加载提示弹窗
    if (!this.data.hasMore) {
      wx.showToast({
        title:'无更多视频',
        icon: 'error',
        duration:1000
      })
      return
    }
    // 到达底部加载数据
    this.fetchTopMv()
  },
  async onPullDownRefresh(){
    // 清空之前的数据
    this.setData({ videoList : [] })
    this.data.offset = 0
    this.data.hasMore = true

    // 重新请求数据
    await this.fetchTopMv()

    // 以上代码已有结果在进行停止刷新
    wx.stopPullDownRefresh()
  }
})