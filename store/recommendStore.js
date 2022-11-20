import {HYEventStore} from 'hy-event-store'
import { recommendPlayListDetail } from '../services/music'
const recommendStore = new HYEventStore({
  state:{
    recommendSongs:{}
  },
  actions:{
    async fetchRecommendPlayListDetail(ctx){
      const res = await recommendPlayListDetail(3778678)
      // console.log(res);
      ctx.recommendSongs = res.playlist 
    }
  }
})

export default recommendStore