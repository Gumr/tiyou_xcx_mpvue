<template>
  <div class="page">
    <div class="course-info">
      <div class="item-title">
        <span class="border"></span>
        <span class="title">上课时间</span>
      </div>

      <div class="course-time">
        {{ order.date }} 
        {{ order.startTime }}-{{ order.endTime }}
      </div>

      <div class="item-title">
        <span class="border"></span>
        <span class="title">课程</span>
      </div>

      <div class="course-name-box" @click="toCourseInfo(order.courseId)">
        <div class="name-left">
          <div>{{ order.courseTitle }}</div>
          <div class="set-color">{{ order.secondCategoryName }}</div>
        </div>
        <image mode='aspectFill'
          v-if="order.cardStatusCode !== 4"
          class="right-img"
          src="../../../static/icon/ic_right.png"
        />
      </div>

      <div class="item-title">
        <span class="border"></span>
        <span class="title">地点</span>
      </div>

      <div class="course-name-box" @click="toStores(order.storeId)">
        <div class="name-left">
          <div>{{ order.storeName }}</div>
          <div class="set-color">{{ order.address }}</div>
        </div>
        <image mode='aspectFill'
          v-if="order.cardStatusCode !== 4"
          class="right-img"
          src="../../../static/icon/ic_right.png"
        />
      </div>
    </div>

    <!-- 预约信息 -->
    <div class="course-info">
      <div class="item-title">
        <span class="border"></span>
        <span class="title">预约时间</span>
      </div>

      <div class="booking-content">
        <div class="item">
          <span class="booking-title">上课宝宝</span>
          <span>
            {{ order.childName }}
            ({{ order.birthday }}岁)</span>
        </div>

        <div class="item">
          <span class="booking-title">预约方式</span>
          <span
            v-if="order.payType === 1 && order.card && (order.card.cardType.code === 'TY1001' || order.card.cardType.code === 'TY1002')"
          >
            年卡
          </span>
          <span
            v-if="order.payType === 1 && order.card && order.card.cardType.code === 'TY1003'"
          >
            体验卡
          </span>
          <span
            v-if="order.payType === 1 && order.card && order.card.cardType && order.card.cardType.topCategories && order.card.cardType.topCategories[0] && order.card.cardType.topCategories[0].id === 3"
          >
            试听卡
          </span>
          <span
            v-if="order.payType === 3"
          >
            微信支付
          </span>
          <span v-if="order.payType === 4">
            课时
          </span>
        </div>

        <div class="item">
          <span class="booking-title">预约时间</span>
          <span>{{ order.createdAt }}</span>
        </div>
      </div>
    </div>

    <!-- 开班情况 -->
    <div class="start-class">
      <div class="item-title">
        <span class="border"></span>
        <span class="title">开班情况</span>
      </div>

      <div class="booked-content">
        <p class="booked-content-p1" :style="{left: order.moveWidth + 'rpx'}">
          <span class="booked-content-p1-yellow">{{ order.bookedNumbers }}</span>/{{ order.maxMembers }}
        </p>
        <span class="booked-content-bg"></span>
        <span class="booked-content-slider" :style="{width: order.moveWidth + 'rpx'}"></span>
        <span class="booked-content-bot" :style="{left: order.moveWidth + 'rpx'}"></span>
        <span class="booked-content-line" :style="{left: order.moveWidthTotal + 'rpx'}"></span>
        <div class="booked-content-word" :style="{left: order.memberMove + 'rpx'}">满{{ order.minMembers }}人开班</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapActions
} from 'vuex'

export default {
  props: {
    order: {
      type: Object,
      default: () => ({
        classSchedule: {}
      })
    }
  },

  components: {
  },

  data () {
    return {
      // 开班情况
      numWidth: 40,
      sliderWidth: 0,
      botWidth: 0,
      lineWidth: 58,
      wordWidth: 20
    }
  },

  methods: {
    ...mapActions('course', [
      'vuexSetCourseInfo'
    ]),

    toCourseInfo (id) {
      if (this.order.cardStatusCode === 4) return
      const data = {
        courseId: id
      }
      this.vuexSetCourseInfo(data)
      wx.navigateTo({
        url: `../../courseInfo/main`
      })
    },

    toStores (id) {
      if (this.order.cardStatusCode === 4) return
      wx.navigateTo({
        url: `../../stores/main?storeId=${id}`
      })
    }
  },

  onLoad () {
    console.log('detail order', this.order)
  }
}
</script>

<style scoped>
.page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.course-info {
  width: 690rpx;
  box-sizing: border-box;
  padding: 30rpx;
  margin-top: 30rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
  margin-bottom: 30rpx;
}

.item-title {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.border {
  width: 4rpx;
  height: 24rpx;
  border-radius: 4rpx;
  background-color: #ffcd76;
  margin-right: 10rpx;
}

.title {
  font-size: 28rpx;
  font-weight: 500;
  color: #b2b2b2;
}

.course-time {
  width: 690rpx;
  text-align: center;
  font-size: 48rpx;
  color: #232323;
  margin-bottom: 30rpx;
  font-family: 'League Gothic'
}

.right-img {
  width: 48rpx;
  height: 48rpx;
}

.course-name-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.name-left {
  display: flex;
  flex-direction: column;
  font-size: 34rpx;
  font-weight: 500;
  color: #232323;
  flex: auto;
  width: 460rpx;
  text-align: center;
}

.set-color {
  font-size: 22rpx;
  color: #b2b2b2;
}

.booking-content {
  margin-top: 30rpx;
  margin-left: 24rpx;
  font-size: 28rpx;
}

.booking-title {
  margin-right: 60rpx;
  color: #b2b2b2;
}

.item {
  display: flex;
  align-items: center;
  color: #232323;
  margin-bottom: 10rpx;
}

.booked-content {
  width: 570rpx;
  height: 162rpx;
  position: relative;
  margin-left: 24rpx;
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
  /* left: 60rpx; */
  width: 570rpx;
  height: 10rpx;
  border-radius: 6rpx;
  background-color: #f8f8f8;
}
.booked-content-slider {
  position: absolute;
  top: 100rpx;
  /* left: 60rpx; */
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
</style>
