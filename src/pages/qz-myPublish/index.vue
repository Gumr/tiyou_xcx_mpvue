<template>
  <div class="warp">
    <!-- 缺失图 -->
    <div v-if="!circleInfo.length" :key="noData">
      <image src="https://api.tiyou.techoiceness.com/v1/static/qz-images/img_circle.png" class="icon" />
      <div class="text">
        暂无发布
      </div>
    </div>
    <div v-else :key="scroll">
      <div class="scroll-box">
        <w-msgcard 
          :circleInfo="circleInfo"
          :joinStatus="1"
        />
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
import WmsgCard from '@/components/quanzis/myPublishMsg'

export default {
  components: {
    'w-msgcard': WmsgCard
  },
  data () {
    return {
      page: 1,
      circleInfo: [],
      loading: false,
      noData: false
    }
  },

  onReachBottom () {
    if (this.noData) return
    this.page += 1
    this.loading = true
    const param = {
      page: this.page
    }
    this.getInfo(param)
  },

  methods: {
    async getInfo (param) {
      let res = await this.$quanzis.api.user.myInfoData(param)
      if (res.error) return
      this.loading = false
      this.circleInfo = [...this.circleInfo, ...res.rows].map(i => {
        return {
          ...i,
          createdAt: this.$quanzis.getTime(i.createdAt)
        }
      })
      res.nextPage = this.circleInfo.length - res.count
      if (res.nextPage === 0) {
        this.noData = true
      }
    }
  },
  onShow () {
  },

  onLoad () {
    this.page = 1
    this.circleInfo = []
    this.loading = false
    this.noData = false
    const param = {
      page: this.page
    }
    this.getInfo(param)
  }
}
</script>

<style scoped>
.scroll {
  width: 750rpx;
}
.warp {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.scroll-box {
  width: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
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
