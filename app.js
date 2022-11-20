// app.js
App({
  globalData: {
    screenWidth:375,
    screenHeight:667,
    // 最顶层 时间 电量 通知栏 的高度
    statusHeight:20,
    // 歌词播放页面高度，需要减去 标题栏+通知栏高度
    contentHeight:500
  },
  onLaunch(){
     // 获取屏幕的尺寸
     wx.getSystemInfo({
      success:(res)=>{
        this.globalData.screenWidth = res.screenWidth
        this.globalData.screenHeight = res.screenHeight
        this.globalData.statusHeight = res.statusBarHeight
        this.globalData.contentHeight = res.screenHeight - res.statusBarHeight - 46
      }
    })
    // console.log(this.globalData.statusHeight);
    // console.log(this.globalData.contentHeight);
  }
})
