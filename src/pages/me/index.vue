<template>
<div class="page">
  <button id="phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" />
  <label v-if="phone" for="phone" class="phone" />
  <div :class="[ AppIsIpx ? 'isx-wrap' : 'wrap']">
    <!-- 个人信息 -->
    <div class="user-info" @click="toUserInfo" key="hasPhone">
      <image mode='aspectFill'
        class="avatar"
        :src="userInfo.avatar"
      />
      <div class="user-info-right">
        <span class="name">{{ userInfo.nickname }}</span>
        <span v-if="userInfo.children" class="relationship">
          <span v-for="(item, index) in child" :key="index">
            {{ item.name }}
            <span v-if="child.length - 1 !== index">
              、
            </span>
          </span>
          的家长
        </span>
      </div>
    </div>

    <!-- <label class="user-info" for="phone" v-else key="noPhone">
      <image mode='aspectFill'
        class="avatar"
        :src="userInfo.avatar"
      />
      <div class="user-info-right">
        <span class="name">{{ userInfo.nickname }}</span>
        <span v-if="userInfo.children" class="relationship">
          <span v-for="(item, index) in child" :key="index">
            {{ item.name }}
            <span v-if="child.length - 1 !== index">
              、
            </span>
          </span>
          的家长
        </span>
      </div>
    </label> -->

    <!-- 年卡 -->
    <div class="years-card-box" @click="toLesson">
      <image mode='aspectFill'
        class="viptext-img"
        src="https://api.tiyou.techoiceness.com/v1/static/icon/img_12.png"
      />
      <image mode='aspectFit'
        class="viptext"
        src="https://api.tiyou.techoiceness.com/v1/static/icon/img_viptext.png"
      />
      <!-- 成为会员 非会员-->
      <div class="get-vip" v-if="userInfo.isVIP === 1 || userInfo.isVIP === 0">
        成为会员
      </div>
      <div class="is-vip" v-if="userInfo.isVIP === 2">
        <div class="vip-time">
          {{ userInfo.VIPExpiredAt }}到期
        </div>
        <div class="vip-info">
          会员中心
        </div>
      </div>
      <div>

      </div>
      <div class="card-bg">
      </div>
    </div>

    <!-- 成长记录 -->
    <div class="growing-box">
      <div class="growing-content">
        <div class="growing-top" @click="toBuyClassTime">
          <image mode='aspectFill'
            class="goods-img"
            src="https://api.tiyou.techoiceness.com/v1/static/icon/ic_timeCoin.png"
          />
          <div class="goods-title">我的课时</div>
          <div class="buy-class-times">购买课时</div>
          <image mode='aspectFill'
            class="qz-item-right"
            src="../../static/icon/ic_right.png"
          />
        </div>

        <div class="kind-study">
          <div class="kind-left">
            <span class="kind-time">{{ userInfo.amount || 0.0 }}</span>
            <span class="kind">剩余课时</span>
          </div>
          <div class="kind-right">
            <span class="kind-times">0</span>
            <span class="kind">陪伴时长</span>
          </div>
        </div>

        <!-- 社群 -->
        <div class="qz-item-box">
          <div class="border"></div>
          <div class="qz-item" @click="toAllCard">
            <image mode='aspectFill'
              class="qz-item-img"
              src="https://api.tiyou.techoiceness.com/v1/static/icon/ic_account.png"
            />
            <div class="qz-item-title">卡包</div>
            <image mode='aspectFill'
              class="qz-item-right"
              src="../../static/icon/ic_right.png"
            />
          </div>
          <!-- todo  需删除 -->
          <div class="qz-item" @click="toTest" v-if="isDev">
            <div class="qz-item-title">着陆页(id: 40)</div>
            <image mode='aspectFill'
              class="qz-item-right"
              src="../../static/icon/ic_right.png"
            />
          </div>
          <!-- <div class="border"></div>
          <div class="qz-item" @click="mySignIn">
            <image mode='aspectFill'
              class="qz-item-img"
              src="https://api.tiyou.techoiceness.com/v1/static/icon/ic_punch.png"
            />
            <div class="qz-item-title">打卡</div>
            <image mode='aspectFill'
              class="qz-item-right"
              src="../../static/icon/ic_right.png"
            />
          </div>

          <div class="border"></div>
          <div class="qz-item" @click="toMyPulish">
            <image mode='aspectFill'
              class="qz-item-img"
              src="https://api.tiyou.techoiceness.com/v1/static/icon/ic_publish.png"
            />
            <div class="qz-item-title">发布</div>
            <image mode='aspectFill'
              class="qz-item-right"
              src="../../static/icon/ic_right.png"
            />
          </div>

          <div class="border"></div>
          <div class="qz-item" @click="toMyCourse">
            <image mode='aspectFill'
              class="qz-item-img"
              src="https://api.tiyou.techoiceness.com/v1/static/icon/ic_circleCourse.png"
            />
            <div class="qz-item-title">课程</div>
            <image mode='aspectFill'
              class="qz-item-right"
              src="../../static/icon/ic_right.png"
            />
          </div> -->

          <!-- 老师入口 -->
          <div class="border" v-if="userInfo.teacher"></div>
          <!-- 课程 -->
          <div class="qz-item" v-if="userInfo.teacher" @click="toTeacherAdmin">
            <image mode='aspectFill'
              class="qz-item-img"
              src="https://api.tiyou.techoiceness.com/v1/static/icon/ic_teacher.png"
            />
            <div class="qz-item-title">老师排课</div>
            <image mode='aspectFill'
              class="qz-item-right"
              src="../../static/icon/ic_right.png"
            />
          </div>
        </div>
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

    <!-- <div class="exchange" @click="toSendCard">
      <image mode='aspectFill'
        class="exchange-https-img"
        src="https://api.tiyou.techoiceness.com/v1/static/images/exchange_card.png"
      />
      <image mode='aspectFill'
        class="exchange-img"
        src="https://api.tiyou.techoiceness.com/v1/static/images/img_10.png"
      />
    </div> -->
  </div>
  <WTabBar />
</div>
</template>

<script>
import WTabBar from '@/components/TabBar'
import { version } from '@/utils/api.js'
export default {
  components: {
    WTabBar
  },

  data () {
    return {
      userInfo: {
        nickname: '体游',
        relationship: '',
        avatar: 'https://api.tiyou.techoiceness.com/v1/static/images/img_6.png'
      },
      child: [],
      phone: 0
    }
  },

  onPullDownRefresh: function () {
    this.getUserInfo()
    wx.stopPullDownRefresh()
  },

  computed: {
    isDev () {
      return version === '0.2.0'
    }
  },

  methods: {
    toBuy () {
      // if (this.phone) return
      wx.navigateTo({
        url: `../packageMe/buyCard/main`
      })
    },

    toTeacherAdmin () {
      wx.navigateTo({
        url: `../packageMe/teacherAdmin/main`
      })
    },

    toAllCard () {
      // if (this.phone) return
      wx.navigateTo({
        url: `../packageMe/cardManagement/main`
      })
    },

    toUserInfo () {
      wx.navigateTo({
        url: `../packageMe/userInfo/main`
      })
    },

    setToken (data) {
      const { token = '', sessionKey = '', phoneNo } = data
      wx.setStorageSync('token', token)
      wx.setStorageSync('sessionKey', sessionKey)
      this.phone = !phoneNo
      if (token) {
        this.getUserInfo()
      }
    },

    getPhoneNumber (e) {
      const _token = wx.getStorageSync('token')
      if (_token) {
        this.$wxLogin.wxLogin(this)
        this.$wxLogin.getPhoneNumber(e, this)
      }
    },

    async getUserInfo () {
      let res = await this.$api.my.profile()
      if (res.msg) {
        return
      }
      // wx.setStorageSync('token', res.token)
      if (!res.phoneNo) {
        this.phone = 1
      }
      this.userInfo = res
      if (this.userInfo.wallet) {
        this.userInfo = {
          ...this.userInfo,
          amount: this.userInfo.wallet && this.userInfo.wallet.amount / 10,
          VIPExpiredAt: this.userInfo.VIPExpiredAt
        }
      }
      if (this.userInfo.isVIP === 2) {
        this.userInfo.VIPExpiredAt = this.$wxApi.getTime(this.userInfo.VIPExpiredAt)
      }
      if (res.children) {
        this.child = res.children.map((i) => ({
          name: i.name
        }))
      }
    },

    // to 购买课时
    toBuyClassTime () {
      wx.navigateTo({
        url: `../packageMe/buyLesson/main`
      })
    },

    // to 会员
    toLesson () {
      // 不是会员 to 购买课时页面
      if (this.userInfo.isVIP === 1 || this.userInfo.isVIP === 0) {
        this.toBuyClassTime()
      } else {
        let userId = this.userInfo.id
        wx.navigateTo({
          url: `../packageMe/VIPinfo/main?userId=${userId}`
        })
        // wx.navigateTo({
        //   url: `../packageMe/VIPinfo/main?branchId=1&organizationId=2`
        // })
      }
    },

    toMyPulish () {
      wx.navigateTo({
        url: `../qz-myPublish/main`
      })
    },

    toMyCourse () {
      wx.navigateTo({
        url: `../qz-mycourse/main`
      })
    },

    mySignIn () {
      wx.navigateTo({
        url: `../qz-allsignin/main`
      })
    },

    // 兑换卡
    toSendCard () {
      wx.navigateTo({
        url: `../packageMe/sendCard/main`
      })
    },

    // 测试-todo
    toTest () {
      wx.navigateTo({
        url: `../packageMe/branchActivity/main`
      })
    },

    // 年卡转课时
    async cardSetLesson () {
      await this.$api.lesson.cardSetLesson()
    },

    // 更新token
    async upDateUserToken () {
      let res = await this.$api.my.upDateToken()
      if (res.msg) return
      wx.setStorageSync('token', res.token)
    }
  },

  onShow () {
    wx.hideTabBar()
    // this.cardSetLesson()
    this.getUserInfo()
  },

  onLoad () {
    const _token = wx.getStorageSync('token')
    if (_token) {
      this.upDateUserToken()
    }
  }
}
</script>

<style scoped>
.isx-wrap {
  width: 100%;
  margin-top: 30rpx;
  padding-bottom: 200rpx;
}
.wrap {
  width: 100%;
  margin-top: 30rpx;
  padding-bottom: 120rpx;
}

.user-info {
  display: flex;
  width: 100%;
  /* height: 96rpx; */
  box-sizing: border-box;
  padding: 0 60rpx;
  margin-bottom: 60rpx;
}

.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  margin-right: 40rpx;
}

.user-info-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 34rpx;
  font-weight: 500;
  width: 464rpx;
  /* overflow: hidden; */
}

.name {
  color: #232323;
}

.relationship {
  color: #c8d2dc;
}

.years-card-box {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100rpx;
}

.buy-click {
  position: absolute;
  right: 0rpx;
  top: 0;
  width: 600rpx;
  height: 120rpx;
}

.years-card-img {
  width: 600rpx;
  height: 360rpx;
  position: absolute;
  top: 0;
  left: 60rpx;
  bottom: 0;
  right: 60rpx;
  z-index: 3;
}

.years-card-info {
  width: 600rpx;
  height: 360rpx;
  position: absolute;
  top: 0;
  left: 60rpx;
  bottom: 0;
  right: 60rpx;
  box-sizing: border-box;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 4;
}

.card-bg {
  position: absolute;
  left: 60rpx;
  bottom: 0;
  width: 630rpx;
  height: 100rpx;
  background-color: #ffdea5;
  z-index: 2;
  border-radius: 20rpx 20rpx 0 0;
}

.years-card-top {
  display: flex;
}

.years-card-name {
  font-size: 34rpx;
  color: #fff;
  text-shadow: 0 1px 2px #ffcd76;
}

.https-card-img {
  width: 106rpx;
  height: 40rpx;
}

.years-card-desc {
  flex: auto;
  width: 240rpx;
  overflow: hidden;
  font-size: 22rpx;
  font-weight: 500;
  color: #ba9657;
  text-align: right;
  line-height: 40rpx;
}

.buy-years-card {
  width: 96rpx;
  height: 40rpx;
  border-radius: 6rpx;
  box-shadow: 0 16rpx 16rpx -8rpx rgba(0, 0, 0, 0.05);
  background-color: #ba9657;
  color: #fff;
  font-size: 22rpx;
  font-weight: 500;
  letter-spacing: 0.2rpx;
  margin-left: 20rpx;
  line-height: 40rpx;
  text-align: center;
}

.years-content {
  display: flex;
  width: 280rpx;
  flex-wrap: wrap;
}

.card-item-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120rpx;
  margin-top: 10rpx;
}

.item-right {
  margin-right: 40rpx;
}

.card-item-img {
  width: 80rpx;
  height: 80rpx;
}

.catd-item-title {
  font-size: 22rpx;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0px;
}

.look-card {
  position: absolute;
  right: 0rpx;
  bottom: 0;
  width: 600rpx;
  box-sizing: border-box;
  padding-bottom: 30rpx;
  padding-right: 30rpx;
  padding-top: 180rpx;
  font-size: 22rpx;
  letter-spacing: 0.1px;
  color: #fff;
  text-align: right;
}

/* 成长 */
.growing-box {
  width: 100%;
  /* height: 600rpx; */
  box-sizing: border-box;
  padding-left: 30rpx;
  padding-right: 30rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #fff;
}

.growing-content {
  width: 690rpx;
  box-sizing: border-box;
  padding: 30rpx;
}

.growing-top {
  display: flex;
  align-items: center;
}

.goods-img {
  width: 48rpx;
  height: 48rpx;
  margin-right: 20rpx;
}

.goods-title {
  font-size: 28rpx;
  letter-spacing: 0.2rpx;
  color: #b2b2b2;
}

.buy-class-times {
  flex: auto;
  text-align: right;
  color: #ffcd76;
  font-size: 28rpx;
}

.kind-study {
  margin-top: 60rpx;
  display: flex;
  margin-bottom: 20rpx;
}

.kind-right, .kind-left {
  flex: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.kind-time, .kind-times {
  font-size: 48rpx;
  color: #888;
  font-family: 'League Gothic';
}

.kind {
  margin-top: 10rpx;
  font-weight: 500;
  font-size: 22rpx;
  color: #c8d2dc;
}

.border {
  width: 570rpx;
  height: 2rpx;
  border-radius: 6rpx;
  background-color: #fcfcfc;
  margin-top: 30rpx;
}

.qz-item {
  display: flex;
  margin-top: 30rpx;
}

.qz-item-img {
  width: 48rpx;
  height: 48rpx;
  margin-right: 30rpx;
}

.qz-item-title {
  flex: auto;
  font-size: 28rpx;
  letter-spacing: 0.2rpx;
  color: #b2b2b2;
  line-height: 48rpx;
}

.qz-item-right {
  width: 48rpx;
  height: 48rpx;
}

.exchange {
  width: 100%;
  box-sizing: border-box;
  padding: 0 30rpx;
  position: relative;
  margin-top: 30rpx;
}

.exchange-title {
  position: absolute;
  left: 30rpx;
  width: 690rpx;
  height: 120rpx;
  line-height: 120rpx;
  box-sizing: border-box;
  padding-left: 40rpx;
  font-size: 34rpx;
  font-family: zcoolqingkehuangyouti;
  letter-spacing: 0.4rpx;
  color: #fff;
}

.exchange-https-img {
  position: absolute;
  left: 30rpx;
  margin-left: 40rpx;
  margin-top: 40rpx;
  width: 220rpx;
  height: 40rpx;
}

.exchange-img {
  width: 690rpx;
  height: 120rpx;
  border-radius: 20rpx;
}

.viptext-img {
  width: 78rpx;
  height: 64rpx;
  position: absolute;
  top: 16rpx;
  left: 76rpx;
  z-index: 3;
}

.viptext {
  position: absolute;
  z-index: 4;
  width: 100rpx;
  height: 50rpx;
  left: 90rpx;
  top: 30rpx;
}

.get-vip {
  width: 120rpx;
  height: 40rpx;
  line-height: 40rpx;
  background-color: #ba9657;
  box-shadow: 0 16rpx 16rpx -8rpx rgba(0,0,0,0.05);
  border-radius: 6rpx;
  opacity: 0.6;
  text-align: center;
  color: #fff;
  font-size: 22rpx;
  position: absolute;
  right: 90rpx;
  top: 30rpx;
  z-index: 3;
}

.is-vip {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 500rpx;
  height: 40rpx;
  line-height: 40rpx;
  color: #fff;
  font-size: 22rpx;
  position: absolute;
  right: 90rpx;
  top: 30rpx;
  z-index: 3;
}

.vip-time {
  font-size: 22rpx;
  color: #ba9657;
}

.vip-info {
  width: 120rpx;
  height: 40rpx;
  line-height: 40rpx;
  background-color: #ba9657;
  box-shadow: 0 16rpx 16rpx -8rpx rgba(0,0,0,0.05);
  border-radius: 6rpx;
  opacity: 0.6;
  text-align: center;
  color: #fff;
  font-size: 22rpx;
  margin-left: 20rpx;
}

.phone {
  position: fixed;
  z-index: 10000;
  top: 0;
  bottom: 200rpx;
  left: 0;
  right: 0;
  width: 100%;
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

</style>
