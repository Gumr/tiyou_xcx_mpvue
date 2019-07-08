<template>
  <div class="page">
    <button id="phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" />
    <!-- ui -->
    <!-- <div class="store-table">
      <div class="course-item">
        <div class="course-img">
          <image mode='aspectFill' class="img" :src="info.courseImg || defaultImg" />
        </div>

        <div class="course-time">{{ info.startTime }}-{{ info.endTime }}</div>

        <div class="course-content">
          <div class="course-content-word">
            <div class="course-content-name-box">
              <span class="course-content-name">
                {{ info.courseName }}
              </span>
              <span class="info-price">¥ {{ info.price }}</span>
            </div>
            <p class="course-content-type">{{ info.courseType }}</p>
          </div>
          <div class="course-date  course-dateYellow"
            >
            {{ info.bookedNum }}/{{ info.maxMembers }}
          </div>
          <div class="members">
            (满{{ info.minMembers }}人开课)
          </div>
          <div v-if="phone === 0" key="hasPhone"
            :class="['course-item-btn', info.bookedNum < info.maxMembers ? 'course-item-btnYellow' : 'course-item-btnGray']"
          >
            <p v-if="info.bookedNum < info.maxMembers" 
              @click="toBooking"
              class="course-item-btn-word">预约</p>
            <p v-if="info.bookedNum >= info.maxMembers" class="course-item-btn-word">已满</p>
          </div>
          <label for="phone" v-else key="noPhone" :class="['course-item-btn', info.bookedNum < info.maxMembers ? 'course-item-btnYellow' : 'course-item-btnGray']">
            <p v-if="info.bookedNum < info.maxMembers " class="course-item-btn-word">预约</p>
            <p v-if="info.bookedNum >= info.maxMembers" class="course-item-btn-word">已满</p>
          </label>
        </div>

      </div>
    </div> -->
    <div class="card">
      <div :class="[ info.classStatus === 0 ? 'border' : 'set-border' ]"></div>
      <!-- 精品课 topId 3 -->
      <image
        mode='aspectFill'
        class="top-img"
        v-if="info.topId === 3"
        src="../../static/icon/is_topid3.png"
      />
      <div class="content-right">
        <div class="card-top">
          <div class="card-time">{{ info.startTime }}-{{ info.endTime }}</div>
          <div :class="[ info.classStatus === 0 ? 'card-number' : 'set-card-number']">
            {{ info.bookedNum }}/{{ info.maxMembers }}
          </div>
          <div class="card-members">
            (满{{ info.minMembers }}人开课)
          </div>
          <p class="user-age" v-if="info.ageRange">
            <span>限&nbsp;</span>
            <span :class="[info.classStatus === 1 ? 'age' : 'set-age' ]">
                {{ info.ageRange && info.ageRange.min }}-{{ info.ageRange && info.ageRange.max }} 
            </span>
            <span>&nbsp;岁</span>
          </p>
          <!-- <span :class="[ info.classStatus === 0 ? 'card-price' : 'set-card-price']">¥ {{ info.price }}</span> -->
          <span :class="[ info.classStatus === 0 ? 'card-price-top3' : 'set-card-price-top3']" v-if="info.topId === 3">
            {{ info.lesson || 0 }}
            <span class="lesson-text">
              课时
            </span>
          </span>
          <span :class="[ info.classStatus === 0 ? 'card-price' : 'set-card-price']" v-else>
            {{ info.lesson || 0 }}
            <span class="lesson-text">
              课时
            </span>
          </span>
        </div>
        <div class="card-course-name">
          {{ info.courseName }}
        </div>
        <div class="card-type">
          {{ info.courseType }}
        </div>

        <div v-if="phone === 0" key="hasPhone"
          :class="['course-item-btn', info.bookedNum < info.maxMembers && (info.status === 4 || info.status === 3) ? 'course-item-btnYellow' : 'course-item-btnGray']"
        >
          <p v-if="info.classStatus === 0" 
            @click="toBooking"
            class="course-item-btn-word">预约</p>
          <!-- <p v-if="info.bookedNum >= info.maxMembers" class="course-item-btn-word">结束</p> -->
          <span class="my-span" v-else>
            <p v-if="info.status === 1 || info.status === 6 || info.status === 3" class="course-item-btn-word">满课</p>
            <p v-if="info.status === 5 || info.status === 7" class="course-item-btn-word">结束</p>
          </span>
        </div>
        <label for="phone" v-else key="noPhone" :class="['course-item-btn', info.bookedNum < info.maxMembers && (info.status === 4 || info.status === 3) ? 'course-item-btnYellow' : 'course-item-btnGray']">
          <p v-if="info.classStatus === 0" class="course-item-btn-word">预约</p>
          <span class="my-span" v-else>
            <p v-if="info.status === 1 || info.status === 6 || info.status === 3" class="course-item-btn-word">满课</p>
            <p v-if="info.status === 5 || info.status === 7" class="course-item-btn-word">结束</p>
          </span>
          <!-- <p v-if="info.bookedNum >= info.maxMembers" class="course-item-btn-word">结束</p> -->
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => ({})
    }
  },

  components: {
  },

  data () {
    return {
      a: 0,
      defaultImg: 'https://api.tiyou.techoiceness.com/v1/static/images/img_default.png',
      phone: 0
    }
  },

  methods: {
    toBooking () {
      this.$emit('toBooking')
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
    },

    getPhoneNumber (e) {
      const _token = wx.getStorageSync('token')
      if (_token) {
        this.$wxLogin.wxLogin(this)
        this.$wxLogin.getPhoneNumber(e, this)
      }
    }
  },

  onLoad () {
    this.phone = 0
    console.log('info', this.info)
    this.getUserInfo()
  }
}
</script>

<style scoped>
.course-img {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 400rpx;
  height: 240rpx;
}

.card {
  position: relative;
}

.img {
  width: 400rpx;
  height: 240rpx;
}

.course-item-btn {
  position: absolute;
  right: 30rpx;
  bottom: 30rpx;
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

/* .course-item {
  position: relative;
  width: 690rpx;
  height: 240rpx;
} */

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
  bottom: 18rpx;
  left: 30rpx;
  width: 44rpx;
  height: 42rpx;
  font-family: 'League Gothic';
  font-size: 34rpx;
  text-align: right;
}

.members {
  position: absolute;
  z-index: 4;
  bottom: 22rpx;
  left: 90rpx;
  font-size: 22rpx;
  color: #b2b2b2;
}

.course-dateYellow {
  color: #ffcd76;
}
.course-dateGray {
  color: #c8d2dc;
}

.course-content {
  position: absolute;
  z-index: 2;
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
  margin-right: 30rpx;
}
.course-content-name {
  width: 200rpx;
  height: 48rpx;
  font-weight: 500;
  font-size: 34rpx;
  color: #232323;
  overflow: hidden;
}
.course-content-name-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.course-content-type {
  width: 274rpx;
  height: 32rpx;
  font-size: 22rpx;
  color: #b2b2b2;
}

.info-price {
  width: 90rpx;
  overflow: hidden;
  font-size: 48rpx;
  color: #ffcd76;
  flex: auto;
  text-align: right;
  font-family: 'League Gothic'
}

.price {
  font-size: 48rpx;
  color: #c8d2dc;
  font-family: 'League Gothic'
}

/* ui */
.card {
  width: 690rpx;
  height: 182rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #fff;
  display: flex;
  margin-top: 30rpx;
}

.border {
  width: 10rpx;
  height: 182rpx;
  background-color: #ffdea5;
  margin-right: 30rpx;
}

.set-border {
   width: 10rpx;
  height: 182rpx;
  background-color: #c8d2dc;
  margin-right: 30rpx;
}

.content-right {
  width: 650rpx;
  height: 182rpx;
  box-sizing: border-box;
  padding: 10rpx 30rpx 30rpx 0;
  position: relative;
}

.card-time {
  font-family: 'League Gothic';
  font-size: 34rpx;
  color: #c8d2dc;
  margin-right: 30rpx;
}

.card-number {
  color: #ffcd76;
  font-family: 'League Gothic';
  font-size: 34rpx;
  margin-right: 20rpx;
}

.set-card-number {
  color: #c8d2dc;
  font-family: 'League Gothic';
  font-size: 34rpx;
  margin-right: 20rpx;
}

.card-top {
  display: flex;
  align-items: center;
}

.card-members {
  font-size: 22rpx;
  color: #b2b2b2;
  margin-right: 10rpx;
}

.card-course-name {
  width: 400rpx;
  height: 48rpx;
  line-height: 48rpx;
  font-weight: 500;
  color: #232323;
  overflow: hidden;
  text-overflow: ellipsis
}

.card-type {
  width: 400rpx;
  height: 32rpx;
  line-height: 32rpx;
  font-size: 22rpx;
  color: #b2b2b2;
  overflow: hidden;
  text-overflow: ellipsis
}

.card-price {
  font-size: 48rpx;
  color: #ffcd76;
  flex: auto;
  text-align: right;
  font-family: 'League Gothic';
  display: flex;
  justify-content: flex-end;
}

.card-price-top3 {
  font-size: 48rpx;
  color: #ffcd76;
  margin-right: 60rpx;
  flex: auto;
  text-align: right;
  font-family: 'League Gothic';
  display: flex;
  justify-content: flex-end;
}

.lesson-text {
  font-size: 22rpx;
  font-weight: 500;
  color: #c8d2dc;
  margin-left: 10rpx;
}

.set-card-price {
  font-size: 48rpx;
  color: #b2b2b2;
  flex: auto;
  text-align: right;
  font-family: 'League Gothic';
  display: flex;
  justify-content: flex-end;
}

.set-card-price-top3 {
  font-size: 48rpx;
  color: #b2b2b2;
  margin-left: 30rpx;
  text-align: right;
  margin-right: 60rpx;
  font-family: 'League Gothic';
  display: flex;
  justify-content: flex-end;
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

.my-span {
  display: flex;
}

.top-img {
  width: 100rpx;
  height: 100rpx;
  position: absolute;
  right: -10rpx;
  top: -10rpx;
  z-index: 80;
}
</style>
