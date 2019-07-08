// 重构
// 圈子各类信息
import {
  TASKDETAIL,
  DETAILDONETOAY,
  DETAILANSWERED,
  DELDETAILANSWERED
} from '@/store/quanzis/modules/circle/mutationsType'
import $api from '@/utils/quanzis/api'

const state = {
  // 任务详情
  detail: {},
  questions: [],
  // 任务类型
  questionType: ''
}

const mutations = {
  [TASKDETAIL] (state, data) {
    state.detail = data
    state.questions = data.questions
    state.questionType = data.questionType
  },

  [DETAILDONETOAY] (state, id) {
    // 打卡
    if (id === state.detail.id) {
      state.detail.doneToday = 1
      state.detail.todayAttendance += 1
      state.detail.currentCompletedDays += 1
    }
  },

  [DETAILANSWERED] (state, id) {
    if (id === state.detail.id) {
      state.detail.answered = 1
    }
  },

  [DELDETAILANSWERED] (state, data) {
    if (data.id === state.detail.id) {
      state.detail.answered = 0
    }
  }
}

const getters = {
  // 任务详情
  vuexGetTaskDetail (state) {
    return state.detail
  },

  vuexGetQuestions (state) {
    return state.questions
  },

  vuexGetQuestionType (state) {
    return state.questionType
  }
}

const actions = {
  async vuexSetTaskDetail ({ commit }, data) {
    let { courseId = 0 } = data
    let res = {}
    if (!courseId) {
      res = await $api.circle.taskDetails(data)
    }
    if (courseId) {
      res = await $api.circle.courseTaskDetail(data)
    }
    if (res.error) {
      return
    }
    commit(TASKDETAIL, res)
  },

  // // 打卡
  vuexDetailDoneToday ({ commit }, id) {
    commit(DETAILDONETOAY, id)
  },

  // 挑战
  vuexDetailAnswered ({ commit }, id) {
    commit(DETAILANSWERED, id)
  },

  vuexDelDetailAnswered ({ commit }, data) {
    commit(DELDETAILANSWERED, data)
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
