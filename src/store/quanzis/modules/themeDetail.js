import { SETCIRCLEID, SETSTATUS } from '../mutations-type'

const state = {
  circleId: -1,
  themeJoinStatus: false
}

const mutations = {
  [SETCIRCLEID] (state, circleId) {
    state.circleId = circleId
  },
  [SETSTATUS] (state, status) {
    state.themeJoinStatus = status
  }
}

const getters = {
  themeCircleID (state) {
    return state.circleId
  },
  themeJoinStatus (state) {
    return state.themeJoinStatus
  }
}

const actions = {
  setCircle ({ commit }, circleId) {
    commit(SETCIRCLEID, circleId)
  },
  setStatus ({ commit }, status) {
    commit(SETSTATUS, status)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
