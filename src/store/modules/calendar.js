// 日历
import {
  SETCALENDAR,
  CLEARCALENDAR
} from '@/store/mutations-type'

const state = {
  calendarList: {}
}

const mutations = {
  [SETCALENDAR] (state, payload) {
    // 解构, 传默认值
    const {
      info = {}
    } = payload
    state.calendarList = info
  },

  [CLEARCALENDAR] (state) {
    state.calendarList = {}
  }
}

const getters = {
  // 得到日历信息 相当于计算属性
  vuexGetCalendarList (state) {
    return state.calendarList
  }
}

const actions = {
  // 设置多天日历信息
  async vuexSetCalendarList ({ commit }, data) {
    const payload = {
      info: data
    }
    commit(SETCALENDAR, payload)
  },

  vuexClearCalenDar ({ commit }) {
    commit(CLEARCALENDAR)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
