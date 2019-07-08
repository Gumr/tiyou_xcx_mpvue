<template>
<div :class="[ codeStatus ? 'code-wrap' : 'wrap']">
<!-- <div class="wrap"> -->
  <div v-if="codeStatus">
    <WqrCode 
      @closeToast="closeToast"
      :orderId="info.id"
    />
  </div>
  <div class="page">
    <WorderDetail
      :order="info"
    />
    <div class="btn-box">
      <div class="check-in" @click="toCode">
        <Wbutton 
          text="签到"
          size="size330"
          :bgColor="bgColor"
        />
      </div>
      <div class="cancel" @click="cancel">
        <Wbutton 
          text="取消"
          size="size330"
          bgColor="white-confirm"
        />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import WorderDetail from '@/components/order/orderDetail'
import Wbutton from '@/components/Button'
import WqrCode from '@/components/order/qrCode'

export default {
  components: {
    WorderDetail,
    Wbutton,
    WqrCode
  },

  data () {
    return {
      info: {},
      codeStatus: 0,
      bgColor: 'confirm',
      // 签到是否可以点击
      status: 1
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
        storeName: res.classSchedule.store.name,
        address: res.classSchedule.store.address,
        courseTitle: res.course.title,
        secondCategoryName: res.course.secondCategory.name,
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
        storeId: res.classSchedule.store.id,
        id: res.id,
        card: res.card,
        cardStatusCode: this.$wxApi.getCardCode(res.card && res.card.cardType && res.card.cardType.code, res.card && res.card.cardType && res.card.cardType.topCategories),
        payType: res.payType
      }
      if (this.info.bookedNumbers < this.info.minMembers) {
        this.bgColor = 'not-clickable'
        this.status = 0
      }
    },

    // 签到（二维码）
    toCode () {
      if (this.status === 0) return
      this.codeStatus = 1
    },

    closeToast (options) {
      this.codeStatus = options.status
    },

    // 取消课程
    async cancel () {
      wx.showModal({
        title: '提示',
        content: '确认取消该课程',
        success: (res) => {
          if (res.confirm) {
            let id = this.info.id
            this.$api.order.cancelOrder(id)
              .then(r => {
                if (r.msg) return
                wx.showToast({
                  title: '取消成功',
                  icon: 'none'
                })
              })
          }
        }
      })
    },

    initState () {
      this.codeStatus = 0
      this.info = {}
      this.bgColor = 'confirm'
      this.status = 1
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
.code-wrap {
  height: 100vh;
  overflow: hidden;
}

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
