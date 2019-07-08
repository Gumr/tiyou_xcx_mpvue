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
    <div :class="[ order.classSchedule.setStatus ? 'border' : 'set-border']"></div>
    <div class="content">
      <div class="content-top">
        <div :class="[ order.classSchedule.setStatus ? 'set-time' : 'time' ]">{{ order.classSchedule.date }} {{ order.classSchedule.startTime }}-{{ order.classSchedule.endTime }}</div>
        <div class="class-status" v-if="!order.classSchedule.setStatus">
          (未开班)
        </div>
        <div v-else class="start-class">
          (已开班)
        </div>
        <div :class="[ order.classSchedule.setStatus ? 'set-content' : '']">{{ order.classSchedule.bookedNumbers }}/{{ order.classSchedule.maxMembers }}</div>
      </div>
      <div class="course">
        <div class="course-left">
          <div class="title-box">
            <span class="title">{{ order.course && order.course.title }}</span>
            <span class="xilie">{{ order.course && order.course.secondCategory && order.course.secondCategory.name }}</span>
          </div>
          <div class="address">{{ order.classSchedule.store && order.classSchedule.store.address }}</div>
          <div class="user" v-if="order.payType === 1 && order.card && (order.card.cardType.code === 'TY1001' || order.card.cardType.code === 'TY1002')">
            学员：{{ order.child && order.child.name }} (年卡)
          </div>
          <div class="user" v-if="order.payType === 1 && order.card && order.card.cardType.code === 'TY1003'">
            学员：{{ order.child && order.child.name }} (体验卡)
          </div>
          <div class="user" v-if="order.payType === 1 && order.card && order.card.cardType && order.card.cardType.topCategories && order.card.cardType.topCategories[0] && order.card.cardType.topCategories[0].id === 3">
            学员：{{ order.child && order.child.name }} (试听卡)
          </div>
          <div class="user" v-if="order.payType === 3">
            学员：{{ order.child && order.child.name }} (微信支付)
          </div>
          <div class="user" v-if="order.payType === 4">
            学员：{{ order.child && order.child.name }} (课时)
          </div>
          <div class="user" v-if="!order.payType">
            学员：{{ order.child && order.child.name }}
          </div>
        </div>
        <div class="course-r" v-if="order.classSchedule.setStatus" @click.stop="toCode">
          签到
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
      this.codeStatus = 1
      let data = {
        status: this.codeStatus
      }
      // 模态框显示无法滚动页面
      this.$emit('setHeight', data)
    },

    closeToast (options) {
      this.codeStatus = options.status
      let data = {
        status: this.codeStatus
      }
      this.$emit('setHeight', data)
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

.set-time {
  color: #ffcd76;
  flex: auto;
}

.start-class {
  color: #ffcd76;
  margin-right: 10rpx;
  font-size: 22rpx;
}

.set-content {
  color: #ffcd76;
}
</style>
