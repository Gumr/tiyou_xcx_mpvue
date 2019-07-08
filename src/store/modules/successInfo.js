import {
  SETSUCCESSINFO,
  CLEARSUCCESSINFO
} from '@/store/mutations-type'

const state = {
  info: {}
}

const mutations = {
  [SETSUCCESSINFO] (state, payload) {
    // 解构, 传默认值
    const {
      info = {}
    } = payload
    state.info = info
  },

  [CLEARSUCCESSINFO] (state) {
    state.info = {}
  }
}

const getters = {
  // 设置成功页信息 相当于计算属性
  vuexGetSucInfo (state) {
    return state.info
  }
}

const actions = {
  // 设置成功页信息
  async vuexSetSucInfo ({ commit }, data) {
    const payload = {
      info: data
    }
    commit(SETSUCCESSINFO, payload)
  },

  vuexClearSucInfo ({ commit }) {
    commit(CLEARSUCCESSINFO)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
