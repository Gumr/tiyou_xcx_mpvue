// 个人信息
import {
  SETCARDINFO
} from '@/store/mutations-type'

const state = {
  cardInfo: {}
}

const mutations = {
  [SETCARDINFO] (state, payload) {
    // 解构, 传默认值
    const {
      cardInfo = {}
    } = payload
    state.cardInfo = cardInfo
  }
}

const getters = {
  // 得到个人信息 相当于计算属性
  vuexGetCardInfo (state) {
    return state.cardInfo
  }
}

const actions = {
  // 设置个人信息
  async vuexSetCardInfo ({ commit }, data) {
    const payload = {
      cardInfo: data
    }
    commit(SETCARDINFO, payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
