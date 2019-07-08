<template>
<div class="wrap">
  <div class="page">
    <!-- <div v-if="codeStatus">
      <WmanualComplete
        @closeToast="closeToast"
        :courseOrders="info.courseOrders"
        :childStatusArr="childStatusArr"
      />
    </div> -->
    <WorderDetail
      :order="info"
    />
    <div class="btn-box">
      <div class="check-in">
        <Wbutton 
          :text="text"
          size="size690"
          bgColor="not-clickable"
        />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import WorderDetail from '@/components/teacher/scheduleCard'
import WmanualComplete from '@/components/teacher/manualComplete'
import Wbutton from '@/components/Button'

export default {
  components: {
    WorderDetail,
    Wbutton,
    WmanualComplete
  },

  data () {
    return {
      info: {},
      codeStatus: 0,
      bgColor: 'confirm',
      // 签到是否可以点击
      status: 1,
      childStatusArr: [],
      text: '未开班'
    }
  },

  methods: {
    async getDetail (id) {
      let res = await this.$api.teacher.teacherScheduleDetail(id)
      if (res.msg) return
      // 计算开办情况的界面移动 总长度未570
      // 当前白点移动距离
      const moveWidth = res.bookedNumbers / res.maxMembers * 570
      // 开班人数达标点
      const moveWidthTotal = res.minMembers / res.maxMembers * 570 + 8
      // const moveWidth = 1 / 2 * 570
      // 孩子list、多少岁
      // let arr = res.courseOrders.map(i => ({
      //   ...i,
      //   child: {
      //     ...i.child,
      //     birthday: this.$wxApi.getChildYears(i.child.birthday)
      //   }
      // }))
      // 开班人数达标点
      // const moveWidthTotal = 1 / 2 * 570 + 8
      this.info = {
        date: this.$wxApi.getTime(res.date),
        startTime: this.$wxApi.getStartTime(res.startTime),
        endTime: this.$wxApi.getStartTime(res.endTime),
        createdAt: this.$wxApi.createdTime(res.createdAt),
        storeName: res.store && res.store.name,
        address: res.store && res.store.address,
        courseTitle: res.course && res.course.title,
        secondCategoryName: res.course && res.course.secondCategory.name,
        moveWidthTotal,
        moveWidth,
        memberMove: moveWidthTotal - 60,
        // 当前人数
        bookedNumbers: res.bookedNumbers,
        // 总人数
        maxMembers: res.maxMembers,
        // 最小开班人数
        minMembers: res.minMembers,
        courseId: res.course && res.course.id,
        storeId: res.store && res.store.id,
        id: res.id,
        courseOrders: res.courseOrders.map(i => {
          if (i.childId !== 0) {
            return {
              ...i,
              child: {
                ...i.child,
                birthday: this.$wxApi.getChildYears(i.child.birthday)
              }
            }
          } else {
            return {
              ...i
            }
          }
        })
      }
      let arr = this.info.courseOrders.map(j => {
        if (j.childId !== 0) {
          return {
            ...j,
            childStatus: 0
          }
        } else {
        }
      })
      if (res.status === 6) {
        // this.text = '自主取消'
        this.text = '自动取消'
      }
      // let arr = []
      // for (let index = 0; index < this.info.courseOrders.length; index++) {
      //   if (this.info.courseOrders[index].childId !== 0) {
      //     arr.push(this.info.courseOrders[index])
      //   }
      // }
      this.childStatusArr = arr
      // if (this.info.bookedNumbers < this.info.minMembers) {
      //   this.bgColor = 'not-clickable'
      //   this.status = 0
      // }
    },

    toast () {
      this.codeStatus = 1
    },

    closeToast (options) {
      this.codeStatus = options.status
    },

    scanCode () {
      wx.scanCode({
        success: (res) => {
          this.$api.teacher.scanCode(res.result)
            .then((res) => {
              if (res.msg) return
              wx.showToast({
                icon: 'none',
                title: '签到成功'
              })
            })
        }
      })
    },

    initState () {
      this.info = {}
      this.bgColor = 'confirm'
      this.status = 1
      this.codeStatus = 0
      this.childStatusArr = []
      this.text = '未开班'
    }
  },

  onUnload () {
    this.initState()
  },

  onLoad (options) {
    // 不是订单id，是课表id
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
