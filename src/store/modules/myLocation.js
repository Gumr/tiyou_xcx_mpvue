// 用户经纬度
import {
  SETLOCATION
} from '@/store/mutations-type'

const state = {
  info: {
    // 未同意设置经纬度
    status: 1
  }
}

const mutations = {
  [SETLOCATION] (state, payload) {
    // 解构, 传默认值
    const {
      info = {}
    } = payload
    state.info = info
  }
}

const getters = {
  // 用户经纬度 相当于计算属性
  vuexGetLocation (state) {
    return state.info
  }
}

const actions = {
  // 用户经纬度
  async vuexSetLocation ({ commit }, data) {
    const payload = {
      info: data
    }
    commit(SETLOCATION, payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
