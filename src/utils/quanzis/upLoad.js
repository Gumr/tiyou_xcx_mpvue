import api from './api.js'

// 选择图片
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

// 预览图片 index(下标)
function wxLookImg ({ index = 0, files = [] } = {}) {
  let current = files[index]
  wx.previewImage({
    current: current,
    urls: files
  })
}

// 七牛上传
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

// 上传图片
async function upLoadImg (filePath) {
  let res = await api.user.uploadToken('image')
  const token = res.uploadToken
  const fileData = {
    token,
    filePath
  }
  let fileRes = await uploadFile(fileData)
  return fileRes
}

export default {
  wxChooseImage,
  wxLookImg,
  upLoadImg
}
