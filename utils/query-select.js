export function querySelectImage(classProps){
  return new Promise((resolve)=>{
    const query = wx.createSelectorQuery()
    // 拿到 image 组件的矩形框
    query.select(classProps).boundingClientRect()
    query.exec(res=>{
      resolve(res)
    })
  })
}

export default function querySelect(selector) {
  return new Promise(resolve => {
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()
    query.exec((res) => {
      resolve(res)
    })
  })
}
