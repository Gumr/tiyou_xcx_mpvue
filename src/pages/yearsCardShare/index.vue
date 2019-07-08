<template>
<!-- 会员中心分享 -->
  <div class="page">
    <button id="phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" />
    <WCard />

    <image mode='aspectFit'
      class="images"
      src="https://api.tiyou.techoiceness.com/v1/static/images/share_page_img.png"
    />
    <div class="btn" @click="getCard">
      <Wbutton
        :text="text"
        size="size690"
        :bgColor="bgColor"
      />
    </div>
    <label v-if="phone" for="phone" class="phone" />
  </div>
</template>

<script>
import WCard from '@/components/yearsCard/shareCard'
import Wbutton from '@/components/Button'
export default {
  components: {
    WCard,
    Wbutton
  },

  data () {
    return {
      text: '领取',
      bgColor: 'confirm',
      // 1 可领取 2 不可领取
      status: 1,
      cardId: '',
      userId: '',
      phone: 0
    }
  },

  methods: {
    // 分享详情
    // async cardDetail (id) {
    //   let res = await this.$api.share.cardDetail(id)
    //   if (res.msg) return
    //   this.setTitle(res.user.nickname)
    //   // 可分享次数 小于等于 领取次数
    //   // let shareTimes = 5
    //   // this.userId = res.user.id
    //   // 总共可以分享多少体验卡
    //   // shareTimes = res.cardActivity.lines
    //   // // 领取次数是否超出
    //   // if (res.cardActivityRecords.length >= shareTimes) {
    //   //   this.text = '已领完'
    //   //   this.bgColor = 'not-clickable'
    //   //   this.status = 0
    //   // }
    //   // 分享卡的类型
    //   let sendCardTypeId = res.cardActivity.sendCardTypeId
    //   let data = {
    //     cardId: this.cardId,
    //     cardTypeId: sendCardTypeId
    //   }
    //   this.canCardType(data)
    // },

    // 或者分享者详情
    async userShareDetail (data) {
      let res = await this.$api.share.getUserShareDetail(data)
      if (res.msg) return
      this.setTitle(res.activity && res.activity.user.nickname)
      if (res.remainingCard <= 0) {
        this.text = '已领完'
        this.bgColor = 'not-clickable'
        this.status = 2
        return
      }
      if (res.can === 2) {
        this.status = 2
        this.text = '不可领取'
        this.bgColor = 'not-clickable'
      }
      if (res.can === 1 && res.got === 1) {
        this.text = '领取'
      }
      if (res.can === 1 && res.got === 2) {
        this.text = '已领取'
        this.status = 2
        this.bgColor = 'not-clickable'
      }
    },

    // 点击-领取
    getCard () {
      if (this.status === 1) {
        this.shareGetCard()
      } else {
        this.$wxApi.wxShowToast({
          title: '不可领取'
        })
      }
    },

    // 领取赠卡
    async shareGetCard () {
      let data = {
        ownerId: this.userId
        // cardId: this.cardId
      }
      let res = await this.$api.share.getCard(data)
      if (res.msg) return
      this.status = 2
      this.text = '已领取'
      this.bgColor = 'not-clickable'
      wx.showToast({
        title: '成功领取'
      })
      wx.reLaunch({
        url: '../course/main'
      })
    },

    // 改变标题
    setTitle (title) {
      wx.setNavigationBarTitle({
        title: `${title}送您一张免费体验卡`
      })
    },

    // 个人信息
    async getUser () {
      let res = await this.$api.my.profile()
      if (res.msg) return
      // this.userId = res.id
      if (!res.phoneNo) {
        this.phone = 1
      }
    },

    // 获取手机
    getPhoneNumber (e) {
      const _token = wx.getStorageSync('token')
      if (_token) {
        // this.phone = false
        // return
        this.$wxLogin.wxLogin(this)
        this.$wxLogin.getPhoneNumber(e, this)
      }
    },

    // 登陆获取token，存储，重新请求分享详情
    setToken (data) {
      const { token = '', sessionKey = '', phoneNo } = data
      wx.setStorageSync('token', token)
      wx.setStorageSync('sessionKey', sessionKey)
      this.phone = !phoneNo
      if (token) {
        this.cardDetail(this.cardId)
      }
    },

    // 页面重置
    initState () {
      this.text = '领取'
      this.bgColor = 'confirm'
      this.status = 1
      this.userId = ''
      this.cardId = ''
    }
  },

  onUnload () {
    this.initState()
  },

  onLoad (options) {
    let { cardId = 0, userId = 0 } = options
    this.setTitle('体游')
    this.cardId = parseInt(cardId, 10)
    this.userId = parseInt(userId, 10)
    if (!userId) {
      this.$wxApi.wxShowToast({
        title: '未获取到userId'
      })
    }
    // this.cardDetail(cardId)
    // 检查是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          let _token = wx.getStorageSync('token')
          if (!_token) {
            this.$wxLogin.wxLogin(this)
          } else {
            // this.cardDetail(cardId)
            let data = {
              userId
            }
            this.getUser()
            this.userShareDetail(data)
          }
        } else {
          wx.redirectTo({
            url: `../login/main?cardId=${this.cardId}&userId=${this.userId}`
          })
        }
      }
    })
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30rpx;
  padding-bottom: 260rpx;
}

.btn {
  position: fixed;
  bottom: 68rpx;
  left: 30rpx;
  right: 30rpx;
}

.phone {
  position: fixed;
  width: 100%;
  height: 100rpx;
  bottom: 68rpx;
  z-index: 10000;
}

.images {
  width: 100%;
  height: 800rpx;
  margin-top: 30rpx;
}
</style>
