import {HYEventStore} from 'hy-event-store'
import {recommendPlayListDetail} from '../services/music'
/**
  新歌 id=3779629
  原创 id=2884035
  飙升 id=19723756
  热歌 id=3778678
 */
const rankingIdx = {
  newRanking:3779629,
  originRanking:2884035,
  upRanking:19723756
}
const rankingStore = new HYEventStore({
  state:{
    newRanking:{},
    originRanking:{},
    upRanking:{}
  },
  actions:{
    fetchRankingDataAction(ctx){
      for (const key in rankingIdx) {
        const id = rankingIdx[key]
         recommendPlayListDetail(id).then(res=>{
          // console.log(res);
          ctx[key] = res.playlist
        })
      }
        
       
    }
  }
})

export default rankingStore