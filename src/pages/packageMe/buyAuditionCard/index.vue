<template>
  <div class="page">
    <button id="phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" />
    <div class="card-box">
      <image mode='aspectFill'
        class="years-card-img"
        src="https://api.tiyou.techoiceness.com/v1/static/images/card_2.png"
      />
      <!-- <div class="card-title">
        科学年卡
      </div> -->
      <image mode='aspectFit'
        class="https-card-img"
        src="https://api.tiyou.techoiceness.com/v1/static/images/audition_card.png"
      />
      <div class="card-bg">
      </div>
    </div>

    <!-- 科学试听卡 价格 -->
    <div class="card-info">
      <div class="card-title-box">
        <div class="years-title">
          科学试听卡
        </div>
        <div class="card-price">
          <text class="card-cost">¥{{ cardInfo.originPrice }}</text>
          <span class="card-current">¥{{ cardInfo.price }}</span>
          <span class="cost-border" :style="{ width: borderWidth + 'px' }"></span>
        </div>
      </div>
    </div>

    <div
      v-for="(item, index) in cardInfo && cardInfo.descriptions"
      :key="index"
    >
    <div class="info-item" v-if="item.title && item.content">
      <div class="item-title-box">
        <span class="item-border"></span>
        <text class="item-title">{{ item.title }}</text>
      </div>
      <text class="item-content">{{ item.content }}</text>
    </div>
    </div>

    <div v-if="detail" class="detail">
      <rich-text :nodes="detail"></rich-text>
    </div>

    <div v-if="detail">
      <rich-text :nodes="direction"></rich-text>
    </div>

    <image mode='aspectFit'
      class="images4"
      src="https://api.tiyou.techoiceness.com/v1/static/images/buy_audition4.png"
    />

    <image mode='aspectFit'
      class="images1"
      src="https://api.tiyou.techoiceness.com/v1/static/images/buy_audition1.png"
    />

    <image mode='aspectFit'
      class="images2"
      src="https://api.tiyou.techoiceness.com/v1/static/images/buy_audition2.png"
    />

    <image mode='aspectFit'
      class="images3"
      src="https://api.tiyou.techoiceness.com/v1/static/images/buy_audition3.png"
    />

    <div class="btn-box">
      <!-- 点击事件 -->
      <div class="agree-click" @click="agree">
      </div>
      <div class="btn-top">
        <image mode='aspectFill'
          class="selected-img"
          :src="agreeStatus ? '../../../static/icon/ic_selected.png' : '../../../static/icon/ic_select.png'"
        />
        <span class="agree">同意</span>
        <span class="description" @click="toProtocel">《体游科学实验室科学试听卡使用协议》</span>
      </div>
      <div class="btn" @click="buyCard">
        购买
      </div>
    </div>

    <!-- 客服 -->
    <label class="service-box" for="service">
      <image mode='aspectFill'
        class="service-img"
        src="https://api.tiyou.techoiceness.com/v1/static/icon/ic_service.png"
      />
    </label>
    <button id="service" open-type="contact"></button>
    <label v-if="phone" for="phone" class="phone" />
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
      // 年卡信息
      cardInfo: {
        originPrice: 999,
        price: 666
      },
      borderWidth: 25,
      // 同意状态
      agreeStatus: 1,
      // 卡类型
      cardTypeId: 0,
      timeFunt: '',
      // 默认已有手机号 0 有 1 没有
      phone: 0,
      // 机构小程序码进入，需要带上网点和机构参数
      // 机构
      organizationId: [],
      // 网点
      branchId: [],
      detail: '',
      direction: '',
      scene: ''
    }
  },

  // 分享
  onShareAppMessage: function () {
    let text = '购买科学试听卡'
    const t = {
      title: `${text}`,
      desc: '',
      imageUrl: 'https://api.tiyou.techoiceness.com/v1/static/images/share_image.png',
      path: `pages/packageMe/buyAuditionCard/main?pageType=12&scene=${this.scene}`
    }
    return t
  },

  methods: {
    ...mapActions('successInfo', [
      'vuexSetSucInfo'
    ]),

    ...mapActions('successInfo', [
      'vuexSetSucInfo'
    ]),

    // 试听卡的机构，网点信息
    ...mapActions('auditionCard', [
      'vuexSetAuditionInfo'
    ]),

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

    async getCardType () {
      let res = await this.$api.card.cardType()
      if (res.msg) return
      let arr = res.list.filter(i => i.topCategories && i.topCategories[0] && i.topCategories[0].id === 3 && i.remainingTimes > 0)
      let data = {}
      if (arr[0].id) {
        data = {
          typeId: arr[0].id
        }
        this.cardTypeDetail(data)
      } else {
        data = {
          typeId: res.list[0].id
        }
        this.cardTypeDetail(data)
      }
      this.cardTypeId = data.typeId
    },

    async cardTypeDetail (data) {
      let res = await this.$api.card.cardTypeDetail(data)
      if (res.msg) return
      this.cardInfo = res
      this.cardInfo.price = res.price / 100
      this.cardInfo.originPrice = res.originPrice / 100
      const regex = new RegExp('<img', 'gi')
      // res.deadline = this.$wxApi.getTime(res.deadline)
      this.cardInfo = res
      // this.detail = res.cardType.detail
      // this.direction = res.cardType.direction
      this.direction = res.direction.replace(regex, `<img style="max-width: 100%;"`)
      this.detail = res.detail.replace(regex, `<img style="max-width: 100%;"`)
      this.timeFunt = setTimeout(() => {
        const query = wx.createSelectorQuery()
        query.select('.card-cost').boundingClientRect((rect) => {
          this.borderWidth = rect.width
        }).exec()
      }, 1000)
    },

    async buyCard () {
      if (!this.agreeStatus) {
        wx.showToast({
          title: '请同意试听卡使用协议',
          icon: 'none'
        })
        return
      }
      let _token = wx.getStorageSync('token')
      if (!_token) {
        this.$wxLogin.wxLogin(this)
        wx.showToast({
          title: '重新登陆',
          icon: 'none'
        })
        return
      }
      let bra = this.branchId[0]
      let org = this.organizationId[0]
      const data = {
        cardTypeId: this.cardTypeId
      }
      if (bra) {
        data[bra] = this.branchId[1]
      }
      if (org) {
        data[org] = this.organizationId[1]
      }
      if (!data.cardTypeId) {
        this.getCardType()
        wx.showToast({
          title: '购买失败，请重新购买',
          icon: 'none'
        })
        return
      }
      let r = await this.$api.my.profile()
      if (r.msg) return
      if (!r.phoneNo) {
        this.phone = 1
        wx.showToast({
          title: '请授权手机号后购买',
          icon: 'none'
        })
        return
      }
      this.$api.card.buyCard(data)
        .then((res) => {
          if (res.error) {
            return
          }
          const id = res.cardOrder.id
          wx.requestPayment({
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.package,
            signType: res.signType,
            paySign: res.paySign,
            success: (res) => {
              let d = {
                status: 1
              }
              this.$api.card.buyCardSuc(id, d)
                .then((resSuc) => {
                  wx.showToast({
                    title: '支付成功'
                  })
                  // wx.navigateTo({
                  //   url: `../auditionCardDetail/main?cardId=${id}`
                  // })
                  let type = 6
                  let cardData = {
                    branchId: resSuc.branchId,
                    organizationId: resSuc.organizationId,
                    storeId: resSuc.cardType && resSuc.cardType.stores
                  }
                  this.vuexSetAuditionInfo(cardData)
                  let code = resSuc.code
                  let info = `你已成功购买卡号为“${code}”的体游科学实验试听卡，赶紧预约使用吧!`
                  this.vuexSetSucInfo(info)
                  wx.navigateTo({
                    url: `../../wsuccessPage/main?type=${type}`
                  })
                })
            },
            fail: (res) => {
              let p = {
                status: 2
              }
              this.$api.card.buyCardSuc(id, p)
                .then((resSuc) => {
                  wx.showToast({
                    icon: 'none',
                    title: '支付失败'
                  })
                })
            }
          })
        })
    },

    // 个人信息
    async getUser () {
      let res = await this.$api.my.profile()
      if (res.msg) return
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

    setToken (data) {
      const { token = '', sessionKey = '', phoneNo } = data
      wx.setStorageSync('token', token)
      wx.setStorageSync('sessionKey', sessionKey)
      this.phone = !phoneNo
      if (token) {
        this.getUser()
        this.getCardType()
      }
    },

    initState () {
      this.agreeStatus = 1
      this.borderWidth = 25
      this.phone = 0
      this.organizationId = []
      this.branchId = []
      this.detail = ''
      this.direction = ''
      this.scene = ''
      clearTimeout(this.timeFunt)
    }
  },

  onUnload () {
    this.initState()
  },

  onLoad (options) {
    let { branchId = '', organizationId = '', scene = '' } = options
    if (!scene) {
      if (organizationId) {
        scene += `organizationId=${organizationId}`
      }
      if (branchId) {
        scene += `,branchId=${branchId}`
      }
    }
    // 如果是分享进入
    this.scene = scene
    if (scene) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            let _token = wx.getStorageSync('token')
            if (!_token) {
              this.$wxLogin.wxLogin(this)
            } else {
              this.getUser()
              this.getCardType()
            }
            let arrScene = scene.split(',')
            if (arrScene.length <= 1) {
              let arr1 = arrScene[0].split('=')
              this.branchId = arr1
            } else {
              let arr2 = arrScene[0].split('=')
              let arr3 = arrScene[1].split('=')
              this.branchId = arr2
              this.organizationId = arr3
            }
          } else {
            wx.redirectTo({
              url: `../../login/main?scene=${scene}&pageType=12`
            })
          }
        }
      })
    } else {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            let _token = wx.getStorageSync('token')
            if (!_token) {
              this.$wxLogin.wxLogin(this)
            } else {
              this.getUser()
              this.getCardType()
            }
          } else {
            wx.redirectTo({
              url: `../../login/main?pageType=12`
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.page {
  margin-top: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 300rpx;
}

.card-box {
  position: relative;
  width: 630rpx;
  height: 360rpx;
}

.years-card-img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 600rpx;
  height: 360rpx;
  z-index: 3;
}

.card-title {
  position: absolute;
  top: 30rpx;
  left: 30rpx;
  font-size: 48rpx;
  text-shadow: 0 2rpx 4rpx #ffcd76;
  font-family: zcoolqingkehuangyouti;
  letter-spacing: 0.4rpx;
  color: #ffffff;
  z-index: 4;
}

.https-card-img {
  position: absolute;
  top: 30rpx;
  left: 30rpx;
  z-index: 4;
  width: 110rpx;
  height: 56rpx;
}

.card-bg {
  position: absolute;
  top: 30rpx;
  left: 30rpx;
  bottom: 0;
  width: 600rpx;
  height: 360rpx;
  opacity: 0.5;
  border-radius: 20rpx;
  background-color: #ff8880;
  z-index: 2;
}

.card-info {
  width: 630rpx;
  margin-top: 90rpx;
  margin-bottom: 50rpx;
}

.card-title-box {
  font-size: 37rpx;
  font-weight: 500;
  color: #232323;
  display: flex;
  align-items: center;
}

.years-title {
  flex: auto;
}

.card-price {
  font-family: 'League Gothic';
  position: relative;
}

.card-title-box {
  display: flex;
  align-items: center;
}

.card-cost {
  font-size: 34rpx;
  color: #c8d2dc;
}

.cost-border {
  position: absolute;
  bottom: 25rpx;
  left: 0;
  /* width: 50rpx; */
  height: 2rpx;
  transform: rotate(20deg);
  background-color: #ffcd76;
}

.card-current {
  font-size: 48rpx;
  color: #ffcd76;
  margin-left: 10rpx;
}

.info-item {
  width: 630rpx;
  display: flex;
  flex-direction: column;
  margin-bottom: 30rpx;
}

.item-border {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background-color: #dfe6ed;
  margin-right: 20rpx;
}

.item-title-box {
  display: flex;
  align-items: center;
}

.item-title {
  font-size: 28rpx;
  color: #232323;
}

.item-content {
  font-size: 22rpx;
  color: #b2b2b2;
  margin-left: 44rpx;
  margin-top: 10rpx;
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
  width: 50rpx;
  height: 50rpx;
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

.service-box {
  position: fixed;
  z-index: 1002;
  right: 40rpx;
  bottom: 208rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 16rpx -8rpx rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
}

.service-img {
  width: 48rpx;
  height: 48rpx;
}

.images1 {
  width: 100%;
  height: 1700rpx;
  margin-top: 30rpx;
}

.images2 {
  width: 100%;
  height: 900rpx;
  margin-top: 30rpx;
}

.images4 {
  width: 100%;
  height: 511rpx;
  margin-top: 30rpx;
}

.images3 {
  width: 100%;
  height: 1750rpx;
  margin-top: 30rpx;
}

.phone {
  position: fixed;
  width: 100%;
  height: 100%;
  /* height: 100rpx;
  bottom: 68rpx; */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
}

.info-item {
  width: 630rpx;
  display: flex;
  flex-direction: column;
  margin-bottom: 30rpx;
}

.item-border {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background-color: #dfe6ed;
  margin-right: 20rpx;
}

.item-title-box {
  display: flex;
  align-items: center;
}

.item-title {
  font-size: 28rpx;
  color: #232323;
}

.item-content {
  font-size: 22rpx;
  color: #b2b2b2;
  margin-left: 44rpx;
  margin-top: 10rpx;
}

.detail {
  margin-bottom: 60rpx;
}
</style>
