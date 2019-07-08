<template>
  <div class="page">
    <button id="phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" />
    <label v-if="phone" for="phone" class="phone" />
    <div v-for="(item, index) in goodsList" :key="index" class="card-box">
      <div :class="[ index === indexStatus ? 'set-card' : 'card' ]"
        @click="selectCard(index)"
      >
        <div class="times">{{ item.amount }}</div>
        <div class="times-text">课时</div>
        <div class="price-box">
          <div class="send-vip">{{ item.desc }}</div>
          <div class="price">¥ {{ item.price }}</div>
        </div>
        <image mode='aspectFill'
          class="selected-img"
          :src="index === indexStatus ? '../../../static/icon/ic_selected.png' : '../../../static/icon/ic_select.png'"
        />
        <!-- 首充 -->
        <div class="one-times" v-if="userInfo.isCharge === 1 && index === indexStatus && item.hasFirstAct === 1">
          首充
        </div>
      </div>
    </div>
    <div class="btn-box">
      <div class="agree-click" @click="agree">
      </div>
      <div class="btn-top">
        <image mode='aspectFill'
          class="selected-img"
          :src="agreeStatus ? '../../../static/icon/ic_selected.png' : '../../../static/icon/ic_select.png'"
        />
        <span class="agree">同意</span>
        <span class="description" @click="toProtocel">《体游科学实验室科学课时使用协议》</span>
      </div>
      <div class="btn" @click="buyLesson">
        购买
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },

  data () {
    return {
      userInfo: {},
      indexStatus: -1,
      goodsList: [],
      phone: 0,
      type: 0,
      agreeStatus: 1,
      // 机构
      branchId: '',
      organizationId: '',
      inviterId: ''
    }
  },

  methods: {
    initState () {
      this.indexStatus = -1
      this.goodsList = []
      this.userInfo = {}
      this.phone = 0
      this.type = 0
      this.agreeStatus = 1
      this.branchId = ''
      this.organizationId = ''
      this.inviterId = ''
    },

    // 同意/不同意
    agree () {
      this.agreeStatus = !this.agreeStatus
    },

    // to 使用协议
    toProtocel () {
      let code = 'currency'
      wx.navigateTo({
        url: `../agreement/main?code=${code}`
      })
    },

    // 个人信息
    async getUserInfo () {
      let res = await this.$api.my.profile()
      if (res.msg) {
        return
      }
      if (!res.phoneNo) {
        this.phone = 1
      }
      this.userInfo = res
      // isCharge 1 未首充 2 已首充
      this.getCurrencyGoods(this.userInfo)
    },

    // 选择卡片
    selectCard (index) {
      if (index === this.indexStatus) {
        this.indexStatus = -1
      } else {
        this.indexStatus = index
      }
    },

    // 购买
    async buyLesson () {
      if (this.indexStatus === -1) {
        this.$wxApi.wxShowToast({
          title: '请选择套餐'
        })
        return
      }
      if (!this.agreeStatus) {
        wx.showToast({
          title: '请同意课时使用协议',
          icon: 'none'
        })
        return
      }
      let d = {
        goodsId: this.goodsList[this.indexStatus].id,
        organizationId: this.organizationId,
        branchId: this.branchId,
        inviterId: this.inviterId
      }
      if (!d.goodsId) {
        this.$wxApi.wxShowToast({
          title: '未获取到相关商品，请联系工作人员'
        })
        return
      }
      let res = await this.$api.lesson.buyLesson(d)
      if (res.msg) return
      const orderID = res.order.id
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign,
        success: (res) => {
          let p = {
            goodsId: d.goodsId,
            data: {
              orderId: orderID,
              status: 1
            }
          }
          // 成功回调
          this.$api.lesson.buyLessonSuc(p)
            .then(() => {
              this.indexStatus = -1
              wx.showToast({
                title: '支付成功',
                icon: 'none'
              })
              if (this.type === 1) {
                wx.navigateBack({})
              }
            })
        },
        fail: (res) => {
          let p = {
            goodsId: d.goodsId,
            data: {
              orderId: orderID,
              status: 2
            }
          }
          // 成功回调
          this.$api.lesson.buyLessonSuc(p)
            .then(() => {
              wx.showToast({
                title: '支付失败',
                icon: 'none'
              })
            })
        },
        complete: (complete) => {
        }
      })
    },

    // 商品套餐列表
    async getCurrencyGoods (info) {
      let data = {
        page: 1
      }
      let res = await this.$api.lesson.currencyGoods(data)
      if (res.msg) return
      // 未首充 显示首充价格
      this.goodsList = res.list.map(i => (
        {
          ...i,
          amount: i.amount / 10,
          price: info.isCharge === 1 ? i.firstPrice / 100 : i.price / 100
        }
      ))
    },

    getPhoneNumber (e) {
      const _token = wx.getStorageSync('token')
      if (_token) {
        this.$wxLogin.wxLogin(this)
        this.$wxLogin.getPhoneNumber(e, this)
      }
    },

    setToken (data) {
      const { token = '', sessionKey = '', phoneNo } = data
      wx.setStorageSync('token', token)
      wx.setStorageSync('sessionKey', sessionKey)
      this.phone = !phoneNo
    }
  },

  onShareAppMessage: function () {
    let type = 15
    // 邀请人 id
    let inviterId = this.userInfo.id
    let text = '课时充值'
    const t = {
      title: `${text}`,
      desc: '',
      imageUrl: 'https://api.tiyou.techoiceness.com/v1/static/images/share_image.png',
      path: `pages/packageMe/buyLesson/main?shareType=${type}&inviterId=${inviterId}`
    }
    return t
  },

  onLoad (options) {
    // type 1 是从预约页过来
    let { type = 0, branchId = '', organizationId = '', shareType = '', inviterId = 0 } = options
    this.type = parseInt(type, 10)
    this.organizationId = parseInt(organizationId, 10)
    this.branchId = parseInt(branchId, 10)
    this.inviterId = parseInt(inviterId, 10)
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          let _token = wx.getStorageSync('token')
          if (!_token) {
            this.$wxLogin.wxLogin(this)
          } else {
            this.getUserInfo()
          }
        } else {
          wx.redirectTo({
            url: `../../login/main?shareType=${shareType}&inviterId=${inviterId}&organizationId=${organizationId}&branchId=${branchId}`
          })
        }
      }
    })
    // this.getCurrencyGoods()
  },

  onUnload () {
    this.initState()
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
.btn-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  height: 200rpx;
  background-color: #fff;
  box-sizing: border-box;
  padding: 10rpx 30rpx 0 30rpx;
}

.agree-click {
  width:150rpx;
  height:60rpx;
  top: 0;
  left: 0;
  /* background-color: red; */
  position: absolute;
  z-index: 1001;
}

.selected-img {
  width: 24rpx;
  height: 24rpx;
  margin-right: 10rpx;
}

.btn-top {
  display: flex;
  align-items: center;
  font-size: 22rpx;
}

.agree {
  color: #b2b2b2;
}

.description {
  color: #ffcd76;
}

.btn {
  width: 690rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  box-shadow: 0 16rpx 16rpx -8rpx #ffdea5;
  background-color: #ffcd76;
  /* background-color: #eee; */
  margin-top: 10rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
}

.card {
  width: 690rpx;
  height: 200rpx;
  box-sizing: border-box;
  padding: 58rpx 60rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0,0,0,0.02);
  background-color: #fff;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 4rpx solid #fff
}

.set-card {
  width: 690rpx;
  height: 200rpx;
  box-sizing: border-box;
  padding: 58rpx 60rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0,0,0,0.02);
  background-color: #fff;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 4rpx solid rgba(255,222,165,1);
}

.card-box {
  position: relative;
  overflow: hidden;
}

.times {
  font-size: 72rpx;
  color: #ffcd76;
  font-family: 'League Gothic';
  font-weight: 400;
  margin-right: 30rpx;
}

.times-text {
  font-size: 34rpx;
  font-weight: 500;
  color: #c8d2dc;
}

.send-vip {
  font-size: 34rpx;
  color: #ffcd76;
  font-weight: 500;
}

.price-box {
  display: flex;
  align-items: center;
  flex: auto;
  justify-content: space-between;
}

.price {
  font-size: 48rpx;
  color: #ffcd76;
  font-family: 'League Gothic';
  font-weight: 400;
}

.selected-img {
  width: 48rpx;
  height: 48rpx;
  margin-left: 30rpx;
}

.one-times {
  width: 200rpx;
  height: 45rpx;
  line-height: 45rpx;
  background-color: #ffdea5;
  color: #fff;
  font-size: 22rpx;
  font-weight: 500;
  text-align: center;
  position: absolute;
  right: -50rpx;
  transform: rotate(45deg);
  top: 0;
  box-sizing: border-box;
  padding-left: 36rpx;
}

.phone {
  position: fixed;
  z-index: 10000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
</style>
