<template>
  <div class="wrap">
    <!-- <div v-if="applyToast">
      <w-apply @showStoast="showStoast" :joinQuestionsList="joinQuestionsList" :joinType="joinType"></w-apply>
    </div> -->
    <div class="box-img">
      <image class="img" mode="aspectFill" :src="data.cover" />
    </div>
    <div class="box-title">
      <span class="circle-title">{{ data.name }}</span>
      <div v-if="data.price > 0" class="box-title-right">
        <span class="yuan">¥</span>
        <span class="price">{{ data.price / 100 }}</span>
        <!-- <image class="img" :src="data.cover" /> -->
        <!-- <div class="img-msask">
        </div> -->
      </div>
    </div>
    <div class="member-box">
      <div class="admin-box-left">
        <image mode="aspectFill" class="admin-avatar" :src="data.administrator.avatar" />
        <span class="admin-name">{{ data.administrator.nickname }}</span>
      </div>
      <div class="member-box-right">
        <span class="member-number">{{ data && data.members && data.members.count || 0 }}</span>
        <w-member :member="data && data.members && data.members.rows || []"></w-member>
      </div>
    </div>
    <div class="desc">
      {{ data.desc || '简介' }}
    </div>
    <div class="btn" @click="joinCircle">
      <w-button :text="text" size="big330" bgColor="black"></w-button>
    </div>
  </div>
</template>

<script>
import WcircleIntro from '@/components/quanzis/circleIntro'
import WadminAvatar from '@/components/quanzis/adminAvatar'
import Wmember from '@/components/quanzis/member'
import Wapply from '@/components/quanzis/apply'
import Wbutton from '@/components/quanzis/button'
import Wbindphone from '@/components/quanzis/bindphone'

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      codeToast: false,
      applyToast: false,
      phone: false,
      joinType: 0,
      joinQuestionsList: [],
      text: '申请加入',
      bindPhoneNoToken: ''
    }
  },
  components: {
    'w-circle-intro': WcircleIntro,
    'w-admin': WadminAvatar,
    'w-member': Wmember,
    'w-apply': Wapply,
    'w-button': Wbutton,
    'w-bindphone': Wbindphone
  },

  computed: {
    s () {
      if (this.data.joinType) {
        if (this.data.joinType === 1) {
          this.text = '加入'
        }
      }
      return ''
    }
  },

  methods: {
    setToken (token) {
      try {
        wx.setStorageSync('token', token)
        wx.setStorageSync('phone', 'ok')
        this.phone = true
      } catch (e) {
        this.phone = false
      }
    },
    sendCode (codeToast, offCode) {
      this.codeToast = codeToast
      if (codeToast === true) {
        this.phone = true
      } else {
        this.phone = false
      }
    },
    joinCircle () {
      // 待审核
      if (this.data.joinStatus === 2) return
      // 自由加入
      if (this.data) {
        if (this.data.joinQuestions) {
          this.joinQuestionsList = this.data.joinQuestions
          this.joinType = this.data.joinType
        }
        if (this.joinQuestionsList.length === 0) {
          this.joinType = 0
        }
      }
      // 优先价格
      if (this.data.price > 0) {
        this.$quanzis.api.circle.circleJoin(this.data.id)
          .then((payRes) => {
            if (payRes.error) return
            if (!Object.keys(payRes).length) {
              wx.showToast({
                title: '申请成功'
              })
              return
            }
            if (this.text === '支付中') return
            wx.requestPayment({
              timeStamp: payRes.timeStamp,
              nonceStr: payRes.nonceStr,
              package: payRes.package,
              signType: payRes.signType,
              paySign: payRes.paySign,
              success: (res) => {
                this.text = '支付中'
                // this.orderId = res.orderId
                this.$quanzis.api.pay.payConfirmed(payRes.orderId)
                  .then((s) => {
                    if (s.error) return
                    if (s.payConfirmed === 1) {
                      wx.showToast({
                        title: '申请成功'
                      })
                      wx.redirectTo({
                        url: `../qz-circle/main?id=${this.data.id}`
                      })
                    }
                  })
              },
              fail: (res) => {
                // this.text = '支付失败'
              }
            })
          })
        return
      }
      // 自由加入
      if (this.data.joinType === 1) {
        this.$quanzis.api.circle.circleJoin(this.data.id)
          .then(res => {
            if (res.error) return
            wx.showToast({
              title: '申请成功'
            })
            let show = 1
            // 加入成功
            this.$emit('joinSatus', show)
            wx.redirectTo({
              url: `../qz-circle/main?id=${this.data.id}`
            })
          })
      } else {
        // 审核加入
        // this.applyToast = true
        wx.navigateTo({
          url: `../qz-apply/main?circleId=${this.data.id}`
        })
      }
    }
    // showStoast (toast, signInStatus, applyList, joinReason) {
    //   if (signInStatus) {
    //     const joinAnswers = []
    //     for (let i = 0; i < this.data.joinQuestions && this.data.joinQuestions.length; i++) {
    //       let questionId = this.data.joinQuestions[i].id
    //       joinAnswers.push({
    //         'answer': applyList[i],
    //         'questionId': questionId
    //       })
    //     }
    //     let data = {}
    //     const joinId = this.data.id
    //     if (this.data.joinQuestions && this.data.joinQuestions.length === 0) {
    //       data = {
    //         joinReason: joinReason
    //       }
    //     } else {
    //       data = {
    //         joinAnswers
    //       }
    //     }
    //     this.$api.circle.circleJoin(joinId, data)
    //       .then(res => {
    //         if (res.error) {
    //           wx.showToast({
    //             title: res.error.msg
    //           })
    //         } else {
    //           wx.showToast({
    //             title: '申请成功'
    //           })
    //           wx.redirectTo({
    //             url: `../qz-circle/main?id=${this.data.id}`
    //           })
    //         }
    //       })
    //   }
    //   this.applyToast = toast
    // }
  },
  onLoad () {
    if (this.data.price > 0) {
      this.text = '支付加入'
    }
    if (this.data.joinStatus === 2) {
      this.text = '待审核'
    }
    if (this.data.joinType === 1) {
      this.text = '加入'
    }
    const _token = wx.getStorageSync('token')
    const _phone = wx.getStorageSync('phone')
    this.phone = !!_phone
    if (!_token) {
      this.$wxLogin.wxLogin(this)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 630rpx;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  border-top-right-radius: 100rpx;
  position: relative;
}
.box-title {
  width: 540rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 40rpx;
  height: 48rpx;
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}
.circle-title {
  width: 200rpx;
  overflow: hidden;
  font-size: 34rpx;
  color: #232323;
}
/* .img-msask {
  position: absolute;
  top: 0;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background-color: #fff;
  opacity: .9;
} */
.admin {
  margin-top: 30rpx;
}
.member {
  width: 570rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  margin-top: 30rpx;
  margin-bottom: 60rpx;
}
.item-key {
  color: #b2b2b2;
}
.item-number {
  margin-left: 30rpx;
}
.member-color {
  color: $decorateColor;
}
.btn {
  position: absolute;
  right: 60rpx;
  bottom: -40rpx;
}
.test {
  width: 750rpx;
  height: 10000rpx;
  opacity: 0.4;
  position: fixed;
  top: 0;
  z-index: 9999;
}

// ----改版----
.box-img {
  width: 630rpx;
  height: 400rpx;
}
.img {
  width: 630rpx;
  height: 400rpx;
}
.member-box {
  width: 550rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 30rpx;
}
.admin-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
}
.admin-box-left,
.member-box-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.admin-name {
  width: 160rpx;
  margin-left: 20rpx;
  overflow: hidden;
  font-size: 24rpx;
  color: #232323;
}
.member-number {
  font-size: 28rpx;
  color: #b2b2b2;
  margin-right: 10rpx;
}
.desc {
  width: 550rpx;
  font-size: 22rpx;
  color: #b2b2b2;
  margin-bottom: 90rpx;
}
.yuan {
  font-size: 34rpx;
  color: #eee;
}
.price {
  font-size: 48rpx;
  color: $decorateColor;
  margin-left: 10rpx;
}
</style>
