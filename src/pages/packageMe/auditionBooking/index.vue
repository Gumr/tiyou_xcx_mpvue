<template>
  <div class="contain">
    <button id="phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" />
    <div class="book-content">
      <WInfo :infoPost="infoPost[0]" />

      <WInfo :infoPost="infoPost[1]" />

      <WInfo :infoPost="infoPost[2]" />
    </div>

    <div class="book-select-boby" @click="toPage(0)">
      <WSelect
        :selectPost="selectPost[0]"
      />
    </div>

    <div class="book-select-card" @click="toPage(1)">
      <WSelect
        :selectPost="selectPost[1]"
      />
    </div>

    <!-- <div v-if="showYearCard" class="book-select-yearCard">
      <span class="item-dot"></span>
      <span class="item-word">开通科学年卡<span class="iten-word-span">免费预约</span></span>
      <span class="item-selected"><span class="item-selected-span">¥</span>{{ cardPrice }}</span>
      <image @click="chooseCard"
        mode='aspectFill'
        class="item-img"
        :src="buyYearCard === 0 ? '../../../static/icon/ic_selected.png' : '../../../static/icon/ic_select.png'"
      />
    </div> -->

    <div class="book-people">
      <div class="booked-title">
        <span class="booked-dot"></span>
        <span class="booked-word">开班情况</span>
      </div>

      <div class="booked-content">
      <p class="booked-content-p1" :style="{left: numWidth + 'rpx'}">
          <span class="booked-content-p1-yellow">{{ classItem.bookedNumbers }}</span>/{{ classItem.maxMembers }}
        </p>
        <span class="booked-content-bg"></span>
        <span class="booked-content-slider" :style="{width: sliderWidth + 'rpx'}"></span>
        <span class="booked-content-bot" :style="{left: botWidth + 'rpx'}"></span>
        <span class="booked-content-line" :style="{left: lineWidth + 'rpx'}"></span>
        <span class="booked-content-word" :style="{left: wordWidth + 'rpx'}">满{{ classItem.minMembers }}人开班</span>
      </div>
    </div>

    <div class="book-info">
      <p>提示：</p>
      <p>1.成团要求：该课程满{{ classItem.minMembers }}人开课</p>
      <p>2.取消条款：活动开始前3小时可以取消</p>
      <p>3.如未取消课程但又未到课，系统仍会扣除1次课程。</p>
      <!-- 3.注意事项： -->
    </div>

    <div v-if="needPay === 0" class="btn0">
      <p class="btn0-price">
        <span class="btn0-price-word">需支付</span>
        <span class="btn0-price-span">¥</span>
        <span v-if="cardType === 1">{{ classItem.price }}</span>
      </p>
      <div class="btn0-btn" @click="booking">
        <Wbutton text="微信支付并预约" size="size346" bgColor="middle-confirm" />
      </div>
    </div>

      <!-- <div v-if="needPay === 1" class="btn" @click="booking">
        <Wbutton text="确认预约" size="size690" bgColor="confirm" />
      </div> -->
      <!-- <label v-if="needPay === 1" for="formId" class="btn" @click="booking">
        <Wbutton text="确认预约" size="size690" bgColor="confirm" />
      </label> -->
      <form v-if="needPay === 1" @submit="booking" bindreset="formReset" report-submit="true">
        <button class="btn-formid" id="formId" formType="submit">确认预约</button>
      </form>

    <div class="btn-mask">
    </div>
    <label v-if="phone" for="phone" class="phone" />
  </div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import moment from 'moment'
import WInfo from '@/components/WInfo'
import WSelect from '@/components/WSelect'
import Wbutton from '@/components/Button'

export default {
  data () {
    return {
      // 注意： 值为''，字符串
      // 0未付年卡，1直付，2卡券, 3已有卡
      cardType: '1',
      cardId: '',
      newCardId: '',
      childId: 0,
      showYearCard: true,
      // 0购买，1不购买
      buyYearCard: 0,
      // 0显示支付，1不显示支付
      needPay: 1,
      cardPrice: 0,
      dontCloseCard: 0,
      classItem: {},
      infoPost: [
        {
          title: '上课时间',
          infoStatus: 0,
          msg: ''
        },
        {
          title: '课程',
          infoStatus: 1,
          msg1: '',
          msg2: ''
        },
        {
          title: '地点',
          infoStatus: 1,
          msg1: '',
          msg2: ''
        }
      ],
      selectPost: [
        {
          title: '上课的宝宝',
          msg: '请选择您的宝宝',
          selectStatus: 0,
          status: 0
        },
        {
          title: '使用卡券',
          msg: '无',
          selectStatus: 1
        }
      ],
      // 开办情况
      numWidth: 40,
      sliderWidth: 0,
      botWidth: 52,
      lineWidth: 58,
      wordWidth: 20,
      // 是否是体验卡，不需要绑定
      oneTimesCard: 0,
      phone: 0
    }
  },

  components: {
    WInfo,
    WSelect,
    Wbutton
  },

  computed: {
    ...mapGetters('child', [
      'vuexGetChildInfo'
    ]),

    // 获取数据
    childInfo () {
      let childInfo = this.vuexGetChildInfo
      return childInfo
    },

    ...mapGetters('classCourse', [
      'vuexGetClassInfo'
    ]),

    // 获取数据
    classInfo () {
      let classInfo = this.vuexGetClassInfo
      return classInfo
    },

    ...mapGetters('card', [
      'vuexGetCardInfo'
    ]),

    // 获取数据
    cardInfo () {
      let cardInfo = this.vuexGetCardInfo
      return cardInfo
    }
  },

  methods: {
    ...mapActions('child', [
      'vuexSetChildInfo'
    ]),

    ...mapActions('card', [
      'vuexSetCardInfo'
    ]),

    formSubmit (e) {
      console.log('e', e)
    },

    toPage (index) {
      // selectPost的selectStatus：0表示选宝宝，1表示选卡券
      // this.$emit('bindCard')
      // wx.navigateTo({
      //   url: `../courseInfo/main`
      // })
      if (index === 0) {
        wx.navigateTo({
          url: `../auditionSelectChild/main`
        })
      }
      if (index === 1) {
        if (!this.childInfo.childId) {
          wx.showToast({
            title: '请选择宝宝',
            icon: 'none'
          })
          return
        }
        wx.navigateTo({
          url: `../auditionSelectCard/main`
        })
      }
    },

    initState () {
      this.newCardId = 0
      this.childId = 0
      this.cardPrice = 0
      this.dontCloseCard = 0
      this.needPay = 1
      this.infoPost[0].msg = ''
      this.infoPost[1].msg1 = ''
      this.infoPost[1].msg2 = ''
      this.infoPost[2].msg1 = ''
      this.infoPost[2].msg2 = ''
      this.selectPost[0].msg = '请选择您的宝宝'
      this.selectPost[1].msg = '无'
      this.selectPost[0].status = 0
      this.numWidth = 40
      this.sliderWidth = 0
      this.botWidth = 52
      this.lineWidth = 58
      this.wordWidth = 20
      this.oneTimesCard = 0
      this.phone = 0
      const child = {
        childId: ''
      }
      this.vuexSetChildInfo(child)
      this.vuexSetCardInfo({
        cardInfo: ''
      })
    },

    async getClass () {
      let id = this.classInfo.classId
      const res = await this.$api.class.getClassById(id)
      this.classItem = {
        classId: id,
        time: this.turnTime(res.startTime.slice(0, 10)),
        startTime: moment(res.startTime).format('HH:mm'),
        endTime: moment(res.endTime).format('HH:mm'),
        courseName: res.course.title,
        courseType: res.course && res.course.secondCategory.name,
        storeName: res.store.name,
        storeAddress: res.store.address,
        originPrice: (res.course.originPrice / 100).toFixed(2),
        price: (res.course.price / 100).toFixed(2),
        minMembers: res.minMembers,
        maxMembers: res.maxMembers,
        bookedNumbers: res.bookedNumbers,
        ageRange: res.ageRange
      }
      // 计算开班情况的界面位移量，总长度为570
      const moveWidth = res.bookedNumbers / res.maxMembers * 570
      const moveWidthTotal = res.minMembers / res.maxMembers * 570
      this.numWidth = 40 + moveWidth
      this.sliderWidth = 0 + moveWidth
      this.botWidth = 52 + moveWidth
      this.lineWidth = 58 + moveWidthTotal
      this.wordWidth = 20 + moveWidthTotal
      this.setData()
    },

    async getChild (id, parpm) {
      // 获取用户是否有试听卡
      let res = await this.$api.card.myCardList()
      let name = this.vuexGetChildInfo.name
      // TY1004 试听卡
      let arr = res.list.filter(i => i.remainingTimes > 0 && i.cardType && i.cardType.topCategories && i.cardType.topCategories[0] && i.cardType.topCategories[0].id === 3)
      // 没有试听卡
      if (arr.length <= 0) {
        this.needPay = 0
        // 微信支付价格
        this.cardType = 1
        this.selectPost[1].msg = '无'
      } else {
        // let cardTypeName = arr[0].cardType && arr[0].cardType.name
        this.needPay = 1
        this.cardType = 3
        this.selectPost[1].msg = '试听卡'
        // this.showYearCard = false
        // this.buyYearCard = 1
        let d = {
          cardId: arr[0].id
        }
        this.vuexSetCardInfo(d)
      }
      this.selectPost[0].msg = `${name}`
      this.selectPost[0].status = 1
    },

    async getCard (id, myCardType) {
      // id为0，表示不选卡，其他则有卡
      if (id > 0 && this.dontCloseCard !== 1) {
        // needPay: 0显示支付，1不显示支付
        this.selectPost[1].msg = '试听卡'
        this.needPay = 1
        this.cardType = 3
      } else {
        // 不使用卡劵,需要微信支付试听课程
        this.needPay = 0
        // 微信支付价格
        this.cardType = 1
        this.selectPost[1].msg = '无'
      }
    },

    async booking (e) {
      let formId = ''
      if (e.type) {
        formId = e.mp.detail.formId
      }
      let cardType = this.cardType
      // cardType: 1 直付课程 3 试听卡
      // payType: 1:年卡(所有卡类型支付方式) 2:体验卡(弃用) 3:微信支付
      let payType = 0
      if (cardType === 1) {
        payType = 3
      }
      if (cardType === 3) {
        payType = 1
      }
      if (!this.childInfo.childId) {
        wx.showToast({
          title: '请选择宝宝',
          icon: 'none'
        })
        return
      }
      // 区分年龄段
      if (this.childInfo.childId && this.classItem.ageRange) {
        if (this.childInfo.age > this.classItem.ageRange.max || this.childInfo.age < this.classItem.ageRange.min) {
          wx.showToast({
            title: '孩子不符合课程年龄要求',
            icon: 'none'
          })
          return
        }
      }
      if (!this.classItem.classId) {
        wx.showToast({
          title: '请选择课程',
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
      // 微信支付预约
      if (cardType === 1) {
        const data = {
          classScheduleId: parseInt(this.classItem.classId),
          childId: this.childInfo.childId,
          payType: payType
        }
        const res = await this.$api.class.bookedClass(data)
        const orderID = res.courseOrder.id
        if (res.msg) return
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: res.signType,
          paySign: res.paySign,
          success: (res) => {
            // 请求支付回调
            const data = {
              // 2:支付失败 3:支付成功
              status: 3
            }
            this.$api.pay.buyCourseSuc(data, orderID)
              .then((resSuc) => {
                console.log('支付回调请求：', resSuc)
                wx.showToast({
                  title: '支付成功'
                })
                let type = 1
                wx.navigateTo({
                  url: `../../successPage/main?type=${type}`
                })
              })
          },
          fail: (res) => {
            // 请求支付回调
            const data = {
              // 2:支付失败 3:支付成功
              status: 2
            }
            this.$api.pay.buyCourseSuc(data, orderID)
              .then((resSuc) => {
                console.log('支付回调请求：', resSuc)
                wx.showToast({
                  icon: 'none',
                  title: '支付失败'
                })
              })
          }
        })
      }
      // 试听卡预约
      if (cardType === 3) {
        const formD = {
          formId: formId
        }
        await this.$api.formId.getFormId(formD)
        // 请求预约
        const data = {
          classScheduleId: parseInt(this.classItem.classId),
          cardId: this.cardInfo.cardId,
          // 1:卡类 3:微信支付
          payType: payType,
          childId: this.childInfo.childId,
          formId
        }
        const res = await this.$api.class.bookedClass(data)
        if (res.msg) return
        let type = 1
        wx.navigateTo({
          url: `../../successPage/main?type=${type}`
        })
      }
    },

    // 获取手机
    getPhoneNumber (e) {
      const _token = wx.getStorageSync('token')
      if (_token) {
        this.$wxLogin.wxLogin(this)
        this.$wxLogin.getPhoneNumber(e, this)
      }
    },

    // 个人信息
    async getUser () {
      let res = await this.$api.my.profile()
      if (res.msg) return
      if (!res.phoneNo) {
        this.phone = 1
      }
    },

    setToken (data) {
      const { token = '', sessionKey = '', phoneNo } = data
      wx.setStorageSync('token', token)
      wx.setStorageSync('sessionKey', sessionKey)
      this.phone = !phoneNo
      if (token) {
        this.getUser()
      }
    },

    setData () {
      const classItem = this.classItem
      this.infoPost[0].msg = `${classItem.time} ${classItem.startTime}- ${classItem.endTime}`
      this.infoPost[1].msg1 = classItem.courseName
      this.infoPost[1].msg2 = classItem.courseType
      this.infoPost[2].msg1 = classItem.storeName
      this.infoPost[2].msg2 = classItem.storeAddress
    },

    // 2xxx.xx.xx
    turnTime (date) {
      const a = date.slice(0, 4)
      const b = date.slice(5, 7)
      const c = date.slice(8, 10)
      return `${a}.${b}.${c}`
    }

  },

  onLoad (options) {
    this.getClass()
  },

  onShow () {
    if (this.childInfo.childId) {
      // 不选择使用卡劵，不刷新孩子
      if (this.cardInfo.cardId !== -1) {
        this.getChild(this.childInfo.childId, this.cardInfo)
      }
    }
    // cardId -1 不是用卡劵
    if (this.cardInfo.cardId || this.cardInfo.cardId === -1) {
      this.getCard(this.cardInfo.cardId, this.cardInfo.myCardType)
    }
  },

  onUnload () {
    this.initState()
  }
}
</script>

<style scoped>
.contain {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 240rpx;
}

.book-content {
  padding-bottom: 60rpx;
}

.book-class, .book-content, .book-select-yearCard {
  margin: 30rpx 30rpx 0;
  width: 690rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
}

.book-select-boby, .book-select-card {
  height: 100rpx;
  margin-bottom: 20rpx;
  margin-left: 30rpx;
  margin-right: 30rpx;
}

.book-select-yearCard {
  display: flex;
  align-items: center;
  position: relative;
  height: 100rpx;
}
.item-dot {
  margin-left: 30rpx;
  display: block;
  width: 4rpx;
  height: 24rpx;
  border-radius: 4rpx;
  background-color: #ffcd76;
}
.item-word {
  margin-left: 20rpx;
  /* width: 56px; */
  height: 40rpx;
  font-size: 28rpx;
  color: #b2b2b2;
}
.iten-word-span {
  color: #ffcd76;
}
.item-selected {
  position: absolute;
  right: 88rpx;
  width: 240rpx;
  height: 56rpx;
  font-family: 'League Gothic';
  font-size: 48rpx;
  text-align: right;
  color: #ffcd76;
}
.item-selected-span {
  font-size: 34rpx;
}
.item-img {
  position: absolute;
  right: 30rpx;
  width: 48rpx;
  height: 48rpx;
}

.book-people {
  height: 262rpx;
}
.booked-title {
  position: relative;
  margin-top: 30rpx;
  width: 690rpx;
  height: 40rpx;
}

.booked-dot {
  position: absolute;
  left: 30rpx;
  top: 16rpx;
  display: block;
  width: 4rpx;
  height: 24rpx;
  border-radius: 4rpx;
  background-color: #ffcd76;
}
.booked-word {
  margin-left: 54rpx;
  /* width: 56px; */
  height: 40rpx;
  font-size: 28rpx;
  color: #b2b2b2;
  font-weight: 500;
}

.booked-content {
  position: relative;
}
.booked-content-p1 {
  position: absolute;
  top: 30rpx;
  font-family: 'League Gothic';
  font-size: 28rpx;
  text-align: center;
  color: #c8d2dc;
}
.booked-content-p1-yellow {
  font-size: 48rpx;
  color: #ffcd76;
}
.booked-content-bg {
  position: absolute;
  top: 100rpx;
  left: 60rpx;
  width: 570rpx;
  height: 10rpx;
  border-radius: 6rpx;
  background-color: #f8f8f8;
}
.booked-content-slider {
  position: absolute;
  top: 100rpx;
  left: 60rpx;
  height: 10rpx;
  border-radius: 6rpx;
  background-color: #ffcd76;
}
.booked-content-bot {
  z-index: 2;
  position: absolute;
  top: 96rpx;
  width: 18rpx;
  height: 18rpx;
  border-radius: 10rpx;
  box-shadow: 0 0 32rpx 0 #ffdea5;
  background-color: #ffffff;
}
.booked-content-line {
  z-index: 1;
  position: absolute;
  top: 90rpx;
  width: 4rpx;
  height: 30rpx;
  background-color: #ffdea5;
}
.booked-content-word {
  position: absolute;
  top: 130rpx;
  height: 32rpx;
  font-size: 22rpx;
  font-weight: 500;
  text-align: center;
  color: #c8d2dc;
}

.book-info {
  margin: 30rpx 60rpx 0;
  width: 630rpx;
  font-size: 22rpx;
  color: #b2b2b2;
}

.btn0 {
  width: 690rpx;
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 68rpx;
  flex: auto;
}
.btn0-price {
  position: absolute;
  right: 370rpx;
  width: 200rpx;
  height: 56rpx;
  font-family: 'League Gothic';
  font-size: 48rpx;
  text-align: right;
  color: #ffcd76;
}
.btn0-price-word {
  margin-right: 10rpx;
  font-size: 22rpx;
  color: #b2b2b2;
}
.btn0-price-span {
  font-size: 34rpx;
}
.btn0-btn {
  z-index: 4;
  position: absolute;
  right: 0rpx;
}

.btn {
  z-index: 4;
  position: fixed;
  bottom: 40rpx;
  flex: auto;
}
.btn-formid::after {
  border: none;
}

.btn-formid {
  position: fixed;
  bottom: 40rpx;
  left: 30rpx;
  width: 690rpx;
  text-align: center;
  line-height: 80rpx;
  height: 80rpx;
  font-weight: 500;
  font-size: 28rpx;
  color: #fff;
  border-radius: 40rpx;
  box-shadow: 0 16rpx 16rpx -8rpx #ffdea5;
  background-color: #ffcd76;
}
/* .btn-mask {
  z-index: 3;
  position: fixed;
  bottom: 0rpx;
  flex: auto;
  width: 750rpx;
  height: 140rpx;
  background-color: white;
} */

.formBnt {
  width: 400rpx;
  height: 100rpx;
}

.phone {
  position: fixed;
  width: 100%;
  height: 100%;
  /* height: 100rpx; */
  /* bottom: 68rpx; */
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 10000;
}
</style>
