<template>
  <!-- 门店活动着陆页 -->
  <div class="page">
    <button id="phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" />

    <div class="bg-img-box">
      <div class="img-a-box">
        <image mode='widthFix'
          class="bg-a"
          lazy-load="true"
          src="https://api.tiyou.techoiceness.com/v1/static/images/bg_a.jpg"
        />
        <div class="logo-box">
          <image mode='widthFix'
            class="logo"
            lazy-load="true"
            src="../../../static/icon/logo_tiyou.png"
          />
          <image mode='aspectFill'
            class="logo-x"
            lazy-load="true"
            src="../../../static/icon/logo_x.png"
          />
          <image mode='aspectFit'
            class="logo2"
            @load="imageLoad"
            lazy-load="true"
            :src="info.logo"
            :style="{ height: imgHeight + 'rpx', width: imgWidth + 'rpx' }"
          />
        </div>
      </div>
      <image mode='widthFix'
        class="bg-b"
        lazy-load="true"
        src="https://api.tiyou.techoiceness.com/v1/static/images/bg_b.jpg"
      />
      <div class="img-box-c">
        <image mode='widthFix'
          class="bg-c"
          lazy-load="true"
          src="https://api.tiyou.techoiceness.com/v1/static/images/bg_c.jpg"
        />
        <div class="content-text">
          <span>为3-8岁孩子提供</span>
          <span>专业有趣的儿童科学实验课</span>
        </div>
        <!-- 轮播 -->
        <div class="img-swiper">
          <swiper
            interval="3000"
            duration="500"
            autoplay="true"
            class="swiper-box"
            :previous-margin="previousMargin"
            :next-margin="nextMargin"
            :current="swiperIndex"
            @change="swiperChange"
            circular="true"
          >
            <div class="swiper-div">
              <block>
                <swiper-item
                  v-for="(item6, index6) in info.descs" :key="index6"
                   class="swiper-tiem"
                  :style="{ height: 340 + 'rpx', width: 630 + 'rpx' }"
                >
                <div
                  :style="{ height: 340 + 'rpx', width: 630 + 'rpx' }"
                >
                  <image
                    :src="item6.cover"
                    :class="[ swiperIndex === index6 ? 'slide-image': 'set-slide-image' ]"
                    mode='aspectFill'
                  />
                </div>
                </swiper-item>
              </block>
            </div>
          </swiper>
          <div class="indicator">
            <span v-for="(item7, index7) in info.descs" :key="index7" 
              :class="[ swiperIndex === index7 ? 'inficator-item' : 'set-inficator-item']">
            </span>
          </div>
        </div>

        <!-- 课程信息 -->
        <div class="course-info">
          <image mode='aspectFill'
            class="icon_kecheng"
            lazy-load="true"
            src="../../../static/icon/icon_kecheng.png"
          />
          <div class="addres" v-if="info.store">
            <image mode='aspectFill'
              class="icon_didian"
              lazy-load="true"
              src="../../../static/icon/icon_didian.png"
            />
            <div class="info-addres">
              {{ info.store && info.store.address }}
            </div>
          </div>
          <!-- 课程 -->
          <div>
            <scroll-view scroll-y class="scroll">
              <div v-for="(item8, index8) in classList" :key="index8" class="info-item">
                <image mode='aspectFill'
                  class="info-cover"
                  lazy-load="true"
                  :src="item8.courseImg"
                />
                <div class="info-right">
                  <div class="info-r">
                    {{ item8.ageRangeStatus }}
                  </div>
                  <div class="course-type">
                    {{ item8.courseName }}
                  </div>
                  <div class="time-box">
                    <span class="info-border"></span>
                    <span>{{ item8.date }}</span>
                  </div>
                  <div class="time-box">
                    <span class="info-border"></span>
                    <span>{{ item8.startTime }} - {{ item8.endTime }}</span>
                  </div>
                  <div class="right-b">
                     <span class="info-has-number">
                       <span>满人：</span>
                       <span class="set-info-has">{{ item8.maxMembers }}</span>
                     </span>
                     <span class="info-has-border"> / </span>
                     <span class="info-has-number">
                       剩余:
                       <span class="set-info-has">{{ item8.maxMembers - item8.bookedNum }}</span>
                     </span>
                  </div>
                </div>
              </div>
            </scroll-view>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="buy-info-btn">
      <div class="agree-click" @click="agree">
      </div>
      <div class="btn-top">
        <image mode='aspectFill'
          class="selected-img"
          :src="agreeStatus ? '../../../static/icon/ic_selected.png' : '../../../static/icon/ic_select.png'"
        />
        <span class="agree">同意</span>
        <span class="description" @click="toProtocel">《体游科学实验室卡券使用协议》</span>
      </div>
      <div class="b-btn">
        <div class="btn-buy-box" @click="buyCard">
          <image mode='aspectFill'
            class="btn-buy"
            lazy-load="true"
            src="https://api.tiyou.techoiceness.com/v1/static/images/btn_buy_nor.png"
          />
          <div class="btn-buy-text" v-if="type === 1">
            {{ text }}元购买
          </div>
          <div class="btn-buy-text" v-if="type === 2">
            兑换
          </div>
          <div class="btn-buy-text" v-if="type === 0">
            活动已结束
          </div>
        </div>
        <div class="btn-buy-box" @click="toYuYue">
          <image mode='aspectFill'
            class="btn-buy-r"
            lazy-load="true"
            src="https://api.tiyou.techoiceness.com/v1/static/images/btn_yuyue_nor.png"
          />
          <div class="btn-buy-text-r">
            预约
          </div>
        </div>
      </div>
    </div>

    <!-- 客服 -->
    <label class="service-box" for="service">
      <image mode='aspectFill'
        class="service-img"
        src="https://api.tiyou.techoiceness.com/v1/static/images/btn_kefu.png"
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
import moment from 'moment'
import CalendarWeek from '@/components/calendar/branchCalendar'
import WcourseCard from '@/components/branch/courseCard'
export default {
  components: {
    CalendarWeek,
    WcourseCard
  },

  data () {
    return {
      // 同意状态
      agreeStatus: 1,
      scene: '',
      type: 2,
      info: {},
      classList: [],
      phone: 0,
      cardTypeId: '',
      text: '',
      organizationId: '',
      storeId: '',
      audition: '',
      dayList: [],
      cvoerArr: [],
      // 1 上架 2 下架
      status: 1,
      swiperIndex: 0,
      imgHeight: 142,
      imgWidth: 60,
      previousMargin: 60,
      nextMargin: 30,
      screenWidth: 750,
      auditionList: []
    }
  },

  methods: {
    ...mapActions('calendar', [
      'vuexSetCalendarList'
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

    // 轮播
    swiperChange (e) {
      this.swiperIndex = e.mp.detail.current
      // if (this.info.descs.length - 1 < this.swiperIndex) {
      //   this.swiperIndex = 0
      // }
    },

    // to 兑换页
    toSendCard () {
      if (this.status === 2) {
        wx.showToast({
          title: '活动已结束',
          icon: 'none'
        })
        return
      }
      if (!this.agreeStatus) {
        wx.showToast({
          title: '请同意年卡使用协议',
          icon: 'none'
        })
        return
      }
      wx.navigateTo({
        url: `../sendCard/main?scene=${this.scene}`
      })
    },

    // to 预约-试听课表
    async toYuYue () {
      // 如果是体验卡或者年卡
      let code = this.info.cardType && this.info.cardType.code
      // 卡包没有试听卡
      // 如果是试听活动
      if (code === 'TY1001' || code === 'TY1002' || code === 'TY1003') {
        wx.switchTab({
          url: `../../course/main`
        })
        return
      }
      let res = await this.$api.card.myCardList()
      if (res.msg) return
      this.cardList = res.list.map((i) => ({
        ...i,
        deadline: this.$wxApi.getTime(i.deadline),
        myCardCode: i.cardType && i.cardType.code
      }))
      // 试听卡
      this.auditionList = this.cardList.filter(i => i.cardType && i.cardType.topCategories && i.cardType.topCategories[0] && i.cardType.topCategories[0].id === 3)
      if (!this.auditionList.length) {
        // let cardData = {
        //   branchId: this.info.branchId,
        //   organizationId: this.info.organizationId,
        //   storeId: this.info.cardType && this.info.cardType.stores
        // }
        // this.vuexSetAuditionInfo(cardData)
        if (this.type === 1) {
          wx.showToast({
            title: '请购买试听卡',
            icon: 'none'
          })
          return
        }
        if (this.type === 2) {
          wx.showToast({
            title: '请兑换试听卡',
            icon: 'none'
          })
        }
      } else {
        let info = this.auditionList[0]
        let cardData = {
          branchId: info.branchId,
          organizationId: info.organizationId,
          storeId: info.cardType && info.cardType.stores
        }
        this.vuexSetAuditionInfo(cardData)
        wx.navigateTo({
          url: `../auditionCourse/main`
        })
      }
    },

    // 购买卡
    async buyCard () {
      if (this.status === 2) {
        wx.showToast({
          title: '活动已结束',
          icon: 'none'
        })
        return
      }
      if (this.type === 0) {
        wx.showToast({
          title: '活动已结束',
          icon: 'none'
        })
        return
      }
      if (this.type === 2) {
        this.toSendCard()
        return
      }
      if (!this.agreeStatus) {
        wx.showToast({
          title: '请同意使用协议',
          icon: 'none'
        })
        return
      }
      let _token = wx.getStorageSync('token')
      if (!_token) {
        this.$wxLogin.wxLogin(this)
        // wx.showToast({
        //   title: '重新登陆',
        //   icon: 'none'
        // })
        return
      }
      let r = await this.$api.my.profile()
      if (r.msg) return
      if (!r.phoneNo) {
        this.phone = 1
        // wx.showToast({
        //   title: '请授权手机号后购买',
        //   icon: 'none'
        // })
        return
      }
      let data = {
        cardTypeId: this.cardTypeId,
        landingPageId: this.scene
      }
      let res = await this.$api.card.buyCard(data)
      if (res.msg) return
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
              if (resSuc.msg) return
              wx.showToast({
                title: '支付成功'
              })
              // 年卡，体验卡挑转首页
              if ((resSuc.cardType && resSuc.cardType.code === 'TY1001') || (resSuc.cardType && resSuc.cardType.code === 'TY1002') || (resSuc.cardType && resSuc.cardType.code === 'TY1003')) {
                wx.switchTab({
                  url: `../../course/main`
                })
              } else {
                // wx.navigateTo({
                //   url: `../auditionCardDetail/main?cardId=${resSuc.id}`
                // })
                let type = 7
                this.vuexSetAuditionInfo({})
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
              }
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
    },

    // 预览图片
    lookImg (index) {
      this.$wxApi.wxLookImg({
        files: this.info.posters,
        index
      })
    },

    // 预览图片
    coverLookImg (index) {
      this.$wxApi.wxLookImg({
        files: this.cvoerArr,
        index
      })
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
        let data = {
          id: this.scene
        }
        this.getUser()
        this.branchDetail(data)
      }
    },

    // 活动详情
    async branchDetail (data) {
      let res = await this.$api.branch.branchDetail(data)
      if (res.msg) {
        this.type = 0
        return
      }
      this.info = res
      this.status = res.status
      // 1 购买 2 兑换
      this.type = res.type
      if (res.storeId !== 0) {
        this.storeId = res.storeId
      }
      // 购买
      if (res.type === 1) {
        this.cardTypeId = res.cardType && res.cardType.id
        // 使用活动价格
        // this.text = res.cardType.price / 100
        this.text = res.price / 100
        if (res.descs && res.descs.length) {
          for (let i = 0; i < res.descs.length; i++) {
            this.cvoerArr.push(res.descs[i].cover)
          }
        }
        // i.remainingTimes > 0 && i.cardType.topCategories[0] && i.cardType.topCategories[0].id === 3
        if (res.cardType && res.cardType.topCategories && res.cardType.topCategories[0] && res.cardType.topCategories[0].id === 3) {
          this.audition = 3
        }
      }
      if (res.type === 2) {
        this.audition = 3
      }
      // this.getCalender()
      const now = moment().format('YYYY-MM-DD')
      const twoDay = moment().add(7, 'days').format('YYYY-MM-DD')
      this.getClassList(now, twoDay)
      if (this.type === 1) {
        wx.setNavigationBarTitle({
          title: '体游科学卡'
        })
      } else {
        wx.setNavigationBarTitle({
          title: '兑换介绍'
        })
      }
    },

    imageLoad (e) {
      let oWidth = e.mp.detail.width
      let oHeight = e.mp.detail.height
      this.imgHeight = 60
      this.imgWidth = oWidth / (oHeight / 60)
    },

    // 日历，点击日期
    // setDateByCalender (options) {
    //   if (this.status === 2) {
    //     wx.showToast({
    //       title: '活动已结束',
    //       icon: 'none'
    //     })
    //   }
    //   const now = options.date
    //   this.calenDerIndex = options.index
    //   const twoDay = moment(now).add(7, 'days').format('YYYY-MM-DD')
    //   this.getClassList(now, twoDay)
    // },

    // 获取7天日历
    // async getCalender () {
    //   const now = moment().format('YYYY-MM-DD')
    //   const twoWeek = moment().add(7, 'days').format('YYYY-MM-DD')
    //   // 一级分类
    //   let data = {
    //     now,
    //     twoWeek,
    //     audition: this.audition,
    //     organizationId: this.organizationId,
    //     storeId: this.storeId
    //   }
    //   const res = await this.$api.class.getCalendarV2(data)
    //   if (res.msg) return
    //   // this.calendarClass = [ ...this.$wxApi.getDayList(res) ]
    //   let dayList = [ ...this.$wxApi.getBranchDayList(res) ]
    //   this.dayList = dayList
    //   let courseIndex = this.$wxApi.getHaveCourse(res)
    //   if (courseIndex === 0) {
    //     const n = moment().format('YYYY-MM-DD')
    //     const t = moment().add(1, 'days').format('YYYY-MM-DD')
    //     this.getClassList(n, t)
    //   } else {
    //     let i = courseIndex + 1
    //     const indexn = moment().add(`${courseIndex}`, 'days').format('YYYY-MM-DD')
    //     const indext = moment().add(`${i}`, 'days').format('YYYY-MM-DD')
    //     this.getClassList(indexn, indext)
    //   }
    //   this.vuexSetCalendarList(dayList)
    // },

    // 获取某天课表
    async getClassList (now, twoDay) {
      // 课表状态 1:已取消 2:未上线 3:已成团 4:未成团 5:已完成
      // const status = [3, 4]
      const status = [3, 4, 5, 6, 7]
      // this.classList = []
      let data = {
        now,
        twoDay,
        status,
        audition: this.audition,
        organizationId: this.organizationId,
        storeId: this.storeId
      }
      const res = await this.$api.class.getClassByOneDayV2(data)
      if (res.msg) return
      // const classData = res.list
      this.classList = res.list.map(item => {
        let obj = {
          startTime: moment(item.startTime).format('HH:mm'),
          endTime: moment(item.endTime).format('HH:mm'),
          date: this.$wxApi.bgGetTime(item.date),
          bookedNum: item.bookedNumbers,
          maxMembers: item.maxMembers,
          minMembers: item.minMembers,
          courseId: item.courseId,
          ageRangeStatus: !item.ageRangeId ? '少儿' : `${item.ageRange && item.ageRange.min}-${item.ageRange && item.ageRange.max}岁`,
          courseName: item.course && item.course.title,
          courseType: item.course && item.course.secondCategory.name,
          address: item.store && item.store.address,
          courseImg: item.course && item.course.cover,
          storeName: item.store && item.store.name,
          classStatus: item.bookedNumbers < item.maxMembers ? 0 : 1,
          ageRange: item.ageRange
        }
        if (item.status === 3 || item.status === 4) {
          return obj
        } else if (item.status === 1 || item.status === 6) {
          obj.classStatus = 1
          obj.bookedNum = obj.maxMembers
          return obj
        } else {
          obj.classStatus = 1
          return obj
        }
      })
      if (res.list.length <= 0) {
        this.classList = []
      }
    },

    // 我的卡劵
    async myCardList () {
      let res = await this.$api.card.myCardList()
      if (res.msg) return
      this.cardList = res.list.map((i) => ({
        ...i,
        deadline: this.$wxApi.getTime(i.deadline),
        myCardCode: i.cardType && i.cardType.code
      }))
      // 试听卡
      this.auditionList = this.cardList.filter(i => i.cardType && i.cardType.topCategories && i.cardType.topCategories[0] && i.cardType.topCategories[0].id === 3)
    },

    // 个人信息
    async getUser () {
      let res = await this.$api.my.profile()
      if (res.msg) return
      if (!res.phoneNo) {
        this.phone = 1
      }
    },

    initState () {
      this.agreeStatus = 1
      this.type = 2
      this.info = {}
      this.classList = []
      this.cardTypeId = ''
      this.text = ''
      this.organizationId = ''
      this.storeId = ''
      this.audition = ''
      this.dayList = []
      this.cvoerArr = []
      this.status = 1
      this.swiperIndex = 0
      this.auditionList = []
    }
  },

  onUnload () {
    this.initState()
  },

  onLoad (options) {
    // 1 购买 2 兑换
    let { scene = 40 } = options
    this.scene = parseInt(scene, 10)
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          let _token = wx.getStorageSync('token')
          if (!_token) {
            this.$wxLogin.wxLogin(this)
          } else {
            let data = {
              id: scene
            }
            this.getUser()
            this.branchDetail(data)
            // this.myCardList()
          }
        } else {
          wx.redirectTo({
            url: `../../login/main?scene=${scene}&pageType=14`
          })
        }
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        this.screenWidth = res.windowWidth * 2
        this.nextMargin = 50 + 'rpx'
        this.previousMargin = 50 + 'rpx'
      }
    })
  },

  onShow () {
    if (this.dayList.length) {
      this.vuexSetCalendarList(this.dayList)
    }
  }
}
</script>

<style scoped>
.page {
  padding-bottom: 800rpx;
  background-color: #FCE3B1;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
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

.images-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 30rpx;
}

.images {
  width: 100%;
  padding: 0;
  margin: 0;
}

.agree-click {
  width: 50rpx;
  height: 50rpx;
  top: 0;
  left: 0;
  position: absolute;
  z-index: 1001;
}

.selected-img {
  width: 32rpx;
  height: 32rpx;
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
  color: #FA7D1E;
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

.set-btn {
  width: 690rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  background-color: #dfe6ed;
  /* background-color: #eee; */
  margin-top: 10rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
}

.card-price {
  font-size: 34rpx;
  font-family: 'League Gothic';
  font-weight: normal;
}

.service-box {
  position: fixed;
  z-index: 1002;
  right: 40rpx;
  bottom: 168rpx;
  width: 94rpx;
  height: 94rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* box-shadow: 0 16rpx 16rpx -8rpx rgba(0, 0, 0, 0.05); */
}

.service-img {
  width: 94rpx;
  height: 94rpx;
}

/* 购买 */
.scroll-box {
  width: 690rpx;
  height: 460rpx;
  white-space: nowrap;
  margin-bottom: 30rpx;
  margin-top: 30rpx;
  margin-left: 30rpx;
}

.content-box {
  /* display: flex;  */
  /* width: 300rpx; */
  height: 454rpx;
  display: inline-block;
}

.content {
  width: 330rpx;
  display: flex;
  flex-direction: column;
  margin-right: 30rpx;
  box-sizing: border-box;
  padding-bottom: 30rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #fff;
}

.content-image {
  width: 330rpx;
  height: 240rpx;
}

.content-title {
  padding: 30rpx 30rpx 10rpx 30rpx;
  font-size: 34rpx;
  color: #232323;
  overflow: hidden;
  font-weight: 500;
}

.content-desc-text {
  box-sizing: border-box;
  padding: 0 30rpx 30rpx 30rpx;
  font-size: 22rpx;
  color: #b2b2b2;
  width: 330rpx;
  height: 96rpx;
  overflow: hidden;
  white-space: pre-wrap;
}

.course-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.phone {
  position: fixed;
  width: 100%;
  height: 100rpx;
  bottom: 68rpx;
  z-index: 10000;
}

.course-item-default {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.default-img {
  width: 500rpx;
  height: 300rpx;
  margin-top: 100rpx;
}

.course-time {
  margin-bottom: 30rpx;
  font-weight: 500;
  margin-left: 30rpx;
  font-size: 36rpx;
}

.swiper-box {
  width: 750rpx;
  height: 360rpx;
}

.swiper-tiem {
  width: 630rpx;
  height: 360rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20rpx;
  overflow: hidden;
}

.slide-image {
  width: 630rpx;
  height: 360rpx;
  border-radius: 20rpx;
}

.set-slide-image {
  /* height: 320rpx;
  width: 630rpx;
  position: absolute;
  top: 20rpx;
  border-radius: 20rpx;
  transition: all .5s; */
  width: 630rpx;
  height: 360rpx;
  border-radius: 20rpx;
}

.indicator {
  /* width: 750rpx; */
  width: 100%;
  height: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40rpx;
}

.set-inficator-item {
  margin-left: 15rpx;
  margin-right: 15rpx;
  width: 12rpx;
  height: 12rpx;
  background-color: #FA7700;
  border-radius: 50%;
  opacity: .3;
}
.inficator-item {
  margin-left: 15rpx;
  margin-right: 15rpx;
  width: 12rpx;
  height: 12rpx;
  background-color: #FA7700;
  border-radius: 50%;
}

.swiper-div {
  /* width: 750rpx; */
  /* width: 100%; */
  width: 630rpx;
  height: 360rpx;
}

.bg-img-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bg-a {
  /* width: 750rpx; */
  width: 100%;
  height: 1014rpx;
}

.bg-b {
  /* width: 750rpx; */
  width: 100%;
  height: 1378rpx;
}

.bg-c {
  width: 100%;
  height: 2168rpx;
}

.img-box-c {
  position: relative;
  padding: 0;
  margin: 0;
  /* width: 750rpx; */
  width: 100%;
  height: 2168rpx;
}

.img-swiper {
  position: absolute;
  bottom: 750rpx;
}

.content-text {
  position: absolute;
  left: 195rpx;
  right: 0;
  bottom: 1180rpx;
  width: 360rpx;
  text-align: center;
  font-size: 30rpx;
  color: #4d4d4d;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.course-info {
  width: 690rpx;
  height: 925rpx;
  box-sizing: border-box;
  padding: 30rpx;
  border-radius: 20rpx;
  bottom: 30rpx;
  background-color: #fff;
  margin-left: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: -600rpx;
}

.icon_kecheng {
  width: 214rpx;
  height: 34rpx;
  margin-top: 10rpx;
  margin-bottom: 30rpx;
}

.icon_didian {
  width: 40rpx;
  height: 32rpx;
  margin-right: 10rpx;
}

.addres {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  width: 630rpx;
}

.info-addres {
  font-size: 30rpx;
  color: #333;
}

.info-item {
  width: 630rpx;
  height: 170rpx;
  margin-bottom: 30rpx;
  border-radius: 10rpx;
  overflow: hidden;
  display: flex;
}

.info-cover {
  width: 240rpx;
  height: 170rpx;
}

.scroll {
  width: 630rpx;
  height: 640rpx;
}


.course-type {
  margin-bottom: 10rpx;
  font-size: 36rpx;
  color: #333;
}

.info-right {
  width: 390rpx;
  height: 170rpx;
  box-sizing: border-box;
  padding: 23rpx 23rpx 16rpx 30rpx;
  background-color: #FCF5E8;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.time-box {
  display: flex;
  margin-bottom: 5rpx;
  font-size: 18rpx;
  color: #666;
  display: flex;
  align-items: center;
}

.info-border {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background-color: #ffcd76;
  margin-right: 5rpx;
}

.right-b {
  flex: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 16rpx;
  color: #666;
  line-height: 24rpx;
}

.set-info-has {
  font-size: 24rpx;
  color: #288DFA;
}

.info-has-border {
  margin-left: 5rpx;
  margin-right: 5rpx;
}

.info-r {
  position: absolute;
  right: 0;
  top: 0;
  width: 110rpx;
  height: 30rpx;
  border-radius: 0 0 0 20rpx;
  background-color: #f9a12a;
  font-size: 18rpx;
  line-height: 30rpx;
  color: #fff;
  text-align: center;
}

.buy-info-btn {
  /* width: 750rpx; */
  width: 100%;
  height: 160rpx;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 10rpx 22rpx;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9800;
  background-color: #fff;
}


.b-btn {
  display: flex;
  /* align-items: center; */
  margin-top: 10rpx;
}

.btn-buy {
  width: 386rpx;
  height: 98rpx;
}

.btn-buy-box {
  position: relative;
}

.btn-buy-text {
  position: absolute;
  top: -5rpx;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  line-height: 98rpx;
  font-size: 36rpx;
  font-size: 500;
  color: #fff;
}

.btn-buy-r {
  width: 316rpx;
  height: 98rpx;
}

.btn-buy-text-r {
  position: absolute;
  top: -5rpx;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  line-height: 98rpx;
  font-size: 36rpx;
  font-size: 500;
  color: #FA7D1E;
}

.img-a-box {
  position: relative;
  margin: 0;
  padding: 0;
  left: 0;
  right: 0;
  /* width: 750rpx; */
  width: 100%;
  height: 1014rpx;
}

.logo-box {
  position: absolute;
  top: 30rpx;
  left: 30rpx;
  right: 0;
  display: flex;
  align-items: center;
}

.logo {
  width: 142rpx;
  height: 60rpx;
}

.logo-x {
  width: 14rpx;
  height: 14rpx;
  margin-left: 30rpx;
  margin-right: 30rpx;
}

.logo2 {
  width: 142rpx;
  height: 60rpx;
}
</style>