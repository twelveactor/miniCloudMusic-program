// pages/detail-menu/detail-menu.js
import {allMenuTag ,hotMenuList} from '../../services/music'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 根据各个歌单标签获取的各个歌单的数据全部汇总在此
    allTagsMenuList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取 歌单全部分类标签
    this.fetchAllMenuTag()
  },
  async fetchAllMenuTag(){
    // 1、获取歌单tag ，如华语，流行.....
    const res = await allMenuTag()
    const tags = res.tags

    // 2、根据歌单 tag 请求对应歌单歌词数据
    const allPromise = []
    tags.forEach(tag => {
      //  console.log(tag.name);     
       const promise = hotMenuList(tag.name)
       allPromise.push(promise)
    });
    
    // 3、获取到所有 tags 数据后，一次全部写入 setData
    Promise.all(allPromise).then(res=>{
      console.log(res);
      this.setData({
        allTagsMenuList:res
      })
    })
  }
})