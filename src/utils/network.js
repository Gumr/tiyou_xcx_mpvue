import wx from './wx'
// 测试服
// const SERVER_URL = 'https://api.tiyou.techoiceness.com/v1'
// 正式服
const SERVER_URL = 'https://api.tiyoukids.com/v1'

async function apiRequest ({ path = '', method = 'GET', data = {}, header = {}, showLoad = 1 } = {}) {
  const url = SERVER_URL + path

  const d = {
    url,
    data,
    method,
    header,
    showLoad
  }
  let res = await wxRequset(d)
  // if (res.error) {
  //   return
  // }
  return res
}

function wxRequset ({ url = '', method = 'GET', data = {}, header = {}, showLoad = 1 } = {}) {
  return new Promise((resolve, reject) => {
    // 不显示加载动画
    // if (showLoad) {
    //   wx.showLoading({ title: '拼命加载中...' })
    // }
    wx.request({
      url: url,
      data: data,
      method: method,
      header: header,
      success: (res) => {
        if (showLoad) {
          wx.hideLoading()
        }
        if (res.statusCode === 401) {
          wx.removeStorageSync('token')
          wx.reLaunch({
            url: '../course/main'
          })
        }
        if (res.data.msg) {
          wx.showToast({
            icon: 'none',
            title: res.data.msg
          })
          resolve(res.data)
        } else {
          if (res.data.data === null) {
            let data = {}
            resolve(data)
          } else {
            resolve(res.data.data)
          }
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

export default apiRequest
