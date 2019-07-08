import {
  ASETTASKDETAIL,
  ASETTASKLIST,
  ASETDELTASK
} from '../../mutations-type'

const state = {
  taskDetailId: {},
  taskList: []
}

const mutations = {
  [ASETTASKDETAIL] (state, t) {
    state.taskDetailId = t
  },
  [ASETTASKLIST] (state, list) {
    state.taskList = list
  },
  [ASETDELTASK] (state, data) {
    state.taskList = state.taskList.filter((i) => i.id !== data.infoId)
  }
}

const getters = {
  aGetTaskDetail (state) {
    return state.taskDetailId
  },
  aGetTaskList (state) {
    return state.taskList
  }
}

const actions = {
  aSetTaskDetail ({ commit }, t) {
    commit(ASETTASKDETAIL, t)
  },
  aSetTaskList ({ commit }, list) {
    commit(ASETTASKLIST, list)
  },
  aSetDelTaskList ({ commit }, data) {
    commit(ASETDELTASK, data)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
