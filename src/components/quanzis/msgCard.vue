<template>
  <div>
    <div class="msg-card" v-for="(item, index) in circleInfo" :key="index">
      <div class="card-box" @click="toMsgPage(circleId, item.id, index, item.isVisible)">
        <div class="card-box-top">
          <div class="card-user">
            <image class="uers-avatar" :src="item.user && item.user.avatar" />
            <span class="user-name">{{ item.user && item.user.nickname }}</span>
          </div>
          <div class="card-time">
            <div>{{ item && item.createdAt }}</div>
            <div v-if="theme" class="theme-box" @click="toCircle(item.circleId)">
              <span class="border-r"></span>
              <span>{{ item.circle && item.circle.name }}</span>
            </div>
          </div>
        </div>
        <div class="msg">
          <!-- 主题详情，无加入状态joinStatus字段,是否展示内容isVisible字段 -->
          <div v-if="theme">
            <w-msg-slot :type="item" :joinStatus="item.isVisible" :dataDetail="item && item.detail"></w-msg-slot>
            <div v-if="item.isVisible === 0" class="mask">
            </div>
            <div v-if="item.isVisible === 0" class="mask-text">
              加入圈子后展开查看
            </div>
          </div>
          <div v-else>
            <w-msg-slot
              :type="item"
              :joinStatus="joinStatus"
              :dataDetail="item && item.detail"
            />
            <div v-if="joinStatus !== 1" class="mask">
            </div>
            <div v-if="joinStatus !== 1" class="mask-text">
              加入圈子后可展开查看
            </div>
          </div>
        </div>
        <div class="icon-box">
          <div class="question-box" @click.stop="toTask(index)" v-if="item.infoType === 9">
            <!-- <image class="imgIcon" src="../../static/qz-images/ic_qa_gray.png" /> -->
            <span class="iconfont icon-ic_qa_gray imgIcon"></span>
            <div class="item-box">
              <div class="question-text" v-for="(questionItem, questionIndex) in item.detail.answers" :key="questionIndex">
                {{ questionItem.questionContent }}
              </div>
            </div>
          </div>
          <div class="iconBox">
            <div @click.stop="doLike(item)" class="msg-box">
              <span v-if="item.liked" :key="liked" class="iconfont icon-ic_liked icon-img"></span>
              <span v-else :key="like" class="iconfont icon-ic_like icon-img"></span>
              <span :class="[item.liked ? 'changetext' : '', 'text']">{{ item.likes }}</span>
            </div>
            <div @click.stop="doDisLike(item)" class="msg-box">
              <span v-if="item.disliked" :key="unliked" class="iconfont icon-ic_unliked icon-img"></span>
              <span v-else :key="unlike" class="iconfont icon-ic_unlike icon-img"></span>
              <span :class="[item.disliked ? 'unliketext' : '', 'text']">{{ item.dislikes }}</span>
            </div>
            <div class="msg-box" @click.stop="toMsg(circleId, item.id, index, item.isVisible, 1)">
              <span class="iconfont icon-ic_comment icon-img"></span>
              <span :class="[false ? 'commenttext' : '', 'text']">{{ item.commentCount || 0 }}</span>
            </div>
            <div v-if="shareStatus" class="msg-share">
              <button class="btn" open-type="share" id="1">
                <image src="https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_forward.png" class="btn-icon" />
              </button>
              <span class="text">{{ item.shareCount || 0 }}</span>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import msgCardSlot from '@/components/quanzis/msgCardSlot'
// 设置index
import {
  mapActions
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
    joinStatus: {
      type: Number,
      required: true
    },
    infoSrc: {
      type: String,
      required: true
    },
    shareType: {
      type: String,
      required: true
    }
  },
  components: {
    'w-msg-slot': msgCardSlot
  },
  data () {
    return {
      taskId: 0
    }
  },

  mounted () {
  },

  methods: {
    ...mapActions([
      'setCircle'
    ]),

    toCircle (id) {
      wx.navigateTo({
        url: `../qz-circle/main?id=${id}`
      })
    },

    toTask (index) {
      this.$quanzis.toTask.toTask(index, this.circleInfo)
    },
    msgFuntion () {
      if (this.joinStatus !== 1) {
        return
      }
      wx.navigateTo({
        url: `../qz-message/main`
      })
    },
    doLike (item) {
      if (this.joinStatus !== 1 && !this.theme) {
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
          if (res.error) return
          item.liked = !item.liked
          item.dislikes = res.dislikes
          item.likes = res.likes
          item.disliked = 0
        })
    },
    doDisLike (item) {
      if (this.joinStatus !== 1 && !this.theme) {
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
          item.disliked = !item.disliked
          item.likes = res.likes
          item.dislikes = res.dislikes
          item.liked = 0
        })
    },
    // focusStatus 从评论跳转 聚焦
    toMsg (circleId, id, index, isVisible, focusStatus) {
      this.toPage(circleId, id, index, isVisible, focusStatus)
    },
    toMsgPage (circleId, id, index, isVisible) {
      this.toPage(circleId, id, index, isVisible)
    },
    toPage (circleId, id, index, isVisible, focusStatus) {
      if (this.theme === true) {
        // 如果是主题详情页
        // isVisible===1 进入圈子 已加入，无毛玻璃效果
        let themeCircleId = this.circleInfo[index].circleId
        // vuex
        this.setCircle(themeCircleId)
        wx.navigateTo({
          url: `../qz-message/main?infoId=${id}&circleId=${themeCircleId}&isVisible=${isVisible}&focusStatus=${focusStatus}`
        })
      } else {
        if (this.joinStatus !== 1) return
        wx.navigateTo({
          url: `../qz-message/main?infoId=${id}&circleId=${circleId}&focusStatus=${focusStatus}`
        })
      }
    }
  },
  onLoad () {
    // this.taskId = this.
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
  // margin-right: 30rpx;
}
.question-text {
  width: 200rpx;
  color: $decorateColor;
  font-size: 22rpx;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  margin-left: 20rpx;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
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
  color: #ff95a7;
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
/* .no-join{
  position: relative;
} */
.img {
  width: 630rpx;
  height: 206rpx;
}
.msg {
  position: relative;
  overflow: hidden;
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
.imgIcon {
  width: 48rpx;
  height: 48rpx;
  // margin-right: 30rpx;
  // margin-left: 20rpx;
}
.iconBox {
  display: flex;
  flex-direction: row;
}
</style>
