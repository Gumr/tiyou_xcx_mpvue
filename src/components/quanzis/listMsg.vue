<template>
  <div>
    <div class="msg-card" v-for="(item, index) in circleData" :key="index">
      <div class="card-box">
        <div class="card-box-top">
          <div class="card-user">
            <image class="uers-avatar" :src="item.user && item.user.avatar" />
            <span class="user-name">{{ item.user && item.user.nickname }}</span>
          </div>
          <div class="card-time">
            <div>{{ item && item.createdAt }}</div>
            <div v-if="theme" class="theme-box">
              <span class="border-r"></span>
              <span>产品进化营一期</span>
            </div>
          </div>
        </div>
        <div class="msg">
          <div v-if="joinStatus" class="no-join">
            <image class="img" src="https://api.tiyou.techoiceness.com/v1/static/qz-images/img_zip.png" />
            <div class="mask">
              加入圈子后可展开查看
            </div>
          </div>
          <w-msg-slot v-else :type="item"></w-msg-slot>
        </div>
        <div class="icon-box">
          <div @click="doLike(item)" class="msg-box">
            <span v-if="item.liked" :key="liked" class="iconfont icon-ic_liked icon-img"></span>
            <span v-else :key="like" class="iconfont icon-ic_like icon-img"></span>
            <span :class="[item.liked ? 'changetext' : '', 'text']">{{ item.likes }}</span>
          </div>
          <div @click="doDisLike(item)" class="msg-box">
            <span v-if="item.disliked" :key="unliked" class="iconfont icon-ic_unliked icon-img"></span>
            <span v-else :key="unlike" class="iconfont icon-ic_unlike icon-img"></span>
            <span :class="[item.liked ? 'unliketext' : '', 'text']">{{ item.dislikes }}</span>
          </div>
          <div class="msg-box" @click="toMsg(item.id)">
            <span class="iconfont icon-ic_comment icon-img"></span>
            <span :class="[false ? 'commenttext' : '', 'text']">{{ item.commentCount || 0 }}</span>
          </div>
          <div v-if="shareStatus" class="msg-share">
            <button class="btn" open-type="share" id="1">
              <image src="https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_forward.png" class="btn-icon" />
            </button>
            <!-- <span class="iconfont icon">&#xe633;</span> -->
            <span class="text">1</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import msgCardSlot from '@/components/quanzis/msgCardSlot'

export default {
  props: {
    shareStatus: {
      type: String
    },
    circleData: {
      type: Array,
      required: true
    },
    joinStatus: {
      type: Boolean
    }
  },
  components: {
    'w-msg-slot': msgCardSlot
  },
  data () {
    return {
    }
  },

  mounted () {
  },

  methods: {
    msgFuntion () {
      wx.navigateTo({
        url: `../qz-message/main`
      })
    },
    doLike (item) {
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
    toMsg (id) {
      wx.navigateTo({
        url: `../qz-message/main?infoId=${id}`
      })
    }
  },
  onLoad () {
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
</style>
