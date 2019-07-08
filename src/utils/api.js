import apiRequest from './network.js'
import location from './location'

export const version = '0.2.0'
// export const version = '0.0.0'

function request ({ path = '', method = 'GET', data = {}, showLoad = 1 } = {}) {
  let type = 'X-TY-Xcx-Token'

  const header = {
    'version': version || 0,
    'content-type': 'application/json'
  }
  // todo
  let token = wx.getStorageSync('token')
  header[type] = token
  // header[type] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6MSwiZXhwIjoxNTU2MjYzNzgxLCJpc3MiOiJ0aXlvdSJ9.oBlsFu_t2TgdmUyJ-dSGamYZRwnLxmIGQFjbFhKgjFM'
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

  auth: {
    // 小程序登录
    xcxLogin (data) {
      const params = {
        path: `/xcx/auth`,
        method: 'POST',
        data
      }
      return request(params)
    },

    // 绑定手机号
    bindPhoneNo (data) {
      const params = {
        path: `/xcx/auth/bindPhone`,
        method: 'POST',
        data
      }
      return request(params)
    }
  },

  xcxLogin: {
    uploadToken () {
      const params = {
        path: `/xcx/uploadToken`,
        method: 'GET'
      }
      return request(params)
    }
  },

  my: {
    profile () {
      const params = {
        path: `/xcx/user/profile`,
        method: 'GET'
      }
      return request(params)
    },

    // 更新token
    upDateToken () {
      const params = {
        path: `/xcx/auth/updateToken`
      }
      return request(params)
    }
  },

  // 分享-用户详情
  share: {
    cardDetail (id) {
      const params = {
        path: `/xcx/card/${id}`,
        method: 'GET'
      }
      return request(params)
    },

    // 会员中心分享 => 查看分享详情
    getUserShareDetail (data) {
      const params = {
        path: `/xcx/activity/info/${data.userId}`,
        method: 'GET'
      }
      return request(params)
    },

    getCard (data) {
      const params = {
        path: `/xcx/activity/receive`,
        method: 'POST',
        data
      }
      return request(params)
    },

    // 是否可以领取
    canCardType (data) {
      const params = {
        path: `/xcx/activity/can`,
        method: 'POST',
        data
      }
      return request(params)
    }
  },

  child: {
    // 家庭关系-增加
    addChild (data) {
      const params = {
        path: `/xcx/child`,
        method: 'POST',
        data
      }
      return request(params)
    },

    putChild (data, id) {
      const params = {
        path: `/xcx/child/${id}`,
        method: 'PUT',
        data
      }
      return request(params)
    },

    // 孩子列表
    childList () {
      const params = {
        path: `/xcx/child?page=1&pageSize=9999`,
        method: 'GET'
      }
      return request(params)
    },

    // 孩子详情
    getChildById (data) {
      const params = {
        path: `/xcx/child/${data}`,
        method: 'GET'
      }
      return request(params)
    },

    // 家庭关系-删除
    delChild (id) {
      const params = {
        path: `/xcx/child/${id}`,
        method: 'DELETE'
      }
      return request(params)
    }
  },

  card: {
    // 兑换卡
    redemption (data) {
      const params = {
        path: `/xcx/exchange`,
        method: 'POST',
        data
      }
      if (data.organizationId) {
        params.path += `?organizationId=${data.organizationId}`
      }
      if (data.branchId) {
        params.path += `&branchId=${data.branchId}`
      }
      return request(params)
    },

    // 购买卡
    buyCard (data) {
      const params = {
        path: `/xcx/cardType/buy`,
        method: 'POST',
        data
      }
      return request(params)
    },

    // 卡类详情
    cardTypeDetail (data) {
      const params = {
        path: `/xcx/cardType/${data.typeId}`,
        method: 'GET'
      }
      return request(params)
    },

    // 卡详情
    cardDetail (data) {
      const params = {
        path: `/xcx/card/${data.cardId}`,
        method: 'GET'
      }
      return request(params)
    },

    // 卡类型
    cardType () {
      const params = {
        path: `/xcx/cardType?page=1&pageSize=9999`,
        method: 'GET'
      }
      return request(params)
    },

    // 我的卡列表
    myCardList () {
      const params = {
        path: `/xcx/card?page=1&pageSize=9999`,
        method: 'GET'
      }
      return request(params)
    },

    // 卡绑定孩子
    bindChild (data) {
      const params = {
        path: `/xcx/card/bindChild`,
        method: 'POST',
        data
      }
      return request(params)
    },

    // 购买成功回调
    buyCardSuc (cardOrderId, data) {
      // status 1 支付成功 2 支付失败
      const params = {
        path: `/xcx/cardType/buy/${cardOrderId}/notify`,
        method: 'POST',
        data
      }
      return request(params)
    }
  },

  class: {
    // 全部课课表
    getClassList () {
      const params = {
        path: `/xcx/classSchedule`,
        method: 'GET'
      }
      return request(params)
    },

    // 课表（日期，状态）
    // getClassByDate (startTime, endTime, status, info, audition) {
    //   let params = {
    //     path: `/xcx/classSchedule?startTime=${startTime}&endTime=${endTime}&status=${status[0]}&status=${status[1]}`,
    //     method: 'GET'
    //   }
    //   if (info.lat) {
    //     params.path += `&lat=${info.lat}&lng=${info.lng}`
    //   }
    //   if (audition) {
    //     // 机构id
    //     // 试听卡可以使用的课表
    //     params.path += `&topCategoryId=3`
    //     // if (audition.organizationId) {
    //     //   path += `&organizationId=${audition.organizationId}`
    //     //   params.path = `${params.path}${path}`
    //     // }
    //     // // 网点id
    //     // if (audition.branchId) {
    //     //   path += `&branchId=${audition.branchId}`
    //     //   params.path = `${params.path}${path}`
    //     // }
    //   }
    //   return request(params)
    // },

    // 课表（日期，课表id）
    // getClassByDateAndCourseId (startTime, endTime, courseId, status, info, audition) {
    //   const params = {
    //     path: `/xcx/classSchedule?startTime=${startTime}&endTime=${endTime}&courseId=${courseId}&status=${status[0]}&status=${status[1]}`,
    //     method: 'GET'
    //   }
    //   if (info.lat) {
    //     params.path += `&lat=${info.lat}&lng=${info.lng}`
    //   }
    //   if (audition) {
    //     // 机构id
    //     params.path += `&topCategoryId=3`
    //     // if (audition.organizationId) {
    //     //   path += `&organizationId=${audition.organizationId}`
    //     //   params.path = `${params.path}${path}`
    //     // }
    //     // // 网点id
    //     // if (audition.branchId) {
    //     //   path += `&branchId=${audition.branchId}`
    //     //   params.path = `${params.path}${path}`
    //     // }
    //   }
    //   return request(params)
    // },

    // 日历某一天的课程
    getClassByOneDayV2 (data) {
      const params = {
        path: `/xcx/classSchedule?startTime=${data.now}&endTime=${data.twoDay}&page=1&pageSize=9999`,
        method: 'GET'
      }
      // 状态
      if (data.status && data.status[0]) {
        data.status.forEach(i => {
          params.path += `&status=${i}`
        })
      }
      if (data.courseId) {
        params.path += `&courseId=${data.courseId}`
      }
      // 经纬度
      // 没有定位经纬度
      if (data.info && !data.info.lng) {
        params.path += `&lat=${location.lat}&lng=${location.lng}`
      }
      if (data.info && data.info.lng) {
        params.path += `&lat=${data.info.lat}&lng=${data.info.lng}`
      }
      // 一级分类
      if (data.audition) {
        // 机构id
        params.path += `&topCategoryId=3`
        if (data.audition.organizationId) {
          params.path += `&organizationId=${data.audition.organizationId}`
        }
        if (data.audition.branchId) {
          params.path += `&branchId=${data.audition.branchId}`
        }
        if (data.audition.storeId && data.audition.storeId[0] && data.audition.storeId[0].id) {
          // params.path += `&storeId=${data.storeId}`
          data.audition.storeId.forEach(i => {
            params.path += `&storeId=${i.id}`
          })
        }
      }
      // 机构
      if (data.organizationId) {
        params.path += `&organizationId=${data.organizationId}`
      }
      // 网点
      if (data.storeId) {
        params.path += `&storeId=${data.storeId}`
      }
      return request(params)
    },

    // 课表（课表id）
    getClassById (data) {
      const params = {
        path: `/xcx/classSchedule/${data}?page=1&pageSize=9999`,
        method: 'GET'
      }
      return request(params)
    },

    // 预约
    bookedClass (data) {
      const params = {
        path: `/xcx/classSchedule/book`,
        method: 'POST',
        data
      }
      return request(params)
    },

    // 时间表
    getCalendar (startTime, endTime, audition) {
      let path = ''
      const params = {
        path: `/xcx/calendar?startTime=${startTime}&endTime=${endTime}`,
        method: 'GET'
      }
      // 一级分类
      if (audition) {
        path += `&topCategoryId=3`
        params.path = `${params.path}${path}`
      }
      return request(params)
    },

    getCalendarV2 (data) {
      const params = {
        path: `/xcx/calendar?startTime=${data.now}&endTime=${data.twoWeek}`,
        method: 'GET'
      }
      // 一级分类
      if (data.audition) {
        params.path += `&topCategoryId=3`
        if (data.audition.organizationId) {
          params.path += `&organizationId=${data.audition.organizationId}`
        }
        if (data.audition.branchId) {
          params.path += `&branchId=${data.audition.branchId}`
        }
        if (data.audition.storeId && data.audition.storeId[0] && data.audition.storeId[0].id) {
          data.audition.storeId.forEach(i => {
            params.path += `&storeId=${i.id}`
          })
        }
      }
      // 机构
      // 机构
      if (data.organizationId) {
        params.path += `&organizationId=${data.organizationId}`
      }
      // 网点
      if (data.storeId) {
        params.path += `&storeId=${data.storeId}`
      }
      if (data.courseId) {
        params.path += `&courseId=${data.courseId}`
      }
      return request(params)
    },

    // 时间表（课程）
    getCalendarCourse (startTime, endTime, courseId, audition) {
      let path = ''
      const params = {
        path: `/xcx/calendar?startTime=${startTime}&endTime=${endTime}&courseId=${courseId}`,
        method: 'GET'
      }
      if (audition) {
        path += `&topCategoryId=3`
        params.path = `${params.path}${path}`
        // 机构id
        // if (audition.organizationId) {
        //   path += `&organizationId=${audition.organizationId}`
        //   params.path = `${params.path}${path}`
        // }
        // // 网点id
        // if (audition.branchId) {
        //   path += `&branchId=${audition.branchId}`
        //   params.path = `${params.path}${path}`
        // }
      }
      return request(params)
    },

    // 时间表（门店）
    getCalendarStore (startTime, endTime, storeId) {
      const params = {
        path: `/xcx/calendar?startTime=${startTime}&endTime=${endTime}&storeId=${storeId}`,
        method: 'GET'
      }
      return request(params)
    }
  },

  course: {
    // 获取课程详情
    getCourseById (data) {
      const params = {
        path: `/xcx/course/${data}`,
        method: 'GET'
      }
      return request(params)
    },

    // 课程列表
    courseList (data) {
      if (!data.page) {
        data.page = 1
      }
      let params = {
        path: `/xcx/course?status=1&page=${data.page}&pageSize=10`,
        method: 'GET'
      }
      if (data.topCategoryId) {
        params.path += `&topCategoryId=${data.topCategoryId}`
      }
      if (data.secondCategoryId) {
        params.path += `&secondCategoryId=${data.secondCategoryId}`
      }
      return request(params)
    },

    // 课程二级分类列表
    getSecondCategory (data) {
      const params = {
        path: `/xcx/secondCategory?topCategoryId=${data.id}&page=1&pageSize=9999`,
        method: 'GET'
      }
      return request(params)
    },

    // 课程一级分类列表
    getTopCategory () {
      const params = {
        path: `/xcx/topCategory?page=1&pageSize=9999`,
        method: 'GET'
      }
      return request(params)
    },

    // 获取课程二级分类下的课程
    // 科学实验室，id为1
    // getSecondCategoryCourse (data) {
    //   let params = {
    //     path: `/xcx/course?status=1&page=1&pageSize=9999`,
    //     method: 'GET'
    //   }
    //   if (data.topCategoryId) {
    //     params.path += `&topCategoryId=${data.topCategoryId}`
    //   }
    //   if (data.secondCategoryId) {
    //     params.path += `&secondCategoryId=${data.secondCategoryId}`
    //   }
    //   return request(params)
    // },

    // 课程下评论
    getCommentInfo (id) {
      const params = {
        path: `/xcx/course/${id}/comment?page=1&pageSize=9999`,
        method: 'GET'
      }
      return request(params)
    }
  },

  pay: {
    // 付款成功
    buySuc () {
      const params = {
        path: `/xcx/cardType/buy/suc`,
        method: 'POST'
      }
      return request(params)
    },

    // 预约，购买成功,status: 3, // 2:支付失败 3:支付成功
    buyCourseSuc (data, orderID) {
      const params = {
        path: `/xcx/classSchedule/book/${orderID}/notify`,
        method: 'POST',
        data
      }
      return request(params)
    }
  },

  store: {
    // 门店列表
    getStoreList (data) {
      if (!data.page) {
        data.page = 1
      }
      const params = {
        path: `/xcx/store?status=1&page=${data.page}&pageSize=10`,
        method: 'GET'
      }
      if (data.lat) {
        params.path += `&lat=${data.lat}`
      }
      if (data.lng) {
        params.path += `&lng=${data.lng}`
      }
      if (!data.lat || !data.lng) {
        params.path += `&lat=${location.lat}&lng=${location.lng}`
      }
      return request(params)
    },

    // 门店详情
    storeDetail (id) {
      const params = {
        path: `/xcx/store/${id}`,
        method: 'GET'
      }
      return request(params)
    },

    // 门店下的课表
    storeClass (data) {
      let path = ''
      data.status.forEach(i => {
        path += `&status=${i}`
      })
      const params = {
        path: `/xcx/classSchedule?storeId=${data.storeId}&page=1&pageSize=9999&startTime=${data.startTime}&endTime=${data.endTime}${path}`,
        method: 'GET'
      }
      return request(params)
    }
  },

  // 我的预约
  order: {
    myOrder (data) {
      if (!data.page) {
        data.page = 1
      }
      let path = ''
      data.status.forEach(i => {
        path += `&status=${i}`
      })
      // 1:未支付 2:支付失败 3:支付成功 4:超时自动取消 5:已完成 6:已取消 7.未开团取消 8.手动核销
      const params = {
        path: `/xcx/order?page=${data.page}&pageSize=10&${path}`,
        method: 'GET'
      }
      return request(params)
    },

    // 预约详情
    orderDetail (id) {
      const params = {
        path: `/xcx/order/${id}`,
        method: 'GET'
      }
      return request(params)
    },

    // 取消预约
    cancelOrder (id) {
      const params = {
        path: `/xcx/order/${id}/cancel`,
        method: 'PUT'
      }
      return request(params)
    },

    // 新增课程评价
    courseComment (data) {
      const params = {
        path: `/xcx/comment`,
        method: 'POST',
        data
      }
      return request(params)
    },

    // 评价详情
    commentDetail (data) {
      const params = {
        path: `/xcx/comment/${data.id}`,
        method: 'GET'
      }
      return request(params)
    },

    putComment (param) {
      const params = {
        path: `/xcx/comment/${param.id}`,
        method: 'PUT',
        data: param.data
      }
      return request(params)
    }
  },

  teacher: {
    // 核销
    scanCode (id) {
      const params = {
        path: `/xcx/order/${id}/complete`,
        method: 'PUT'
      }
      return request(params)
    },

    // 手动核销
    selfScanCode (data) {
      const params = {
        path: `/xcx/orders/complete`,
        method: 'PUT',
        data
      }
      return request(params)
    },

    // 老师排课
    // 1:已取消 2:未上线 3:已成团 4:未成团 5:已完成 6:自动取消
    teacherSchedule (data) {
      let path = ''
      data.status.forEach(i => {
        path += `&status=${i}`
      })
      let pageSize = 10
      if (!data.page) {
        data.page = 1
        pageSize = 9999
      }
      const params = {
        path: `/xcx/teacher/schedule?page=${data.page}&pageSize=${pageSize}${path}`,
        method: 'GET'
      }
      return request(params)
    },

    // 老师排课详情
    teacherScheduleDetail (id) {
      const params = {
        path: `/xcx/teacher/schedule/${id}`,
        method: 'GET'
      }
      return request(params)
    }
  },

  qzCircle: {
    // 获取圈子token
    getCircleToken () {
      const params = {
        path: `/xcx/auth/circle`,
        method: 'GET'
      }
      return request(params)
    }
  },

  formId: {
    getFormId (data) {
      const params = {
        path: `/xcx/user/updateFormId`,
        method: 'PUT',
        data
      }
      return request(params)
    }
  },

  // 门店活动着陆页
  branch: {
    branchDetail (data) {
      const params = {
        path: `/xcx/landingPage/${data.id}`,
        method: 'GET'
      }
      return request(params)
    }
  },

  lesson: {
    // 购买课时
    buyLesson (param) {
      let params = {
        path: `/xcx/currency/${param.goodsId}/buy`,
        method: 'POST'
      }
      if (!param.inviterId) {
        param.inviterId = 0
      }
      if (!param.branchId) {
        param.branchId = 0
      }
      if (!param.organizationId) {
        param.organizationId = 0
      }
      params.path += `?inviterId=${param.inviterId}&organizationId=${param.organizationId}&branchId=${param.branchId}`
      return request(params)
    },

    // 购买课时成功回调
    buyLessonSuc (param) {
      // 1 成功 2 失败
      let { data = {} } = param
      const params = {
        path: `/xcx/currency/${param.goodsId}/notify`,
        method: 'POST',
        data
      }
      return request(params)
    },

    // 年卡转课时
    cardSetLesson () {
      const params = {
        path: `/xcx/convert/cardToCurrency`,
        method: 'POST'
      }
      return request(params)
    },

    // 课时套餐列表
    currencyGoods (data) {
      if (!data.page) {
        data.page = 1
      }
      const params = {
        path: `/xcx/currency?page=${data.page}&pageSize=9999&status=1`,
        method: 'GET'
      }
      return request(params)
    },

    // 用户信息。会员信息
    vipInfo (data) {
      const params = {
        path: `/xcx/user/info/${data.userId}`,
        method: 'GET'
      }
      return request(params)
    },

    // 协议
    // "cardToCurrency":卡转代币协议 "currency":购买代币协议
    agreement (data) {
      const params = {
        path: `/xcx/agreement/${data.code}`,
        method: 'GET'
      }
      return request(params)
    }
  }
}
