// const SERVER_URL = 'https://api.quanzis.com/v1/xcx'
const QUANZI_URL = 'https://api.qz.techoiceness.com/v2/xcx'

async function apiRequest ({ path = '', method = 'GET', data = {}, header = {}, showLoad = 1 } = {}) {
  let url = QUANZI_URL + path

  // if (serverApi === 1) {
  //   url = SERVER_URL + path
  // }

  url = QUANZI_URL + path
  const d = {
    url,
    data,
    method,
    header,
    showLoad
  }
  let res = await wxRequset(d)
  return res
}

function wxRequset ({ url = '', method = 'GET', data = {}, header = {}, showLoad = 1 } = {}) {
  return new Promise((resolve, reject) => {
    // 不显示加载动画
    if (showLoad) {
      wx.showLoading({ title: '拼命加载中...' })
    }
    wx.request({
      url: url,
      data: data,
      method: method,
      header: header,
      success: (res) => {
        if (showLoad) {
          wx.hideLoading()
        }
        // if (res.statusCode === 401) {
        //   wx.removeStorageSync('token')
        //   wx.reLaunch({
        //     url: '../login/main'
        //   })
        // }
        if (res.data.error) {
          wx.showToast({
            icon: 'none',
            title: res.data.error.msg
          })
        }
        resolve(res.data)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

export default apiRequest
