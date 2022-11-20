import {HYEventStore} from 'hy-event-store'

const playStore = new HYEventStore({
  state:{
    playSongList:[],
    playSongIndex:0
  },
  actions:{

  }
})

export default playStore