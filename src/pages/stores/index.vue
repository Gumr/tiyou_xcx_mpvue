<template>
  <div class="contain">
    <!-- <button id="phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" /> -->
    <!-- <label v-if="phone" for="phone" class="phone" /> -->
    <!-- <div class="store-images">
      <image mode='aspectFill' class="store-images-img" :src="store.covers && store.covers[0] || coverImg" />
      <p class="store-images-num">
        <span class="store-images-currentNum">1</span>/1
      </p>
    </div> -->

    <swiper :autoplay="autoplay" style="height:400rpx" :current="swiperIndex" 
      @change="swiperChange">
      <!-- 判断是否是视频 -->
      <!-- <div v-if="store.video">
        <swiper-item>
          <video v-if="store.video" id="myVideo" :src="store.video" controls="false"
           v-on:pause="videoPause" v-on:ended="videoEnd"
           show-play-btn="false" :show-fullscreen-btn="showFullScreenBtn" danmu-btn="false"></video>
          <div v-if="showVideo === 0" class="course-mask" @click="playVideo">
            <image v-if="store.cover"
              mode='aspectFill'
              class="course-images-mask"
              :src="store.cover ? store.cover : 'https://api.tiyou.techoiceness.com/v1/static/images/img_default.png'"/>
            <image v-else
              mode='aspectFill'
              class="course-images-mask"
              :src="store.cover ? store.cover : 'https://api.tiyou.techoiceness.com/v1/static/images/img_default.png'"/>
            <p class="course-images-duration">
            </p>
            <div class="course-duration-mask">
              <image mode='aspectFill'
                class="course-images-icon"
                src="../../static/icon/ic_play.png"
              />
            </div>
          </div>
        </swiper-item>
      </div> -->
      <!-- <div v-if="!store.video">
        <swiper-item>
          <image mode='aspectFill'
            class="course-images-img"
            :src="store.cover ? store.cover : 'https://api.tiyou.techoiceness.com/v1/static/images/img_default.png'"
          />
        </swiper-item>
      </div> -->
      <div>
        <div v-for="(item, index) in store.covers" :key="index">
          <swiper-item>
          <image mode='aspectFill'
            class="course-images-img"
            :src="item ? item : 'https://api.tiyou.techoiceness.com/v1/static/images/img_default.png'"
          />
          <p class="store-images-num">
            <span class="store-images-currentNum">{{ index + 1 }}</span>/{{ store.covers && store.covers.length }}
          </p>
          </swiper-item>
        </div>
      </div>
    </swiper>

    <p class="store-name">{{ store.name }}</p>
    <!-- <p v-if="判断是否有社群" class="store-community">进入社群</p> -->

    <div class="store-loaction" @click="toMap">
      <image mode='aspectFill' class="store-loaction-img" src="https://api.tiyou.techoiceness.com/v1/static/icon/ic_location.png" />
      <p class="store-loaction-word">{{ store.address }}</p>
      <image mode='aspectFill' class="store-loaction-arrive" src="../../static/icon/ic_right.png" />
    </div>

    <div class="store-phone" @click="makePhoneCall(store.phoneNo)">
      <image mode='aspectFill' class="store-phone-img" src="https://api.tiyou.techoiceness.com/v1/static/icon/ic_call.png" />
      <p class="store-phone-word">{{ store.phoneNo }}</p>
      <image mode='aspectFill' class="store-phone-arrive" src="../../static/icon/ic_right.png" />
    </div>

    <!-- 长租和自营显示排课 -->
    <div class="calendar" v-if="store.type === 1 || store.type === 3">
      <CalendarWeek
        :calendarClass="calendarClass"
        calendartype="classStore"
        @setDateByCalender="setDateByCalender"
        :dayList="dayList"
      />
    </div>

    <div v-if="store.type === 1 || store.type === 3">
      <div class="store-table" v-if="classList.length">
        <div class="course-item" v-for="(item, index) in classList" :key="index">
          <WcourseCard 
            :info="item"
            @toBooking="toBooking(item.classId, index)"
          />
        </div>
        <label for="phone" class="mask-label"></label>
      </div>

      <div v-else class="course-item-default">
        <image mode='aspectFill'
          class="default-img"
          src="https://api.tiyou.techoiceness.com/v1/static/images/no-data.png"
        />
      </div>
    </div>

    <div v-if="tipStatus === 4">
      <Wtoast 
        @closeTip="closeTip"
        @toBookingBuy="toBookingBuy"
        @toProtocel="toProtocel"
        :info="courseItem"
        :cardTimes="cardTimes"
      />
    </div>
  </div>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'
import moment from 'moment'
import CalendarWeek from '@/components/calendar/CalendarWeek'
import WcourseCard from '@/components/storeDetail/courseCard'
import Wtoast from '@/components/toBookingToast/toast'

export default {
  components: {
    CalendarWeek,
    WcourseCard,
    Wtoast
  },

  computed: {
    ...mapGetters('card', [
      'vuexGetCardInfo'
    ]),

    ...mapGetters('myLocation', [
      'vuexGetLocation'
    ]),

    // 获取数据
    cardInfo () {
      let cardInfo = this.vuexGetCardInfo
      return cardInfo
    }
  },

  data () {
    return {
      classList: [],
      store: {},
      dayList: [],
      lat: '',
      lon: '',
      coverImg: 'https://api.tiyou.techoiceness.com/v1/static/images/img_default.png',
      storeId: 1,
      cardList: [],
      tipStatus: 1,
      courseItem: {},
      cardPrice: '',
      courseIndex: 0,
      phone: 0,
      myLng: 0,
      myLat: 0,
      imgNum: 1,
      // 图片滑动参数
      swiperIndex: 0,
      autoplay: false,
      showVideo: 0,
      showFullScreenBtn: false,
      userInfo: {},
      cardTimes: 0
    }
  },

  methods: {
    ...mapActions('classCourse', [
      'vuexSetClassInfo'
    ]),

    ...mapActions('calendar', [
      'vuexSetCalendarList'
    ]),

    ...mapActions('card', [
      'vuexSetCardInfo'
    ]),

    swiperChange (e) {
      let index = e.mp.detail.current
      this.swiperIndex = index
    },

    playVideo () {
      this.videoContext = wx.createVideoContext('myVideo')
      this.showVideo = 1
      this.videoContext.play()
    },

    videoEnd () {
      this.showVideo = 0
    },

    videoPause () {
      this.showVideo = 0
    },

    // 网点详情
    async getStoreDetail (id) {
      let res = await this.$api.store.storeDetail(id)
      if (res.msg) return
      wx.setNavigationBarTitle({
        title: `${res.name}`
      })
      this.store = res
      this.lat = res.lat
      this.lon = res.lng
    },

    closeTip () {
      this.tipStatus = 1
    },

    toBooking (id, index) {
      const data = {
        classId: id
      }
      this.vuexSetClassInfo(data)
      // 测试无卡的情况
      this.courseIndex = index
      let topId = this.classList[index].topId
      this.courseItem = {
        price: this.classList[index].price
      }
      if (this.userInfo.isConvertToCurrency === 1 && this.cardTimes > 0) {
        this.tipStatus = 4
      } else {
        if (topId === 3) {
          wx.navigateTo({
            url: `../packageMe/topId3Booking/main`
          })
        } else {
          wx.navigateTo({
            url: `../booking/main`
          })
        }
      }
      // if (this.userInfo.isConvertToCurrency === 1) {
      //   wx.showModal({
      //     title: '提示',
      //     content: '是否将年卡转换为课时？',
      //     success: (res) => {
      //       if (res.confirm) {
      //         wx.navigateTo({
      //           url: `../booking/main`
      //         })
      //       } else if (res.cancel) {
      //         this.$wxApi.wxShowToast({
      //           title: '转换为课时后才可预约课程'
      //         })
      //       }
      //     }
      //   })
      // } else {
      //   wx.navigateTo({
      //     url: `../booking/main`
      //   })
      // }
    },

    setToken (data) {
      const { token = '', sessionKey = '', phoneNo } = data
      wx.setStorageSync('token', token)
      wx.setStorageSync('sessionKey', sessionKey)
      this.phone = !phoneNo
    },

    // 门店下课表
    async storeClassList (startTime, endTime) {
      let status = [3, 4, 5, 6, 7]
      let data = {
        storeId: this.storeId,
        now: startTime,
        twoDay: endTime,
        status
      }
      let res = await this.$api.class.getClassByOneDayV2(data)
      if (res.msg) return
      const classData = res.list
      this.classList = classData.map(item => {
        let obj = {
          startTime: moment(item.startTime).format('HH:mm'),
          endTime: moment(item.endTime).format('HH:mm'),
          bookedNum: item.bookedNumbers,
          maxMembers: item.maxMembers,
          minMembers: item.minMembers,
          courseId: item.course && item.course.id,
          classId: item.id,
          courseName: item.course && item.course.title,
          courseType: item.course && item.course.secondCategory.name,
          address: item.store && item.store.address,
          courseImg: item.course && item.course.cover,
          classStatus: item.bookedNumbers < item.maxMembers ? 0 : 1,
          storeName: item.store && item.store.name,
          price: (item.course && item.course.price / 100).toFixed(2),
          ageRange: item.ageRange,
          status: item.status,
          lesson: item.lesson / 10,
          topId: item.course && item.course.topCategoryId
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
    },

    // 获取日历需要的信息
    async getCalender () {
      const now = moment().format('YYYY-MM-DD')
      const twoWeek = moment().add(14, 'days').format('YYYY-MM-DD')
      // 遗留问题，换成门店
      const res = await this.$api.class.getCalendarStore(now, twoWeek, this.storeId)
      this.calendarClass = res
      this.dayList = this.$wxApi.getDayList(this.calendarClass)
      let courseIndex = this.$wxApi.getHaveCourse(res)
      // 当天有课
      this.calenDerIndex = courseIndex
      if (courseIndex === 0) {
        const now = moment().format('YYYY-MM-DD')
        const twoDay = moment().add(1, 'days').format('YYYY-MM-DD')
        this.storeClassList(now, twoDay)
      } else {
        let i = courseIndex + 1
        const indexn = moment().add(`${courseIndex}`, 'days').format('YYYY-MM-DD')
        const indext = moment().add(`${i}`, 'days').format('YYYY-MM-DD')
        this.storeClassList(indexn, indext)
      }
      this.vuexSetCalendarList(this.dayList)
    },

    // 确认升级-转换
    async toBookingBuy (data) {
      let { agreeStatus } = data
      if (!agreeStatus) {
        this.$wxApi.wxShowToast({
          title: '请同意协议'
        })
        return
      }
      // 1购买单课 - 直付,0 购买年卡 - 未付年卡
      let res = await this.$api.lesson.cardSetLesson()
      if (res.msg) return
      this.tipStatus = 1
      this.$wxApi.wxShowToast({
        title: '升级成功'
      })
      this.getUserInfo()
    },

    // 日历，点击日期
    setDateByCalender (options) {
      if (options.type === 'classStore') {
        const now = options.date
        const twoDay = moment(now).add(1, 'days').format('YYYY-MM-DD')
        this.storeClassList(now, twoDay)
      }
    },

    // 我的-全部卡劵
    async myCardList () {
      let res = await this.$api.card.myCardList()
      this.cardList = res.list.map((i) => ({
        ...i,
        deadline: this.$wxApi.getTime(i.deadline),
        myCardCode: i.cardType && i.cardType.code
      }))
      // 4 TY1004 试听卡 198 99 1次 1张 不需要 适用于试听活动大类；
      let times = 0
      let yearsCard = this.cardList.filter(i => (i.myCardCode === 'TY1002' || i.myCardCode === 'TY1001') && i.remainingTimes >= 1)
      if (yearsCard.length > 0) {
        yearsCard.forEach(i => {
          times += i.remainingTimes
        })
      }
      this.cardTimes = times
    },

    // 前往地图
    toMap () {
      if (!this.myLng || !this.myLat) {
        this.myLng = this.vuexGetLocation.lng
        this.myLat = this.vuexGetLocation.lat
      }
      wx.navigateTo({
        url: `../storeMap/main?lat=${this.lat}&lon=${this.lon}&myLng=${this.myLng}&myLat=${this.myLat}`
      })
    },

    // 拨打电话
    makePhoneCall (phone) {
      wx.makePhoneCall({
        phoneNumber: `${phone}`
      })
    },

    initState () {
      this.lat = ''
      this.lon = ''
      this.classList = []
      this.dayList = []
      this.cardList = []
      this.tipStatus = 1
      this.courseItem = {}
      this.cardList = ''
      this.courseIndex = 0
      this.phone = 0
      this.myLat = 0
      this.myLng = 0
      this.swiperIndex = 0
      this.autoplay = false
      this.showVideo = 0
      this.imgNum = 1
      this.userInfo = {}
      this.cardTimes = 0
    },

    // 个人信息
    async getUserInfo () {
      let res = await this.$api.my.profile()
      if (res.msg) {
        return
      }
      this.userInfo = res
      if (!res.phoneNo) {
        this.phone = 1
      }
    }
  },

  onUnload () {
    this.initState()
  },

  onLoad (options) {
    let { storeId, myLat, myLng } = options
    storeId = parseInt(storeId, 10)
    this.myLng = myLng
    this.myLat = myLat
    this.storeId = parseInt(storeId, 10)
    this.getUserInfo()
    this.getStoreDetail(storeId)
    // 获取日历需要的信息
    this.getCalender()
    this.myCardList()
    // 判断该用户是否有卡
    // this.myCardList()
    // this.getUserInfo()
    // 获取某天，某门店的课表
    // const now = moment().format('YYYY-MM-DD')
    // const twoDay = moment().add(1, 'days').format('YYYY-MM-DD')
    // this.storeClassList(now, twoDay)
    // 获取card类型
    // this.getCardType()
  }
}
</script>

<style scoped>
.contain {
  position: relative;
  padding-bottom: 100rpx;
}

video {
  width: 750rpx;
  height: 400rpx;
}

.store-images {
  position: relative;
  width: 750rpx;
  height: 400rpx;
}
.store-images-img {
  width: 750rpx;
  height: 400rpx;
}
.store-images-num {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  width: 80rpx;
  height: 42rpx;
  opacity: 0.2;
  border-radius: 30rpx;
  background-color: #000000;
  font-size: 22rpx;
  font-family: 'League Gothic';
  letter-spacing: 0.2rpx;
  text-align: center;
  color: #ffffff;
}
.store-images-currentNum {
  /* width: 17px;
  height: 21px; */
  font-size: 34rpx;
}

.store-name {
  margin-top: 30rpx;
  margin-left: 30rpx;
  /* width: 240rpx; */
  height: 48rpx;
  font-size: 34rpx;
  color: #232323;
}
.store-community {
  position: absolute;
  right: 30rpx;
  top: 434rpx;
  line-height: 40rpx;
  border-radius: 6rpx;
  box-shadow: 0 16rpx 16rpx -8rpx rgba(0, 0, 0, 0.05);
  background-color: #ffcd76;
  width: 120rpx;
  height: 40rpx;
  font-size: 22rpx;
  letter-spacing: 0.2rpx;
  text-align: center;
  color: #ffffff;
}

.store-loaction {
  display: flex;
  align-items: center;
  width: 750rpx;
  height: 140rpx;
  background-color: #ffffff;
}
.store-loaction image {
  width: 48rpx;
  height: 48rpx;
}
.store-loaction-img {
  margin: 46rpx 20rpx 46rpx 30rpx;
}
.store-loaction-word {
  margin: 30rpx 0;
  width: 480rpx;
  /* height: 80rpx; */
  font-size: 28rpx;
  color: #888888;
}
.store-loaction-arrive {
  margin: 46rpx 30rpx 46rpx 94rpx;
}

.store-phone {
  display: flex;
  width: 750rpx;
  height: 100rpx;
  background-color: #ffffff;
  margin-bottom: 20rpx;
}
.store-phone image {
  width: 48rpx;
  height: 48rpx;
}
.store-phone-img {
  margin: 26rpx 20rpx 26rpx 30rpx;
}
.store-phone-word {
  margin: 30rpx 0;
  width: 480rpx;
  height: 40rpx;
  font-size: 28rpx;
  color: #888888;
}
.store-phone-arrive {
  margin: 26rpx 30rpx 26rpx 94rpx;
}

.calender {
  text-align: center;
}

.course-item {
  /* position: relative;
  margin: 30rpx 30rpx 0;
  width: 690rpx;
  height: 240rpx; */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.course-time {
  position: absolute;
  z-index: 4;
  top: 10rpx;
  left: 420rpx;
  /* width: 112rpx; */
  height: 42rpx;
  font-family: 'League Gothic';
  font-size: 34rpx;
  color: #c8d2dc;
}
.course-date {
  position: absolute;
  z-index: 4;
  top: 10rpx;
  right: 30rpx;
  width: 44rpx;
  height: 42rpx;
  font-family: 'League Gothic';
  font-size: 34rpx;
  text-align: right;
}
.course-dateYellow {
  color: #ffcd76;
}
.course-dateGray {
  color: #c8d2dc;
}

.course-content {
  position: absolute;
  z-index: 3;
  right: 0;
  bottom: 0;
  width: 400rpx;
  height: 200rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
}
.course-content-word {
  margin-top: 30rpx;
  margin-left: 30rpx;
}
.course-content-name {
  width: 274rpx;
  height: 48rpx;
  font-size: 34rpx;
  color: #232323;
}
.course-content-type {
  width: 274rpx;
  height: 32rpx;
  font-size: 22rpx;
  color: #b2b2b2;
}

.course-img {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 400rpx;
  height: 240rpx;
}
.img {
  width: 400rpx;
  height: 240rpx;
}

.course-item-btn {
  position: absolute;
  right: 22rpx;
  bottom: 18rpx;
  width: 120rpx;
  height: 60rpx;
  border-radius: 30rpx;
}
.course-item-btnYellow {
  background-color: #ffcd76;
}
.course-item-btnGray {
  background-color: #eeeeee;
}
.course-item-btn-word {
  margin-top: 10rpx;
  margin-left: 4rpx;
  width: 112rpx;
  height: 40rpx;
  font-size: 28rpx;
  text-align: center;
  color: #ffffff;
}

.course-item-default {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.default-img {
  width: 500rpx;
  height: 300rpx;
  margin-top: 60rpx;
}

.course-mask {
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  width: 750rpx;
  height: 400rpx;
}
.course-images-mask {
  width: 750rpx;
  height: 400rpx;
}
.course-images-duration {
  position: absolute;
  bottom: 60rpx;
  left: 282rpx;
  width: 200rpx;
  height: 60rpx;
  opacity: 0.5;
  border-radius: 30rpx;
  box-shadow: 0 16rpx 16rpx -16rpx #ffdea5;
  background-color: #ffcd76;
}

.course-duration-mask {
  position: absolute;
  bottom: 60rpx;
  left: 282rpx;
  width: 200rpx;
  height: 60rpx;
  border-radius: 30rpx;
  z-index: 2;
}

.course-images-icon {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 48rpx;
  height: 48rpx;
}
.course-images-duration-time {
  position: absolute;
  bottom: 68rpx;
  left: 352rpx;
  width: 100rpx;
  height: 42rpx;
  font-family: 'League Gothic';
  font-size: 34rpx;
  letter-spacing: 0.2rpx;
  text-align: center;
  color: #ffffff;
  display: block;
}
.course-images-img {
  width: 750rpx;
  height: 400rpx;
}

.phone {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 10000;
}
</style>
