// 个人信息
import {
  SETCHILDINFO
} from '@/store/mutations-type'

const state = {
  childInfo: {}
}

const mutations = {
  [SETCHILDINFO] (state, payload) {
    // 解构, 传默认值
    const {
      childInfo = {}
    } = payload
    state.childInfo = childInfo
  }
}

const getters = {
  // 得到个人信息 相当于计算属性
  vuexGetChildInfo (state) {
    return state.childInfo
  }
}

const actions = {
  // 设置个人信息
  async vuexSetChildInfo ({ commit }, data) {
    const payload = {
      childInfo: data
    }
    commit(SETCHILDINFO, payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
