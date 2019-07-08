import apiRequest from './network.js'

function request ({ path = '', method = 'GET', data = {}, showLoad = 1 } = {}) {
  let type = 'X-App-Token'

  const header = {
    'content-type': 'application/json'
  }
  // todo
  let token = wx.getStorageSync('token')
  let circleAccount = wx.getStorageSync('circleAccount')
  header[type] = token
  let YlqUserToken = 'X-Ylq-UserToken'
  // 社群token
  let YlqCommunityRefNo = 'X-Ylq-CommunityRefNo'
  // todo
  header[YlqUserToken] = circleAccount.ylqAccountToken
  header[YlqCommunityRefNo] = circleAccount.ylqCommunityRefNo
  // header[type] = 'eyJ1c2VySWQiOjEsImV4cGlyZWRBdCI6MTU1NjQyMTkwMDA3OSwic2lnbiI6ImM4YmY3ZmIzZGEwNjlkMTRmNjcwM2E5Y2Q2YmI5MGFmIn0'
  // header[YlqUserToken] = 'eyJ1c2VySWQiOjIsImV4cGlyZWRBdCI6MTU4NTM2NTkwMDIyMiwic2lnbiI6IjEzOWFmMDMyMDEyNDI2NmM2YzljNjM2ZGFkODIzMjNiIn0'
  // header[YlqCommunityRefNo] = 'J53Pu5Qqkh'
  const d = {
    path,
    method,
    data,
    header,
    showLoad
  }
  return apiRequest(d)
}

export default {
  pay: {
    // orderType 表示入圈费用，circleId
    xcxPay (param) {
      return request(`/order`, 'POST', param)
    },
    // payConfirmed: 1   // 0未确认收款，1已确认收款
    payConfirmed (orderId) {
      return request(`/order/${orderId}/payConfirmed`, 'GET')
    }
  },
  auth: {
    // 小程序登录
    xcxLogin (data) {
      const params = {
        path: `/auth/xcxLogin`,
        method: 'POST',
        data
      }
      return request(params)
    },

    // 授权绑定手机号
    bindPhoneNo (data) {
      const params = {
        path: `/auth/bindPhoneNo`,
        method: 'POST',
        data
      }
      return request(params)
    },

    smsCode (phone) {
      return request(`/auth/smsCode?countryCode=86&phoneNo=${phone}`, 'GET')
    }
  },
  user: {
    // 获取七牛下载token-圈子
    uploadToken (type) {
      let data = {
        uploadType: type
      }
      const params = {
        path: `/upload/token`,
        method: 'GET',
        data
      }
      return request(params)
    },

    // 加入的圈子列表, circleType 1 普通圈子 2课程型圈子
    joinedCircle (param) {
      const params = {
        path: `/my/circle?joinStatus=${param.joinStatus}&page=${param.page}&perPage=9999`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    },

    // 我的发布-圈子
    myInfoData (param) {
      const params = {
        path: `/my/info?page=${param.page}&perPage=10`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    },

    // 我的打卡
    punchIn (param) {
      const params = {
        path: `/my/punchIn?page=${param.page}&perPage=10`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    }
  },
  circle: {
    // 所有圈子-列表
    allCircle (data) {
      const params = {
        path: `/circle?page=${data.page}&perPage=10`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    },

    // 搜索圈子
    circle (param) {
      // data: 搜索关键词，页数，每页结果数量
      const params = {
        path: `/circle?keyword=${param.keyword}&page=${param.page}&perPage=9999`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    },

    // 获取圈子下成员列表
    member (params) {
      const param = {
        path: `/circle/${params.circleId}/member?page=${params.page}&perPage=10`,
        method: 'GET',
        serverApi: 2
      }
      return request(param)
    },

    // 圈子详情
    circleId (circleId) {
      const params = {
        path: `/circle/${circleId}`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    },

    // 加入圈子
    circleJoin (id, param) {
      // 适配
      let { joinAnswers = [], joinReason = {} } = param
      let data = param
      if (joinAnswers.length) {
        let answers = []
        for (let i = 0; i < data.joinAnswers.length; i++) {
          answers.push({
            content: data.joinAnswers[i].answer,
            questionId: data.joinAnswers[i].questionId
          })
        }
        data = {
          answers
        }
        if (data.inviterUserId) {
          data = {
            answers,
            inviterUserId: 1
          }
        }
      }
      // 没有申请问题，默认提问
      if (joinReason.joinReason) {
        data = {
          reason: data.joinReason
        }
      }
      if (data.inviterUserId) {
        data = {
          reason: data.joinReason,
          inviterUserId: 1
        }
      }
      const params = {
        path: `/circle/${id}/join`,
        method: 'POST',
        data,
        serverApi: 2
      }
      return request(params)
    },

    // 退出圈子
    quitCircle (circleId) {
      const params = {
        path: `/circle/${circleId}/quit`,
        method: 'POST',
        serverApi: 2
      }
      return request(params)
    },

    // 圈子任务
    circleTask (data) {
      const { taskType = '' } = data
      const params = {
        path: `/task?circleId=${data.id}&page=${data.page}&perPage=10`,
        method: 'GET',
        serverApi: 2
      }
      if (taskType) {
        params.path += `&taskType=${taskType}`
      }
      return request(params)
    },

    // 获取圈子任务详情
    taskDetails (param) {
      const params = {
        path: `/task/${param.taskId}`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    },

    // 课程下子任务详情
    courseTaskDetail (param) {
      const params = {
        path: `/courseTask/${param.courseId}/childTask/${param.taskId}`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    },

    // 打卡
    circleSignEd (param, data) {
      if (data.pics.length <= 0) {
        data = {
          textContent: data.textContent
        }
      }
      const { courseId = 0 } = param
      let params = {
        method: 'POST',
        data,
        serverApi: 2
      }
      if (courseId) {
        params.path = `/courseTask/${param.courseId}/childTask/${param.taskId}/punchIn`
      } else {
        params.path = `/task/${param.taskId}/punchIn`
      }
      return request(params)
    },

    // 圈子下任务 打卡排行
    apiPunchInRanking (param) {
      const { courseId = 0 } = param
      let params = {
        method: 'GET',
        serverApi: 2
      }
      if (courseId) {
        params.path = `/courseTask/${param.courseId}/childTask/${param.taskId}/punchInRanking?page=1&perPage=9999`
      } else {
        params.path = `/task/${param.taskId}/punchInRanking?page=1&perPage=9999`
      }
      return request(params)
    },

    // 打卡任务,打卡列表
    punchInList (param) {
      const { courseId = 0 } = param
      let params = {
        method: 'GET',
        serverApi: 2
      }
      if (courseId) {
        params.path = `/courseTask/${param.courseId}/childTask/${param.taskId}/punchIn?page=${param.page}&perPage=10`
      } else {
        params.path = `/task/${param.taskId}/punchIn?page=${param.page}&perPage=10`
      }
      return request(params)
    },

    // 回答问题
    answerQuestion (params) {
      const { courseId = 0 } = params
      let param = {
        method: 'POST',
        data: params.data,
        serverApi: 2
      }
      // 圈子挑战和课程挑战
      if (courseId) {
        param.path = `/courseTask/${params.courseId}/childTask/${params.taskId}/answer`
      } else {
        param.path = `/task/${params.taskId}/answer`
      }
      return request(param)
    },

    // 问题任务回答列表
    answerList (param) {
      const { courseId = 0 } = param
      let params = {
        method: 'GET',
        serverApi: 2
      }
      if (courseId) {
        params.path = `/courseTask/${param.courseId}/childTask/${param.taskId}/answer?page=${param.page}&perPage=10`
      } else {
        params.path = `/task/${param.taskId}/answer?page=${param.page}&perPage=10`
      }
      return request(params)
    },

    // 课程详情
    courseList (param) {
      const params = {
        path: `/courseTask/${param.courseTaskId}`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    },

    // 课程任务列表
    courseTask (param) {
      const params = {
        path: `/courseTask/${param.courseId}/childTask?page=${param.page}&perPage=10`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    }
  },

  myCircle: {
    // 我加入的圈子
    myCircle (data) {
      const params = {
        path: `/my/circle?page=${data.page}&perPage=10&joinStatus=${data.joinStatus}`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    },

    myCourseTask (data) {
      const params = {
        path: `/my/courseTask?page=${data.page}&perPage=9999`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    }
  },

  info: {
    // share (params) {
    //   const param = {
    //     path: `/share`,
    //     method: 'POST',
    //     data: params,
    //     serverApi: 2
    //   }
    //   return request(param)
    // },

    // 发布
    publish (data) {
      const params = {
        path: `/info`,
        method: 'POST',
        serverApi: 2,
        data
      }
      return request(params)
    },

    // 获取课程里信息流
    courseInfo (param) {
      const params = {
        path: `/courseTask/${param.courseTaskId}/info?page=${param.page}&perPage=10`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    },

    // 圈子信息
    info (data) {
      const params = {
        path: `/info?circleId=${data.circleId}&page=${data.page}&perPage=10`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    },

    // 获取信息详情
    getInfoDetail (infoId) {
      const params = {
        path: `/info/${infoId}`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    },

    // 删除信息
    deleteMsg (infoId) {
      const params = {
        path: `/info/${infoId}`,
        method: 'DELETE',
        serverApi: 2
      }
      return request(params)
    },

    // 获取评论
    getCommentList (param) {
      const params = {
        path: `/info/${param.infoId}/comment?page=${param.page}&perPage=10`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    },

    // 评论
    comment (id, data) {
      const params = {
        path: `/info/${id}/comment`,
        method: 'POST',
        data,
        serverApi: 2
      }
      return request(params)
    },

    // 删除某条评论
    delComment (data) {
      const params = {
        path: `/info/${data.infoId}/comment/${data._id}`,
        method: 'DELETE',
        serverApi: 2
      }
      return request(params)
    },

    // 踩
    dislike (data) {
      const params = {
        path: `/info/${data.infoId}/dislike`,
        method: 'PUT',
        data: data.data,
        serverApi: 2,
        showLoad: 0
      }
      return request(params)
    },

    // 点赞
    like (data) {
      const params = {
        path: `/info/${data.infoId}/like`,
        method: 'PUT',
        data: data.data,
        serverApi: 2,
        showLoad: 0
      }
      return request(params)
    },

    // 评级 10 置顶 9 优质 5 普通
    setInfoLevel (param, level) {
      const { courseId = 0 } = param
      let params = {
        method: 'PUT',
        data: level,
        serverApi: 2
      }
      if (courseId) {
        params.path = `/courseTask/${param.courseId}/childTask/${param.taskId}/answer/${param.answerId}/level`
      } else {
        params.path = `/task/${param.taskId}/answer/${param.answerId}/level`
      }
      return request(params)
    }
  },

  topic: {
    topicDetail (topicContent) {
      const params = {
        path: `/topic/${topicContent}`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    },

    topicInfo (param) {
      const params = {
        path: `/info?page=${param.page}&perPage=10&topic=${param.topic}`,
        method: 'GET',
        serverApi: 2
      }
      return request(params)
    }
  },

  share: {
    shareImg (data) {
      const params = {
        path: `/qz-share/xcxCodeImg`,
        data,
        method: 'POST',
        serverApi: 2
      }
      return request(params)
    },

    shareGetUser (data) {
      const params = {
        path: `/user/${data.userId}`,
        serverApi: 2,
        method: 'GET'
      }
      return request(params)
    }
  }
}
