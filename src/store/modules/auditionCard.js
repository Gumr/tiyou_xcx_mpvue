import {
  SETAUDITION
} from '@/store/mutations-type'

const state = {
  info: {
    organizationId: '',
    branchId: ''
  }
}

const mutations = {
  [SETAUDITION] (state, payload) {
    // 解构, 传默认值
    const {
      info = {}
    } = payload
    state.info = info
  }
}

const getters = {
  vuexGetAuditionInfo (state) {
    return state.info
  }
}

const actions = {
  vuexSetAuditionInfo ({ commit }, data) {
    const payload = {
      info: data
    }
    commit(SETAUDITION, payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
