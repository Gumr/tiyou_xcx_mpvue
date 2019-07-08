// 重构
// 圈子各类信息
import {
  SETCIRCLETASK,
  CLEARCIRCLETASK,
  DONETOAYTASK,
  ANSWEREDTASK,
  ALLTASKSIGN,
  ALLCOURSE,
  ALLQUESTIONS
} from '@/store/quanzis/modules/circle/mutationsType'
import $api from '@/utils/quanzis/api'

const state = {
  // 圈子任务流
  circleTask: [],
  // 全部打卡
  circleAllSign: [],
  // 全部挑战
  circleAllQuestions: [],
  // 三个任务
  circleTaskThree: [],
  // 全部课程
  circleAllCoures: [],
  nextPage: 0,
  singNextPage: 0,
  questionsNextPage: 0,
  courseNextPage: 0,
  taskType: ''
}

const mutations = {
  [SETCIRCLETASK] (state, payLoad) {
    state.circleTask = payLoad.list
    state.nextPage = payLoad.nextPage
    if (state.circleTask.length > 3) {
      state.circleTaskThree = [ ...state.circleTask.slice(0, 3) ]
    } else {
      state.circleTaskThree = [ ...state.circleTask ]
    }
  },

  [ALLTASKSIGN] (state, payLoad) {
    state.circleAllSign = payLoad.list
    state.singNextPage = payLoad.singNextPage
  },

  [ALLQUESTIONS] (state, payLoad) {
    state.circleAllQuestions = payLoad.list
    state.questionsNextPage = payLoad.questionsNextPage
  },

  [ALLCOURSE] (state, payLoad) {
    state.circleAllCoures = payLoad.list
    state.courseNextPage = payLoad.courseNextPage
  },

  [CLEARCIRCLETASK] (state, task) {
    state.circleTask = task
    state.circleAllCoures = task
    state.circleAllQuestions = task
    state.circleAllSign = task
    state.nextPage = 0
    state.singNextPage = 0
    state.questionsNextPage = 0
    state.courseNextPage = 0
  },

  [DONETOAYTASK] (state, id) {
    // 打卡
    let _index = state.circleTask.findIndex((i) => i.id === id)
    if (_index !== -1) {
      state.circleTask[_index].doneToday = 1
      state.circleTask[_index].todayAttendance += 1
      state.circleTask[_index].currentCompletedDays += 1
    }
  },

  [ANSWEREDTASK] (state, id) {
    let _index = state.circleTask.findIndex((i) => i.id === id)
    if (_index !== -1) {
      state.circleTask[_index].answered = 1
    }
  }
}

const getters = {
  // 全部
  vuexGetTask (state) {
    return state.circleTask
  },

  // 分类，打卡
  vuexAllTaskClass (state) {
    return (status) => {
      if (status === 1) {
        return state.circleAllSign
      }
      if (!status) {
        return state.circleTask
      }
      if (status === 2) {
        return state.circleAllQuestions
      }
      if (status === 101) {
        return state.circleAllCoures
      }
    }
  },

  // 圈子展示3个任务
  vuexCircleTask (state) {
    return state.circleTaskThree
  },

  // 全部任务，课程
  vuexAllCoures (state) {
    let arr = []
    if (state.circleTask.length) {
      arr = state.circleTask.filter((i) => i.taskType === 101)
    }
    return arr
  },

  // 全部任务，打卡
  vuexAllQuestions (state) {
    let arr = []
    if (state.circleTask.length) {
      arr = state.circleTask.filter((i) => i.taskType === 1)
    }
    return arr
  },

  // 全部任务，打卡
  vuexAllTask (state) {
    let arr = []
    if (state.circleTask.length) {
      arr = state.circleTask.filter((i) => i.taskType === 2)
    }
    return arr
  },

  vuexTaskNext (state) {
    return (status) => {
      if (!status) {
        return state.nextPage
      }
      if (status === 1) {
        return state.singNextPage
      }
      if (status === 2) {
        return state.questionsNextPage
      }
      if (status === 101) {
        return state.courseNextPage
      }
    }
  }
}

const actions = {
  async vuexSetCricleTask ({ commit }, data) {
    let res = await $api.circle.circleTask(data)
    if (res.error) {
      return
    }
    let list = [ ...state.circleTask, ...res.rows ]
    // let setList = this.list.filter(i => i.taskType !== 101)
    res.nextPage = list.length - res.count
    const payLoad = {
      list,
      nextPage: res.nextPage
    }
    commit(SETCIRCLETASK, payLoad)
  },

  // 分类全部打卡
  async vuexSetAllTaskSign ({ commit }, data) {
    data.taskType = 1
    let res = await $api.circle.circleTask(data)
    if (res.error) {
      return
    }
    let list = [ ...state.circleAllSign, ...res.rows ]
    res.nextPage = list.length - res.count
    const payload = {
      list,
      singNextPage: res.nextPage
    }
    commit(ALLTASKSIGN, payload)
  },

  // 分类全部问答
  async vuexSetAllQuestions ({ commit }, data) {
    data.taskType = 2
    let res = await $api.circle.circleTask(data)
    if (res.error) {
      return
    }
    let list = [ ...state.circleAllQuestions, ...res.rows ]
    res.nextPage = list.length - res.count
    const payload = {
      list,
      questionsNextPage: res.nextPage
    }
    commit(ALLQUESTIONS, payload)
  },

  async vuexSetAllCourse ({ commit }, data) {
    data.taskType = 101
    let res = await $api.circle.circleTask(data)
    if (res.error) {
      return
    }
    let list = [ ...state.circleAllCoures, ...res.rows ]
    res.nextPage = list.length - res.count
    const payload = {
      list,
      courseNextPage: res.nextPage
    }
    commit(ALLCOURSE, payload)
  },

  vuexClearTask ({ commit }, data) {
    commit(CLEARCIRCLETASK, data)
  },

  // 打卡
  vuexDoneToday ({ commit }, id) {
    commit(DONETOAYTASK, id)
  },

  // 挑战
  vuexAnswered ({ commit }, id) {
    commit(ANSWEREDTASK, id)
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
