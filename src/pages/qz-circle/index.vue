<template>
  <div class="circle-wrap">
    <!-- 课程型圈子 -->
    <!-- todo -->
    <div v-if="courseTaskStatus === 2 && vuexGetCicleDetail.joinStatus !== 1" key="course">
      <w-course
        :courseInfo="vuexGetCicleDetail"
        :member="vuexGetMembers"
        :administrator="vuexGetAdmin"
      />
    </div>
    <!-- 正常圈子 -->
    <div v-else class="have-courseTask" key="no-course">
      <div class="filter-box">
        <image mode="aspectFill" :src="vuexGetCicleDetail.cover" class="avatar-bg" />
      </div>
      <div class="img-mask"></div>
      <div class="info-wrap">
        <div class="wrap">
          <div class="circleKnow">
            <div class="box-top">
              <w-circle-intro :circleCesc="vuexGetCicleDetail.desc" />
            </div>
            <div class="box-bottom">
              <div class="circle-item">
                <span class="item-key">管理员</span>
                <div class="userInfo-box">
                  <span class="user-name">{{ vuexGetAdmin.nickname }}</span>
                  <image
                    mode="aspectFill" :src="vuexGetAdmin.avatar" class="avatar" />
                </div>
              </div>
              <div class="circle-item" @click="toMember">
                <div class="number-key">
                  <span class="item-key">圈成员</span>
                  <span class="item-number">
                    <span>(</span>
                    <span class="member-color">{{ vuexGetCicleDetail.memberCount || 0 }}</span>
                    <span>)</span>
                  </span>
                </div>
                <div>
                  <!-- 未加入 私密应该模糊成员 -->
                  <w-member
                    :member="vuexGetRows"
                    :isPrivate="vuexGetCicleDetail.joinStatus!== 1 ? vuexGetCicleDetail.isPrivate : 0"
                  />
                </div>
              </div>
              <!-- start 子圈，父圈 -->
              <div v-if="vuexGetCicleDetail.joinStatus === 1">
                <div v-if="vuexGetCicleDetail.parentCircle" class="circle-item">
                  <span class="item-key">所属圈</span>
                  <span>{{ vuexGetCicleDetail.parentCircle.name }}</span>
                </div>
                <div v-if="vuexGetCicleDetail.childCircles && vuexGetCicleDetail.childCircles.length" class="circle-item">
                  <span class="item-key">下属圈</span>
                  <span>{{ vuexGetCicleDetail.childCircles && vuexGetCicleDetail.childCircles[0].name }}</span>
                </div>
              </div>
              <div class="task-icon-box">
                <div @click="toAllTask(101)">
                  <WcircleIcon 
                    imageSrc="https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_tocourse.png"
                    text="课程"
                    marginL="margin20"
                  />
                </div>
                <div @click="toAllTask(1)">
                  <WcircleIcon 
                    imageSrc="https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_topunchCad.png"
                    text="打卡"
                    marginL="margin20"
                  />
                </div>
                <div @click="toAllTask(2)">
                  <WcircleIcon 
                    imageSrc="https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_tochallenge.png"
                    text="挑战"
                  />
                </div>
              </div>
              <!-- end -->
            </div>
          </div>
          <div class="mission-title" v-if="vuexCircleTask.length">
            最新应用
          </div>
          <div v-if="vuexGetCicleDetail.isPrivate === 1 && vuexGetCicleDetail.joinStatus !== 1" class="circle-privacy">
            <span class="privacy-title">私密圈子</span>
            <span class="privacy-content">加入圈子后可查看信息</span>
          </div>
          <!-- isPrivate不是私密圈展示，加入状态，私密圈展示 -->
          <div v-if="vuexGetCicleDetail.isPrivate === 0 || (vuexGetCicleDetail.isPrivate === 1 && vuexGetCicleDetail.joinStatus === 1)" class="content">
            <WcircleMisson 
              :circleDetail="vuexGetCicleDetail"
              :taskData="vuexCircleTask"
            />
            <!-- 查看全部任务 -->
            <div class="circle-title">
              圈子信息
            </div>
            <div class="status-text" v-if="vuexGetCicleDetail.joinStatus !== 1">
              加入后查看
            </div>
            <div class="msg-card" :class="[ vuexGetCicleDetail.joinStatus !== 1 ? 'msg-card-btn' : '', 'msg-card']">
              <w-msgcard
                :circleId="circleId"
                :theme="theme"
                :circleInfo="vuexGetCircleInfo"
                :joinStatus="vuexGetCicleDetail.joinStatus"
                :infoSrc="vuexGetCicleDetail.cover"
              />
            </div>
            <!-- 已加入 && 没有信息  -->
            <view class="no-more" v-if="vuexGetCircleInfo.length === 0 && vuexGetCicleDetail.joinStatus === 1">
              暂无信息
            </view>    
          </div>
        </div>
        <div v-if="noData && vuexGetCicleDetail.joinStatus === 1 && vuexGetCircleInfo.length > 0">
          <w-loading
            :loading="loading"
            :noData="noData"
          />
        </div>
    </div>
  </div>
  <div v-if="vuexJoinStatus !== 1" class="btn">
    <div class="course-btn">
      <div @click="joinCircle()">
        <w-button :text="vuexBtnText" size="big580" :bgColor="[vuexGetCicleDetail.joinStatus === 0 ? 'gray' : 'black']"></w-button>
      </div>
      <button @click="toWxCode" id="1" class="btn-share">
        <span class="iconfont course-icon icon-ic_forward_gray1"></span>
      </button>
    </div>
  </div>
  <!-- 发布消息按钮 -->
  <!-- todo -->
  <div v-if="vuexGetCicleDetail.joinStatus === 1 && vuexGetCicleDetail.circleUserRole !== 1" 
    class="high-member"
    :style="{ bottom: ball.ballBottom + 'rpx', right: ball.ballRight + 'rpx'}">
  <!-- <div class="high-member" :style="{ bottom: ball.ballBottom + 'rpx', right: ball.ballRight + 'rpx'}"> -->
    <div class="high-box" @click="toPublish" >
      <span class="iconfont high-img icon-ic_publish"></span>
    </div>
  </div>
  </div>
</template>

<script>
import Wloading from '@/components/quanzis/loading'
import WcircleIntro from '@/components/quanzis/circleIntro'
import Wmember from '@/components/quanzis/member'
import Wmission from '@/components/quanzis/mission'
import WmsgCard from '@/components/quanzis/msgCard'
import Wbutton from '@/components/quanzis/button'
import WcourseCard from '@/components/quanzis/courseCard'
import WcircleMisson from '@/components/quanzis/circleMisson/circleMisson'
import WcircleIcon from '@/components/quanzis/circleIcon/circleIcon'
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  components: {
    'w-circle-intro': WcircleIntro,
    'w-member': Wmember,
    'w-mission': Wmission,
    'w-msgcard': WmsgCard,
    'w-button': Wbutton,
    'w-loading': Wloading,
    'w-course': WcourseCard,
    'WcircleMisson': WcircleMisson,
    'WcircleIcon': WcircleIcon
  },

  data () {
    return {
      loading: 0,
      noData: 0,
      page: 1,
      marginStatus: true,
      ball: {
        ballBottom: 120,
        ballRight: 60
      },
      shareUserName: '',
      shareUserAvatar: '',
      status: 1,
      toast: false,
      circleId: 0,
      src: 'https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_publish.png',
      theme: false
    }
  },

  onShareAppMessage: function () {
    let text = '邀请你加入圈子'
    if (this.vuexGetCicleDetail.circleType === 2) {
      text = '邀请你加入课程'
    }
    const t = {
      title: `${this.shareUserName}${text}`,
      desc: this.vuexGetCicleDetail.desc,
      path: `/pages/qz-share/main?id=${this.circleId}&type=0&shareUserName=${this.shareUserName}&shareUserAvatar=${this.shareUserAvatar}`
    }
    return t
  },

  onPullDownRefresh: function () {
    this.initState()
    let { id } = this.$root.$mp.query
    this.vuexSetCircleDetail(id)
    this.getTaskList()
    this.getInfoList()
    wx.stopPullDownRefresh()
  },

  onReachBottom () {
    if (!this.vuexGetCircleNext) {
      this.noData = 1
      this.loading = 0
      return
    }
    if (this.vuexGetCicleDetail.joinStatus !== 1) return
    // 当任务加载完成
    // 未加入圈子，无法分页加载
    this.page += 1
    this.loading = 1
    const infoData = {
      circleId: this.circleId,
      page: this.page
    }
    this.vuexSetCircleInfo(infoData)
  },
  computed: {
    courseTaskStatus () {
      return this.vuexGetCourseCircleS
    },
    // 2.0
    ...mapGetters('circle', [
      'vuexGetCicleDetail',
      'vuexGetAdmin',
      'vuexGetMembers',
      'vuexGetRows',
      'vuexGetName',
      'vuexBtnText',
      'vuexGetCourseCircleS',
      'vuexJoinStatus'
    ]),
    ...mapGetters('circleTask', [
      'vuexCircleTask',
      'vuexGetTask'
    ]),
    ...mapGetters('circleInfo', [
      'vuexGetCircleInfo',
      'vuexGetCircleNext'
    ]),
    circleName () {
      if (this.vuexGetName) {
        wx.setNavigationBarTitle({
          title: `${this.vuexGetName}`
        })
      }
      return ''
    }
  },
  methods: {
    // 2.0
    ...mapActions('circle', [
      'vuexSetCircleDetail',
      'vuexSetCourseCircle',
      'vuexSetClearDetail',
      'vuexInfoCount'
    ]),

    ...mapActions('circleTask', [
      'vuexSetCricleTask',
      'vuexClearTask',
      'vuexDoneToday'
    ]),

    ...mapActions('circleInfo', [
      'vuexSetCircleInfo',
      'vuexClearInfo'
    ]),

    toWxCode () {
      wx.navigateTo({
        url: `../qz-WXACode/main?circleId=${this.circleId}`
      })
    },

    toAllTask (taskStatus) {
      if (this.vuexGetCicleDetail.joinStatus !== 1) {
        return
      }
      wx.navigateTo({
        url: `../qz-alltasklist/main?id=${this.circleId}&taskStatus=${taskStatus}`
      })
    },

    toastStatus (toastStatus) {
      this.toast = toastStatus
    },

    toPublish () {
      // 清除长音频
      this.$quanzis.VoicePlay().voiceInit()
      wx.navigateTo({
        url: `../qz-publish/main?id=${this.circleId}`
      })
    },

    joinCircle () {
      // 1 已经加入 0待审核
      if (this.vuexGetCicleDetail.joinStatus === 0) return
      if (this.vuexGetCicleDetail.joinStatus === 1) return
      // 需要支付的圈子
      if (this.vuexGetCicleDetail.price > 0) {
        let data = {}
        // if (this.text === '支付中' || this.text === '支付失败') return
        this.$quanzis.api.circle.circleJoin(this.vuexGetCicleDetail.id, data)
        // this.$api.pay.xcxPay(param)
          .then((payRes) => {
            if (payRes.error) {
              return
            }
            if (!Object.keys(payRes).length) {
              wx.showToast({
                title: '申请成功'
              })
              return
            }
            wx.requestPayment({
              timeStamp: payRes.timeStamp,
              nonceStr: payRes.nonceStr,
              package: payRes.package,
              signType: payRes.signType,
              paySign: payRes.paySign,
              success: (res) => {
                this.text = '支付中'
                // this.orderId = res.orderId
                this.$quanzis.api.pay.payConfirmed(payRes.orderId)
                  .then((s) => {
                    if (s.payConfirmed === 1) {
                      if (this.vuexGetCicleDetail.circleType === 2) {
                        this.vuexSetCourseCircle(1)
                      }
                      this.initState()
                      this.vuexSetCircleDetail(this.circleId)
                      // 获取圈子任务
                      this.getTaskList()
                      // 信息流
                      this.getInfoList()
                      wx.showToast({
                        title: '申请成功'
                      })
                    }
                  })
              },
              fail: (res) => {
                // this.text = '支付失败'
              }
            })
          })
        return
      }
      // jointype自由加入
      if (this.vuexGetCicleDetail.joinType === 1) {
        const joinId = this.circleId
        let data = {}
        this.$quanzis.api.circle.circleJoin(joinId, data)
          .then((res) => {
            if (res.error) return
            if (this.vuexGetCicleDetail.circleType === 2) {
              this.vuexSetCourseCircle(1)
            }
            this.initState()
            // 课程型圈子
            this.vuexSetCircleDetail(this.circleId)
            // 获取圈子任务
            this.getTaskList()
            // 信息流
            this.getInfoList()
            wx.showToast({
              title: '申请成功'
            })
          })
      } else {
        // 需要回答问题并审核
        wx.navigateTo({
          url: `../qz-apply/main?circleId=${this.circleId}`
        })
      }
    },

    initState () {
      this.loading = 0
      this.noData = 0
      this.page = 1
      // 清空vuex info
      this.vuexClearInfo([])
      // 清除任务
      this.vuexClearTask([])
      this.vuexSetClearDetail()
    },

    toMember () {
      // 未加入状态返回
      if (this.vuexGetCicleDetail.joinStatus !== 1) return
      wx.navigateTo({
        url: `../qz-member/main?id=${this.circleId}`
      })
    },

    getInfoList () {
      const infoData = {
        circleId: this.circleId,
        page: this.page
      }
      this.vuexSetCircleInfo(infoData)
    },

    getTaskList (options) {
      const taskListData = {
        id: this.circleId,
        page: 1
      }
      this.vuexSetCricleTask(taskListData)
    }
  },
  onUnload () {
    this.initState()
  },

  onLoad (options) {
    wx.getUserInfo({
      success: (res) => {
        this.shareUserName = res.userInfo.nickName
        this.shareUserAvatar = res.userInfo.avatarUrl
      }
    })
    // 2.任务折叠，只需加载第一页
    this.courseTaskStatus = false
    this.circleId = parseInt(this.$root.$mp.query.id)
    // 2.0
    // 获取圈子信息
    this.vuexSetCircleDetail(this.circleId)
    // 获取圈子任务
    this.getTaskList()
    // // 信息流
    this.getInfoList()
  }
}
</script>

<style lang="scss" scoped>
.circle-wrap {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
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
.info-wrap {
  position: absolute;
  top: 0;
}
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 630rpx;
  background-color: #fff;
  margin-top: 60rpx;
  /* background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), #ffffff 71%, #ffffff); */
}
.circleKnow {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 630rpx;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
}
.box-top {
  margin-top: 30rpx;
}
.box-bottom {
  width: 550rpx;
  margin-top: 30rpx;
  font-size: 28rpx;
}
.avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 48rpx;
  box-shadow: 0 4rpx 8rpx 0 rgba(0, 0, 0, 0.05);
  margin-left: 20rpx;
}
.circle-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 550rpx;
  height: 50rpx;
  margin-bottom: 30rpx;
}
.userInfo-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.item-key {
  color: #b2b2b2;
}
.item-number {
  margin-left: 30rpx;
  color: #b2b2b2;
}
.mission {
  width: 630rpx;
  margin-top: 30rpx;
  /* margin-bottom: 30rpx; */
}
.icon-box {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 600rpx;
  margin-top: 40rpx;
}
.member-color {
  color: $decorateColor;
}
.btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 750rpx;
  height: 100rpx;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  z-index: 10;
}
.course-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 750rpx;
  height: 100rpx;
  box-sizing: border-box;
  padding-left: 40rpx;
  padding-right: 40rpx;
  position: fixed;
  bottom: 30rpx;
  z-index: 11;
}
.course-icon {
  color: $decorateColor;
}
.status-text {
  width: 630rpx;
  height: 40rpx;
  background-color: #fff;
  font-size: 28rpx;
  color: #888;
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}
.content {
  width: 630rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.circle-privacy {
  width: 630rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #b2b2b2;
  background-color: #fff;
  margin-top: 300rpx;
}
.privacy-title {
  width: 630rpx;
  text-align: center;
  font-size: 37rpx;
}
.privacy-content {
  width: 630rpx;
  text-align: center;
  font-size: 22rpx;
}
.high-member {
  position: fixed;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 16rpx 32rpx -16rpx rgba(0, 0, 0, 0.3);
  z-index: 10;
}
.high-img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 48rpx;
  height: 48rpx;
  z-index: 12;
}
.high-box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 96rpx;
  height: 96rpx;
  background-color: $btnColor;
  border-radius: 50%;
  z-index: 11;
}
.video, .voice, .img, .words {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background-color: #fff;
  margin-bottom: 10rpx;
  font-size: 28rpx;
  color: #232323;
  line-height: 96rpx;
  text-align: center;
  box-shadow: 0 10rpx 20rpx -10rpx rgba(0, 0, 0, 0.3);
}
.animation-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  width: 50rpx;
  height: 100rpx;
  overflow: hidden;
}
.msg-card {
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}
.msg-card-btn {
  margin-bottom: 130rpx;
}
.phone {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: .4;
  z-index: 9999;
}
.filter-box {
  position: relative;
  overflow: hidden;
  width: 750rpx;
  height: 480rpx;
  /* opacity: .9; */
}
.avatar-bg {
  position: absolute;
  top: 0;
  width: 750rpx;
  height: 480rpx;
  filter: blur(16rpx);
}
.img-mask {
  position: absolute;
  top: 0;
  width: 750rpx;
  height: 500rpx;
  /* opacity: .7; */
  background-image: linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.85) 15%, rgba(255, 255, 255, 0.7) 51%, #ffffff 86%, #ffffff);
}
.all-task {
  line-height: 100rpx;
  font-size: 28rpx;
  text-align: center;
  color: $decorateColor;
  width: 630rpx;
  height: 100rpx;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
}
.mission-title, .circle-title {
  width: 630rpx;
  height: 48rpx;
  line-height: 48rpx;
  margin-top: 60rpx;
  font-size: 34rpx;
  font-weight: 500;
  color: #232323;
}
.have-courseTask {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.task-icon-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 40rpx;
}
.btn-share::after {
  border: none;
}
.btn-share {
  width: 80rpx;
  height: 80rpx;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 40rpx;
  box-shadow: 0 8rpx 16rpx -8rpx rgba(0, 0, 0, 0.1);
}
</style>
