// components/area-header/area-header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:''
    },
    hasMore:{
      type:Boolean,
      value:true
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
    // 点击更多按钮发送事件
    onMoreClick(){
      this.triggerEvent('onMoreClick')
    }
  }
})
