import api from './api.js'

function wxChooseImage ({ imgNumber = 1, len = 0 } = {}) {
  let number = imgNumber - len
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: number,
      sizeType: ['original', 'compressed'],
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
// 选择图片 默认为 1, paths 预览图片集合
// function wxChooseImage ({ imgNumber = 1, paths = [], oneImage = 0 } = {}) {
//   let number = imgNumber - paths.length
//   let s = 0
//   // 图片只能有一张 长按替换
//   if (oneImage === 1 && paths.length > 0) {
//     s = 1
//     number = 1
//   }
//   wx.chooseImage({
//     count: number,
//     sizeType: ['original', 'compressed'],
//     sourceType: ['album', 'camera'],
//     success: (res) => {
//       res.tempFilePaths.map((path) => {
//         if (s === 1) {
//           // vue 检测不到数组某些变化
//           paths = paths.splice(0, 1, path)
//         } else {
//           paths.push(path)
//         }
//       })
//       // const p = res.tempFilePaths.map((path, index) => {
//       //   paths.push(path)
//       //   return upLoadImg(path)
//       // })
//       // Promise.all(p)
//       //   .then(d => {
//       //   })
//     }
//   })
// }

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
  const data = {
    uploadType: 'image'
  }
  let res = await api.xcxLogin.uploadToken(data)
  const token = res.uploadToken
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

function wxCloseImage () {
  let r = 0
  return new Promise((resolve, reject) => {
    wx.showActionSheet({
      itemList: ['删除'],
      success: (res) => {
        if (res.tapIndex === 0) {
          r = 1
        }
        resolve(r)
      },
      fail: () => {
        reject(r)
      }
    })
  })
}

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

function isArray (arr, msg = '请选择封面') {
  if (!arr[0]) {
    wx.showToast({
      title: `${msg}`,
      icon: 'none'
    })
    return 'err'
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
  invitedUpLoadImg
}
