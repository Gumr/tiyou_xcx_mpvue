<template>
<div class="wrap">
  <div class="page">
    <WorderDetail
      :order="info"
    />
    <div class="btn-box">
      <Wbutton 
        :text="text"
        size="size690"
        bgColor="not-clickable"
      />
    </div>
  </div>
</div>
</template>

<script>
import WorderDetail from '@/components/order/orderDetail'
import Wbutton from '@/components/Button'

export default {
  components: {
    WorderDetail,
    Wbutton
  },

  data () {
    return {
      info: {},
      bgColor: 'confirm',
      text: '未开班'
      // 签到是否可以点击
    }
  },

  methods: {
    async getDetail (id) {
      let res = await this.$api.order.orderDetail(id)
      if (res.msg) return
      // 计算开办情况的界面移动 总长度未570
      // 当前白点移动距离
      const moveWidth = res.classSchedule.bookedNumbers / res.classSchedule.maxMembers * 570
      // 开班人数达标点
      const moveWidthTotal = res.classSchedule.minMembers / res.classSchedule.maxMembers * 570 + 8
      // const moveWidth = 1 / 2 * 570
      // 开班人数达标点
      // const moveWidthTotal = 1 / 2 * 570 + 8
      this.info = {
        date: this.$wxApi.getTime(res.classSchedule.date),
        startTime: this.$wxApi.getStartTime(res.classSchedule.startTime),
        endTime: this.$wxApi.getStartTime(res.classSchedule.endTime),
        createdAt: this.$wxApi.createdTime(res.createdAt),
        birthday: this.$wxApi.getChildYears(res.child && res.child.birthday),
        childName: res.child && res.child.name,
        storeName: res.classSchedule && res.classSchedule.store.name,
        address: res.classSchedule && res.classSchedule.store.address,
        courseTitle: res.course && res.course.title,
        secondCategoryName: res.course && res.course.secondCategory.name,
        moveWidthTotal,
        moveWidth,
        memberMove: moveWidthTotal - 60,
        // 当前人数
        bookedNumbers: res.classSchedule.bookedNumbers,
        // 总人数
        maxMembers: res.classSchedule.maxMembers,
        // 最小开班人数
        minMembers: res.classSchedule.minMembers,
        courseId: res.course.id,
        storeId: res.classSchedule && res.classSchedule.store.id,
        id: res.id,
        card: res.card,
        payType: res.payType
      }
      if (this.info.bookedNumbers < this.info.minMembers) {
        this.bgColor = 'not-clickable'
        this.status = 0
      }
      if (res.status === 6) {
        this.text = '自主取消'
      }
      if (res.status === 7) {
        this.text = '未开班'
      }
    },

    initState () {
      this.info = {}
      this.bgColor = 'confirm'
      this.status = 1
      this.text = '未开班'
    }
  },

  onUnload () {
    this.initState()
  },

  onLoad (options) {
    let { orderId } = options
    this.getDetail(orderId)
  }
}
</script>

<style scoped>
.wrap {
  padding-bottom: 260rpx;
}

.btn-box {
  width: 100%;
  height: 178rpx;
  position: fixed;
  box-sizing: border-box;
  padding: 30rpx 30rpx 0 30rpx;
  bottom: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
}
</style>
