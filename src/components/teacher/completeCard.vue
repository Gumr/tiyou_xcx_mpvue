<template>
<div class="wrap">
  <div class="page">
    <div v-if="codeStatus">
      <WqrCode
        @closeToast="closeToast"
        isPackage=""
        :orderId="order.id"
      />
    </div>
    <div :class="[ order.setStatus ? 'border' : 'set-border']"></div>
    <div class="content">
      <div class="content-top">
        <div :class="[ order.setStatus ? 'time' : 'set-time']">{{ order.date }} {{ order.startTime }}-{{ order.endTime }}</div>
        <!-- <div class="class-status" v-if="!order.setStatus">
          (未开班)
        </div>
        <div v-else class="start-class">
          (已开班)
        </div> -->
        <div :class="[ order.setStatus ? 'number' : 'set-number']">{{ order.bookedNumbers }}/{{ order.maxMembers }}</div>
      </div>
      <div class="course">
        <div class="course-left">
          <div class="title-box">
            <span class="title">{{ order.course.title }}</span>
            <span class="xilie">{{ order.course && order.course.secondCategory && order.course.secondCategory.name }}</span>
          </div>
          <div class="address">{{ order.store && order.store.address }}</div>
          <div class="user" v-if="order.courseOrders.length" key="hasChild">
            学员：<span v-for="(item, index) in order.courseOrders" :key="index">
              {{ item.child && item.child.name }}
              <span v-if="order.courseOrders.length - index !== 1 && item.child.name">
                、
              </span>
            </span>
          </div>
          <div class="user" v-else key="noChild">
            学员：暂无
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import WqrCode from '@/components/order/qrCode'
export default {
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },

  components: {
    WqrCode
  },

  data () {
    return {
      codeStatus: 0
    }
  },

  methods: {
    toCode () {
      console.log('---')
      this.codeStatus = 1
    },

    closeToast (options) {
      this.codeStatus = options.status
    },

    initState () {
      this.codeStatus = 0
    }
  },

  onUnload () {
    this.initState()
  },

  onLoad () {
  }
}
</script>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page {
  display: flex;
  align-items: center;
  width: 690rpx;
  height: 100%;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #fff;
  margin-bottom: 30rpx;
}

.number {
  color: #ffdea5;
}

.set-number {
  color: #dfe6ed;
}

.border {
  width: 10rpx;
  height: 288rpx;
  background-color: #ffdea5;
}

.set-border {
  width: 10rpx;
  height: 288rpx;
  background-color: #dfe6ed;
}

.time {
  flex: auto;
  color: #ffdea5
}

.set-time {
  flex: auto;
  color: #c8d2dc;
}

.content {
  box-sizing: border-box;
  padding: 30rpx;
  flex: auto;
  width: 330rpx;
}

.content-top {
  margin-bottom: 20rpx;
  font-size: 34rpx;
  color: #c8d2dc;
  font-family: 'League Gothic';
  display: flex;
  align-items: center;
}

.title-box {
  margin-bottom: 20rpx;
}

.title {
  font-size: 34rpx;
  color: #232323;
  margin-right: 30rpx;
}

.xilie {
  font-size: 22rpx;
  color: #b2b2b2;
}

.user {
  font-size: 22rpx;
  color: #b2b2b2;
}

.address {
  font-size: 22rpx;
  color: #888;
  margin-bottom: 20rpx;
}

.time {
  flex: auto;
}

.course {
  display: flex;
  align-items: center;
}

.course-left {
  flex: auto;
  width: 460rpx;
}

.course-r {
  width: 120rpx;
  height: 120rpx;
  line-height: 120rpx;
  text-align: center;
  color: #fff;
  font-size: 34rpx;
  font-weight: 500;
  border-radius: 50%;
  box-shadow: 0 16rpx 16rpx -8rpx #ffdea5;
  background-color: #ffcd76;
}

.class-status {
  font-size: 22rpx;
  color: #eee;
  margin-right: 10rpx;
}

.start-class {
  color: #ffcd76;
  margin-right: 10rpx;
  font-size: 22rpx;
}
</style>
