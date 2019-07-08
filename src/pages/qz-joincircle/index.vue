<template>
  <div class="wrap">
    <div class="scroll">
      <div class="scroll-box">
        <form>
          <input type="text" class="input" v-model="exploreText" @confirm="explore" placeholder-style="opacity: 0.2" placeholder="搜索">
        </form>
        <div v-if="exploreText" key="explore">
          <div @click="toCircle(item.id)" v-for="(item, index) in exploreArr" :key="index">
            <div class="circle" v-if="!item.isPrivate">
              <image class="img"
                mode="aspectFill"
                @load="imageLoad"
                :src="item.cover"
              />
              <div class="circle-content">
                <div class="content">
                  <div class="title">
                    {{ item.name }}
                  </div>
                  <div class="content-box">
                    <div class="member">
                      <span class="member-title">成员</span>
                      <span>{{ item.memberCount || 0 }}</span>
                    </div>
                    <div class="munber">
                      <span class="munber-title">信息</span>
                      <span>{{ item.infoCount }}</span>
                    </div>
                  </div>
                </div>
                <div class="iconfont icon icon-ic_right">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else key="no-explore">
          <div @click="toCircle(item.id)" v-for="(item, index) in circleData" :key="index">
            <div class="circle" v-if="!item.isPrivate">
              <image class="img"
                mode="aspectFill"
                @load="imageLoad"
                :src="item.cover"
              />
              <div class="circle-content">
                <div class="content">
                  <div class="title">
                    {{ item.name }}
                  </div>
                  <div class="content-box">
                    <div class="member">
                      <span class="member-title">成员</span>
                      <span>{{ item.memberCount || 0 }}</span>
                    </div>
                    <div class="munber">
                      <span class="munber-title">信息</span>
                      <span>{{ item.infoCount }}</span>
                    </div>
                  </div>
                </div>
                <div class="iconfont icon icon-ic_right">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <view class="weui-loadmore" v-if="loading">
        <view class="weui-loading"></view>
        <view class="weui-loadmore__tips">正在加载</view>
      </view>
      <!-- <view class="no-more" v-if="noData">
        已经到底啦~
      </view> -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      scrollHeight: 0,
      loading: false,
      noData: false,
      exploreText: '',
      circleData: [],
      circleList: [],
      page: 1,
      allCircleStatus: false,
      imgWidth: 0,
      imgHeight: 0,
      explorePage: 1,
      // 搜索得到的圈子
      exploreArr: []
    }
  },
  onReachBottom () {
    if (this.allCircleStatus === true) {
      // if (this.noData === true) return
      // this.explorePage += 1
      // this.loading = true
      // // 加载时loading
      // const exploreData = {
      //   keyword: this.exploreText,
      //   page: this.explorePage
      // }
      // this.getExploreData(exploreData)
    } else {
      if (this.noData === true) return
      this.page += 1
      this.loading = true
      const data = {
        page: this.page
      }
      this.getCirlceList(data)
    }
  },

  methods: {
    toCircle (id) {
      wx.navigateTo({
        url: `../qz-circle/main?id=${id}`
      })
    },
    async getExploreData (data) {
      let res = await this.$quanzis.api.circle.circle(data)
      if (res.error) return
      res.nextPage = this.exploreArr.length - res.count
      if (res.nextPage === 0) {
        this.noData = true
      }
      this.exploreArr = [ ...res.rows ]
    },

    async getCirlceList (data) {
      let res = await this.$quanzis.api.circle.allCircle(data)
      this.loading = false
      if (res.error) return
      this.circleData = [...this.circleData, ...res.rows]
      res.nextPage = this.circleData.length - res.count
      if (res.nextPage === 0) {
        this.noData = true
      }
    },

    async explore () {
      const exploreData = {
        keyword: this.exploreText,
        page: this.explorePage
      }
      if (!this.exploreText) {
        wx.showToast({
          icon: 'none',
          title: '请输入文字'
        })
        return
      }
      let res = await this.$quanzis.api.circle.circle(exploreData)
      this.loading = false
      if (res.error) return
      this.exploreArr = res.rows
      // 清除全部显示状态
      this.allCircleStatus = true
      this.noData = false
      if (this.exploreArr.length === 0) {
        wx.showModal({
          title: '提示',
          content: '未找到相应圈子'
        })
      }
    }
  },

  onLoad () {
    this.circleData = []
    this.exploreArr = []
    this.loading = false
    this.noData = false
    this.page = 1
    this.explorePage = 1
    this.allCircleStatus = false
    this.exploreText = ''
    const exploreData = {
      page: this.page
    }
    this.getCirlceList(exploreData)
  }
}
</script>

<style scoped>
.iconfont {
  font-family: iconfont;
}
.wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.input {
  width: 630rpx;
  height: 100rpx;
  line-height: 100rpx;
  padding-left: 30rpx;
  font-size: 28rpx;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 30rpx;
}
.circle {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 690rpx;
  /* height: 100rpx; */
  margin-bottom: 30rpx;
  /* background-color: #fff; */
}
.img {
  width: 110rpx;
  /* height: 100rpx; */
  height: 100rpx;
  border-radius: 16rpx;
}
.circle-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-left: 30rpx;
  padding-right: 30rpx;
  width: 580rpx;
  /* height: 100rpx; */
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 360rpx;
  /* height: 100rpx; */
  color: #232323;
}
.title {
  width: 360rpx;
  font-size: 34rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.content-box {
  display: flex;
  flex-direction: row;
  font-size: 26rpx;
}
.content-box span{
  height: 36rpx;
  line-height: 36rpx;
}
.member, .munber {
  width: 160rpx;
}
.member-title, .munber-title {
  color: #b2b2b2;
  margin-right: 20rpx;
}
.icon {
  font-size: 48rpx;
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
</style>
