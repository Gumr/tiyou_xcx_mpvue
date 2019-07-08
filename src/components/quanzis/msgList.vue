<template>
  <div>
    <div class="msg-card" v-for="(item, index) in info" :key="index">
      <div class="card-box" @click="toMsgPage(item.circleId, item.id)">
        <div class="card-box-top">
          <div class="card-user">
            <image class="uers-avatar" :src="item.user && item.user.avatar" />
            <span class="user-name">{{ item.user && item.user.nickname }}</span>
          </div>
          <div class="card-time">
            <div>{{ item && item.createdAt }}</div>
            <div @click.stop="setStatus(index, item)" class="set-status"
              v-if="item.detail.level && item.n" :style="{backgroundColor: item.bgcolor}">
              {{ item.n }}
            </div>
          </div>
          <!-- 是否可以评级 -->
          <!-- canSetStatus 是否已经评级过 0 未评级-->
          <div v-if="getUserRole === 3 && !item.detail.level" class="info-status" @click.stop="setStatus(index, item)">
            评级
          </div>
          <!-- 评级弹框 -->
          <div v-if="showInfoStatus && setIndex === index" :class="['info-w', canSetStatus ? 'set-top' : '' ]">
            <!-- <w-info-status @wSetStatus = "wSetStatus" :status="item.detail.level" /> -->
            <w-info-status @wSetStatus = "wSetStatus" :status="needCheck" />
          </div>
        </div>
        <div class="msg">
          <w-msg-slot :type="item" :dataDetail="item && item.detail"></w-msg-slot>
        </div>
        <div class="icon-box">
          <div class="iconBox">
            <div @click.stop="doLike(item, index)" class="msg-box">
              <span v-if="item.liked" :key="liked" class="iconfont icon-ic_liked icon-img"></span>
              <span v-else :key="like" class="iconfont icon-ic_like icon-img"></span>
              <span :class="[item.liked ? 'changetext' : '', 'text']">{{ item.likes }}</span>
            </div>
            <div @click.stop="doDisLike(item, index)" class="msg-box">
              <span v-if="item.disliked" :key="unliked" class="iconfont icon-ic_unliked icon-img"></span>
              <span v-else :key="unlike" class="iconfont icon-ic_unlike icon-img"></span>
              <span :class="[item.disliked ? 'unliketext' : '', 'text']">{{ item.dislikes }}</span>
            </div>
            <div class="msg-box" @click.stop="toMsg(item.circleId, item.id, 1)">
              <span class="iconfont icon-ic_comment icon-img"></span>
              <span :class="[false ? 'commenttext' : '', 'text']">{{ item.commentCount }}</span>
            </div>
            <div v-if="shareStatus" class="msg-share">
              <button class="btn" open-type="share" id="1">
                <image src="https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_forward.png" class="btn-icon" />>
              </button>
              <span class="text">{{ item.shareTimes }}</span>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import msgCardSlot from '@/components/quanzis/messageSlot'
import setInfoStatus from '@/components/quanzis/setInfoStatus'
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  props: {
    circleId: {
      type: String,
      required: true
    },
    shareStatus: {
      type: String
    },
    theme: {
      type: Boolean,
      required: true
    },
    circleInfo: {
      type: Array,
      required: true
    },
    taskId: {
      type: Number,
      required: true
    },
    joinStatus: {
      type: Number,
      required: true
    },
    needCheck: {
      type: Number,
      required: true
    },
    course: {
      type: String,
      default: 0
    }
  },
  components: {
    'w-msg-slot': msgCardSlot,
    'w-info-status': setInfoStatus
  },
  computed: {
    getUserRole () {
      return this.vuexGetCircleUserRole
    },

    ...mapGetters('circle', [
      'vuexGetCircleUserRole'
    ]),

    courseId () {
      let id = this.course ? this.course : ''
      return id
    },
    info () {
      let n = ''
      let bgcolor = ''
      let arr = this.circleInfo.map(i => {
        switch (i.detail.level) {
          case 5:
            if (this.getUserRole === 3) {
              n = '普通'
              bgcolor = '#eee'
            } else {
              n = ''
              bgcolor = ''
            }
            break
          case 9:
            n = '优质'
            bgcolor = '#55d9ff'
            break
          case 10:
            n = '置顶'
            bgcolor = '#ffe597'
            break
          default:
        }
        return {
          ...i,
          n: n,
          bgcolor: bgcolor
        }
      })
      return arr
    }
  },
  data () {
    return {
      canSetStatus: 0,
      statusIndex: 2,
      setIndex: 0,
      list: [ '置顶', '优质', '普通' ],
      showInfoStatus: false,
      taskId: 0,
      index: 0,
      infoId: 0
    }
  },

  methods: {
    ...mapActions([
      'setJumpToStatus'
    ]),

    // emit
    async wSetStatus (index) {
      const level = {
        level: 10
      }
      const param = {
        circleId: this.circleId,
        taskId: this.taskId,
        answerId: this.infoId,
        courseId: this.course
      }
      switch (index) {
        case 0:
          level.level = 10
          break
        case 1:
          level.level = 9
          break
        case 2:
          level.level = 5
          break
        case 3:
          level.level = 0
          // await this.$api.info.delinfoLevel(param)
          let res = await this.$quanzis.api.info.deleteMsg(this.taskId)
          if (!res.error) {
            this.circleInfo.splice(this.index, 1)
          }
          break
        default:
      }
      if (level.level !== 0) {
        await this.$quanzis.api.info.setInfoLevel(param, level)
      }
      let n = ''
      let bgcolor = ''
      switch (index) {
        case 0:
          n = '置顶'
          bgcolor = '#ffe597'
          break
        case 1:
          n = '优质'
          bgcolor = '#55d9ff'
          break
        case 2:
          n = '普通'
          bgcolor = '#eee'
          break
        default:
      }
      this.info = this.info.map((i, j) => {
        if (this.index === j) {
          i.n = n
          i.bgcolor = bgcolor
        }
        return {
          ...i
        }
      })
      this.info[this.index].detail.level = level.level
      this.statusIndex = index
      this.canSetStatus = 1
      this.showInfoStatus = false
      // 删除或驳回
      // if (index === 3) {
      //   this.circleInfo.splice(this.index, 1)
      // }
    },
    setStatus (index, item) {
      if (this.getUserRole !== 3) return
      this.infoId = item.id
      this.index = index
      this.setIndex = index
      this.showInfoStatus = !this.showInfoStatus
    },
    msgFuntion () {
      if (this.joinStatus !== 1) {
        return
      }
      wx.navigateTo({
        url: `../qz-message/main`
      })
    },
    doLike (item, index) {
      if (this.joinStatus !== 1) {
        return
      }
      const act = item.liked ? 'cancel' : 'add'
      const params = {
        infoId: item.id,
        data: {
          action: act
        }
      }
      this.$quanzis.api.info.like(params)
        .then(res => {
          if (res.error) {
            wx.showToast({
              icon: 'none',
              title: res.error.msg
            })
          } else {
            this.circleInfo[index].liked = !this.circleInfo[index].liked
            // item.liked = !item.liked
            this.circleInfo[index].dislikes = res.dislikes
            this.circleInfo[index].likes = res.likes
            this.circleInfo[index].disliked = 0
          }
        })
    },
    doDisLike (item, index) {
      if (this.joinStatus !== 1) {
        return
      }
      const act = item.disliked ? 'cancel' : 'add'
      const params = {
        infoId: item.id,
        data: {
          action: act
        }
      }
      this.$quanzis.api.info.dislike(params)
        .then(res => {
          if (res.error) return
          this.circleInfo[index].disliked = !this.circleInfo[index].disliked
          // item.liked = !item.liked
          this.circleInfo[index].dislikes = res.dislikes
          this.circleInfo[index].likes = res.likes
          this.circleInfo[index].liked = 0
        })
    },
    jumpTo () {
      if (this.course) {
        this.setJumpToStatus(101)
      }
    },
    toMsg (circleId, id, focusStatus) {
      if (this.joinStatus !== 1) return
      if (this.circleId) {
        circleId = this.circleId
      }
      this.jumpTo()
      wx.navigateTo({
        url: `../qz-message/main?infoId=${id}&circleId=${circleId}&focusStatus=${focusStatus}`
      })
    },
    toMsgPage (circleId, id) {
      if (this.joinStatus !== 1) return
      if (this.circleId) {
        circleId = this.circleId
      }
      this.jumpTo()
      wx.navigateTo({
        url: `../qz-message/main?infoId=${id}&circleId=${circleId}`
      })
    }
  },
  onLoad () {
    this.showInfoStatus = false
    this.setIndex = 0
  }
}
</script>

<style lang="scss" scoped>
.iconfont {
  font-family: iconfont;
}
.msg-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40rpx;
  padding-bottom: 40rpx;
  width: 690rpx;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 96rpx;
  margin-bottom: 30rpx;
}
.info-status {
  font-size: 26rpx;
  text-align: right;
  width: 100rpx;
  height: 32rpx;
  color: $decorateColor;
}
.info-w {
  position: absolute;
  top: 92rpx;
  right: 0;
  z-index: 99999;
}
.set-top {
  top: 40rpx;
}
.uers-avatar {
  width: 72rpx;
  height: 72rpx;
  box-shadow: 0 4rpx 8rpx 0 rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  margin-right: 30rpx;
}
.card-box-top {
  position: relative;
  width: 610rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30rpx;
}
.card-box {
  width: 610rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.card-user {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 380rpx;
  height: 72rpx;
  font-size: 28rpx;
  color: #888;
  overflow: hidden;
}
.theme-name {
  font-size: 28rpx;
}
.card-content {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30rpx;
  padding-bottom: 30rpx;
  width: 570rpx;
  font-size: 28rpx;
  background-color: #fff;
  box-shadow: 0 8rpx 16rpx -8rpx rgba(0, 0, 0, 0.05);
}
.questions {
  width: 530rpx;
  color: #888;
}
.solution {
  margin-top: 10rpx;
  width: 530rpx;
  color: #232323;
}
.icon-box {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 600rpx;
  margin-top: 30rpx;
}
.item-box {
  margin-right: 80rpx;
  width: 200rpx;
  height: 64rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.question-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 30rpx;
}
.question-text {
  width: 200rpx;
  color: $decorateColor;
  font-size: 22rpx;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  // height: 32rpx;
}
.msg-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 76rpx;
  margin-left: 24rpx;
}
.text {
  width: 64rpx;
  height: 24rpx;
  line-height: 32rpx;
  text-align: center;
  font-size: 22rpx;
  color: #b2b2b2;
}
.changetext {
  color: #efd2d7;
}
.unliketext {
  color: #b2b2b2;
}
.commenttext {
  color: #c2dce0;
}
.card-time {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  top: -10rpx;
  font-size: 22rpx;
  width: 610rpx;
  height: 32rpx;
  color: #b2b2b2;
}
.set-status {
  width: 80rpx;
  height: 40rpx;
  text-align: center;
  line-height: 40rpx;
  margin-left: 30rpx;
  color: #fff;
}
.border-r {
  display: block;
  width: 4rpx;
  height: 20rpx;
  background-color: #b2b2b2;
  margin-left: 10rpx;
  margin-right: 10rpx;
}
.theme-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 32rpx;
  color: $decorateColor;
}
.msg-share {
  box-sizing: border-box;
  padding-bottom: 3rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 60rpx;
  height: 76rpx;
  margin-left: 10rpx;
}
.btn {
  width: 40rpx;
  height: 40rpx;
  background-color: #fff;
  margin: 0;
  padding: 0;
  /* margin-top: 4rpx; */
}
.btn::after {
  border: 0;
}
.btn-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 40rpx;
  height: 40rpx;
}
.no-join{
  position: relative;
  width: 690rpx;
  height: 206rpx;
}
.img {
  width: 690rpx;
  height: 206rpx;
}
.mask {
  position: absolute;
  top: 0;
  width: 690rpx;
  height: 206rpx;
  background-color: #fff;
  opacity: .7;
  backdrop-filter: blur(14rpx);
  line-height: 206rpx;
  text-align: center;
  font-size: 26rpx;
  color: #b2b2b2;
}
.icon-img {
  width: 48rpx;
  height: 48rpx;
}
.imgIcon {
  width: 48rpx;
  height: 48rpx;
  margin-right: 30rpx;
  margin-left: 20rpx;
}
.iconBox {
  display: flex;
  flex-direction: row;
}
</style>
