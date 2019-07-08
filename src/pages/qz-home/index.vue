  <template>
  <div class="water-drop">
    <label v-if="phone" for="phone" class="test" />
    <button id="phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" />
    <div v-if="joinData.length === 0 && noJoinData.length === 0" class="wrap" key="joinData">
      <div class="btn" @click="toJoinCircle">
        加入新圈子
      </div>
      <image src="https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_circle_gray.png" class="icon" />
      <div class="text">
        未加入圈子
      </div>
    </div>
    <div v-else class="scroll" key="on-joinData">
      <div class="scroll-box">
        <div>
          <card :joinData="joinData" @quit="quit"></card>
        </div>
        <div>
          <cardCheck :noJoinData="noJoinData"></cardCheck>
        </div>
        <div class="join-circle" @click="toJoinCircle">
          加入新圈子
        </div>
      </div>
      <!-- <view class="weui-loadmore" v-if="loading">
        <view class="weui-loading"></view>
        <view class="weui-loadmore__tips">正在加载</view>
      </view> -->
    </div>
    <WTabBar />
  </div>
</template>

<script>
import WTabBar from '@/components/TabBar'
import card from '@/components/quanzis/index/card'
import cardCheck from '@/components/quanzis/index/cardCheck'

export default {

  components: {
    WTabBar,
    'card': card,
    'cardCheck': cardCheck
  },

  data () {
    return {
      codeToast: false,
      scrollHeight: 0,
      loading: false,
      page: 1,
      noPage: 1,
      userName: '',
      avatar: '',
      phoneNo: '',
      id: '',
      // 加入圈子列表
      joinData: [],
      joinDataList: [],
      // 审核圈子列表
      noJoinData: [],
      nojoinDatalist: [],
      joinListStatus: false,
      noData: false,
      // 登陆信息中需要手机号才能使用社群
      phone: 0,
      code: ''
    }
  },
  onReachBottom () {
    // 下拉加载
    // if (this.joinListStatus) {
    //   this.page += 1
    //   this.loading = true
    //   const joincircle = {
    //     joinStatus: [1],
    //     page: this.page
    //   }
    //   this.getJoinCircle(joincircle)
    // }
    // if (!this.joinListStatus) {
    //   阻止继续上拉加载
    //   if (this.noData === true) return
    //   this.noPage += 1
    //   this.loading = true
    //   const noJoincircle = {
    //     joinStatus: [0],
    //     page: this.noPage
    //   }
    //   this.getJoinedcircle(noJoincircle)
    // }
  },

  onPullDownRefresh () {
    this.page = 1
    this.noData = false
    this.noPage = 1
    this.joinListStatus = false
    this.noJoinData = []
    this.joinData = []
    this.nojoinDatalist = []
    this.joinDatalist = []
    // const _token = wx.getStorageSync('token')
    // if (!_token) return
    // 已加入圈子列表
    const joincircle = {
      joinStatus: [1],
      page: this.page
    }
    // 已加入圈子
    // this.joinData = []
    this.getJoinCircle(joincircle)
    wx.stopPullDownRefresh()
  },

  methods: {
    async getJoinCircle (data) {
      let res = await this.$quanzis.api.user.joinedCircle(data)
      if (res.error) return
      this.loading = false
      this.joinDataList = res.rows
      this.joinData = [...this.joinData, ...this.joinDataList]
      this.joinListStatus = true
      // 已加入圈子第一页小于十个
      const noJoincircle = {
        joinStatus: [0],
        page: this.noPage
      }
      this.getJoinedcircle(noJoincircle)
      // res.nextPage = this.joinData.length - res.count
      // if (!res.nextPage) {
      //   this.joinDataList = res.rows
      //   this.joinData = [...this.joinData, ...this.joinDataList]
      //   this.joinListStatus = true
      //   // 已加入圈子第一页小于十个
      //   const noJoincircle = {
      //     joinStatus: [0],
      //     page: this.noPage
      //   }
      //   this.getJoinedcircle(noJoincircle)
      // }
      // let len = res.count - this.joinData.length
      // if (len) {
      //   this.joinData = [...this.joinData, ...res.rows]
      //   // 已加入圈子需要上拉加载
      //   this.joinListStatus = true
      // }
    },

    async getJoinedcircle (dataed) {
      let res = await this.$quanzis.api.user.joinedCircle(dataed)
      if (res.error) return
      this.loading = false
      this.joinListStatus = false
      this.nojoinDatalist = res.rows
      if (this.nojoinDatalist === this.noJoinData) return
      this.noJoinData = [...this.noJoinData, ...this.nojoinDatalist]
      // res.nextPage = this.noJoinData.length - res.count
      // if (!res.nextPage) {
      //   this.noData = true
      //   this.loading = false
      // }
      // this.nojoinDatalist = res.rows
      // if (this.nojoinDatalist === this.noJoinData) return
      // this.noJoinData = [...this.noJoinData, ...this.nojoinDatalist]
    },

    toJoinCircle () {
      wx.navigateTo({
        url: '../qz-joincircle/main'
      })
    },

    // 监听子组件quit 获取当前id
    async quit (id, index) {
      let res = await this.$quanzis.api.circle.quitCircle(id)
      if (res.error) return
      this.joinData.splice(index, 1)
    },

    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },

    sendCode (codeToast, login) {
      this.codeToast = codeToast
      if (login === true) {
        this.phone = false
        const joincircle = {
          joinStatus: [1],
          page: this.page
        }
        // 已加入圈子
        this.getJoinCircle(joincircle)
      }
      if (!login) {
        this.phone = true
      }
    },

    setToken (data) {
      const { token = '', sessionKey = '', phoneNo } = data
      wx.setStorageSync('token', token)
      wx.setStorageSync('sessionKey', sessionKey)
      this.phone = !phoneNo
      // 绑定手机才请求
      if (phoneNo) {
        const joincircle = {
          joinStatus: [1],
          page: this.page
        }
        // 已加入圈子
        this.getJoinCircle(joincircle)
      }
    },
    bindPhone () {
      this.codeToast = true
      this.phone = false
    },
    getPhoneNumber (e) {
      const _token = wx.getStorageSync('token')
      if (_token) {
        // this.phone = false
        // return
        this.$wxLogin.wxLogin(this)
        this.$wxLogin.getPhoneNumber(e, this)
      }
      // 如果拒绝，需绑定手机号
    },

    initState () {
      this.page = 1
      this.noData = false
      this.noPage = 1
      this.joinListStatus = false
      this.noJoinData = []
      this.joinData = []
      this.nojoinDatalist = []
      this.joinDatalist = []
      this.codeToast = false
    }
  },

  onTabItemTap (item) {
  },

  onShow () {
    wx.hideTabBar()
  },

  onLoad () {
    // this.initState()
    // const _token = wx.getStorageSync('token')
    // if (!_token) return
    // this.$api.my.profile()
    //   .then((res) => {
    //     // 没有手机需要绑定手机
    //     if (!res.phoneNo) {
    //       this.phone = 1
    //     } else {
    //       // 0 待审核 1 已加入 2 被驳回
    //       const data = {
    //         joinStatus: [1],
    //         page: this.page
    //       }
    //       // 已加入圈子列表
    //       this.getJoinCircle(data)
    //     }
    //   })
  }
}
</script>

<style lang="scss" scoped>
.water-drop {
  margin-top: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 200rpx;
}
.test {
  width: 750rpx;
  height: 10000rpx;
  opacity: 0.4;
  position: fixed;
  top: 0;
  z-index: 9999;
}
.weui-loading {
  margin: 0 10rpx;
  width: 40rpx;
  height: 40rpx;
  display: inline-block;
  vertical-align: middle;
  animation: weuiLoading 1s steps(12, end) infinite;
  -webkit-animation: weuiLoading 1s steps(12, end) infinite;
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
::-webkit-scrollbar{
  width: 0;
  height: 0;
  color: transparent;
}
.scroll {
  width: 750rpx;
  white-space: nowrap
}
.scroll-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 750rpx;
}
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn {
  width: 690rpx;
  height: 100rpx;
  border-radius: 16rpx;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  color: $decorateColor;
  font-size: 28rpx;
  text-align: center;
  line-height: 100rpx;
}
.icon {
  width: 432rpx;
  height: 432rpx;
  opacity: .1;
  margin-top: 240rpx;
}
.text {
  width: 400rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  color: #eee;
  font-size: 34rpx;
}
.join-circle {
  width: 690rpx;
  height: 100rpx;
  border-radius: 16rpx;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  color: $decorateColor;
  font-size: 28rpx;
  text-align: center;
  line-height: 100rpx;
}

.test {
  width: 750rpx;
  height: 10000rpx;
  opacity: 0.4;
  position: fixed;
  top: 0;
  z-index: 9998;
}
</style>
