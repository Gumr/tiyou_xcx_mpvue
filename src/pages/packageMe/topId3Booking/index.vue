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

    <!-- 显示剩余课时 -->
    <div class="has-times">
      <div class="border-times"></div>
      <div class="times-text">剩余课时</div>
      <div class="lesson-times">{{ userInfo.amount || 0.0 }}</div>
    </div>
  
    <!-- 购买18次课时 -->
    <!-- <div v-if="showYearCard" class="book-select-yearCard"> -->
    <!-- 没有课时 -->
    <div v-if="!userInfo.amount" class="book-select-yearCard">
      <span class="item-dot"></span>
      <span class="item-word">购买18课时附赠<span class="iten-word-span">一年会员</span></span>
      <span class="item-selected"><span class="item-selected-span">¥</span>{{ lessonPrice.price }}</span>
      <image @click="chooseCard"
        mode='aspectFill'
        class="item-img"
        :src="buyYearCard === 0 ? '../../../static/icon/ic_selected.png' : '../../../static/icon/ic_select.png'" 
      />
    </div>

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

    <!-- 注意事项： -->
    <div class="book-info">
      <p>提示：</p>
      <p>1.成团要求：该课程满{{ classItem.minMembers }}人开课</p>
      <p>2.取消条款：活动开始前3小时可以取消</p>
      <p>3.如未取消课程但又未到课，系统仍会扣除1次课程。</p>
    </div>

    <!-- 支付18课时 -->
    <div v-if="needPay === 0" class="btn0">
      <p class="btn0-price">
        <span class="btn0-price-word">需支付</span>
        <span class="btn0-price-span">¥</span>
        <span>{{ lessonPrice.price }}</span>
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
      <!-- 课程需要消耗多少课时 -->
      <div v-if="needPay === 2" class="btn0">
        <p class="btn0-price">
          <span class="btn0-price-word">需消耗</span>
          <span >{{ classItem.lesson || 0 }} </span>
          <span class="btn0-price-word"> 课时</span>
        </p>
        <!-- <div class="btn0-btn" @click="booking">
          <Wbutton text="预约" size="size346" bgColor="middle-confirm" />
        </div> -->
        <form @submit="booking" bindreset="formReset" report-submit="true">
          <button class="pay-type4" id="formId" formType="submit">预约</button>
        </form>
      </div>
    
      <!-- 试听卡 -->
      <form v-if="needPay === 1" @submit="booking" bindreset="formReset" report-submit="true">
        <button class="btn-formid" id="formId" formType="submit">预约</button>
      </form>

    <div class="btn-mask">
    </div>
    <!-- 绑定手机号 -->
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
      // 0购买，1不购买
      buyYearCard: 0,
      // 显示支付购买18课时
      needPay: 0,
      cardPrice: 0,
      dontCloseCard: 0,
      userInfo: {},
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
      // 是否是试听卡，不需要绑定
      oneTimesCard: 0,
      phone: 0,
      lessonPrice: ''
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

    ...mapActions('successInfo', [
      'vuexSetSucInfo'
    ]),

    ...mapActions('card', [
      'vuexSetCardInfo'
    ]),

    formSubmit (e) {
    },

    toPage (index) {
      // selectPost的selectStatus：0表示选宝宝，1表示选卡券
      // this.$emit('bindCard')
      // wx.navigateTo({
      //   url: `../courseInfo/main`
      // })
      if (index === 0) {
        if (this.cardInfo.cardId === -1) {
          this.vuexSetCardInfo({
            cardInfo: ''
          })
        }
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
        let childId = this.vuexGetChildInfo.childId
        wx.navigateTo({
          url: `../auditionSelectCard/main?childId=${childId}`
        })
      }
    },

    initState () {
      this.newCardId = 0
      this.childId = 0
      this.cardPrice = 0
      this.userInfo = {}
      this.dontCloseCard = 0
      this.lessonPrice = ''
      this.cardType = 1
      this.needPay = 0
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
        price: (res.price / 100).toFixed(2),
        minMembers: res.minMembers,
        maxMembers: res.maxMembers,
        bookedNumbers: res.bookedNumbers,
        ageRange: res.ageRange,
        lesson: res.lesson / 10
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

    // 选择孩子
    async getChild (id) {
      const res = await this.$api.child.getChildById(id)
      const name = res.name
      if (this.cardType === 4) {
        this.selectPost[1].msg = '试听卡'
        this.needPay = 1
        this.buyYearCard = 1
        this.cardType = 3
      } else {
        // 请求我的卡列表
        // 如果有试听卡，直接显示
        let r = await this.$api.card.myCardList()
        let arr = r.list.filter(i => i.remainingTimes > 0 && i.childId === 0 && i.cardType && i.cardType.topCategories && i.cardType.topCategories[0] && i.cardType.topCategories[0].id === 3)
        // 有未绑定的卡
        if (arr.length) {
          // 年卡
          // 试听卡,试听卡不可用
          let exCard = arr
          let data = {
            cardId: exCard[0].id
          }
          this.vuexSetCardInfo(data)
          this.needPay = 1
          this.selectPost[1].msg = '试听卡'
          this.cardType = 3
          this.buyYearCard = 1
        } else {
          this.selectPost[1].msg = '无'
          // 使用课时支付
          if (this.userInfo.amount > 0) {
            this.cardType = 2
            this.needPay = 2
            this.buyYearCard = 1
          } else {
            // 没有剩余代币 购买18课时
            this.needPay = 0
            this.cardType = 0
            this.buyYearCard = 0
          }
        }
      }
      this.selectPost[0].msg = `${name}`
      this.selectPost[0].status = 1
    },

    // 选择卡
    async getCard (id, myCardType) {
      // id为0，表示不选卡，其他则有卡
      if (id > 0 && this.dontCloseCard !== 1) {
        // let data = {
        //   cardId: id
        // }
        // let res = await this.$api.card.cardDetail(data)
        // if (res.msg) return
        // buyYearCard: 0购买，1不购买
        // needPay: 0显示支付，1不显示支付
        // 1 试听卡
        this.selectPost[1].msg = '试听卡'
        this.needPay = 1
        this.buyYearCard = 1
        this.cardType = 4
        // 2 年卡
        // if (myCardType === 2) {
        //   this.selectPost[1].msg = '年卡'
        //   this.needPay = 1
        //   this.buyYearCard = 1
        //   this.cardType = 4
        // }
      } else {
        if (this.userInfo.amount > 0) {
          this.cardType = 2
          this.needPay = 2
          this.buyYearCard = 1
        } else {
          this.cardType = 0
          this.needPay = 0
          this.buyYearCard = 0
        }
        // 微信购买年卡并支付 0 年卡 1 直付
        this.selectPost[1].msg = '无'
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
      this.userInfo = res
      if (this.userInfo.wallet) {
        this.userInfo = {
          ...this.userInfo,
          amount: this.userInfo.wallet.amount / 10
        }
      }
      // todo 课时
      if (this.userInfo.amount > 0) {
        // 使用课时支付
        this.needPay = 2
      } else {
        this.needPay = 0
      }
      if (!res.phoneNo) {
        this.phone = 1
      }
      let param = {
        data: {
          page: 1
        },
        isCharge: this.userInfo.isCharge
      }
      // 是否首充
      this.getCurrencyGoods(param)
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

    // 预约
    async booking (e) {
      let formId = ''
      if (e.type) {
        formId = e.mp.detail.formId
      }
      let cardType = this.cardType
      // cardType 3 试听卡
      // cardType: 0未付年卡，1直付，2卡券(其他卡类), 3已有卡, 4绑卡预约
      // payType: 1:卡  3:微信支付 4 代币支付
      let payType = 0
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
      if (!this.cardInfo.cardId && cardType === 3) {
        wx.showToast({
          title: '请选择卡券',
          icon: 'none'
        })
        return
      }
      // let r = await this.$api.my.profile()
      // if (r.msg) return
      // if (!r.phoneNo) {
      //   this.phone = 1
      //   wx.showToast({
      //     title: '请授权手机号后购买',
      //     icon: 'none'
      //   })
      //   return
      // }
      if (cardType === 0) {
        payType = 4
      } else if (cardType === 1) {
        payType = 4
      } else if (cardType === 2) {
        payType = 4
      } else if (cardType === 3 || cardType === 4) {
        payType = 1
      } else {
        wx.showToast({
          title: '未获取到支付方式请重试-booking',
          icon: 'none'
        })
        return
      }
      // 购买18课时
      if (cardType === 0) {
        // 购买课时
        let d = {
          goodsId: this.lessonPrice.id
        }
        if (!d.goodsId) {
          wx.showToast({
            title: '无法购买该商品，请与工作人员联系',
            icon: 'none'
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
                wx.showToast({
                  title: '支付成功',
                  icon: 'none'
                })
                // if (formRes.msg) return
                // 请求预约
                const data = {
                  classScheduleId: this.classItem.classId,
                  // 1:卡 3:微信支付 4 代币
                  payType: payType,
                  childId: this.childInfo.childId
                }
                this.bookedClass(data)
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
          }
        })
      }
      // 购买1个课时
      if (cardType === 1) {
      }
      // 有代币, 使用代币支付
      if (cardType === 2 || cardType === 1) {
        if (this.userInfo.amount * 10 < this.classItem.lesson * 10) {
          wx.showModal({
            title: '提示',
            content: '课时剩余数量不足，是否充值?',
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: `../packageMe/buyLesson/main?type=1`
                })
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          // this.cardType = 2
          const formD = {
            formId: formId
          }
          await this.$api.formId.getFormId(formD)
          // if (formRes.msg) return
          // 请求预约
          const data = {
            classScheduleId: this.classItem.classId,
            // 1:卡 3:微信支付 4 代币
            payType: payType,
            childId: this.childInfo.childId
          }
          this.bookedClass(data)
        }
      }
      // 有试听卡直接约课
      if (cardType === 3) {
        const formD = {
          formId: formId
        }
        await this.$api.formId.getFormId(formD)
        // if (formRes.msg) return
        // 请求预约
        const data = {
          classScheduleId: parseInt(this.classItem.classId),
          cardId: this.cardInfo.cardId,
          // 1:卡 3:微信支付 4 代币
          payType: payType,
          childId: this.childInfo.childId
        }
        this.bookedClass(data)
      }
    },

    // 预约
    async bookedClass (data) {
      let res = await this.$api.class.bookedClass(data)
      if (res.msg) return
      // let type = 1
      // wx.navigateTo({
      //   url: `../wsuccessPage/main?type=${type}`
      // })
      let time = `${this.classItem.time} ${this.classItem.startTime}`
      let address = `${this.classItem.storeName}`
      let msg = `《${this.classItem.courseType}》`
      let name = `${this.childInfo.name}`
      let info = `你已成功为 ${name} 预约了 ${time} 在 ${address}的 ${msg} 课程`
      this.vuexSetSucInfo(info)
      let type = 8
      wx.navigateTo({
        url: `../../wsuccessPage/main?type=${type}`
      })
    },

    // 套餐列表
    async getCurrencyGoods (param) {
      let { data = {}, isCharge = 0 } = param
      let res = await this.$api.lesson.currencyGoods(data)
      if (res.msg) return
      if (isCharge === 0 || !isCharge) {
        wx.showToast({
          title: '未获取到用户是否首次充值',
          icon: 'none'
        })
        return
      }
      let arr = res.list.filter(i => i.amount === 180)
      if (arr.length <= 0) {
        this.buyYearCard = 1
        this.needPay = 0
        this.cardType = 1
      } else {
        this.lessonPrice = {
          price: isCharge === 1 ? arr[0].firstPrice / 100 : arr[0].price / 100,
          id: arr[0].id
        }
      }
    },

    chooseCard () {
      // 0购买，1不购买
      let buyYearCard = this.buyYearCard
      if (buyYearCard === 0) {
        this.buyYearCard = 1
        this.cardType = 1
        // buyYearCard 1 不购买 显示消耗课程课时
        this.needPay = 2
      }
      if (buyYearCard === 1) {
        this.buyYearCard = 0
        this.cardType = 0
        // 购买课时
        this.needPay = 0
      }
    },

    // 初始化页面所需值
    SetYearCardStatus () {
      let cardType = this.cardType
      // 年卡选项：0购买，1不购买
      if (cardType === 0) {
        this.buyYearCard = 0
      }
      if (cardType === 1) {
        this.buyYearCard = 1
      }
      if (cardType === 3) {
        this.buyYearCard = 1
      }
      // 问题
      // 年卡选项：0显示，1不显示
      // 支付选项：0显示支付，1不显示支付
      if (cardType === 0) {
        this.needPay = 0
      }
      if (cardType === 1) {
        this.needPay = 0
      }
      if (cardType === 2) {
        this.needPay = 1
      }
      if (cardType === 3) {
        this.needPay = 1
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
    },

    // 获取孩子
    async getChildList () {
      let res = await this.$api.child.childList()
      if (res.msg) return
      let arr = res
      if (arr.length > 0) {
        let age = this.$wxApi.getChildYears(arr[0].birthday)
        const child = {
          childId: arr[0].id,
          age,
          name: arr[0].name
        }
        this.vuexSetChildInfo(child)
        this.getChild(child.childId)
      }
    }
  },

  onLoad (options) {
    this.cardType = Number(options.cardType)
    this.SetYearCardStatus()
    this.getClass()
    this.getChildList()
    // 个人信息-剩余课时
    // let data = {
    //   page: 1
    // }
    // this.getCurrencyGoods(data)
  },

  onShow () {
    this.getUser()
    // if (this.cardInfo.cardTypeId) {
    //   this.cardTypeDetail()
    // }
    // if (!this.cardInfo.cardTypeId) {
    //   // this.cardTypeDetail()
    // }
    if (this.childInfo.childId) {
      // 不选择使用卡劵，不刷新孩子
      if (this.cardInfo.cardId !== -1) {
        this.getChild(this.childInfo.childId, this.cardInfo)
      }
    }
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
  width: 340rpx;
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
  /* position: relative; */
  display: flex;
  align-items: center;
  margin-top: 30rpx;
  width: 690rpx;
  height: 40rpx;
  box-sizing: border-box;
  padding-left: 30rpx;
}

.booked-dot {
  /* position: absolute;
  left: 30rpx;
  top: 16rpx; */
  display: block;
  width: 4rpx;
  height: 24rpx;
  border-radius: 4rpx;
  background-color: #ffcd76;
}
.booked-word {
  margin-left: 20rpx;
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

.pay-type4::after {
  border: none;
}

.pay-type4 {
  z-index: 4;
  position: absolute;
  right: 0rpx;;
  text-align: center;
  line-height: 80rpx;
  bottom: -40rpx;
  width: 346rpx;
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

/* 代币 */
.has-times {
  width: 690rpx;
  height: 100rpx;
  background-color: #fff;
  box-sizing: border-box;
  padding: 22rpx 30rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0,0,0,0.02);
  display: flex;
  align-items: center;
  margin-top: 30rpx;
}

.border-times {
  width: 4rpx;
  height: 24rpx;
  background-color: #ffcd76;
  border-radius: 4rpx;
  margin-right: 20rpx;
}

.times-text {
  font-size: 28rpx;
  color: #b2b2b2;
}

.lesson-times {
  font-size: 48rpx;
  color: #ffcd76;
  flex: auto;
  text-align: right;
  font-family: 'League Gothic';
}
</style>
