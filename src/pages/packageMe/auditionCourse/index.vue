<template>
  <div class="page">
    <CalendarWeek
      :calendarClass="calendarClass"
      calendartype="classIndex"
      :dayList="dayList"
      @setDateByCalender="setDateByCalender"
    />
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
  </div>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'
import moment from 'moment'
import CalendarWeek from '@/components/calendar/CalendarWeek'
import TableCard from '@/components/table/TableCard'

export default {
  components: {
    CalendarWeek,
    TableCard
  },

  data () {
    return {
      calendarClass: [
        {
          date: 0,
          remainingNumber: 0
        }
      ],
      dayList: [],
      classList: [],
      calenDerIndex: 0
    }
  },

  computed: {
    ...mapGetters('myLocation', [
      'vuexGetLocation'
    ]),

    ...mapGetters('auditionCard', [
      'vuexGetAuditionInfo'
    ])
  },

  methods: {
    ...mapActions('course', [
      'vuexSetCourseInfo'
    ]),

    ...mapActions('calendar', [
      'vuexSetCalendarList'
    ]),

    ...mapActions('myLocation', [
      'vuexSetLocation'
    ]),

    toCourseInfo4 (id) {
      const data = {
        courseId: id
      }
      this.vuexSetCourseInfo(data)
      wx.navigateTo({
        url: `../auditionCourseInfo/main?index=${this.calenDerIndex}`
      })
    },

    // 获取30天日历信息
    async getCalender () {
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
        audition
      }
      const res = await this.$api.class.getCalendarV2(data)
      this.calendarClass = [ ...this.$wxApi.getDayList(res) ]
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
          this.getCalender()
          // const now = moment().format('YYYY-MM-DD')
          // const twoDay = moment().add(1, 'days').format('YYYY-MM-DD')
          // this.getClassList(now, twoDay)
        }
      })
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

    // 获取某天课表
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
        info,
        now,
        twoDay,
        audition
      }
      const res = await this.$api.class.getClassByOneDayV2(data)
      if (res.msg) return
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
      if (res.list.length <= 0) {
        this.classList = []
      }
    },

    // 日历，点击日期
    setDateByCalender (options) {
      const now = options.date
      this.calenDerIndex = options.index
      const twoDay = moment(now).add(1, 'days').format('YYYY-MM-DD')
      this.getClassList(now, twoDay)
    },

    initState () {
      this.calendarClass = [{
        date: 0,
        remainingNumberL: 0
      }]
      this.dayList = []
      this.classList = []
      this.calenDerIndex = 0
    }
  },

  onLoad () {
    this.getCalender()
  },

  onShow () {
    if (this.dayList.length) {
      this.vuexSetCalendarList(this.dayList)
    }
    if (this.vuexGetLocation.status === 1) {
      this.getUserLocation()
    }
  },

  onUnload () {
    this.initState()
  }
}
</script>

<style scoped>
.page {
  width: 100%;
  padding-bottom: 160rpx;
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
