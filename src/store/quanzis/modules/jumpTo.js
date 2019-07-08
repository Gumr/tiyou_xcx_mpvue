import { SETJUMP, SETCOURSEID } from '../mutations-type'

const state = {
  jumpToStatus: 1,
  courseId: ''
  // 1为圈子，101为课程
}

const mutations = {
  [SETJUMP] (state, jumpToStatus) {
    state.jumpToStatus = jumpToStatus
  },
  [SETCOURSEID] (state, courseId) {
    state.courseId = courseId
  }
}

const getters = {
  getJumpToStatus (state) {
    return state.jumpToStatus
  },
  getCourseId (state) {
    return state.courseId
  }
}

const actions = {
  setJumpToStatus ({ commit }, jumpToStatus) {
    commit(SETJUMP, jumpToStatus)
  },
  setCourseId ({ commit }, courseId) {
    commit(SETCOURSEID, courseId)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
