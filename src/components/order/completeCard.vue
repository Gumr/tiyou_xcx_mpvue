<template>
<!-- 已完成 -->
<div class="wrap">
  <div class="page">
    <div class="border'"></div>
    <div class="content">
      <div class="content-top">
        <div class="time">{{ order.classSchedule.date }} {{ order.classSchedule.startTime }}-{{ order.classSchedule.endTime }}</div>
        <!-- <div class="class-status" v-if="!order.classSchedule.setStatus">
          (未开班)
        </div> -->
        <div class="start-class">
          (已完成)
        </div>
        <div>{{ order.classSchedule.bookedNumbers }}/{{ order.classSchedule.maxMembers }}</div>
      </div>
      <div class="course">
        <div class="course-left">
          <div class="title-box">
            <span class="title">{{ order.course && order.course.title }}</span>
            <span class="xilie">系列</span>
          </div>
          <div class="address">{{ order.classSchedule.store && order.classSchedule.store.address }}</div>
          <div class="user" v-if="order.payType === 1 && order.card && (order.card.cardType.code === 'TY1001' || order.card.cardType.code === 'TY1002')">
            学员：{{ order.child && order.child.name }} (年卡)
          </div>
          <div class="user" v-if="order.payType === 1&& order.card && order.card.cardType.code === 'TY1003'">
            学员：{{ order.child && order.child.name }} (体验卡)
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
        <div v-if="!order.comments.length" class="course-r" @click.stop="toComment(1)" key="noComments">
          评价
        </div>
        <div v-else key="hasComments" class="change-comment" @click.stop="toComment(2)">
          修改评价
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },

  components: {
  },

  data () {
    return {
    }
  },

  methods: {
    toComment (type) {
      let data = {
        courseId: this.order.courseId,
        classScheduleId: this.order.classScheduleId,
        orderId: this.order.id
      }
      let commentId = ''
      if (type === 2) {
        commentId = this.order.comments && this.order.comments[0].id
      }
      wx.navigateTo({
        url: `../packageMe/orderComment/main?courseId=${data.courseId}&classScheduleId=${data.classScheduleId}&orderId=${data.orderId}&type=${type}&commentId=${commentId}`
      })
    }
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
  color: #ffdea5;
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

.change-comment {
  width: 120rpx;
  height: 120rpx;
  line-height: 120rpx;
  text-align: center;
  color: #fff;
  font-size: 24rpx;
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
