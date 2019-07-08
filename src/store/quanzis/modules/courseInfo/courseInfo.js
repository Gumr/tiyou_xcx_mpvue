// 重构
// 课程信息信息
import {
  SETCOURSEINFO,
  SETCLEARCOURSEINFO,
  SETADDCOURSEINFO,
  SETDELCOURSERID
} from '@/store/quanzis/modules/circle/mutationsType'
import $getTime from '@/utils/quanzis/getTime'

const state = {
  // 信息
  courseInfo: []
}

const mutations = {
  [SETCOURSEINFO] (state, payLoad) {
    const {
      info = []
    } = payLoad
    state.courseInfo = info
  },

  [SETADDCOURSEINFO] (state, payLoad) {
    const {
      infoItem = {}
    } = payLoad
    state.courseInfo = [ infoItem, ...state.courseInfo ]
  },

  [SETCLEARCOURSEINFO] (state) {
    state.courseInfo = []
  },

  [SETDELCOURSERID] (state, payLoad) {
    const {
      id = ''
    } = payLoad
    state.courseInfo = state.courseInfo.filter((i) => i._id !== id)
  }
}

const getters = {
  vuexGetCourseInfo (state) {
    return state.courseInfo
  }
}

const actions = {
  vuexSetCourseInfo ({ commit }, data) {
    const payLoad = {
      info: data
    }
    commit(SETCOURSEINFO, payLoad)
  },

  vuexAddCourseInfo ({ commit }, data) {
    data.createdAt = $getTime.getTime(data.createdAt)
    const payLoad = {
      infoItem: data
    }
    commit(SETADDCOURSEINFO, payLoad)
  },

  vuexDelCourseId ({ commit }, id) {
    const payLoad = {
      id
    }
    commit(SETDELCOURSERID, payLoad)
  },

  vuexClearCourseInfo ({ commit }) {
    commit(SETCLEARCOURSEINFO)
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
