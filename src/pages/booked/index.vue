<template>
<div :class="[ qrStatus ? 'set-wrap' : '' ]">
  <div :class="[ AppIsIpx ? 'isx-wrap' : 'wrap']">
    <!-- <div v-if="codeStatus">
      <WqrCode
        @closeToast="closeToast"
      />
    </div> -->
    <div class="title">
      <div class="titie-item" @click="changeTitle(1)">
        <p :class="titleStatus === 1 ? 'title-p' : 'title-p-none'">待签到</p>
        <span :class="['title-span', titleStatus === 1 ? 'title-span-have' : 'title-span-none']"></span>
      </div>
      <div class="titie-item" @click="changeTitle(2)">
        <p :class="titleStatus === 2 ? 'title-p' : 'title-p-none'">已取消</p>
        <span :class="['title-span', titleStatus === 2 ? 'title-span-have' : 'title-span-none']"></span>
      </div>
      <div class="titie-item" @click="changeTitle(3)">
        <p :class="titleStatus === 3 ? 'title-p' : 'title-p-none'">已完成</p>
        <span :class="['title-span', titleStatus === 3 ? 'title-span-have' : 'title-span-none']"></span>
      </div>
    </div>
    <div class="content">
      <div v-if="titleStatus === 1">
        <div v-for="(item, index) in waitOrderList" :key="index" @click="toWaitOrder(item.id)">
          <waitCard
            :order="item"
            @toCode="toCode"
            @setHeight="setHeight"
          />
        </div>

        <div v-if="!waitOrderList.length" class="course-item">
          <image mode='aspectFill'
            class="default-img"
            src="https://api.tiyou.techoiceness.com/v1/static/images/no-data.png"
          />
        </div>
      </div>

      <div v-if="titleStatus === 2">
        <div v-for="(item, index) in cancelList" :key="index" @click="toCancelOrder(item.id)">
          <cancelCard
            :order="item"
          />
        </div>

        <div v-if="!cancelList.length" class="course-item">
          <image mode='aspectFill'
            class="default-img"
            src="https://api.tiyou.techoiceness.com/v1/static/images/no-data.png"
          />
        </div>
      </div>
      
      <div v-if="titleStatus === 3">
        <div v-for="(item, index) in completeList" :key="index" @click="toCompleteOrder(item.id)">
          <completeCard
            :order="item"
          />
        </div>

        <div v-if="!completeList.length" class="course-item">
          <image mode='aspectFill'
            class="default-img"
            src="https://api.tiyou.techoiceness.com/v1/static/images/no-data.png"
          />
        </div>
      </div>
    </div>
    <WTabBar />
  </div>
</div>
</template>

<script>
import WTabBar from '@/components/TabBar'
import waitCard from '@/components/order/waitCard'
import completeCard from '@/components/order/completeCard'
import cancelCard from '@/components/order/cancelCard'
import WqrCode from '@/components/order/qrCode'

export default {
  data () {
    return {
      // 默认待签到
      titleStatus: 1,
      waitOrderList: [],
      completeList: [],
      cancelList: [],
      codeStatus: 0,
      qrStatus: 0,
      page1: 1,
      page2: 1,
      noData2: 1,
      // 有数据 1
      noData1: 1,
      page3: 1,
      noData3: 1,
      // 正在加载
      loading: 1
    }
  },

  components: {
    WTabBar,
    waitCard,
    completeCard,
    cancelCard,
    WqrCode
  },

  methods: {
    setHeight (options) {
      let { status } = options
      this.qrStatus = status
    },

    changeTitle (status) {
      if (status === this.titleStatus) return
      this.titleStatus = status
      let data = {}
      if (this.titleStatus === 1) {
        this.page1 = 1
        this.noData1 = 1
        this.waitOrderList = []
        data = {
          status: [3],
          page: this.page1
        }
        this.getMyOrder(data)
      }
      if (this.titleStatus === 2) {
        this.page2 = 1
        this.noData2 = 1
        this.cancelList = []
        data = {
          status: [6, 7],
          page: this.page2
        }
        this.getCancelOrder(data)
      }
      if (this.titleStatus === 3) {
        this.page3 = 1
        this.noData3 = 1
        this.completeList = []
        data = {
          status: [5, 8, 9],
          page: this.page3
        }
        console.log('tiitle 3')
        this.getCompleteOrder(data)
      }
    },

    toCode (options) {
      this.codeStatus = options.status
    },

    closeToast (options) {
      this.codeStatus = options.status
    },

    // 待签到 list
    async getMyOrder (data) {
      this.loading = 2
      let res = await this.$api.order.myOrder(data)
      this.loading = 1
      if (res.msg) return
      let arr = res.list.map(i => ({
        ...i,
        classSchedule: {
          ...i.classSchedule,
          date: this.$wxApi.getTime(i.classSchedule.date),
          startTime: this.$wxApi.getStartTime(i.classSchedule.startTime),
          endTime: this.$wxApi.getStartTime(i.classSchedule.endTime),
          // 开班情况
          setStatus: i.classSchedule.bookedNumbers < i.classSchedule.minMembers ? 0 : 1
        }
      }))
      this.waitOrderList = [ ...this.waitOrderList, ...arr ]
      let len = res.total - this.waitOrderList.length
      if (len > 0) {
        this.noData1 = 2
      } else {
        this.noData1 = 1
      }
    },

    // 获取已取消 list
    async getCancelOrder (data) {
      this.loading = 2
      let res = await this.$api.order.myOrder(data)
      this.loading = 1
      if (res.msg) return
      let arr = res.list.map(i => ({
        ...i,
        classSchedule: {
          ...i.classSchedule,
          date: this.$wxApi.getTime(i.classSchedule.date),
          startTime: this.$wxApi.getStartTime(i.classSchedule.startTime),
          endTime: this.$wxApi.getStartTime(i.classSchedule.endTime),
          // 开班情况
          setStatus: i.classSchedule.bookedNumbers < i.classSchedule.minMembers ? 0 : 1
        }
      }))
      this.cancelList = [ ...this.cancelList, ...arr ]
      let len = res.total - this.cancelList.length
      if (len > 0) {
        this.noData2 = 2
      } else {
        this.noData2 = 1
      }
    },

    // 已完成 list
    async getCompleteOrder (data) {
      this.loading = 2
      let res = await this.$api.order.myOrder(data)
      console.log('res ==', res)
      this.loading = 1
      if (res.msg) return
      let arr = res.list.map(i => ({
        ...i,
        classSchedule: {
          ...i.classSchedule,
          date: this.$wxApi.getTime(i.classSchedule.date),
          startTime: this.$wxApi.getStartTime(i.classSchedule.startTime),
          endTime: this.$wxApi.getStartTime(i.classSchedule.endTime),
          // 开班情况
          setStatus: i.classSchedule.bookedNumbers < i.classSchedule.minMembers ? 0 : 1
        }
      }))
      this.completeList = [ ...this.completeList, ...arr ]
      let len = res.total - this.completeList.length
      if (len > 0) {
        this.noData3 = 2
      } else {
        this.noData3 = 1
      }
      console.log('this. completeList', this.completeList)
    },

    toWaitOrder (id) {
      wx.navigateTo({
        url: `../packageMe/waitOrder/main?orderId=${id}`
      })
    },

    toCancelOrder (id) {
      wx.navigateTo({
        url: `../packageMe/cancelOrder/main?orderId=${id}`
      })
    },

    toCompleteOrder (id) {
      wx.navigateTo({
        url: `../packageMe/completeOrder/main?orderId=${id}`
      })
    },

    initState () {
      this.titleStatus = 1
      this.waitOrderList = []
      this.completeList = []
      this.codeStatus = 0
      this.qrStatus = 0
      this.page1 = 1
      this.page2 = 1
      this.page3 = 1
      this.noData1 = 1
      this.noData2 = 1
      this.noData3 = 1
      this.loading = 1
    }
  },

  // 上拉加载
  onReachBottom () {
    if (this.loading === 2) return
    // 待签到
    if (this.titleStatus === 1) {
      if (this.noData1 === 2) {
        this.page1 += 1
        let data = {
          status: [3],
          page: this.page1
        }
        // 待签到
        console.log('data', data)
        this.getMyOrder(data)
      }
    }
    if (this.titleStatus === 2) {
      if (this.noData2 === 2) {
        // 取消
        this.page2 += 1
        let data = {
          status: [6, 7],
          page: this.page2
        }
        this.getCancelOrder(data)
      }
    }
    if (this.titleStatus === 3) {
      if (this.noData3 === 2) {
        this.page3 += 1
        let data = {
          status: [5, 8, 9],
          page: this.page3
        }
        this.getCompleteOrder(data)
      }
      // 完成
    }
  },

  created () {
  },

  onShow () {
    wx.hideTabBar()
  },

  onUnload () {
    this.initState()
  },

  onLoad () {
    let data = {
      status: [3]
    }
    this.getMyOrder(data)
  }
}
</script>

<style scoped>
.set-wrap {
  height: 100vh;
  overflow: hidden;
}

.isx-wrap {
  width: 100%;
  padding-bottom: 186rpx;
}
.wrap {
  width: 100%;
  padding-bottom: 120rpx;
}


.title {
  position: fixed;
  top: 0;
  z-index: 100;
  display: flex;
  width: 100%;
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
}
.title-p {
  width: 250rpx;
  height: 36rpx;
  font-weight: bold;
}
.title-p-none {
  width: 250rpx;
  height: 36rpx;
  font-weight: bold;
  color: #b2b2b2;
}
.title-span {
  width: 24rpx;
  height: 4rpx;
  margin-top: 6rpx;
  margin-left: 114rpx;
  transition: all .3s;
  display: block;
}
.title-span-have {
  background-color: #ffcd76;
}
.title-span-none {
  background-color: white;
}

.border {
  width: 24rpx;
  height: 4rpx;
  background-color: #ffcd76;
}

.content {
  margin-top: 106rpx;
}


.course-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.default-img {
  width: 500rpx;
  height: 300rpx;
  margin-top: 300rpx;
}
</style>
