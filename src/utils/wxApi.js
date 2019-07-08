import api from './api.js'
import _index from './index.js'
import wx from './wx'
import moment from 'moment'

function wxChooseImage ({ imgNumber = 1, len = 0 } = {}) {
  let number = imgNumber - len
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: number,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        resolve(res.tempFilePaths)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 预览图片 index(下标)
function wxLookImg ({ index = 0, files = [] } = {}) {
  let current = files[index]
  wx.previewImage({
    current: current,
    urls: files
  })
}

function uploadFile ({ token = '', filePath = '' } = {}) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      filePath: filePath,
      url: 'https://upload-z2.qiniup.com',
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        token
      },
      success: (res) => {
        const data = JSON.parse(res.data)
        resolve(data.url)
      },
      fail: (res) => {
        reject(res)
      }
    })
  })
}

// 七牛上传
async function upLoadImg (filePath) {
  // const data = {
  //   uploadType: 'image'
  // }
  let res = await api.xcxLogin.uploadToken()
  const token = res.token
  const fileData = {
    token,
    filePath
  }
  let fileRes = await uploadFile(fileData)
  return fileRes
}

// 访客七牛
async function invitedUpLoadImg (parma) {
  const data = {
    uploadType: 'image',
    inviteToken: parma.inviteToken
  }
  let res = await api.invited.invitedUpload(data)
  const token = res.uploadToken
  const fileData = {
    filePath: parma.filePath,
    token
  }
  let fileRes = await uploadFile(fileData)
  return fileRes
}

// 访客 七牛
// function invitedUpLoadImg (parma) {
//   return new Promise((resolve, reject) => {
//     const data = {
//       uploadType: 'image',
//       inviteToken: parma.inviteToken
//     }
//     api.invited.invitedUpload(data)
//       .then(res => {
//         if (res.error) {
//           wx.showToast({
//             icon: 'none',
//             title: res.error.msg
//           })
//           return
//         }
//         const token = res.uploadToken
//         wx.uploadFile({
//           filePath: parma.filePath,
//           url: 'https://upload-z2.qiniup.com',
//           name: 'file',
//           header: {
//             'content-type': 'multipart/form-data'
//           },
//           formData: {
//             token
//           },
//           success: (res) => {
//             const data = JSON.parse(res.data)
//             resolve(data.url)
//           },
//           fail: (res) => {
//             reject(res)
//           }
//         })
//       })
//   })
// }

// 系统设置  删除图片弹出层
// function wxCloseImage ({ index, funt = f => f } = {}) {
//   wx.showActionSheet({
//     itemList: ['删除'],
//     success: (res) => {
//       funt(index)
//     },
//     fail: (res) => {
//     }
//   })
// }

// getUserInfo
function getUser () {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: (res) => {
        resolve(res)
      },
      fail: (res) => {
        reject(res)
      }
    })
  })
}

// wxlogin
function wxlogin () {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        resolve(res)
      },
      fail: (res) => {
        reject(res)
      }
    })
  })
}

// 将数字转换为金额格式
function toMoney (price) {
  if (price === 0) {
    return 0
  }
  if (price !== 0) {
    let num = price / 100
    num = num.toFixed(2)
    num = numSplit(num)
    num = num.toLocaleString()
    return num
  }
}

function inputVaule (num) {
  num = Number(num)
  num = num.toFixed(2)
  num = numSplit(num)
  num = num.toLocaleString()
  // let reg = /^[-][0-9][,]*$/
  // 输入的正确金额
  return num
}

function numSplit (num) {
  let n = num.split('.')
  let p = n[0]
  let nEnd = n[1]
  if (nEnd !== '00') {
    p = num
  }
  p = Number(p)
  return p
}

// 删除图片
function wxCloseImage () {
  let status = 0
  return new Promise((resolve, reject) => {
    wx.showActionSheet({
      itemList: ['删除'],
      success: (res) => {
        // 如果点击的是删除文字 index 0
        if (res.tapIndex === 0) {
          status = 1
        }
        resolve(status)
      },
      fail: () => {
        reject(status)
      }
    })
  })
}

function isArray (arr, msg = '请选择封面') {
  if (!arr[0]) {
    wx.showToast({
      title: `${msg}`,
      icon: 'none'
    })
    return 'err'
  }
}

function getTime (time) {
  const date = new Date(time)

  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  return `${y}.${m}.${d}`
}

function bgGetTime (time) {
  const date = new Date(time)

  // let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? (m) : m
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  return `${m}月${d}日`
}

function getStartTime (time) {
  const date = new Date(time)
  let h = date.getHours()
  let minute = date.getMinutes()
  minute = minute < 10 ? ('0' + minute) : minute
  return `${h}:${minute}`
}

// 获取孩子年龄 多少岁
function getChildYears (time) {
  let newTime = new Date()
  let oldTime = new Date(time)
  let diff = Math.abs(newTime.getTime() - oldTime.getTime())
  let childYaers = parseInt(diff / (1000 * 60 * 60 * 24))
  let res = ''
  if (childYaers < 365) {
    res = '1'
    return res
  } else {
    res = Math.floor(childYaers / 365)
    return res
  }
}

function createdTime (time) {
  const date = new Date(time)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  let h = date.getHours()
  let minute = date.getMinutes()
  minute = minute < 10 ? ('0' + minute) : minute
  let second = date.getSeconds()
  second = second < 10 ? ('0' + second) : second
  return `${y}.${m}.${d} ${h}:${minute}:${second}`
}

function getDayList (list, index) {
  if (!index) {
    index = 0
  }
  // // 哪一天有课显示哪一天
  let indexStatus = -1
  let dayList = []
  for (let i = 0; i < 15; i++) {
    const day = moment().add(i, 'days').format('YYYY-MM-DD')
    const week = moment(day).format('d')
    const month = moment(day).format('MMM')
    // 处理周几 (处理下一周：取余数)
    const wWeek = _index.dayTurnWeek(week)
    // 处理票数情况
    const remainingNumber = (list[i] && list[i].remainingNumber) || 0
    const total = (list[i] && list[i].total) || 0
    const canceledNumber = (list[i] && list[i].canceledNumber) || 0
    // 0满了，1有几张，2充足，3 取消课程 满
    let status = -1
    if (remainingNumber - 5 < 0 && remainingNumber > 0 && total > 0) {
      // 小于 5 余下多少
      status = 1
    }
    if (remainingNumber - 5 >= 0 && total > 0) {
      // 充足
      status = 2
    }
    if (remainingNumber <= 0 && total > 0) {
      // 有效课程 无剩余 满了
      status = 0
    }
    // total 有效课程数
    if (total <= 0 && canceledNumber > 0) {
      // 没有有效课程 有取消课程 满
      status = 3
    }
    if (total <= 0 && canceledNumber <= 0) {
      // 无课程
      status = 4
    }
    if (indexStatus === -1 && remainingNumber > 0) {
      indexStatus = i
    }
    dayList.push({
      time: day,
      month: month,
      day: day.slice(8, 10),
      week: wWeek,
      status: status,
      remainingNumber: remainingNumber,
      // 0表示点击，1表示没点击
      clickStatus: i === index ? 0 : 1,
      total: total
    })
    // if (dayListIndex !== index) {
    //   dayList[dayListIndex].clickStatus = 0
    //   dayList[index].clickStatus = 1
    // }
    // 有预约位置 并且不是第一个
  }
  if (indexStatus > 0) {
    for (let j = 0; j < dayList.length; j++) {
      if (j === indexStatus) {
        dayList[j].clickStatus = 0
      } else {
        dayList[j].clickStatus = 1
      }
    }
  }
  return dayList
}

// 仅显示不改变状态
function getShowDayList (list, index) {
  if (!index) {
    index = 0
  }
  // // 哪一天有课显示哪一天
  let dayList = []
  for (let i = 0; i < 15; i++) {
    const day = moment().add(i, 'days').format('YYYY-MM-DD')
    const week = moment(day).format('d')
    const month = moment(day).format('MMM')
    // 处理周几 (处理下一周：取余数)
    const wWeek = _index.dayTurnWeek(week)
    // 处理票数情况
    const remainingNumber = (list[i] && list[i].remainingNumber) || 0
    const total = (list[i] && list[i].total) || 0
    const canceledNumber = (list[i] && list[i].canceledNumber) || 0
    // 0满了，1有几张，2充足，3 取消课程 满
    let status = -1
    if (remainingNumber - 5 < 0 && remainingNumber > 0 && total > 0) {
      // 小于 5 余下多少
      status = 1
    }
    if (remainingNumber - 5 >= 0 && total > 0) {
      // 充足
      status = 2
    }
    if (remainingNumber <= 0 && total > 0) {
      // 有效课程 无剩余 满了
      status = 0
    }
    // total 有效课程数
    if (total <= 0 && canceledNumber > 0) {
      // 没有有效课程 有取消课程 满
      status = 3
    }
    if (total <= 0 && canceledNumber <= 0) {
      // 无课程
      status = 4
    }
    dayList.push({
      time: day,
      month: month,
      day: day.slice(8, 10),
      week: wWeek,
      status: status,
      remainingNumber: remainingNumber,
      // 0表示点击，1表示没点击
      clickStatus: i === index ? 0 : 1,
      total: total
    })
    // 有预约位置 并且不是第一个
  }
  return dayList
}

function getBranchDayList (list, index) {
  if (!index) {
    index = 0
  }
  let dayList = []
  let indexStatus = -1
  for (let i = 0; i < 7; i++) {
    const day = moment().add(i, 'days').format('YYYY-MM-DD')
    const week = moment(day).format('d')
    const month = moment(day).format('MMM')
    // 处理周几 (处理下一周：取余数)
    const wWeek = _index.dayTurnWeek(week)
    // 处理票数情况
    const remainingNumber = (list[i] && list[i].remainingNumber) || 0
    const total = (list[i] && list[i].total) || 0
    const canceledNumber = (list[i] && list[i].canceledNumber) || 0
    // 0满了，1有几张，2充足，3 取消课程 满
    let status = -1
    if (remainingNumber - 5 < 0 && remainingNumber > 0 && total > 0) {
      // 小于 5 余下多少
      status = 1
    }
    if (remainingNumber - 5 >= 0 && total > 0) {
      // 充足
      status = 2
    }
    if (remainingNumber <= 0 && total > 0) {
      // 有效课程 无剩余 满了
      status = 0
    }
    // total 有效课程数
    if (total <= 0 && canceledNumber > 0) {
      // 没有有效课程 有取消课程 满
      status = 3
    }
    if (total <= 0 && canceledNumber <= 0) {
      // 无课程
      status = 4
    }
    if (indexStatus === -1 && remainingNumber > 0) {
      indexStatus = i
    }
    dayList.push({
      time: day,
      month: month,
      day: day.slice(8, 10),
      week: wWeek,
      status: status,
      remainingNumber: remainingNumber,
      // 0表示点击，1表示没点击
      clickStatus: i === index ? 0 : 1,
      total: total
    })
  }
  // 有预约位置 并且不是第一个
  if (indexStatus > 0) {
    for (let j = 0; j < dayList.length; j++) {
      if (j === indexStatus) {
        dayList[j].clickStatus = 0
      } else {
        dayList[j].clickStatus = 1
      }
    }
  }
  return dayList
}

function getHaveCourse (list) {
  let indexStatus = -1
  for (let i = 0; i < 14; i++) {
    // 处理周几 (处理下一周：取余数)
    // 处理票数情况
    const remainingNumber = (list[i] && list[i].remainingNumber) || 0
    // 0满了，1有几张，2充足，3 取消课程 满
    if (indexStatus === -1 && remainingNumber > 0) {
      indexStatus = i
    }
  }
  return indexStatus
}

function commentTime (t) {
  const time = new Date(t).getTime()
  const date = Math.round(Date.now())
  const diff = date - time
  let day = '0'
  let dayDiff = 0
  if (diff >= 60 * 60 * 24 * 3 * 1000) {
    const d = new Date(time)
    const M = d.getMonth() + 1
    const D = d.getDate()
    day = `${M}月${D}日`
  } else if (diff >= 60 * 60 * 24 * 1000) {
    dayDiff = diff / 60 / 60 / 24 / 1000
    dayDiff = Math.round(dayDiff)
    day = `${dayDiff}天之前`
  } else if (diff >= 60 * 60 * 1000) {
    dayDiff = diff / 60 / 60 / 1000
    dayDiff = Math.round(dayDiff)
    day = `${dayDiff}小时之前`
  } else if (diff >= 60 * 1000) {
    dayDiff = diff / 60 / 1000
    dayDiff = Math.round(dayDiff)
    day = `${dayDiff}分钟之前`
  } else {
    day = `1分钟之内`
  }
  return day
}

function getDisTance (vla) {
  // vla 单位km
  if (!vla) {
    vla = 0
  }
  let distance = 0 + 'm'
  if (vla < 1) {
    distance = vla.toFixed(3) * 1000 + 'm'
  } else {
    distance = vla.toFixed(1) + 'km'
  }
  return distance
}

function getCardCode (code, top) {
  // 1 老年卡 2 新年卡 3 体验卡 4 试听
  let s = 0
  if (code === 'TY1001') {
    s = 1
  }
  if (code === 'TY1002') {
    s = 2
  }
  if (code === 'TY1003') {
    s = 3
  }
  if (code === 'TY1004' || code === 'TY1005' || code === 'TY1006' || code === 'TY1007' || code === 'TY1008' || (top && top[0] && top[0].id === 3)) {
    s = 4
  }
  return s
}

function setView (arr) {
  if (arr[0] === arr[arr.length - 1]) {
    return `${arr[0]}`
  } else {
    return `${arr[0]}-${arr[arr.length - 1]}`
  }
}

function setPrice (priceArr) {
  let arr = []
  priceArr.forEach(i => {
    arr.push(i)
  })
  let changeArr = arr.sort(sortNumber)
  return changeArr
}

function sortNumber (a, b) {
  return a - b
}

function setCoursePrice (arr) {
  let price = 0
  arr = setPrice(arr)
  price = setView(arr)
  return price
}

function wxShowToast (data) {
  let { suc, title = '' } = data
  if (suc) {
    wx.showToast({
      title: `${title}`
    })
  } else {
    wx.showToast({
      title: `${title}`,
      icon: 'none'
    })
  }
}

export default {
  wxChooseImage,
  wxLookImg,
  toMoney,
  wxCloseImage,
  upLoadImg,
  isArray,
  inputVaule,
  wxlogin,
  getUser,
  invitedUpLoadImg,
  getTime,
  getStartTime,
  getChildYears,
  createdTime,
  getDayList,
  commentTime,
  getDisTance,
  getCardCode,
  setCoursePrice,
  getBranchDayList,
  getHaveCourse,
  wxShowToast,
  bgGetTime,
  getShowDayList
}
