// pages/music-play/music-play.js
import { getSongDetail , getSongLyric} from '../../services/player'
import {throttle} from 'underscore'
import {parseLyric} from '../../utils/parse_lyric'
import playStore from '../../store/playStore'

const app = getApp()
// 创建内部 audio 上下文 InnerAudioContext 对象
const audioContext = wx.createInnerAudioContext({
  useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 歌曲 id
    id:-1,
    // 当前要播放的歌曲
    currentSong:{},
    // 当前歌词
    lyricInfos:[],
    currentLyric:'',
    currentLyricIndex:-1,
    // 当前所在标签
    currentActive:0,
    // 歌曲歌词内容高度
    contentHeight:500,
    // 控制音乐播放的按钮状态
    controlPlayOrPause:false,
    // 当前音频总时长
    songDuration:0,
    // 当前音频播放进度
    songPlayTime:0,
    // slider 进度条
    sliderValue:0,
    // 判断slider滑块是否正在改变
    isSliderChanging:false,
    // 歌词滚动位置距离
    lyricScrollTop:0,
    // 歌曲播放列表及索引下标
    lyricPlayList:[],
    lyricPlayListIndex:0,
    // 歌曲顺序，随机，单曲循环播放状态
    songPlayState:['order','random','repeat'],
    songPlayStateIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 1、获取 歌曲 id,根据 id 获取歌词数据
    const id = options.id
    this.setData({id:id})

    this.setData({contentHeight : app.globalData.contentHeight})

    // 歌曲播放
    this.handleSongPlaySwitchId(id)
    audioContext.onEnded(()=>{
      this.setData({controlPlayOrPause:false})
      // audioContext.loop = true
      if (this.data.songPlayState[this.data.songPlayStateIndex] === 'order') {
        this.handleSwitchStateAndNextOrPause('next')
        this.setData({controlPlayOrPause:true})
      }else if(this.data.songPlayState[this.data.songPlayStateIndex] === 'random'){
        this.handleSwitchStateAndNextOrPause('next')
        this.setData({controlPlayOrPause:true})
      }else if(this.data.songPlayState[this.data.songPlayStateIndex] === 'repeat'){
        this.handleSwitchStateAndNextOrPause('next')
        this.setData({controlPlayOrPause:true})
      }
      console.log('歌曲结束');
    })
    audioContext.onError(()=>{
      console.log('音频出错啦！！！');
      wx.showToast({
        title: '音频出错啦！！！',
        icon: 'error',
        duration: 2000
      })
    })

    // 保存播放列表数据
    playStore.onStates(['playSongList','playSongIndex'],this.handleLyricPlayList)
  },
  handleLyricPlayList({playSongList,playSongIndex}){
    // console.log(value);
    // console.log(!value);
    if (playSongList) {
      this.setData({
        lyricPlayList:playSongList
      })
    }
    if (playSongIndex !== undefined) {
      this.setData({
        lyricPlayListIndex:playSongIndex
      })
    }
  },

  // ==========================================================歌曲播放配置
  handleSongPlaySwitchId(id){
    // 2、获取歌曲数据
    this.getSongDetailData()
    // 3、获取歌词数据
    this.getSongLyricData()
    // 4、播放歌曲的音频url
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    this.setData({controlPlayOrPause: true})
    audioContext.autoplay = true
    
    // 5、监听播放的进度
    const throttleUpdateProgress = throttle(this.updateProgress,1000,{
      leading:false,
      trailing:false
    })
    audioContext.onTimeUpdate(()=>{
      // 当滑块没有在滑动的时候就不需要设置值
     if (!this.data.isSliderChanging) {
      throttleUpdateProgress()
     }

     // 匹配正确的歌词
     if (!this.data.lyricInfos.length) return
     let index = this.data.lyricInfos.length - 1
     for (let i = 0; i < this.data.lyricInfos.length; i++) {
       const line = this.data.lyricInfos[i]
       if (line.time > audioContext.currentTime * 1000) {
         // 找到 匹配到的下标 的前一句歌词
         index = i - 1
         break
       }
     }
      // 下标一致歌词只设置一次
      if (this.data.currentLyricIndex === index) return

      this.setData({
        currentLyric:this.data.lyricInfos[index].text || '未知' , 
        currentLyricIndex : index,
        lyricScrollTop: 40 * index
      })
      // console.log(index,this.data.lyricInfos[index].text,this.data.currentLyricIndex);
    })
    //  当seek移动播放条，onTimeUpdate不会再监听，这个时候采取onWaiting等待数据加载
    audioContext.onWaiting(()=>{
      audioContext.pause()
    })
    // 当可以播放了之后主动让他在进行播放,才会继续通过 onTimeUpdate 进行监听滚动
    audioContext.onCanplay(()=>{
      audioContext.play()
    })
    
    
  },
  // ==========================================================歌曲播放end

  // ==========================================================页面加载第一次网络请求歌曲歌词数据
  async getSongDetailData(){
    const res = await getSongDetail(this.data.id)
    this.setData({ 
      currentSong : res.songs[0],
      songDuration: res.songs[0].dt
    })
  },
  async getSongLyricData(){
    const res = await getSongLyric(this.data.id)
    const lyric = parseLyric(res.lrc.lyric)
    // console.log(lyric);
    this.setData({lyricInfos : lyric})
    // this.setData({ currentLyric : res.lrc.lyric })
  },
  // =======================================================修改播放进度
  updateProgress(){
    // console.log('---');
      // 设置 播放进度 和 音频总时间
      this.setData({songPlayTime:audioContext.currentTime * 1000})
      
      // 设施 slider , 除以 是为了计算出百分比 10 / 100 = 0.1 * 100 = 10%
      const sliderValue = this.data.songPlayTime / this.data.songDuration * 100
      this.setData({sliderValue})
  },

  // =======================================================各种按钮点击事件
  // navbar 返回按钮
  onCallback(){
    console.log('返回');
    wx.navigateBack()
  },
  // navbar 歌词歌曲 navbar 切换点击
  onTitleLeft(){
    this.setData({currentActive:0})
    console.log('left');
  },
  onTitleRight(){
    this.setData({currentActive:1})
    console.log('right');
  }, 
  // swiper 歌词歌曲轮播图滚动
  onCurrentSwiperChange(current,source){
    this.setData({currentActive : current.detail.current}) 
  },
  // slider 进度条拖动
  onSliderChange(e){
    // 计算要播放的位置时间
    const value = e.detail.value
    const currentTime = value / 100 * this.data.songDuration
    
    // 设置播放器,seek 接收一个秒钟
    audioContext.seek(currentTime / 1000)
    this.setData({songPlayTime:currentTime , isSliderChanging:false ,sliderValue:value})
  },
  // slider 滑动的过程
  onSliderChanging(e){
    // value 是滑动的一个百分比数值，与总时长相除得到要设置的方位
    const value = e.detail.value
    // 根据不松手一直在滑动的数据计算出cuurent的时间
    const currentTime = value / 100 * this.data.songDuration
    // console.log(currentTime);
    this.setData({songPlayTime:currentTime})
    // 滑块正在滑动
    this.data.isSliderChanging = true
  },

  // ====================================================播放器控制
  // 音乐播放控制器
  onPlayMusic(e){
    // 判断点击的按钮类型
    console.log('点击',e.currentTarget.dataset.type);
    const onType = e.currentTarget.dataset.type
    // 根据判断的按钮类型进行对应的操作
    switch(this.data.id !== -1){
      case onType === 'stateChange':
        if (this.data.songPlayStateIndex >= this.data.songPlayState.length - 1) {
          this.setData({
            songPlayStateIndex:0
          })
        }else{
          this.setData({
            songPlayStateIndex:this.data.songPlayStateIndex + 1
          })
        }
        console.log(this.data.songPlayStateIndex , this.data.songPlayState[this.data.songPlayStateIndex]);
        // console.log('播放设置');
        break
      case onType === 'resume':
        this.setData({controlPlayOrPause:!this.data.controlPlayOrPause})
        audioContext.play()
        break
      case onType === 'pause':
        this.setData({controlPlayOrPause:!this.data.controlPlayOrPause})
        audioContext.pause()
        break
      case onType === 'list':
        console.log(this.data.lyricPlayList);
        break
      case onType === 'prev':
        
        this.handleSwitchStateAndNextOrPause('prev')
        console.log('上一首',this.data.lyricPlayList[this.data.lyricPlayListIndex].id);
        break
      case onType === 'next':
        
        this.handleSwitchStateAndNextOrPause('next')
        console.log('下一首',this.data.lyricPlayList[this.data.lyricPlayListIndex].id);
        break
      default:
        break
    }
  },
  // 歌曲播放切换 上一首下一首
  handleSwitchStateAndNextOrPause(type){

    // 1、在 顺序模式 下判断上一首下一首
    if (this.data.songPlayState[this.data.songPlayStateIndex] === 'order') {
      // 1.1 下一首
      if (type === 'next') {
        if (this.data.lyricPlayListIndex >= this.data.lyricPlayList.length - 1) {
          this.setData({
            lyricPlayListIndex : 0
          })
        }else{
          this.setData({
            lyricPlayListIndex:this.data.lyricPlayListIndex + 1
          })
        }
        // 2、将下一首歌词的 id 给到，也就是重新请求一遍，但不好
        // this.setData({
        //     id : this.data.lyricPlayList[this.data.lyricPlayListIndex].id
        // })
        // this.handleSongPlaySwitchId(this.data.id)

        // 虽然不用重新请求歌曲信息，但是歌词信息还是要重新请求
        this.handleSwitchSong()
        audioContext.loop = false

        // 1.2 上一首
      }else if (type === 'prev') {
        // 判断前一首歌词是否超越下标
        if (this.data.lyricPlayListIndex <= 0) {
          this.setData({
            lyricPlayListIndex: this.data.lyricPlayList.length - 1
          })
        }else{
          this.setData({
            lyricPlayListIndex:this.data.lyricPlayListIndex - 1
          })
        }
        // this.setData({
        //   id : this.data.lyricPlayList[this.data.lyricPlayListIndex].id
        // })
        // 虽然不用重新请求歌曲信息，但是歌词信息还是要重新请求
        this.handleSwitchSong()
        audioContext.loop = false
      }
    
      // 2、在 随机模式 下判断上一首下一首
    }else if(this.data.songPlayState[this.data.songPlayStateIndex] === 'random'){
      if (type === 'prev') {
        let randomSong = Math.floor(Math.random() * this.data.lyricPlayList.length)
        this.setData({
          lyricPlayListIndex:randomSong
        })
        this.handleSwitchSong()
        audioContext.loop = false
      }else if(type === 'next'){
        let randomSong = Math.floor(Math.random() * this.data.lyricPlayList.length)
        this.setData({
          lyricPlayListIndex:randomSong
        })
        this.handleSwitchSong()
        audioContext.loop = false
      }
      // 3、在 单首循环模式 下判断上一首下一首
    }else if (this.data.songPlayState[this.data.songPlayStateIndex] === 'repeat') {
      if (type === 'next') {
        if (this.data.lyricPlayListIndex >= this.data.lyricPlayList.length - 1) {
          this.setData({
            lyricPlayListIndex : 0
          })
        }else{
          this.setData({
            lyricPlayListIndex:this.data.lyricPlayListIndex + 1
          })
        }

        this.handleSwitchSong()
         // 开启循环播放
        audioContext.loop = true

      }else if (type === 'prev') {
        if (this.data.lyricPlayListIndex <= 0) {
          this.setData({
            lyricPlayListIndex: this.data.lyricPlayList.length - 1
          })
        }else{
          this.setData({
            lyricPlayListIndex:this.data.lyricPlayListIndex - 1
          })
        }

        this.handleSwitchSong()
        // 开启循环播放
        audioContext.loop = true
      }
    }
  },

  // 歌曲切换歌曲信息 ， 音频 ，歌词重新请求
  handleSwitchSong(){
    this.setData({ 
      id : this.data.lyricPlayList[this.data.lyricPlayListIndex].id,
      currentSong : this.data.lyricPlayList[this.data.lyricPlayListIndex],
      songDuration: this.data.lyricPlayList[this.data.lyricPlayListIndex].dt
    })
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${this.data.id}.mp3`
    this.getSongLyricData()
  },


  // ===============================================================================组件卸载
  onUnload(){
    playStore.offStates(['playSongList','playSongIndex'],this.handleLyricPlayList)
  }
})