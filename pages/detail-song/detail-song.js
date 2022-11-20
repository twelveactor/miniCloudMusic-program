// pages/detail-song/detail-song.js
import recommendStore from '../../store/recommendStore'
import rankingStore from '../../store/rankingStore'
import { recommendPlayListDetail } from '../../services/music'
import playStore from '../../store/playStore'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    key:'newRanking',
    id:'',
    // songs:{},
    songRanking:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 判断榜单类型
    // type === ranking 巅峰榜单数据
    // type === recommend 推荐榜单数据
    const type = options.type
    this.setData({
      type:type
    })

    // 获取 store 的数据
    if (type === 'ranking') {
      // 拿到 巅峰榜 三组数据
      const key = options.key
      this.data.key = key
      rankingStore.onState(key,this.handleOnRanking)
    }else if (type === 'recommend') {
      // 拿到 热门榜单 存储在eventBus中保存的全部数据
      recommendStore.onState('recommendSongs',this.handleOnRecommendSongss)
    }else if (type === 'menu') {
      // 拿到 热门歌单 
      const id = options.id
      this.data.id = id
      this.fetchMenuSongInfo()
    }
  },
  async fetchMenuSongInfo(){
    const res = await recommendPlayListDetail(this.data.id)
    this.setData({ songRanking:res.playlist })
  },
  handleOnRecommendSongss(value){
    // console.log(value);
    this.setData({songRanking:value})
  },
  handleOnRanking(value){
    // console.log(value);
    this.setData({
      songRanking:value
    })
  },

  onSongItemTap(e){
    console.log(e.currentTarget.dataset.index);
    // console.log(this.data.songRanking.tracks);
    playStore.setState('playSongList',this.data.songRanking.tracks)
    playStore.setState('playSongIndex',e.currentTarget.dataset.index)
  },

  onUnload(){
    // 页面卸载取消事件监听
    if (this.data.type === 'ranking') {
      rankingStore.offState(this.data.key,this.handleOnRanking)
    }else if (this.data.type === 'recommend') {
      recommendStore.offState('recommendSongs',this.handleOnRecommendSongss)
    }
  }
})