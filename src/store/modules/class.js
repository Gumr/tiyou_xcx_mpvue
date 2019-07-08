// 个人信息
import {
  SETCLASSINFO
} from '@/store/mutations-type'

const state = {
  classInfo: {}
}

const mutations = {
  [SETCLASSINFO] (state, payload) {
    // 解构, 传默认值
    const {
      classInfo = {}
    } = payload
    state.classInfo = classInfo
  }
}

const getters = {
  // 得到个人信息 相当于计算属性
  vuexGetClassInfo (state) {
    return state.classInfo
  }
}

const actions = {
  // 设置个人信息
  async vuexSetClassInfo ({ commit }, data) {
    const payload = {
      classInfo: data
    }
    commit(SETCLASSINFO, payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
