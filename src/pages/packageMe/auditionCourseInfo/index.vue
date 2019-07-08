<template>
  <div class="contain">
    <button id="phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" />

    <swiper :autoplay="autoplay" style="height:400rpx" :current="swiperIndex" @change="swiperChange">
      <!-- 判断是否是视频 -->
      <div v-if="courseItem.video">
        <swiper-item>
          <!-- v-show="false" -->
          <video v-if="courseItem.video" id="myVideo" :src="courseItem.video" controls="false"
           v-on:pause="videoPause" v-on:ended="videoEnd"
           show-play-btn="false" :show-fullscreen-btn="showFullScreenBtn" danmu-btn="false"></video>
          <div v-if="showVideo === 0" class="course-mask" @click="playVideo">
            <image v-if="courseItem.cover" mode='aspectFill' class="course-images-mask" :src="courseItem.cover ? courseItem.cover : 'https://api.tiyou.techoiceness.com/v1/static/images/img_default.png'"/>
            <image v-else mode='aspectFill' class="course-images-mask" :src="courseItem.cover ? courseItem.cover : 'https://api.tiyou.techoiceness.com/v1/static/images/img_default.png'"/>
            <!-- <p class="course-images-duration"></p>
            <image mode='aspectFill' class="course-images-icon" src="../../static/icon/ic_play.png" /> -->
            <!-- <span class="course-images-duration-time">01:30</span> -->
            <p class="course-images-duration">
            </p>
            <div class="course-duration-mask">
              <image mode='aspectFill'
                class="course-images-icon"
                src="../../../static/icon/ic_play.png"
              />
            </div>
          </div>
        </swiper-item>
      </div>
      <div v-if="!courseItem.video">
        <swiper-item>
          <image mode='aspectFill'
            class="course-images-img"
            :src="courseItem.cover ? courseItem.cover : 'https://api.tiyou.techoiceness.com/v1/static/images/img_default.png'"
          />
        </swiper-item>
      </div>
      <div v-if="courseItem.images" >
        <div v-for="(item, index) in courseItem.images" :key="index">
          <swiper-item>
          <image mode='aspectFill'
            class="course-images-img"
            :src="item ? item : 'https://api.tiyou.techoiceness.com/v1/static/images/img_default.png'"
          />
          </swiper-item>
        </div>
      </div>
    </swiper>

    <div class="course-images-tip">
      <p class="course-images-bg"></p>
      <p class="course-images-num">
        <span class="course-images-currentNum">{{ swiperIndex + 1 }}</span>/{{imgNum}}
      </p>
    </div>

    <div class="course-info">
      <p class="course-info-desc">
        <span class="course-info-desc-name">{{ courseItem.name }}</span>
        <span>{{ courseItem.type }}</span>
      </p>
      <div class="course-info-price">
        <view class="course-info-priPrice">¥ {{ originPrice }}</view>
        <span class="course-info-nowPrice">¥ {{ price }}</span>
        <span :style="{ width: borderWidth + 'px' }"
          class="course-info-price-line">
        </span>
      </div>
    </div>

    <div class="title">
      <div class="titie-item" @click="changeTitle(1)">
        <p :class="titleStatus === 1 ? 'title-p' : 'title-p-none'">预约课程</p>
        <span :class="['title-span', titleStatus === 1 ? 'title-span-have' : 'title-span-none']"></span>
      </div>
      <div class="titie-item" @click="changeTitle(2)">
        <p :class="titleStatus === 2 ? 'title-p' : 'title-p-none'">课程介绍</p>
        <span :class="['title-span', titleStatus === 2 ? 'title-span-have' : 'title-span-none']"></span>
      </div>
      <!-- <div class="titie-item" @click="changeTitle(3)">
        <p :class="titleStatus === 3 ? 'title-p' : 'title-p-none'">课程点评</p>
        <span :class="['title-span', titleStatus === 3 ? 'title-span-have' : 'title-span-none']"></span>
      </div> -->
    </div>

    <div v-if="titleStatus === 1" class="class">

      <div class="calender">
        <CalendarWeek
          :calendarClass="calendarClass"
          :dayList="dayList"
          calendartype="classCourse"
          @setDateByCalender="setDateByCalender"
        />
      </div>

      <!-- <div v-if="classList" class="course-item">
        <image mode='aspectFill' class="course-item-img" src="https://api.tiyou.techoiceness.com/v1/static/images/no-data.png"/>
      </div> -->

      <div class="table" v-if="classList.length">
        <div v-for="(item, index) in classList" :key="index" class="table-item">
          <span v-if="item.classStatus === 0" class="table-item-border"></span>
          <span v-if="item.classStatus === 1" class="table-item-border-none"></span>
          <div class="table-item-desc">
            <div class="table-item-time-box">
              <span class="table-item-time">{{ item.startTime }}-{{ item.endTime}}</span>
              <p v-if="item.classStatus === 0" class="table-item-num">
                {{ item.bookedNum }}/{{ item.maxMembers }}
              </p>
              <p v-if="item.classStatus === 1" class="table-item-num-none">
                {{ item.bookedNum }}/{{ item.maxMembers }}
              </p>
              <p class="table-item-term">(满{{ item.minMembers }}人开班)</p>
              <p class="user-age" v-if="item.ageRange">
                <span>限&nbsp;</span>
                <span :class="[item.classStatus === 1 ? 'age' : 'set-age' ]">
                   {{ item.ageRange && item.ageRange.min }}-{{ item.ageRange && item.ageRange.max }} 
                </span>
                <span>&nbsp;岁</span>
              </p>
            </div>
            <p class="table-item-store">{{ item.storeName }}</p>
            <p class="table-item-location">距离<span>{{ item.distance }}</span>&emsp;{{ item.address }}</p>
          </div>
          <div :class="[ item.classStatus === 0 ? 'item-price' : 'item-price-none' ]">
            ¥ {{ item.price }}
          </div>
          <div v-if="item.classStatus === 0 && !phone" key="hasPhone" @click="toBooking(item.classId, index)" class="table-item-btn">
            <p class="table-item-btn-word">预约</p>
          </div>
          <label v-else for="phone" key="noPhone" class="table-item-btn">
            <p class="table-item-btn-word">预约</p>
          </label>
          <div v-if="item.classStatus === 1" class="table-item-btn-none">
            <p class="table-item-btn-word" v-if="item.status === 1 || item.status === 6 || item.status === 3">满课</p>
            <p class="table-item-btn-word" v-else>结束</p>
          </div>
        </div>
      </div>
      <div v-else class="course-item-default">
        <image mode='aspectFill'
          class="default-img"
          src="https://api.tiyou.techoiceness.com/v1/static/images/no-data.png"
        />
      </div>
    </div>


    <div v-if="titleStatus === 2" class="introduce">
      <div class="introduce-item" v-if="!courseItem.nodes">
        <image mode='aspectFill'
          class="introduce-item-images"
          src="https://api.tiyou.techoiceness.com/v1/static/images/img_default.png"
        />
      </div>
      <div v-else>
        <rich-text :nodes="courseItem.nodes"></rich-text>
      </div>
    </div>

    <div v-if="titleStatus === 3" class="assess">
      <!-- <div class="assess-item">
        <div class="assess-item-user">
          <image mode='aspectFill' class="assess-item-user-img" src="https://api.tiyou.techoiceness.com/v1/static/images/card_1.png" />
          <span class="assess-item-user-name">ABC</span>
          <span class="assess-item-user-time">5分钟前</span>
        </div>
        <p class="assess-item-word">课程很不错，孩子很喜欢。</p>
        <div class="assess-item-images">
          <image mode='aspectFill' class="assess-item-images-img" src="https://api.tiyou.techoiceness.com/v1/static/images/card_1.png" />
          <image mode='aspectFill' class="assess-item-images-img" src="https://api.tiyou.techoiceness.com/v1/static/images/card_1.png" />
        </div>
      </div> -->
      <div v-for="(item3, index3) in commentList" :key="index3">
        <WcommentInfo
          :info="item3"
        />
      </div>
    </div>

  </div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import moment from 'moment'
import Wbutton from '@/components/Button'
import CalendarWeek from '@/components/calendar/CalendarWeek'
import Wtoast from '@/components/toBookingToast/toast'
import WcommentInfo from '@/components/courseComment/commentInfo'

export default {
  data () {
    return {
      titleStatus: 1,
      // 0无卡,1有卡
      tipStatus: 1,
      classList: [],
      courseItem: [],
      cardList: [],
      maskHeight: '',
      originPrice: 0,
      price: 0,
      cardPrice: 0,
      borderWidth: 25,
      imgNum: 1,
      // 图片滑动参数
      swiperIndex: 0,
      // 组件数据
      calendarClass: [],
      dayList: [],
      // 音频
      autoplay: false,
      showVideo: 0,
      showFullScreenBtn: false,
      phone: 0,
      courseIndex: 0,
      commentList: [],
      timeFunt: '',
      courseId: ''
    }
  },

  components: {
    Wbutton,
    CalendarWeek,
    Wtoast,
    WcommentInfo
  },

  computed: {
    ...mapGetters('course', [
      'vuexGetCourseInfo'
    ]),

    ...mapGetters('myLocation', [
      'vuexGetLocation'
    ]),

    ...mapGetters('auditionCard', [
      'vuexGetAuditionInfo'
    ]),

    // 获取数据
    courseInfo () {
      let courseInfo = this.vuexGetCourseInfo
      return courseInfo
    }
  },

  // 分享
  // onShareAppMessage: function () {
  //   let type = 3
  //   let id = this.vuexGetCourseInfo.courseId
  //   if (!id) {
  //     wx.showToast({
  //       icon: 'none',
  //       title: '分享失败'
  //     })
  //   }
  //   let text = '体游科学实验室'
  //   const t = {
  //     title: `${text}`,
  //     desc: '',
  //     imageUrl: 'https://api.tiyou.techoiceness.com/v1/static/images/share_image.png',
  //     path: `pages/courseInfo/main?shareType=${type}&courseId=${id}`
  //   }
  //   return t
  // },

  methods: {
    ...mapActions('classCourse', [
      'vuexSetClassInfo'
    ]),

    ...mapActions('card', [
      'vuexSetCardInfo'
    ]),

    ...mapActions('course', [
      'vuexSetCourseInfo'
    ]),

    ...mapActions('calendar', [
      'vuexSetCalendarList'
    ]),

    ...mapActions('myLocation', [
      'vuexSetLocation'
    ]),

    // 用户经纬度
    getUserLocation () {
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success: (s) => {
                this.getLocation()
              },
              fail: () => {
                // 拒绝授权
                wx.showModal({
                  title: '提示',
                  content: '授权地理位置后获取附近门店及课程信息',
                  success: res => {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (res) => {
                          console.log('open', res)
                        },
                        fail: (eee) => {
                          console.log('open', eee)
                        }
                      })
                    }
                  }
                })
              }
            })
          } else {
            this.getLocation()
          }
        },
        fail: (err) => {
          console.log('err', err)
        }
      })
    },

    getLocation () {
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          this.lat = res.latitude
          this.lng = res.longitude
          // const speed = res.speed
          // const accuracy = res.accuracy
          const data = {
            lat: this.lat,
            lng: this.lng
          }
          this.vuexSetLocation(data)
          const now = moment().format('YYYY-MM-DD')
          const twoDay = moment().add(1, 'days').format('YYYY-MM-DD')
          this.getClassList(now, twoDay)
        }
      })
    },

    initState () {
      this.imgNum = 1
      this.cardPrice = 0
      this.originPrice = 0
      this.price = 0
      this.titleStatus = 1
      this.classList = []
      this.courseItem = []
      this.calendarClass = []
      this.cardList = []
      this.dayList = []
      this.tipStatus = 1
      this.borderWidth = 25
      this.swiperIndex = 0
      this.autoplay = false
      this.showVideo = 0
      this.phone = 0
      this.courseIndex = 0
      this.commentList = []
      this.timeFunt = ''
      clearTimeout(this.timeFunt)
      this.courseId = ''
    },

    changeTitle (num) {
      this.titleStatus = num
      if (num === 3) {
        this.getCommonet(this.courseInfo.courseId)
      }
    },

    async getCommonet (id) {
      let res = await this.$api.course.getCommentInfo(id)
      if (res.msg) return
      if (res.list.length > 0) {
        this.commentList = res.list.map(i => {
          return {
            ...i,
            createdAt: this.$wxApi.commentTime(i.createdAt)
          }
        })
      }
    },

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

    // 获取课程详情
    async getCourse () {
      const res = await this.$api.course.getCourseById(this.courseInfo.courseId)
      const regex = new RegExp('<img', 'gi')
      this.courseItem = {
        name: res.title,
        type: res.secondCategory.name,
        originPrice: (res.originPrice / 100).toFixed(2),
        price: (res.price / 100).toFixed(2),
        video: res.videoUrl,
        // 数组
        images: res.images,
        cover: res.cover,
        nodes: res.detail.replace(regex, `<img style="max-width: 100%;"`),
        coursePrice: res.price / 100,
        minPrice: res.minPrice / 100,
        maxPrice: res.maxPrice / 100
      }
      if (res.images) {
        this.imgNum = res.images.length + 1
      }
      this.originPrice = this.courseItem.originPrice
      if (res.maxPrice === 0) {
        this.price = `${this.courseItem.maxPrice}`
      } else {
        if (this.courseItem.minPrice === this.courseItem.maxPrice) {
          this.price = `${this.courseItem.maxPrice}`
        } else {
          this.price = `${this.courseItem.minPrice}-${this.courseItem.maxPrice}`
        }
      }
      // todo
      // this.price = this.courseItem.price
      // 设置导航栏为对应导航
      wx.setNavigationBarTitle({
        title: this.courseItem.name
      })
      this.timeFunt = setTimeout((res) => {
        const query = wx.createSelectorQuery()
        query.select('.course-info-priPrice').boundingClientRect((rect) => {
          if (rect.width) {
            this.borderWidth = rect.width
          }
        }).exec()
      }, 1000)
    },

    // 日历，点击日期
    setDateByCalender (options) {
      const now = options.date
      const twoDay = moment(now).add(1, 'days').format('YYYY-MM-DD')
      this.getClassList(now, twoDay)
      for (let i = 0; i < this.dayList.length; i++) {
        if (i === options.index) {
          this.dayList[i].clickStatus = 0
        } else {
          this.dayList[i].clickStatus = 1
        }
      }
    },

    // 获取某天，某课表的课程列表
    async getClassList (now, twoDay) {
      const status = [3, 4, 5, 6, 7]
      let info = {
        lat: this.vuexGetLocation.lat,
        lng: this.vuexGetLocation.lng
      }
      let audition = {
        organizationId: this.vuexGetAuditionInfo.organizationId,
        branchId: this.vuexGetAuditionInfo.branchId,
        storeId: this.vuexGetAuditionInfo.storeId
      }
      let data = {
        status,
        courseId: this.courseInfo.courseId,
        info,
        now,
        twoDay,
        audition
      }
      const res = await this.$api.class.getClassByOneDayV2(data)
      const classData = res.list
      // classStatus: 0可预约，1不可预约
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
          distance: this.$wxApi.getDisTance(item.store && item.store.distance),
          price: item.price / 100,
          ageRange: item.ageRange,
          status: item.status
        }
        if (item.status === 3 || item.status === 4) {
          return obj
        } else if (item.status === 1 || item.status === 6) {
          // 取消
          obj.classStatus = 1
          obj.bookedNum = obj.maxMembers
          return obj
        } else {
          obj.classStatus = 1
          return obj
        }
      })
    },

    // 没有课程下活动
    async getCoursePirce () {
      const res = await this.$api.course.getCourseById(this.courseInfo.courseId)
      if (res.msg) return
      this.price = res.price / 100
    },

    // 获取日历需要的信息
    async getCalender (index) {
      const now = moment().format('YYYY-MM-DD')
      const twoWeek = moment().add(14, 'days').format('YYYY-MM-DD')
      let audition = {
        organizationId: this.vuexGetAuditionInfo.organizationId,
        branchId: this.vuexGetAuditionInfo.branchId,
        storeId: this.vuexGetAuditionInfo.storeId
      }
      let data = {
        now,
        twoWeek,
        courseId: this.courseInfo.courseId,
        audition
      }
      const res = await this.$api.class.getCalendarV2(data)
      this.calendarClass = res
      this.dayList = this.$wxApi.getShowDayList(this.calendarClass, index)
      this.vuexSetCalendarList(this.dayList)
    },

    // 获取我的卡列表，判断是否还有卡
    async myCardList () {
      let res = await this.$api.card.myCardList()
      this.cardList = res.list.map((i) => ({
        ...i,
        deadline: this.$wxApi.getTime(i.deadline)
      }))
    },

    // 获取卡类型
    async getCardType () {
      //  遗留问题：要取得年卡
      let res = await this.$api.card.cardType()
      if (res.msg) return
      // 是年卡条件
      let arr = res.list.filter(i => i.code === 'TY1002')
      let data = {}
      let vuexData = {}
      if (arr[0].id) {
        vuexData = {
          cardTypeId: arr[0].id
        }
        this.vuexSetCardInfo(vuexData)
        data = {
          typeId: arr[0].id
        }
        this.cardTypeDetail(data)
      }
    },

    // 获取年卡typeID
    async getCardTypeId () {
      let res = await this.$api.card.cardType()
      if (res.msg) return
      let arr = []
      arr = res.list.filter(i => i.code === 'TY1002')
      let data = {}
      // 错误处理
      if (arr.length <= 0) {
        wx.showToast({
          icon: 'none',
          title: '未找到编号为TY1002的年卡'
        })
      } else {
        data = {
          cardTypeId: arr[0].id
        }
        this.vuexSetCardInfo(data)
      }
    },

    // 获取卡详情（年卡，体验卡）
    async cardTypeDetail (data) {
      let res = await this.$api.card.cardTypeDetail(data)
      if (res.msg) return
      this.cardPrice = (res.price / 100).toFixed(2)
    },

    toBooking (id, index) {
      const data = {
        classId: id
      }
      this.vuexSetClassInfo(data)
      // this.tipStatus = 1
      // 购买 - 有年卡
      wx.navigateTo({
        url: `../auditionBooking/main?cardType=` + 3
      })
    },

    async getUserInfo () {
      let res = await this.$api.my.profile()
      if (res.msg) {
        return
      }
      if (!res.phoneNo) {
        this.phone = 1
      }
    },

    setToken (data) {
      const { token = '', sessionKey = '', phoneNo } = data
      wx.setStorageSync('token', token)
      wx.setStorageSync('sessionKey', sessionKey)
      this.phone = !phoneNo
      // 登陆后请求信息
      if (token) {
        this.getUserInfo()
        // 获取地理位置
        if (this.vuexGetLocation.status === 1) {
          this.getUserLocation()
        }
        if (!this.courseId) {
          this.courseId = this.vuexGetCourseInfo.courseId
        }
        let id = parseInt(this.courseId, 10)
        const d = {
          courseId: id
        }
        this.vuexSetCourseInfo(d)
        this.getCalender(0)
        // 获取某天，某课程的课表
        const now = moment().format('YYYY-MM-DD')
        const twoDay = moment().add(1, 'days').format('YYYY-MM-DD')
        this.getClassList(now, twoDay)
        // 获取课程详情
        this.getCourse()
        // 判断该用户是否有卡
        this.myCardList()
        this.getCardType()
      }
    },

    getPhoneNumber (e) {
      const _token = wx.getStorageSync('token')
      if (_token) {
        this.$wxLogin.wxLogin(this)
        this.$wxLogin.getPhoneNumber(e, this)
      }
    }
  },

  onLoad (options) {
    // 日历下标
    let { index = 0, shareType = '', courseId = '' } = options
    index = parseInt(index, 10)
    this.courseId = courseId
    // 如果是分享进来
    if (shareType) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            let _token = wx.getStorageSync('token')
            if (!_token) {
              this.$wxLogin.wxLogin(this)
            } else {
              this.getUserInfo()
              // 获取地理位置
              if (this.vuexGetLocation.status === 1) {
                this.getUserLocation()
              }
              let id = parseInt(courseId, 10)
              const data = {
                courseId: id
              }
              this.vuexSetCourseInfo(data)
              this.getCalender(index)
              // 获取某天，某课程的课表
              const now = moment().format('YYYY-MM-DD')
              const twoDay = moment().add(1, 'days').format('YYYY-MM-DD')
              this.getClassList(now, twoDay)
              // 获取课程详情
              this.getCourse()
              // 判断该用户是否有卡
              this.myCardList()
              this.getCardType()
            }
          } else {
            wx.redirectTo({
              url: `../login/main?shareType=${shareType}&courseId=${courseId}`
            })
          }
        }
      })
    } else {
      // 获取日历需要的信息
      this.getUserInfo()
      this.getCalender(index)
      // 获取某天，某课程的课表
      if (index === 0) {
        const now = moment().format('YYYY-MM-DD')
        const twoDay = moment().add(1, 'days').format('YYYY-MM-DD')
        this.getClassList(now, twoDay)
      } else {
        const indexNow = moment().add(index, 'days').format('YYYY-MM-DD')
        const indexTwo = moment().add(index + 1, 'days').format('YYYY-MM-DD')
        this.getClassList(indexNow, indexTwo)
      }
      // 获取课程详情
      this.getCourse()
      // 判断该用户是否有卡
      this.myCardList()
      this.getCardType()
    }
  },

  onUnload () {
    this.initState()
  }
}
</script>

<style scoped>
.contain {
  position: relative;
  padding-bottom: 60rpx;
}

video {
  width: 750rpx;
  height: 400rpx;
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
.course-images-tip {
  z-index: 4;
  position: absolute;
  top: 348rpx;
  right: 10rpx;
  height: 42rpx;
}
.course-images-bg {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  width: 80rpx;
  height: 42rpx;
  opacity: 0.2;
  border-radius: 30rpx;
  background-color: #000000;
}
.course-images-num {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  width: 80rpx;
  height: 42rpx;
  font-size: 22rpx;
  font-family: 'League Gothic';
  letter-spacing: 0.2rpx;
  text-align: center;
  color: #ffffff;
}
.course-images-currentNum {
  /* width: 17px;
  height: 21px; */
  font-size: 34rpx;
}

.course-info {
  position: relative;
  width: 750rpx;
  height: 140rpx;
}

.introduce {
  margin-top: 30rpx;
}

.course-info-desc {
  position: absolute;
  left: 30rpx;
  top: 30rpx;
  font-size: 22rpx;
  color: #b2b2b2;
}
.course-info-desc-name {
  display: block;
  width: 274rpx;
  height: 48rpx;
  font-weight: 500;
  font-size: 34rpx;
  color: #232323;
}

.course-info-price {
  display: flex;
  align-items: flex-end;
  position: absolute;
  right: 0rpx;
  top: 20rpx;
  /* width: 400rpx; */
  height: 56rpx;
  /* letter-spacing: 0.2rpx; */
  text-align: right;
  font-family: 'League Gothic';
}
.course-info-priPrice {
  height: 42rpx;
  font-size: 34rpx;
  line-height: 42rpx;
  color: #c8d2dc;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}
.course-info-price-line {
  position: absolute;
  bottom: 25rpx;
  left: 0;
  height: 2rpx;
  /* display: block; */
  transform: rotate(20deg);
  background-color: #ffcd76;
}
.course-info-nowPrice {
  margin-left: 10rpx;
  margin-right: 30rpx;
  /* width: 76rpx; */
  height: 56rpx;
  font-size: 48rpx;
  /* text-align: right; */
  color: #ffcd76;
}

.title {
  display: flex;
  width: 750rpx;
  height: 76rpx;
  box-shadow: 0 16rpx 16rpx -8rpx rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
}
.titie-item {
  margin-top: 20rpx;
  width: 250rpx;
  height: 56rpx;
  font-size: 26rpx;
  text-align: center;
  color: #232323;
  flex: 1;
}
.title-p {
  /* width: 250rpx; */
  height: 36rpx;
  font-weight: 500;
}
.title-p-none {
  /* width: 250rpx; */
  height: 36rpx;
  font-weight: 500;
  color: #b2b2b2;
}
.title-span {
  width: 24rpx;
  height: 4rpx;
  margin-top: 6rpx;
  margin-left: 175rpx;
  transition: all .5s ease;
  display: block;
}
.title-span-have {
  background-color: #ffcd76;
}
.title-span-none {
  background-color: white;
}

.calender {
  text-align: center;
}

.table-item {
  display: flex;
  position: relative;
  margin: 30rpx 30rpx 0;
  width: 690rpx;
  height: 216rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
}

.table-item-border {
  display: block;
  width: 10rpx;
  height: 216rpx;
  background-color: #ffdea5;
}
.table-item-border-none {
  display: block;
  width: 10rpx;
  height: 216rpx;
  background-color: #dfe6ed;
}

.table-item-desc {
  margin-left: 30rpx;
}

.table-item-time-box {
  display: flex;
  align-items: center;
  width: 500rpx;
  height: 42rpx;
  margin-top: 20rpx;
  margin-bottom: 10rpx;
}

.table-item-time {
  font-family: 'League Gothic';
  margin-right: 30rpx;
  font-size: 34rpx;
  color: #c8d2dc;
}
.table-item-store {
  width: 400rpx;
  height: 40rpx;
  font-weight: 500;
  font-size: 28rpx;
  color: #232323;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.table-item-location {
  margin-top: 10rpx;
  width: 400rpx;
  height: 64rpx;
  font-size: 22rpx;
  color: #888888;
}
.table-item-location span {
  color: #232323;
}

.table-item-term {
  /* position: absolute; */
  right: 84rpx;
  top: 26rpx;
  /* width: 73px; */
  height: 32rpx;
  font-size: 22rpx;
  text-align: right;
  color: #b2b2b2;
  margin-left: 30rpx;
}
.table-item-num {
  /* position: absolute; */
  right: 30rpx;
  top: 20rpx;
  width: 44rpx;
  height: 42rpx;
  font-family: 'League Gothic';
  font-size: 34rpx;
  text-align: right;
  color: #ffcd76;
}

.item-price {
  position: absolute;
  right: 30rpx;
  top: 20rpx;
  height: 48rpx;
  font-family: 'League Gothic';
  font-size: 48rpx;
  text-align: right;
  color: #ffcd76;
}

.item-price-none {
  position: absolute;
  right: 30rpx;
  top: 20rpx;
  height: 48rpx;
  font-family: 'League Gothic';
  font-size: 48rpx;
  text-align: right;
  color: #c8d2dc;
}

.table-item-num-none {
  /* position: absolute; */
  right: 30rpx;
  top: 20rpx;
  width: 44rpx;
  height: 42rpx;
  font-family: 'League Gothic';
  font-size: 34rpx;
  text-align: right;
  color: #c8d2dc;
}

.table-item-btn {
  position: absolute;
  right: 30rpx;
  bottom: 34rpx;
  width: 120rpx;
  height: 60rpx;
  border-radius: 30rpx;
  background-color: #ffcd76;
}
.table-item-btn-none {
  position: absolute;
  right: 30rpx;
  bottom: 34rpx;
  width: 120rpx;
  height: 60rpx;
  border-radius: 30rpx;
  background-color: #eeeeee;
}
.table-item-btn-word {
  margin-top: 10rpx;
  margin-left: 4rpx;
  width: 112rpx;
  height: 40rpx;
  font-size: 28rpx;
  text-align: center;
  font-weight: 500;
  color: #ffffff;
}

.introduce-item {
  margin: 30rpx 30rpx 0;
  width: 690rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
}

.assess {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30rpx;
}

.assess-item {
  margin: 30rpx 30rpx 0;
  width: 690rpx;
  height: 432rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
}
.assess-item-user {
  display: flex;
  align-items: center;
  position: relative;
  margin: 30rpx 40rpx;
  height: 36px;
}
.assess-item-user-img {
  margin-right: 30rpx;
  width: 72rpx;
  height: 72rpx;
  border-radius: 100%;
  box-shadow: 0 6rpx 12rpx 0 rgba(0, 0, 0, 0.05);
}
.assess-item-user-name {
  width: 250rpx;
  height: 40rpx;
  font-size: 28rpx;
  color: #888888;
}
.assess-item-user-time {
  position: absolute;
  right: 0;
  top: 0;
  height: 32rpx;
  font-size: 22rpx;
  letter-spacing: 0.2rpx;
  text-align: right;
  color: #b2b2b2;

}
.assess-item-word {
  margin: 0 40rpx;
  width: 610rpx;
  /* height: 40rpx; */
  font-size: 28rpx;
  letter-spacing: 0.2rpx;
}
.assess-item-images {
  margin: 20rpx 0 40rpx 40rpx;
}
.assess-item-images-img {
  margin-right: 8rpx;
  width: 200rpx;
  height: 200rpx;
}

.mask {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  /* width: 100vw; */
  /* height: 100vw; */
  width: 100%;
  height: 100%;
  opacity: 0.5;
  z-index: 99999;
  background-color: #000000;
}

.tip {
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 364rpx;
  left: 120rpx;
  width: 510rpx;
  height: 720rpx;
  border-radius: 10rpx;
  box-shadow: 0 16rpx 16rpx -8rpx rgba(0, 0, 0, 0.5);
  background-color: #ffffff;
}
.tip-sign {
  z-index: 4;
  position: absolute;
  top: 318rpx;
  left: 180rpx;
  width: 158rpx;
  height: 122rpx;
  font-family: 'League Gothic';
  font-size: 96rpx;
  color: #ffdea5;
}
.tipStatus-img {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 10rpx;
  right: 10rpx;
}
.tipStatus-image {
  width: 24px;
  height: 24px;
}
.tip-title {
  margin: 116rpx 101rpx 60rpx 103rpx;
  width: 306rpx;
  height: 48rpx;
  font-size: 34rpx;
  text-align: center;
  color: #232323;
  font-weight: 500;
}
.tip-card {
  display: flex;
  justify-content: space-between;
  width: 360rpx;
  height: 78rpx;
}
.tip-word {
  font-weight: 500;
  margin-top: 30rpx;
  /* width: 98px; */
  /* height: 20px; */
  font-size: 28rpx;
  color: #c8d2dc;
}
.tip-price {
  /* width: 47px; */
  /* height: 39px; */
  font-family: 'League Gothic';
  font-size: 64rpx;
  letter-spacing: 0.2rpx;
  text-align: right;
  color: #ffcd76;
}
.btn1 {
  margin-top: 60rpx;
}
.btn2 {
  margin-top: 30rpx;
}

.introduce-item-images {
  width: 690rpx;
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

.user-age {
  display: flex;
  align-items: center;
  font-size: 22rpx;
  color: #b2b2b2;
  margin-left: 10rpx;
}

.age {
  color: #b2b2b2;
  font-size: 34rpx;
  font-family: 'League Gothic'
}

.set-age {
  color: #ffcd76;
  font-size: 34rpx;
  font-family: 'League Gothic'
}

</style>
