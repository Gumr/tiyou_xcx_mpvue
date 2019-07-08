<template>
  <div class="my-wrap">
    <!-- 缺失图 -->
    <div v-if="!circleList.length" :key="noData">
      <image src="https://api.tiyou.techoiceness.com/v1/static/qz-images/img_circle.png" class="icon" />
      <div class="text">
        暂无打卡
      </div>
    </div>
    <div v-else class="scroll" :key="scroll">
      <div class="sign-in">
        <div class="circle-box" v-for="(item, index) of arrList" :key="index">
          <div class="circle">
            <span class="circle-title">{{ item[0].circle && item[0].circle.name }}</span>
            <span class="to-circle" @click="toCircle(item[0].circle.id)">进入圈子</span>
          </div>
          <sign-in @goSignIn="goSignIn" @toastStatus="toastStatus" :taskData="item"></sign-in>
        </div>
      </div>
      <view class="weui-loadmore" v-if="loading">
        <view class="weui-loading"></view>
        <view class="weui-loadmore__tips">正在加载</view>
      </view>
      <view class="no-more" v-if="noData">
        已经到底啦~
      </view>
    </div>
  </div>
</template>

<script>
import signIn from '@/components/quanzis/signIn'
import Wtoast from '@/components/quanzis/toast'

export default {
  data () {
    return {
      toast: false,
      text: '',
      circleList: [],
      arrList: [],
      loading: false,
      noData: false,
      page: 1,
      list: [],
      circleData: {}
    }
  },

  components: {
    'sign-in': signIn,
    'w-toast': Wtoast
  },
  onReachBottom () {
    if (this.noData === true) return
    this.page += 1
    this.loading = true
    const param = {
      page: this.page
    }
    this.getAlltasklist(param)
  },
  methods: {
    async goSignIn (text, _id, circleId, path, index) {
      const signParam = {
        cirlceId: circleId,
        taskId: _id
      }
      const SignIdData = {
        textContent: text,
        pics: path
      }
      let res = await this.$quanzis.api.circle.circleSignEd(signParam, SignIdData)
      if (res.error) return
      // let index = this.arrList[index].findIndex(i => i.taskId === _id)
      // let arr = this.arrList[index]
      this.arrList[index].doneToday = 1
      this.arrList[index].currentCompletedDays += 1
    },

    toastStatus (toastStatus) {
      this.toast = toastStatus
      // wx.hideTabBar()
    },

    signIn (toast) {
      this.toast = toast
    },

    toCircle (id) {
      wx.navigateTo({
        url: `../qz-circle/main?id=${id}`
      })
    },

    async getAlltasklist (params) {
      let res = await this.$quanzis.api.user.punchIn(params)
      if (res.error) return
      this.loading = false
      if (res.rows.length === 0) {
        this.noData = true
      } else {
        this.circleList = res.rows
        for (let i = 0; i < this.circleList.length; i++) {
          let circleId = this.circleList[i].circleId
          if (!this.circleData[circleId]) {
            this.circleData[circleId] = []
          }
          this.circleData[circleId].push(this.circleList[i])
        }
        this.arrList = this.circleData
      }
    }
  },

  onLoad () {
    this.page = 1
    this.noData = false
    this.noData = false
    this.circleList = []
    this.arrList = []
    this.list = []
    this.circleData = {}
    const param = {
      page: this.page
    }
    this.getAlltasklist(param)
  }
}
</script>

<style lang="scss" scoped>
.my-wrap {
  width: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sign-in {
  width: 630rpx;
  /* display: flex;
  flex-direction: column;
  align-items: center; */
  margin-top: 60rpx;
}
.circle {
  width: 630rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  /* display: flex;
  flex-direction: column;
  align-items: center; */
}
.circle-title {
  font-size: 34rpx;
  color: #232323;
}
.to-circle {
  font-size: 26rpx;
  color: $decorateColor;
}
.circle-box {
  margin-bottom: 30rpx;
}
.weui-loading {
  margin: 0 10rpx;
  width: 40rpx;
  height: 40rpx;
  display: inline-block;
  vertical-align: middle;
  -webkit-animation: weuiLoading 1s steps(12, end) infinite;
  animation: weuiLoading 1s steps(12, end) infinite;
  background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
  background-size: 100%;
}
.weui-loadmore {
  width: 100%;
  font-size: 24rpx;
  text-align: center;
  opacity: .5;
}
.weui-loadmore__tips {
  display: inline-block;
  vertical-align: middle;
}
.no-more {
  width: 100%;
  text-align: center;
  line-height: 48rpx;
  opacity: .3;
  font-size: 24rpx;
}
.scroll {
  width: 630rpx;
}
.icon {
  width: 432rpx;
  height: 432rpx;
  margin-top: 240rpx;
}
.text {
  width: 432rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  color: #eee;
  font-size: 34rpx;
}
</style>
