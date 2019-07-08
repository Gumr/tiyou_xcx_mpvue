// 重构
// 圈子各类信息
import {
  SETCARETASK
} from '@/store/quanzis/modules/circle/mutationsType'
import $api from '@/utils/quanzis/api'

const state = {
  // 任务回答列表，最多展示2个，所以只用请求一页
  taskList: []
}

const mutations = {
  [SETCARETASK] (state, payload) {
    state.taskList = payload.list
  }
}

const getters = {
  vuexGetCareTask (state) {
    return 
  }
}

const actions = {
  async vuexGetCareTask ({ commit }, data) {
    let res = await $api.circle.answerList(data)
    if (res.error) {
      return
    }
    const payload = {
      list: res.rows
    }
    commit(SETCARETASK, payload)
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
