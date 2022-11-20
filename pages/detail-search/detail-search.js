// pages/detail-search/detail-search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 监听input输入框数据变化
  onInputChange(e){
    this.setData({
      searchValue:e.detail
    },()=>{
      console.log(this.data.searchValue);
    })
  }
})