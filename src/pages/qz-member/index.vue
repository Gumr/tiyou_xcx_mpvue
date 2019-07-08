<template>
  <div class="member">
    <div class="scroll" :style="{ height: scrollHeight + 'rpx' }">
      <div class="scroll-box">
        <div class="admin-box" v-if="adminList.length">
          <div class="avatar-title">
            管理员
          </div>
          <div class="avatar">
            <w-avatar :user="adminList[0]"></w-avatar>
          </div>
        </div>
        <div v-if="seniorList.length" class="high-box">
          <div class="avatar-title">
            高级成员
          </div>
          <div v-for="(item, index) in seniorList" :key="index" class="avatar">
            <w-avatar :user="item"></w-avatar>
          </div>
        </div>
        <div v-if="memberList.length" class="common-box">
          <div class="avatar-title">
            普通成员
          </div>
          <div v-for="(item, index) in memberList" :key="index" class="avatar">
            <w-avatar :user="item"></w-avatar>
          </div>
        </div>
        <!-- <div class="invite-btn" @click="toWxCode">
          <span class="iconfont icon-ic_invite invite-icon"></span>
          <span class="to-invite">邀请成员</span>
        </div> -->
      </div>
      <view class="weui-loadmore" v-if="loading">
        <view class="weui-loading"></view>
        <view class="weui-loadmore__tips">正在加载</view>
      </view>
      <!-- <view class="no-more" v-if="noData">
        没有更多了~
      </view> -->
    </div>
  </div>
</template>

<script>
import wavatar from '@/components/quanzis/avatar'

export default {

  components: {
    'w-avatar': wavatar
  },

  data () {
    return {
      scrollHeight: 0,
      loading: false,
      noData: false,
      adminList: [],
      seniorList: [],
      memberList: [],
      page: 1
    }
  },
  onReachBottom: function () {
    if (this.noData === true) return
    this.page += 1
    this.loading = true
    const params = {
      circleId: this.id,
      page: this.page
    }
    this.fetchMember(params)
  },
  methods: {
    toWxCode () {
      wx.navigateTo({
        url: `../qz-WXACode/main?circleId=${this.id}`
      })
    },

    async fetchMember (params) {
      let res = await this.$quanzis.api.circle.member(params)
      if (res.error) return
      res.rows.forEach(i => {
        if (i.role === 1) {
          this.memberList.push(i)
        } else if (i.role === 2) {
          this.seniorList.push(i)
        } else {
          this.adminList.push(i)
        }
      })
      res.nextPage = this.memberList.length + this.seniorList.length + this.adminList.length - res.count
      if (res.nextPage === 0) {
        this.noData = true
        this.loading = false
      }
    },

    initState () {
      this.page = 1
      this.adminList = []
      this.seniorList = []
      this.memberList = []
      this.loading = false
      this.noData = false
    }
  },
  onUnload () {
    this.initState()
  },
  onLoad () {
    this.$quanzis.VoicePlay().voiceInit()
    this.initState()
    this.id = this.$root.$mp.query.id
    const params = {
      circleId: this.id,
      page: this.page
    }
    this.fetchMember(params)
    wx.getSystemInfo({
      success: res => {
        this.scrollHeight = res.windowHeight * 2
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.iconfont {
  font-family: iconfont;
}
.member {
  box-sizing: border-box;
  padding-top: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 60rpx;
}
.avatar-title {
  margin-top: 30rpx;
  margin-bottom: 30rpx;
  font-size: 28rpx;
  color: #888;
}
.admin-box {
  width: 630rpx;
  display: flex;
  flex-direction: column;
  border-bottom: 4rpx #f8f8f8 solid;
}
.high-box {
  width: 630rpx;
  display: flex;
  flex-direction: column;
  border-bottom: 4rpx #f8f8f8 solid;
}
.common-box {
  width: 630rpx;
  display: flex;
  flex-direction: column;
}
.avatar {
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
  width: 750rpx;
}
.scroll-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 750rpx;
}
.invite-btn {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding-left: 50rpx;
  padding-right: 60rpx;
  width: 330rpx;
  height: 80rpx;
  background-color: $btnColor;
  box-shadow: $btnColor;
  border-radius: 40rpx;
  margin-top: 30rpx;
}
.to-invite {
  font-size: 37rpx;
  font-weight: 500;
  color: #fff;
  line-height: 80rpx;
}
</style>
