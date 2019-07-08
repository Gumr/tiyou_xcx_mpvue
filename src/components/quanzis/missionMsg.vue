<template>
  <div>
    <progress  v-if="progressStatus" class="progressClass" :percent="progress" forwards />
    <div class="msg-card">
      <div class="card-box">
        <div class="card-box-top">
          <div class="message-del">
            <div class="card-user">
              <image class="uers-avatar" :src="circleInfo.user && circleInfo.user.avatar" />
              <span class="user-name">{{ circleInfo.user && circleInfo.user.nickname }}</span>
            </div>
            <div class="del" @click="delMsg" v-if="circleInfo.canDelete">
              删除
            </div>
          </div>
          <div class="card-time">
            <div>{{ circleInfo.createdAt }}</div>
            <div v-if="isVisible === '1' || isVisible === '0'" @click="toCircle(isVisible, circleInfo.circleId)" class="theme-box">
              <span class="border-r"></span>
              <span>{{ name }}</span>
            </div>
          </div>
        </div>
        <div class="msg">
          <w-msg-slot @progress="progressFu" :isVisible="isVisible" :type="circleInfo" :dataDetail="circleInfo && circleInfo.detail"></w-msg-slot>
          <div v-if="isVisible === '0'" class="mask">
          </div>
          <div v-if="isVisible === '0'" class="mask-text">
            加入圈子后可展开查看
          </div>
        </div>
        <div class="icon-box">
          <div class="question-box" @click.stop="toTask" v-if="circleInfo.infoType === 9">
            <span class="iconfont icon-ic_qa_gray imgIcon"></span>
            <div class="item-box">
              <div class="question-text" v-for="(questionItem, questionIndex) in circleInfo.detail.answers" :key="questionIndex">
                {{ questionItem.questionContent }}
              </div>
            </div>
          </div>
          <div class="iconBox">
            <div @click="doLike(circleInfo)" class="msg-box">
              <span v-if="circleInfo.liked" :key="liked" class="iconfont icon-ic_liked icon-img"></span>
              <span v-else :key="like" class="iconfont icon-ic_like icon-img"></span>
              <span :class="[circleInfo.liked ? 'changetext' : '', 'text']">{{ circleInfo.likes }}</span>
            </div>
            <div @click="doDisLike(circleInfo)" class="msg-box">
              <span v-if="circleInfo.disliked" :key="unliked" class="iconfont icon-ic_unliked icon-img"></span>
              <span v-else :key="unlike" class="iconfont icon-ic_unlike icon-img"></span>
              <span :class="[circleInfo.liked ? 'unliketext' : '', 'text']">{{ circleInfo.dislikes }}</span>
            </div>
            <div class="msg-box" @click="toComment()">
              <span class="iconfont icon-ic_comment icon-img"></span>
              <span :class="[false ? 'commenttext' : '', 'text']">{{ circleInfo.commentCount || 0 }}</span>
            </div>
            <div v-if="shareStatus" class="msg-share">
              <!-- <button class="btn" open-type="share" id="1"> -->
              <button class="btn" @click="toShare()">
                <span class="iconfont icon-ic_forward btn-icon"></span>
                <!-- <image src="../../static/qz-images/ic_forward.png" class="btn-icon" /> -->
              </button>
              <!-- <span class="iconfont icon">&#xe633;</span> -->
              <span class="share-text">{{ circleInfo.shareTimes || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import msgCardSlot from '@/components/quanzis/messageSlot'
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  props: {
    shareStatus: {
      type: String
    },
    circleInfo: {
      type: Object,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    toComment: {
      type: Function,
      required: true
    },
    name: {
      type: String
    }
  },

  components: {
    'w-msg-slot': msgCardSlot
  },

  computed: {
    ...mapGetters({
      getJumpToStatus: 'getJumpToStatus',
      getCourseId: 'getCourseId'
    }),

    ...mapGetters([
      'aGetTaskDetail'
    ])
  },
  data () {
    return {
      infoId: '',
      circleId: '',
      isVisible: '',
      progress: 0,
      progressStatus: false
    }
  },

  mounted () {
  },

  methods: {
    ...mapActions([
      'setJumpToStatus',
      'aSetDelTaskList'
    ]),

    ...mapActions('cTaskDetail', [
      'vuexDelDetailAnswered'
    ]),

    ...mapActions('courseInfo', [
      'vuexDelCourseId'
    ]),

    ...mapActions('circleInfo', [
      'vuexDelInfoId'
    ]),

    toTask () {
      this.$quanzis.toTask.msgToTask(this.circleInfo)
    },

    toShare () {
      let show = 1
      this.$emit('myShare', show)
    },

    toCircle (isVisible, id) {
      if (this.isVisible === '0') return
      wx.navigateTo({
        url: `../qz-circle/main?id=${id}`
      })
    },
    progressFu (progress, status) {
      this.progress = progress
      this.progressStatus = status
    },
    msgFuntion () {
      wx.navigateTo({
        url: `../qz-message/main`
      })
    },
    doLike (item) {
      if (this.isVisible === '0') return
      const act = item.liked ? 'cancel' : 'add'
      const params = {
        infoId: item.id,
        data: {
          action: act
        }
      }
      this.$quanzis.api.info.like(params)
        .then(res => {
          if (res.error) return
          item.liked = !item.liked
          item.dislikes = res.dislikes
          item.likes = res.likes
          item.disliked = 0
        })
    },
    delMsg () {
      wx.showModal({
        title: '提示',
        content: '确认删除该信息吗？',
        success: res => {
          let that = this
          if (res.confirm) {
            const infoId = that.circleInfo.id
            that.$api.info.deleteMsg(infoId)
              .then(res => {
                if (res.error) {
                  return
                }
                const data = {
                  infoId: infoId
                }
                let id = this.aGetTaskDetail
                this.aSetDelTaskList(data)
                const t = {
                  id: id
                }
                this.vuexDelDetailAnswered(t)
                if (that.getJumpToStatus === 101) {
                  that.setJumpToStatus(1)
                  wx.navigateBack({
                    url: `../qz-course/main?id=${that.circleInfo.circleId}&taskId=${that.getCourseId}`
                  })
                } else {
                  this.vuexDelCourseId(infoId)
                  this.vuexDelInfoId(infoId)
                  wx.navigateBack({
                    url: `../qz-circle/main?id=${that.circleInfo.circleId}`
                  })
                }
              })
          }
        }
      })
    },
    async doDisLike (item) {
      if (this.isVisible === '0') return
      const act = item.disliked ? 'cancel' : 'add'
      const params = {
        infoId: item.id,
        data: {
          action: act
        }
      }
      let res = await this.$quanzis.api.info.dislike(params)
      if (res.error) return
      item.disliked = !item.disliked
      item.likes = res.likes
      item.dislikes = res.dislikes
      item.liked = 0
    }
  },

  onLoad () {
    this.isVisible = this.$root.$mp.query.isVisible
    this.circleId = this.$root.$mp.query.circleId
    this.infoId = this.$root.$mp.query.infoId
    this.progressStatus = false
  }
}
</script>

<style lang="scss" scoped>
.iconfont {
  font-family: iconfont;
}
.progressClass {
  display: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* width: 750rpx; */
  height: 10rpx;
  margin-bottom: 20rpx;
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
  margin-bottom: 30rpx;
}
.card-box {
  width: 610rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.message-del {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 610rpx;
  height: 72rpx;
}
.del {
  font-size: 26rpx;
  height: 60rpx;
  color: $decorateColor;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
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
  /* padding-left: 70rpx;
  padding-right: 70rpx; */
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
.msg {
  position: relative;
  overflow: hidden;
}
.text {
  width: 64rpx;
  height: 28rpx;
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
  // padding-bottom: 3rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 60rpx;
  // height: 76rpx;
  margin-left: 24rpx;
}
.btn {
  width: 48rpx;
  height: 48rpx;
  background-color: #fff;
  // margin-bottom: 4rpx;
}
.share-text {
  width: 64rpx;
  height: 28rpx;
  // margin-top: 4rpx;
  line-height: 32rpx;
  text-align: center;
  font-size: 22rpx;
  color: #b2b2b2;
}
.btn::after {
  border: 0;
}
.btn-icon {
  position:absolute;
  top:-34rpx;
  left:5rpx;
  width:48rpx;
  height:48rpx;
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
  width: 630rpx;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  background-color: #fff;
  opacity: .7;
  /* backdrop-filter: blur(14rpx);
  -webkit-filter: blur(14rpx); */
  /* filter: blur(14rpx); */
  text-align: center;
}
.mask-text {
  width: 630rpx;
  height: 30rpx;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  font-size: 26rpx;
  color: #b2b2b2;
}
.icon-img {
  width: 48rpx;
  height: 48rpx;
}
.question-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  /* margin-right: 30rpx; */
}
.imgIcon {
  width: 48rpx;
  height: 48rpx;
  margin-right: 20rpx;
}
.item-box {
  width: 180rpx;
  height: 64rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // margin-right: 32rpx;
  // margin-left: 20rpx;
}
.question-text {
  width: 180rpx;
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
.iconBox {
  display: flex;
  flex-direction: row;
}
</style>
