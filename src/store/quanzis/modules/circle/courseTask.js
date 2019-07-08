// 重构
// 圈子各类信息
import {
  COURSETASK,
  CLEARCOURSETASK,
  COURSETDONETOAY,
  COURSEANSERED
} from '@/store/quanzis/modules/circle/mutationsType'
import $api from '@/utils/quanzis/api'

const state = {
  // 课程任务流
  courseTask: [],
  nextPage: 0
}

const mutations = {
  [COURSETASK] (state, payLoad) {
    state.courseTask = payLoad.list
    state.nextPage = payLoad.nextPage
  },

  [CLEARCOURSETASK] (state, task) {
    state.courseTask = task
  },

  [COURSETDONETOAY] (state, id) {
    // 打卡
    let _index = state.courseTask.findIndex((i) => i.id === id)
    if (_index !== -1) {
      state.courseTask[_index].doneToday = 1
      state.courseTask[_index].todayAttendance += 1
      state.courseTask[_index].completedDays += 1
    }
  },

  [COURSEANSERED] (state, id) {
    let _index = state.courseTask.findIndex((i) => i.id === id)
    if (_index !== -1) {
      state.courseTask[_index].answered = 1
    }
  }
}

const getters = {
  vuexGetCourseTask (state) {
    return state.courseTask
  },

  vuexTaskCourseNext (state) {
    return state.nextPage
  }
}

const actions = {
  async vuexSetCourseTask ({ commit }, data) {
    let res = await $api.circle.courseTask(data)
    if (res.error) {
      return
    }
    let list = [ ...state.courseTask, ...res.rows ]
    res.nextPage = list.length - res.count
    const payLoad = {
      list,
      nextPage: res.nextPage
    }
    commit(COURSETASK, payLoad)
  },

  // 清空课程下任务列表
  vuexSetClearCourse ({ commit }, data) {
    commit(CLEARCOURSETASK, data)
  },

  // 列表打卡
  vuexSetCourseDone ({ commit }, id) {
    commit(COURSETDONETOAY, id)
  },

  // 列表回答
  vuexSetCourseAnsered ({ commit }, id) {
    commit(COURSEANSERED, id)
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
