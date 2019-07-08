function wxLogin (data) {
  let that = data
  const { inviterId = 0 } = that
  wx.login({
    success: (res) => {
      let code = res.code
      wx.getUserInfo({
        success: (res) => {
          const data = {
            code: code,
            nickname: res.userInfo.nickName,
            avatar: res.userInfo.avatarUrl,
            sex: res.userInfo.gender,
            inviterId
          }
          that.$api.auth.xcxLogin(data)
            .then((res) => {
              // 需要绑定手机
              if (!res.user.phoneNo) {
                wx.setStorageSync('sessionKey', res.sessionKey)
                that.phone = 1
                const data = {
                  token: res.token,
                  sessionKey: res.sessionKey,
                  phoneNo: 0
                }
                that.setToken(data)
                // try {
                //   // 请求bindPhoneNoToken存储到本地，ps:刷新会请求success函数,
                // } catch (e) {
                // }
                // if (that.phone) {
                //   wx.showToast({
                //     icon: 'none',
                //     title: '请点击页面授权手机继续使用'
                //   })
                // }
              } else {
                // 已经绑定手机号
                const d = {
                  token: res.token,
                  sessionKey: res.sessionKey,
                  phoneNo: 1
                }
                that.setToken(d)
              }
            })
        }
      })
    }
  })
}

function getPhoneNumber (ev, data) {
  let e = ev
  let that = data
  if (e.mp.detail.errMsg !== 'getPhoneNumber:ok') {
    // that.bindPhone()
    that.phone = 1
  } else {
    wx.checkSession({
      success: () => {
        const sessionKey = wx.getStorageSync('sessionKey')
        if (!sessionKey) {
          // wx.showToast({
          //   icon: 'none',
          //   title: '绑定码已无效，请重新登陆'
          // })
          wxLogin(that)
          return
        }
        const param = {
          sessionKey: sessionKey,
          iv: e.mp.detail.iv,
          encryptedData: e.mp.detail.encryptedData
        }
        that.$api.auth.bindPhoneNo(param)
          .then((res) => {
            if (res.msg) {
              return
            }
            const d = {
              token: res.token,
              phoneNo: 1
            }
            that.setToken(d)
          })
      },
      fail: () => {
        wxLogin(that)
      }
    })
  }
}

export default {
  wxLogin,
  getPhoneNumber
}
