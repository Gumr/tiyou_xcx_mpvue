<template>
  <div class="page">
    <image mode='aspectFill'
      class="card-img"
      src="https://api.tiyou.techoiceness.com/v1/static/images/img_9.png"
    />
    <input type="text"
      class="input"
      placeholder="请输入16位兑换码"
      maxlength="16"
      v-model="text"
      @input="bindinput"
      placeholder-style="color: #eee"
    />

    <div class="prompt">
      <span>兑换方式</span>
      <span>示例：G56I—DZCT—FWZ3—ZK93</span>
      <span>请输入：G56IDZCTFWZ3ZK93兑换即可，请勿输入—</span>
    </div>

    <!-- 客服 -->
    <label class="service-box" for="service">
      <image mode='aspectFill'
        class="service-img"
        src="https://api.tiyou.techoiceness.com/v1/static/icon/ic_service.png"
      />
    </label>
    <button id="service" open-type="contact"></button>

    <div :class="[ AppIsIpx ? 'isx-btn' : 'btn' ]" @click="toSend">
      <Wbutton 
        text="确认兑换"
        bgColor="confirm"
        size="size690"
      />
    </div>
  </div>
</template>

<script>
import {
  mapActions
} from 'vuex'
import Wbutton from '@/components/Button'

export default {
  components: {
    Wbutton
  },

  data () {
    return {
      text: '',
      organizationId: [],
      branchId: [],
      phone: 0
    }
  },

  methods: {
    ...mapActions('successInfo', [
      'vuexSetSucInfo'
    ]),

    // 试听卡的机构，网点信息
    ...mapActions('auditionCard', [
      'vuexSetAuditionInfo'
    ]),

    bindinput (e) {
      this.text = e.mp.detail.value.toUpperCase()
    },

    // 前往兑换成功
    async toSend () {
      let bra = this.branchId[0]
      let org = this.organizationId[0]
      // this.text = this.text.toUpperCase()
      let data = {
        redemptionCode: this.text
      }
      if (bra) {
        data[bra] = this.branchId[1]
      }
      if (org) {
        data[org] = this.organizationId[1]
      }
      if (!data.redemptionCode) {
        wx.showToast({
          icon: 'none',
          title: '请输入正确兑换码'
        })
        return
      }
      let res = await this.$api.card.redemption(data)
      if (res.msg) return
      if (res.cardType && (res.cardType.code === 'TY1002' || res.cardType.code === 'TY1001')) {
        let type = 4
        wx.navigateTo({
          url: `../../wsuccessPage/main?type=${type}`
        })
        let code = res.code
        let info = `你已成功兑换卡号为“${code}”的体游科学实验年卡，赶紧预约使用吧!`
        this.vuexSetSucInfo(info)
      }
      // 兑换体验卡
      if (res.cardType && res.cardType.code === 'TY1003') {
        let type = 4
        wx.navigateTo({
          url: `../../wsuccessPage/main?type=${type}`
        })
        let code = res.code
        let info = `你已成功兑换卡号为“${code}”的体游科学实验体验卡，赶紧预约使用吧!`
        this.vuexSetSucInfo(info)
      }
      // 兑换试听类
      // if (res.cardType && res.cardType.code === 'TY1004') {
      //   wx.showToast({
      //     title: '兑换成功'
      //   })
      //   wx.navigateTo({
      //     url: `../auditionCardDetail/main?cardId=${res.id}`
      //   })
      // }
      // i.remainingTimes > 0 && i.cardType.topCategories[0] && i.cardType.topCategories[0].id === 3
      if (res.cardType && res.remainingTimes > 0 && res.cardType.topCategories && res.cardType.topCategories[0] && res.cardType.topCategories[0].id === 3) {
        let type = 5
        wx.navigateTo({
          url: `../../wsuccessPage/main?type=${type}`
        })
        let cardData = {
          branchId: res.branchId,
          organizationId: res.organizationId,
          storeId: res.cardType && res.cardType.stores
        }
        let code = res.code
        let info = `你已成功兑换卡号为“${code}”的体游科学实验试听卡，赶紧预约使用吧!`
        this.vuexSetAuditionInfo(cardData)
        this.vuexSetSucInfo(info)
      }
    },

    setToken (data) {
      const { token = '', sessionKey = '', phoneNo } = data
      wx.setStorageSync('token', token)
      wx.setStorageSync('sessionKey', sessionKey)
      this.phone = !phoneNo
    },

    initState () {
      this.branchId = []
      this.organizationId = []
    }
  },

  onUnLoad () {
    this.initState()
  },

  onLoad (options) {
    this.text = ''
    let { branchId = '', organizationId = '', scene = '' } = options
    if (!scene) {
      if (organizationId) {
        scene += `organizationId=${organizationId}`
      }
      if (branchId) {
        scene += `,branchId=${branchId}`
      }
    }
    if (scene) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            let _token = wx.getStorageSync('token')
            if (!_token) {
              this.$wxLogin.wxLogin(this)
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
              url: `../../login/main?scene=${scene}&pageType=11`
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
            }
          } else {
            wx.redirectTo({
              url: `../../login/main?pageType=11`
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-img {
  width: 100%;
  height: 300rpx;
}

.input {
  position: absolute;
  top: 250rpx;
  width: 690rpx;
  height: 100rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #fff;
  left: 30rpx;
  font-size: 28rpx;
  text-align: center;
}

.isx-btn {
  position: fixed;
  bottom: 68rpx;
  left: 30rpx;
}

.btn {
  position: fixed;
  bottom: 30rpx;
  left: 30rpx;
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

.prompt {
  width: 630rpx;
  margin-top: 100rpx;
  font-size: 22rpx;
  color: #b2b2b2;
  display: flex;
  flex-direction: column;
  line-height: 36rpx;
}
</style>
