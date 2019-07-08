// 个人信息
import {
  SETUSERINFO
} from '@/store/mutations-type'
// import $api from '@/utils/api'

const state = {
  // 个人信息
  userInfo: {}
}

const mutations = {
  [SETUSERINFO] (state, payload) {
    // 解构, 传默认值
    const {
      userInfo = {}
    } = payload
    state.userInfo = userInfo
  }
}

const getters = {
  // 得到个人信息 相当于计算属性
  vuexGetUserInfo (state) {
    return state.userInfo
  }
}

const actions = {
  // 设置个人信息
  async vuexSetUserInfo ({ commit }, data) {
    // let res = await $api.user(data)
    // if (res.error) {
    //   return
    // }
    const payload = {
      userInfo: data
    }
    commit(SETUSERINFO, payload)
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
