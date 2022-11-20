// components/song-item-v4/song-item-v4.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songItem:{
      type:Object,
      value:{}
    },
    index:{
      type:Number,
      value:-1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotoMusicPlay(){
      const id = this.properties.songItem.id
      wx.navigateTo({
        url: `/pages/music-play/music-play?id=${id}`,
      })
    }
  }
})
