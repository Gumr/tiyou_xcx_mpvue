// 重构
// 圈子各类信息
import {
  SETCIRCLEDETAIL,
  COURSECIRCLESTATUS,
  CLEARCIRCLEDETAIL
  // SETCIRCLEINFO
} from '@/store/quanzis/modules/circle/mutationsType'
import $api from '@/utils/quanzis/api'

const state = {
  // 圈子详情
  circleDetail: {},
  // 课程型圈子
  courseCircle: {},
  members: [],
  name: '',
  circleType: 1,
  // 所在圈子权限
  circleUserRole: 0,
  memberCount: 0,
  joinStatus: 1
}

const mutations = {
  [SETCIRCLEDETAIL] (state, detail) {
    state.circleDetail = detail
    state.joinStatus = detail.joinStatus
    state.members = detail.members
    state.name = detail.name
    state.courseCircle = detail.courseTask.courseDetail
    state.circleType = detail.circleType
    state.circleUserRole = detail.userRole || 0
    state.memberCount = detail.memberCount
  },

  [CLEARCIRCLEDETAIL] (state) {
    state.circleDetail = {}
    state.members = []
    state.joinStatus = 1
    state.name = ''
    state.circleType = 1
    state.circleUserRole = 0
  },

  [COURSECIRCLESTATUS] (state, status) {
    state.circleType = status
  }
}

const getters = {
  vuexGetCicleDetail (state) {
    let status = {
      joinStatus: 1
    }
    status = state.circleDetail
    return status
  },

  // 课程型圈子
  vuexCourseCircle (state) {
    return state.courseCircle
  },

  // 是否为课程型圈子
  vuexGetCourseCircleS (state) {
    return state.circleType
  },

  // 所在圈子权限
  vuexGetCircleUserRole (state) {
    return state.circleUserRole
  },

  // 管理员信息
  vuexGetAdmin (state) {
    const { administrator = {} } = state.circleDetail
    return administrator
  },

  // 成员
  vuexGetMembers (state) {
    const { members = {} } = state.circleDetail
    return members
  },

  // 成员数量
  vuexInfoCount (state) {
    return state.memberCount
  },

  // 圈子加入状态默认为1
  vuexJoinStatus (state) {
    return state.joinStatus
  },
  // 成员
  vuexGetRows (state) {
    return state.members
  },

  // 标题
  vuexGetName (state) {
    // const { name = '圈子' } = state.circleDetail
    return state.name
  },

  vuexBtnText (state) {
    const { joinStatus, joinApplied } = state.circleDetail
    let text = '申请加入'
    // 自由加入
    if (state.circleDetail.joinType === 1) {
      text = '加入'
    }
    if (state.circleDetail.price > 0) {
      text = '支付加入'
    }
    if (joinStatus === 0) {
      text = '待审核'
    }
    if (joinStatus === 2 && joinApplied === 1) {
      text = '重新申请'
    }
    return text
  }
}

const actions = {
  async vuexSetCircleDetail ({ commit }, ciecleId) {
    let res = await $api.circle.circleId(ciecleId)
    if (res.error) {
      return
    }
    commit(SETCIRCLEDETAIL, res)
  },

  vuexSetCourseCircle ({ commit }, status) {
    commit(COURSECIRCLESTATUS, status)
  },

  // 清除圈子详情
  vuexSetClearDetail ({ commit }) {
    commit(CLEARCIRCLEDETAIL)
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
