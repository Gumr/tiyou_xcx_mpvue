<template>
  <div class="wrap">
    <div class="box" v-if="show">
      <image mode="aspectFit" src="https://api.tiyou.techoiceness.com/v1/static/images/logo.png" class="logo" />
      <button id="test" class="btn" open-type="getUserInfo" @getuserinfo="getUserInfo">
        授权进入
      </button>
    </div>
  </div>
</template>

<script>
import {
  mapActions
} from 'vuex'

export default {
  components: {
  },

  data () {
    return {
      show: 0,
      inviterId: 0
    }
  },

  computed: {
  },

  methods: {
    ...mapActions('user', [
      'vuexSetUserInfo'
    ]),

    getUserInfo (e) {
      let err = e.mp.detail.errMsg
      if (err === 'getUserInfo:ok') {
        this.login()
      }
    },

    async login () {
      let res = await this.$wxApi.getUser()
      if (res.msg) return
      // let t = await this.$api.qzCircle.getCircleToken()
      // let token = this.getToken()
      // 本地有 token 请求个人资料接口
      // if (token) {
      //   let profile = await this.$api.my.profile()
      //   if (profile.error) {
      //     return
      //   }
      //   this.vuexSetUserInfo(profile)
      // } else {
      //   const data = {
      //     nickname: res.userInfo.nickName
      //   }
      //   this.vuexSetUserInfo(data)
      // }
      const data = {
        nickname: res.userInfo.nickName
      }
      this.vuexSetUserInfo(data)
      this.show = 0
      const { cardId, shareType, courseId, pageType, scene, userId, organizationId, branchId, inviterId } = this.$root.$mp.query
      // scene 小程序码带的参数
      let type = parseInt(shareType, 10)
      let t = parseInt(pageType, 10)
      // 1 购买年卡
      // 分享页面登陆
      if (cardId) {
        wx.reLaunch({
          url: `../yearsCardShare/main?cardId=${cardId}&userId=${userId}`
        })
      } else if (type === 1) {
        wx.reLaunch({
          url: `../packageMe/buyCard/main?shareType=${type}`
        })
      } else if (type === 3) {
        wx.reLaunch({
          url: `../courseInfo/main?shareType=${shareType}&courseId=${courseId}&inviterId=${inviterId}`
        })
      } else if (type === 15) {
        wx.reLaunch({
          url: `../packageMe/buyLesson/main?shareType=${shareType}&inviterId=${inviterId}&organizationId=${organizationId}&branchId=${branchId}`
        })
      } else if (t === 10) {
        wx.reLaunch({
          url: `../packageMe/buyCard/main?scene=${scene}`
        })
      } else if (t === 11) {
        wx.reLaunch({
          url: `../packageMe/sendCard/main?scene=${scene}`
        })
      } else if (t === 12) {
        wx.reLaunch({
          url: `../packageMe/buyAuditionCard/main?scene=${scene}`
        })
      } else if (t === 13) {
        // 公众号进入卡劵管理
        wx.reLaunch({
          url: `../packageMe/cardManagement/main`
        })
      } else if (t === 14) {
        wx.reLaunch({
          url: `../packageMe/branchActivity/main?scene=${scene}`
        })
      } else {
        this.toPage()
      }
    },

    getToken () {
      let _token = ''
      _token = wx.getStorageSync('token')
      return _token
    },

    toPage () {
      // 前往 tab 页
      // todo
      wx.switchTab({
        url: `../course/main?inviterId=${this.inviterId}`
      })
      // 购买试听卡页面（小程序码）
      // wx.navigateTo({
      //   url: `../packageMe/buyAuditionCard/main`
      // })
      // 会员中心分享
      // wx.navigateTo({
      //   url: `../yearsCardShare/main`
      // })
      // 活动着陆页（小程序码）
      // wx.navigateTo({
      //   url: `../packageMe/branchActivity/main`
      // })
      // 卡包
      // wx.navigateTo({
      //   url: `../packageMe/cardManagement/main`
      // })
      // wx.navigateTo({
      //   url: `../inSaleShare/main`
      // })
    }
  },

  onLoad (options) {
    let { inviterId = 0 } = options
    this.inviterId = inviterId
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.login()
        } else {
          this.show = 1
        }
      },
      fail: () => {
        wx.showToast({
          title: '系统错误请重试',
          icon: 'none'
        })
      }
    })
  }
}
</script>

<style scoped>
.box {
  width: 630rpx;
  height: 750rpx;
  background: #fff;
  margin: 0 auto;
  margin-top: 150rpx;
  position: relative;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
}

.logo {
  position: absolute;
  top: 184rpx;
  left: 80rpx;
  width: 468rpx;
  height: 392rpx;
}
.btn {
  position: absolute;
  bottom: -40rpx;
  right: 80rpx;
  width: 330rpx;
  height: 80rpx;
  border-radius: 40rpx;
  color: #fff;
  font-weight: 500;
  letter-spacing: 0.1rpx;
  line-height: 80rpx;
  text-align: center;
  /* background-image: linear-gradient(256deg, #55f9ff, #55d9ff 51%, #55baff); */
  /* box-shadow: 0 8rpx 16rpx -8rpx #76bdec; */
  font-size: 34rpx;
  border: none;
  background-color: #ffcd76;
}
button::after {
  border: none;
}
</style>
