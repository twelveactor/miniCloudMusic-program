// pages/main-music/main-music.js
import { musicBanners ,hotMenuList} from '../../services/music'
import querySelect from '../../utils/query-select'
import {throttle} from 'underscore'
import recommendStore from '../../store/recommendStore'
import rankingStore from '../../store/rankingStore'
import playStore from '../../store/playStore'

const queryImg = throttle(querySelect,100, {trailing:true})
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索value
    searchValue:'',
    // 轮播图数据
    banners:[],
    // 轮播图控制器颜色及活跃颜色
    indicatorColor:'#fafafa',
    indicatorActiveColor:'#FFC0CB',
    // 轮播图高度
    bannersHeight:0,
    hotMenuWidth:375,
    // 热门推荐榜单数据
    recommendSongs:{},
    // 热门歌单数据
    hotMenuList:[],
    // 巅峰榜数据
    rankingInfos:{

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 1、获取 banners 数据
    this.fetchMusicBanners()

    // 2、获取热门榜单数据，因为要共享给其他页面，就不交由组件本身管理，通过eventBus进行管理共享
    // this.fetchRecommendPlayListDetail()
    // 改用 event bus 共享数据，通过监听 staore recommendSongs 是否变化，变化会返回一个回调函数数据设置到 dataa 中
    recommendStore.dispatch('fetchRecommendPlayListDetail')
    recommendStore.onState('recommendSongs',(value)=>{
      if (!value.tracks) return 
      // 首页只展示 6 条数据，其他数据在点击更多的时候进行跳转
      const newRecommendSongs = value.tracks.slice(0,6)
      this.setData({recommendSongs:newRecommendSongs})
    })
    
    // 3、获取热门歌单
    this.fetchHotMenuList()

    // 4、获取巅峰榜单数据
    rankingStore.dispatch('fetchRankingDataAction')
    rankingStore.onState('newRanking',(value)=>{
      const newRankingInfos = { ...this.data.rankingInfos , newRanking: value}
      this.setData({ rankingInfos : newRankingInfos })

    })
    rankingStore.onState('originRanking',(value)=>{
      const newRankingInfos = { ...this.data.rankingInfos , originRanking: value}
      this.setData({ rankingInfos : newRankingInfos })

    })
    rankingStore.onState('upRanking',(value)=>{
      const newRankingInfos = { ...this.data.rankingInfos , upRanking: value}
      this.setData({ rankingInfos : newRankingInfos })

    })

    // 额外，获取屏幕尺寸
    this.setData({
      hotMenuWidth:app.globalData.screenWidth
    })
  },
  async fetchMusicBanners(){
    const res = await musicBanners()
    this.setData({
      banners:res.banners
    })
  },
  async fetchHotMenuList(){
    const res = await hotMenuList()
    // console.log(res);
    this.setData({
      hotMenuList:res.playlists
    })
  },
  // async fetchRecommendPlayListDetail(){
  //   const res = await recommendPlayListDetail(3778678)
  //   // console.log(res);
  //   const playListTracks = res.playlist.tracks
  //   const recomendSongs = playListTracks.slice(0,6)
  //   this.setData({
  //     recommendSongs:recomendSongs
  //   })
  // },

  // 搜索框聚焦跳转搜索页面
  onFouceSearch(){
    wx.navigateTo({
      url: '/pages/detail-search/detail-search',
    })
  },
  // 获取 banner 图片加载完毕的事件获取图片宽高
  async onImageLoad(e){
      // const t = throttle(this.querySelectImage,100)
      // const res = await t('.swiper-item-img')
      // console.log(res);
      // this.setData({ bannersHeight: res[0].height }) 
      const res = await queryImg('.swiper-item-img')
      this.setData({ bannersHeight: res[0].height })
    // // 获取 image 组件的高度 
    // const query = wx.createSelectorQuery() 
    // // 拿到 image 组件的矩形框
    // query.select('.swiper-item-img').boundingClientRect()
    // query.exec(res=>{
    //   console.log('sss');
    //   this.setData({ bannersHeight: res[0].height })
    // })
  },
  // 获取 area-header 点击更多发送的事件
  onHeaderMoreClick(){
    // console.log('onMoreClick');
    wx.navigateTo({
      url: '/pages/detail-song/detail-song?type=recommend',
    })
  },
  onHeaderMoreClickToMenu(){
    wx.navigateTo({
      url: '/pages/detail-menu/detail-menu',
    })
  },
  // 点击歌单item讲所有歌曲加入播放列表
  onSongItemTap(e){
    // console.log(this.data.recommendSongs,e.currentTarget.dataset);
    playStore.setState('playSongList',this.data.recommendSongs)
    playStore.setState('playSongIndex',e.currentTarget.dataset.index)
  }

})