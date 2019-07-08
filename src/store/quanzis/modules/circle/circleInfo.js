// 重构
// 圈子各类信息
import {
  SETCIRCLEINFO,
  CLEARCIRCLEINFO,
  SETADDINFO,
  SETFILTERINFO
} from '@/store/quanzis/modules/circle/mutationsType'
import $api from '@/utils/quanzis/api'
import $getTime from '@/utils/quanzis/getTime'

const state = {
  // 圈子任务流
  circleInfo: [],
  nextPage: 0
}

const mutations = {
  [SETCIRCLEINFO] (state, payLoad) {
    state.nextPage = payLoad.nextPage
    state.circleInfo = payLoad.info
  },

  [SETADDINFO] (state, payLoad) {
    const {
      info = {}
    } = payLoad
    state.circleInfo = [ info, ...state.circleInfo ]
  },

  [CLEARCIRCLEINFO] (state, data) {
    state.circleInfo = data
  },

  [SETFILTERINFO] (state, payLoad) {
    const {
      infoId = ''
    } = payLoad
    state.circleInfo = state.circleInfo.filter((i) => i.id !== infoId)
  }
}

const getters = {
  vuexGetCircleInfo (state) {
    return state.circleInfo
  },

  vuexGetCircleNext (state) {
    return state.nextPage
    // return 0
  }
}

const actions = {
  async vuexSetCircleInfo ({ commit }, data) {
    let res = await $api.info.info(data)
    if (res.error) {
      return
    }
    let rows = res.rows.map((i) => {
      return {
        ...i,
        createdAt: $getTime.getTime(i.createdAt)
      }
    })
    let info = [ ...state.circleInfo, ...rows ]
    res.nextPage = info.length - res.count
    const payLoad = {
      info,
      nextPage: res.nextPage
    }
    commit(SETCIRCLEINFO, payLoad)
  },

  vuexAddInfo ({ commit }, data) {
    data.createdAt = $getTime.getTime(data.createdAt)
    const payLoad = {
      info: data
    }
    commit(SETADDINFO, payLoad)
  },

  vuexDelInfoId ({ commit }, id) {
    const payLoad = {
      infoId: id
    }
    commit(SETFILTERINFO, payLoad)
  },

  vuexClearInfo ({ commit }, data) {
    commit(CLEARCIRCLEINFO, data)
  }
}

export default {
  // 命名空间
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
