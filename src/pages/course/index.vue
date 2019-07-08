<template>
  <div :class="[ AppIsIpx ? 'isx-wrap' : 'wrap']">
    <div class="title">
      <div class="titie-item-one" @click="changeTitle(1)">
        <p :class="titleStatus === 1 ? 'title-p' : 'title-p-none'">课表</p>
        <span :class="titleStatus === 1 ? 'title-span' : 'title-span-none'"></span>
      </div>
      <div class="titie-item" @click="changeTitle(2)">
        <p :class="titleStatus === 2 ? 'title-p' : 'title-p-none'">课程</p>
        <span :class="titleStatus === 2 ? 'title-span' : 'title-span-none'"></span>
      </div>
      <div class="titie-item" @click="changeTitle(3)">
        <p :class="titleStatus === 3 ? 'title-p' : 'title-p-none'">门店</p>
        <span :class="titleStatus === 3 ? 'title-span' : 'title-span-none'"></span>
      </div>

      <div class="title-location">
        <span class="title-dot"></span>
        <span class="title-city">深圳市</span>
      </div>
    </div>

    <!-- 课表 -->
    <div v-if="titleStatus === 1 " class="course">

      <div class="calender">
        <CalendarWeek
          :calendarClass="calendarClass"
          calendartype="classIndex"
          :dayList="dayList"
          @setDateByCalender="setDateByCalender"
        />
      </div>

      <div v-if="classList.length">
        <div v-for="(item4, index4) in classList" :key="index4"
          @click="toCourseInfo4(item4.courseId)">
          <TableCard
            :item="item4"
          />
        </div>
      </div>

      <div v-else class="course-item-default">
        <image mode='aspectFill'
          class="default-img"
          src="https://api.tiyou.techoiceness.com/v1/static/images/no-data.png"
        />
      </div>

      <!-- <div v-if="classList" class="course-item">
        <image mode='aspectFill' class="course-item-img" src="https://api.tiyou.techoiceness.com/v1/static/images/no-data.png"/>
      </div> -->
    </div>

    <!-- 课程 -->
    <div v-if="titleStatus === 2 " class="class">
      <div class="class-search">
        <picker 
          @change="ChangeCourseTypePicker"
          :value="topIndex"
          :range="CourseTypeArray"
          @columnchange="changeTopId"
          mode="multiSelector"
        >
          <div class="course-picker">
            <p class="class-search-word">课程分类</p>
            <p class="class-search-type">
              {{ CourseTypeArray && CourseTypeArray[0][topIndex[0]] }}/
            </p>
            <p class="class-search-type">
              {{ CourseTypeArray && CourseTypeArray[1][topIndex[1]] }}
            </p>
          </div>
        </picker>
      </div>

      <div v-for="(item, index) in courseList" :key="index" @click="toCourseInfo(item.courseId)" class="class-item">
        <div class="class-item-images">
          <image mode='aspectFill' class="class-item-img" lazy-load="true"
            :src="item.courseImg ? item.courseImg : img"
          placeholder-image="https://api.tiyou.techoiceness.com/v1/static/images/img_default.png" />
        </div>
        <div class="class-item-mask"></div>
        <div class="class-item-content">
          <p class="class-item-type">{{ item.courseType }}</p>
          <p class="class-item-name">{{ item.courseName }}</p>
        </div>
      </div>
    </div>

    <!-- 门店 -->
    <div v-if="titleStatus === 3 " class="stores">
      <!-- <div class="stores-select">
        <picker @change="ChangeStoreTypePicker" :value="indexStoreType" :range="StoreTypeArray">
          <p class="class-search-word">课程分类</p>
          <p class="class-search-type">{{ StoreTypeArray[indexStoreType] }}</p>
        </picker>
      </div> -->
      <div v-for="(item3, index3) in storeList" :key="index3" @click="toStores(item3.id)">
        <storeCard
          :store="item3"
        />
      </div>

      <!-- <div class="stores-item" @click="toStores">
        <image mode='aspectFill' class="stores-item-img" src="https://api.tiyou.techoiceness.com/v1/static/images/img_9.png" />
        <div class="stores-item-word">
          <p class="stores-item-name">米兔卡乐美术（东林教育城）</p>
          <p class="stores-item-location">深圳市南山区创业路现代城华庭东林教育城216</p>
          <span class="stores-item-instance">4.5km</span>
        </div>
      </div> -->
    </div>

    <WTabBar />
  </div>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'

import moment from 'moment'
import WTabBar from '@/components/TabBar'
import TableCard from '@/components/table/TableCard'
import CalendarWeek from '@/components/calendar/CalendarWeek'
import storeCard from '@/components/store/storeCard'

export default {

  data () {
    return {
      // 经度
      lat: '',
      // 维度
      lng: '',
      img: 'https://api.tiyou.techoiceness.com/v1/static/images/img_default.png',
      dayList: [],
      titleStatus: 1,
      classList: [],
      courseList: [],
      // 组件数据
      calendarClass: [
        {
          date: 0,
          remainingNumber: 0
        }
      ],
      // 选择器数据
      topIndex: [0, 0],
      // 一级分类数据
      topRes: [],
      // 二级分类数据
      secondId: [],
      indexCourseType: 0,
      topI: 0,
      CourseTypeArray: [[], []],
      CourseTypeIdArray: [],
      // 门店列表
      storeList: [],
      // 日历下标，需要改变下级页面下标
      calenDerIndex: 0,
      noData2: 1,
      page2: 1,
      page3: 1,
      noData3: 1,
      // 正在加载
      loading: 1,
      changeTopIndex: 0,
      inviterId: 0,
      userInfo: {}
    }
  },

  components: {
    WTabBar,
    TableCard,
    CalendarWeek,
    storeCard
  },

  computed: {
    ...mapGetters('myLocation', [
      'vuexGetLocation'
    ])
  },

  // 分享
  onShareAppMessage: function () {
    // 相当于分享login
    let inviterId = this.userInfo.id
    let text = '体游科学实验室'
    const t = {
      title: `${text}`,
      desc: '',
      imageUrl: 'https://api.tiyou.techoiceness.com/v1/static/images/share_image.png',
      path: `pages/login/main?inviterId=${inviterId}`
    }
    return t
  },

  methods: {
    ...mapActions('course', [
      'vuexSetCourseInfo'
    ]),

    ...mapActions('myLocation', [
      'vuexSetLocation'
    ]),

    ...mapActions('calendar', [
      'vuexSetCalendarList'
    ]),

    initState () {
      this.secondId = []
      this.topRes = []
      this.CourseTypeArray = [[], []]
      this.topIndex = [0, 0]
      this.classList = []
      this.courseList = []
      this.indexCourseType = 0
      this.CourseTypeArray = []
      this.lat = ''
      this.lng = ''
      this.dayList = []
      this.calenDerIndex = 0
      this.noData2 = 1
      this.page2 = 1
      this.page3 = 1
      this.noData3 = 1
      this.loading = 1
      this.changeTopIndex = 0
      this.inviterId = 0
      this.userInfo = {}
    },

    // 个人信息
    async getUserInfo () {
      let res = await this.$api.my.profile()
      if (res.msg) {
        return
      }
      this.userInfo = res
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
          // const now = moment().format('YYYY-MM-DD')
          // const twoDay = moment().add(1, 'days').format('YYYY-MM-DD')
          // this.getClassList(now, twoDay)
          this.getCalender()
        }
      })
    },

    // 改变三大标题
    changeTitle (num) {
      this.titleStatus = num
      if (num === 2) {
        // 获取一级分类
        this.CourseTypeArray = [[], []]
        this.topIndex = [0, 0]
        this.getTopCategory()
        // 切换-改变为全部
        this.courseList = []
        this.indexCourseType = 0
        this.page2 = 1
        this.noData2 = 1
        let data = {
          page: this.page2
        }
        this.getCourseList(data)
      }
      if (num === 1) {
        this.dayList = []
        this.getCalender()
        const now = moment().format('YYYY-MM-DD')
        const twoDay = moment().add(1, 'days').format('YYYY-MM-DD')
        this.getClassList(now, twoDay)
      }
      // 门店需要获取用户地址
      if (num === 3) {
        this.page3 = 1
        this.noData3 = 1
        this.storeList = []
        const data = {
          lat: this.vuexGetLocation.lat,
          lng: this.vuexGetLocation.lng,
          page: this.page3
        }
        this.getStoreList(data)
      }
    },

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

    // 用户拒绝经纬度授权后 onShow 一直调用
    onShowGetLoction () {
      wx.authorize({
        scope: 'scope.userLocation',
        success: (s) => {
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
    },

    getToken () {
      let _token = ''
      _token = wx.getStorageSync('token')
      return _token
    },

    setToken (data) {
      const { token = '', sessionKey = '' } = data
      wx.setStorageSync('token', token)
      wx.setStorageSync('sessionKey', sessionKey)
      if (token) {
        this.getSecondCategory()
        // this.getStoreList()
        this.getCalender()
        // const now = moment().format('YYYY-MM-DD')
        // const twoDay = moment().add(1, 'days').format('YYYY-MM-DD')
        // this.getClassList(now, twoDay)
      }
    },

    // to 课程信息
    toCourseInfo (id) {
      const data = {
        courseId: id
      }
      this.vuexSetCourseInfo(data)
      wx.navigateTo({
        url: `../courseInfo/main?index=9999`
      })
    },

    toCourseInfo4 (id) {
      const data = {
        courseId: id
      }
      this.vuexSetCourseInfo(data)
      wx.navigateTo({
        url: `../courseInfo/main?index=${this.calenDerIndex}`
      })
    },

    // to 网点
    toStores (id) {
      wx.navigateTo({
        url: `../stores/main?storeId=${id}&myLat=${this.lat}&myLng=${this.lng}`
      })
    },

    // 日历，点击日期
    setDateByCalender (options) {
      const now = options.date
      this.calenDerIndex = options.index
      const twoDay = moment(now).add(1, 'days').format('YYYY-MM-DD')
      this.getClassList(now, twoDay)
    },

    // 获取某天课表
    async getClassList (now, twoDay) {
      // 课表状态 1:已取消 2:未上线 3:已成团 4:未成团 5:已完成 6自动取消 7停止预约
      const status = [3, 4, 5, 6, 7]
      let info = {
        lat: this.vuexGetLocation.lat,
        lng: this.vuexGetLocation.lng
      }
      let data = {
        status,
        info,
        now,
        twoDay
      }
      // this.classList = []
      const res = await this.$api.class.getClassByOneDayV2(data)
      if (res.msg) return
      // const classData = res.list
      this.classList = res.list.map(item => {
        let obj = {
          startTime: moment(item.startTime).format('HH:mm'),
          endTime: moment(item.endTime).format('HH:mm'),
          bookedNum: item.bookedNumbers,
          maxMembers: item.maxMembers,
          courseId: item.courseId,
          courseName: item.course && item.course.title,
          courseType: item.course && item.course.secondCategory.name,
          address: item.store && item.store.address,
          courseImg: item.course && item.course.cover,
          storeName: item.store && item.store.name,
          classStatus: item.bookedNumbers < item.maxMembers ? 0 : 1,
          distance: this.$wxApi.getDisTance(item.store && item.store.distance),
          status: item.status,
          // 所属一级分类
          topId: item.course && item.course.topCategoryId
        }
        // 已成团/未成团显示真实状态
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
      if (res.list.length <= 0) {
        this.classList = []
      }
    },

    // 获取全部课程
    async getCourseList (data) {
      // this.courseList = []
      this.loading = 2
      const res = await this.$api.course.courseList(data)
      this.loading = 1
      let courseData = res.list.map(item => {
        return {
          courseId: item.id,
          courseName: item.title,
          courseType: item.secondCategory.name,
          courseImg: item.cover
        }
      })
      this.courseList = [ ...this.courseList, ...courseData ]
      let total = res.total - this.courseList.length
      if (total > 0) {
        this.noData2 = 2
      }
      if (total <= 0) {
        this.noData2 = 1
      }
    },

    // 获取一级分类
    async getTopCategory () {
      const res = await this.$api.course.getTopCategory()
      if (res.msg) return
      this.topRes = res.list
      // 一级分类显示的名称(仅做显示)
      let topArr = res.list.map(i => (
        i.name
      ))
      // 默认显示topId 1
      let data = {
        id: 1
      }
      this.getSecondCategory(data, topArr)
    },

    // 获取二级分类
    async getSecondCategory (data, topArr) {
      // 科学实验室，一级分类id为1
      const res = await this.$api.course.getSecondCategory(data)
      if (res.msg) return
      // 获取二级分类列表
      this.secondId = res.list
      let secondNameArr = res.list.map(i => (
        i.name
      ))
      secondNameArr = [ '全部', ...secondNameArr ]
      this.CourseTypeArray = [[ ...topArr ], [ ...secondNameArr ]]
      // this.CourseTypeArray[1] = [ ...secondNameArr]
    },

    // 获取门店信息
    async getStoreList (data) {
      this.loading = 2
      const res = await this.$api.store.getStoreList(data)
      this.loading = 1
      if (res.msg) return
      let arr = res.list.map(i => ({
        ...i,
        distance: this.$wxApi.getDisTance(i.distance)
      }))
      this.storeList = [ ...this.storeList, ...arr ]
      let total = res.total - this.storeList.length
      if (total > 0) {
        this.noData3 = 2
      }
      if (total <= 0) {
        this.noData3 = 1
      }
    },

    // 获取日历30天list
    async getCalender () {
      const now = moment().format('YYYY-MM-DD')
      const twoWeek = moment().add(14, 'days').format('YYYY-MM-DD')
      const res = await this.$api.class.getCalendar(now, twoWeek)
      if (res.msg) return
      this.calendarClass = [ ...this.$wxApi.getDayList(res) ]
      // this.getDayList(this.calendarClass)
      this.dayList = [ ...this.$wxApi.getDayList(res) ]
      let courseIndex = this.$wxApi.getHaveCourse(res)
      // 当天有课
      this.calenDerIndex = courseIndex
      if (courseIndex === 0) {
        const now = moment().format('YYYY-MM-DD')
        const twoDay = moment().add(1, 'days').format('YYYY-MM-DD')
        this.getClassList(now, twoDay)
      } else {
        let i = courseIndex + 1
        const indexn = moment().add(`${courseIndex}`, 'days').format('YYYY-MM-DD')
        const indext = moment().add(`${i}`, 'days').format('YYYY-MM-DD')
        this.getClassList(indexn, indext)
      }
      this.vuexSetCalendarList(this.dayList)
    },

    // 改变一级分类-相应的改变二级分类列表
    changeTopId (e) {
      let index = e.mp.detail.value
      let column = e.mp.detail.column
      // 第一列
      if (column === 0) {
        this.topIndex = [index, 0]
        if (!this.topRes[index].id) {
          this.wxShowToast({
            title: '未获取到分类id-wx'
          })
          return
        }
        let id = this.topRes[index].id
        let data = {
          id
        }
        let topArr = this.topRes.map(i => (
          i.name
        ))
        this.topI = index
        this.getSecondCategory(data, topArr)
      }
    },

    // 课程分类选择器-确定
    ChangeCourseTypePicker (e) {
      this.topIndex = e.mp.detail.value
      if (this.topI !== 0) {
        this.topIndex[0] = this.topI
      }
      let data = {}
      let topId = this.topRes[this.topIndex[0]].id
      if (this.topIndex[1] !== 0) {
        let seconId = this.secondId[this.topIndex[1] - 1].id
        data = {
          topCategoryId: topId,
          secondCategoryId: seconId
        }
      } else {
        // 全部
        data = {
          topCategoryId: topId
        }
      }
      this.page2 = 1
      this.noData2 = 1
      this.courseList = []
      this.getCourseList(data)
    },

    // 门店分类选择器
    ChangeStoreTypePicker (e) {
      if (e.mp.detail.value === '0') {
        this.indexCourseType = 0
      } else {
        this.indexCourseType = e.mp.detail.value
      }
    }
  },

  // 上拉加载
  onReachBottom () {
    if (this.loading === 2) return
    if (this.titleStatus === 2) {
      if (this.noData2 === 2) {
        this.page2 += 1
        let data = {
          page: this.page2
        }
        this.getCourseList(data)
      }
    }
    if (this.titleStatus === 3) {
      if (this.noData3 === 2) {
        this.page3 += 1
        let data = {
          page: this.page3,
          lat: this.vuexGetLocation.lat,
          lng: this.vuexGetLocation.lng
        }
        this.getStoreList(data)
      }
    }
  },

  onLoad (options) {
    let { inviterId = 0 } = options
    this.inviterId = parseInt(inviterId, 10)
    const _token = this.getToken()
    if (_token) {
      this.getSecondCategory()
      this.getCalender()
      this.getUserInfo()
      // 没有授权地理位置
      // const now = moment().format('YYYY-MM-DD')
      // const twoDay = moment().add(1, 'days').format('YYYY-MM-DD')
      // this.getClassList(now, twoDay)
      // if (this.vuexGetLocation.status === 1) {
      //   this.getUserLocation()
      // }
    }
  },

  onShow () {
    wx.hideTabBar()
    const _token = this.getToken()
    if (!_token) {
      this.initState()
      this.$wxLogin.wxLogin(this)
    } else {
      // this.onShowGetLoction()
      // 如果没有dayList 加载日历信息
      if (this.dayList.length) {
        this.vuexSetCalendarList(this.dayList)
      }
      // 定位
      if (this.vuexGetLocation.status === 1) {
        this.getUserLocation()
      }
    }
  },

  onUnload () {
    this.initState()
  }
}
</script>

<style scoped>
.isx-wrap {
  width: 100%;
  padding-bottom: 260rpx;
  padding-top: 120rpx;
}
.wrap {
  width: 100%;
  padding-bottom: 160rpx;
  padding-top: 120rpx;
}

.title {
  height: 120rpx;
  width: 750rpx;
  display: flex;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 16rpx 16rpx -8rpx rgba(0, 0, 0, 0.05);
  background-color: #fff;
}
.titie-item {
  margin-top: 30rpx;
  margin-left: 30rpx;
}
.titie-item-one {
  margin-top: 30rpx;
  margin-left: 60rpx;
}
.title-p {
  width: 96rpx;
  height: 66rpx;
  font-size: 48rpx;
  /* font-weight: 500; */
  font-weight: bold;
}
.title-p-none {
  width: 96rpx;
  height: 66rpx;
  font-size: 48rpx;
  color: #eeeeee;
  /* font-weight: 500; */
  font-weight: bold;
}
.title-span {
  width: 40rpx;
  height: 6rpx;
  background-color: #ffcd76;
  margin-top: 6rpx;
  margin-left: 28rpx;
  transition: all .5s ease;
  display: block;
}
.title-span-none {
  width: 40rpx;
  height: 6rpx;
  background-color: white;
  margin-top: 6rpx;
  margin-left: 28rpx;
  transition: all .5s ease;
  display: block;
}
.title-location {
  display: flex;
  margin-top: 30rpx;
  margin-left: 152rpx;
  width: 160rpx;
  height: 60rpx;
  border-radius: 4rpx;
  background-color: #f8f8f8;
}
.title-dot {
  width: 20rpx;
  height: 20rpx;
  margin-top: 20rpx;
  margin-left: 20rpx;
  border-radius: 100%;
  background-color: #ffcd76;
  display: block;
}
.title-city {
  height: 40rpx;
  margin-left: 20rpx;
  margin-top: 10rpx;
  font-size: 28rpx;
}

.calender {
  text-align: center;
}
.course-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 690rpx;
  margin-left: 30rpx;
  margin-top: 30rpx;
  height: 380rpx;
}
.course-item-img {
  height: 380rpx;
  width: 380rpx;
}

.class-search {
  /* position: relative; */
  margin: 30rpx 30rpx 0;
  width: 690rpx;
  height: 80rpx;
  border: solid 2rpx #ffdea5;
  background-color: #ffffff;
  font-size: 28rpx;
  letter-spacing: 0.2rpx;
}

.course-picker {
  width: 690rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 30rpx;
  padding-right: 30rpx;
}

.class-search-word {
  height: 40rpx;
  color: #b2b2b2;
  flex: auto;
}
.class-search-type {
  height: 40rpx;
  text-align: right;
  color: #ffcd76;
}
.class-item {
  position: relative;
  margin: 30rpx 30rpx 0;
  width: 690rpx;
  height: 400rpx;
}
.class-item-images, .class-item-img {
  width: 690rpx;
  height: 400rpx;
}
.class-item-mask {
  position: absolute;
  left: 0rpx;
  bottom: 0rpx;
  width: 690rpx;
  height: 200rpx;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
}
.class-item-content {
  position: absolute;
  left: 30rpx;
  bottom: 30rpx;
  color: #ffffff;
}
.class-item-type {
  /* width: 274rpx; */
  height: 32rpx;
  font-size: 22rpx;
}
.class-item-name {
  /* width: 170rpx; */
  height: 48rpx;
  font-size: 34rpx;
}

.stores-select {
  position: relative;
  margin: 30rpx 30rpx 0;
  width: 690rpx;
  height: 80rpx;
  border: solid 2rpx #ffdea5;
  background-color: #ffffff;
  font-size: 28rpx;
  letter-spacing: 0.2rpx;
}
.stores-select-word {
  margin-top: 20rpx;
  margin-left: 30rpx;
  /* width: 114rpx; */
  height: 40rpx;
  color: #b2b2b2;

}
.stores-select-type {
  position: absolute;
  right: 30rpx;
  top: 20rpx;
  height: 40rpx;
  text-align: right;
  color: #ffcd76;
}
.stores-item {
  display: flex;
  align-items: center;
  margin: 30rpx 30rpx 0;
  width: 690rpx;
  height: 180rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
}
.stores-item-img {
  margin: 30rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 100%;
  background-color: #dfe6ed;
}
.stores-item-word {
  position: relative;
  width: 480rpx;
  height: 120rpx;
}
.stores-item-name {
  height: 48rpx;
  font-size: 34rpx;
  color: #232323;
}
.stores-item-location {
  height: 32rpx;
  font-size: 22rpx;
  color: #888888;
}
.stores-item-instance {
  position: absolute;
  right: 0;
  height: 32rpx;
  font-size: 22rpx;
  text-align: right;
  color: #b2b2b2;
}

.course-item-default {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.default-img {
  width: 500rpx;
  height: 300rpx;
  margin-top: 260rpx;
}
</style>
