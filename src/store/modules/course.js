// 个人信息
import {
  SETCOURSEINFO
} from '@/store/mutations-type'

const state = {
  courseInfo: {}
}

const mutations = {
  [SETCOURSEINFO] (state, payload) {
    // 解构, 传默认值
    const {
      courseInfo = {}
    } = payload
    state.courseInfo = courseInfo
  }
}

const getters = {
  // 得到个人信息 相当于计算属性
  vuexGetCourseInfo (state) {
    return state.courseInfo
  }
}

const actions = {
  // 设置个人信息
  async vuexSetCourseInfo ({ commit }, data) {
    const payload = {
      courseInfo: data
    }
    commit(SETCOURSEINFO, payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
