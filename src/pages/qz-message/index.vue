<template>
  <div class="msg-wrap">
    <!-- 删除弹窗时蒙版 -->
    <div class="del-mask" v-if="showDelMask" @click="offShowDelMask">
    </div>
    <!-- 遮住 -->
    <cover-view
      v-if="maskStatus"
      catchtouchmove="preventTouchMove"
      class="mask"
      :style="{ position: 'fixed', bottom: maskBottom + 'rpx' }">
    </cover-view >
    <div v-if="show">
      <w-share 
        @share="share"
        :shareData="shareData"
        @shareExtra="shareExtra"
      />
    </div>
    <div class="scroll" :style="{ height: scrollHeight + 'rpx' }">
      <div class="warp">
        <w-msgcard
          :shareStatus="shareStatus"
          :toComment="toMsg"
          :circleInfo="circleInfo"
          :theme="theme"
          :name="circleDetail.name"
          @myShare="myShare"
        />
        <div class="comment">
          <div v-if="commentList.length > 0" class="comment-top">
          </div>
          <div v-if="commentList.length > 0" class="comment-content">
            <div class="comment-box"
              @longpress="longpress(index, $event)"
              @click="toReply(item.id, item.user && item.user.nickname)"
              v-for="(item, index) in commentList"
              :key="index">
              <div v-if="delIndex === index" class="del-show" @click.stop="delComment(item.id)">删除</div>
              <span class="name">{{ item.user && item.user.nickname }}</span>
              <!-- 有回复者 -->
              <span v-if="item.replyUser" :key="replyUser" class="comment-title">回复</span>
              <span v-else :key="noReplyedUser" class="comment-title">评论</span>
              <span v-if="item.replyUser" class="content"><span class="replyed-user">{{ item.replyUser.nickname }}:</span> {{ item.content }}</span>
              <span v-else class="content">{{ item.content }}</span>
            </div>
          </div>
        </div>
        <!-- 评论 -->
        <div v-if="focusStatus" class="input-box" :style="{ bottom: maskBottom + 'rpx' }">
          <input class="input"
            v-model="commentText"
            @confirm="send"
            confirm-type="send"
            type="text"
            @focus="focus"
            @blur="blur"
            :focus="focusStatus"
            placeholder="评论"
            adjust-postition="true"
          />
        </div>
        <!-- 回复 -->
        <div catchtouchmove="preventTouchMove" v-if="replyStatus" class="input-box">
          <input class="input"
            v-model="replyText"
            @confirm="replySend"
            confirm-type="send"
            type="text"
            @focus="replyFocus"
            @blur="replyBlur"
            :focus="replyStatus"
            :placeholder="reply"
            @input="replyValueFunt"
          />
        </div>
      </div>
      <div class="card" v-if="isVisible === '0'">
        <w-card
          :data="circleDetail"
        />
      </div>
      <div v-if="commentList.length > 0" class="loading">
        <w-loading
          :loading="loading"
          :noData="noData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Wloading from '@/components/quanzis/loading'
import WmsgCard from '@/components/quanzis/missionMsg'
import WCard from '@/components/quanzis/msgThemeCard'
import WShare from '@/components/quanzis/shareShow'
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  data () {
    return {
      scrollHeight: 0,
      loading: false,
      noData: false,
      page: 1,
      shareStatus: true,
      theme: false,
      focusStatus: false,
      replyStatus: false,
      reply: '',
      commentText: '',
      replyText: '',
      replyName: '',
      infoId: '',
      circleInfo: {},
      // 评论列表
      commentList: [],
      list: [],
      user_id: '',
      status: false,
      circleId: 0,
      type: 0,
      shareUrl: '',
      inputHeight: 0,
      inputStatus: false,
      maskStatus: false,
      isVisible: '',
      circleDetail: {},
      // 新
      show: 0,
      msg: '',
      // 用户信息
      profileInfo: {},
      shareData: {},
      maskBottom: 0,
      shareUserName: '',
      shareUserAvatar: '',
      // 当前删除的下标
      delIndex: -1,
      showDelMask: 0,
      shareText: ''
    }
  },

  components: {
    'w-msgcard': WmsgCard,
    'w-card': WCard,
    'w-loading': Wloading,
    'w-share': WShare
  },
  onReachBottom () {
    // 痰气软键盘时不需要加载
    // if (this.inputStatus === true) return
    // 上拉加载
    if (this.noData === true) return
    if (this.isVisible === '0') return
    if (this.focusStatus) return
    if (this.replyStatus) return
    this.page += 1
    this.loading = true
    const param = {
      page: this.page,
      infoId: this.infoId
    }

    // 评论列表
    this.$quanzis.api.info.getCommentList(param)
      .then(res => {
        if (res.error) {
          return
        }
        this.list = res.rows
        this.commentList = [...this.commentList, ...this.list]
        res.nextPage = this.commentList.length - res.count
        if (res.nextPage === 0) {
          this.noData = true
          this.loading = false
        }
      })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 再造
      return {
        title: this.shareUserName + '分享了内容',
        path: `/pages/qz-share/main?id=${this.circleId}
        &type=2&shareUserName=${this.shareUserName}
        &shareUserAvatar=${this.shareUserAvatar}
        &infoId=${this.infoId}&extra=${this.shareText}`
      }
    } else {
      return {
        title: this.shareUserName + '分享了内容',
        path: `/pages/qz-share/main?id=${this.circleId}
        &type=2&shareUserName=${this.shareUserName}
        &shareUserAvatar=${this.shareUserAvatar}&infoId=${this.infoId}`
      }
    }
  },

  comptued: {
    ...mapGetters([
      'userInfo'
    ])
  },

  methods: {
    ...mapActions([
      'setJumpToStatus'
    ]),

    shareExtra (text) {
      this.shareText = text
    },

    myShare (show) {
      this.show = show
    },

    share (show, msg, shareId) {
      this.show = show
      this.shareId = shareId
    },

    longpress (index, e) {
      this.delIndex = index
      this.showDelMask = 1
      this.maskStatus = false
      this.replyStatus = false
    },

    offShowDelMask () {
      this.delIndex = -1
      this.showDelMask = 0
    },

    async delComment (_id) {
      const param = {
        infoId: this.infoId,
        _id: _id
      }
      this.maskStatus = false
      this.replyStatus = false
      let res = await this.$quanzis.api.info.delComment(param)
      if (res.error) {
        return
      }
      this.commentList.splice(this.delIndex, 1)
      this.delIndex = -1
      this.showDelMask = 0
    },

    // 评论
    toMsg () {
      if (this.isVisible === '0') return
      // 显示评论框
      // this.inputStatus = true
      this.focusStatus = true
      this.maskStatus = true
    },
    // 回复评论
    toReply (id, name) {
      this.maskStatus = true
      // this.inputStatus = true
      this.user_id = id
      this.replyStatus = true
      this.reply = '回复' + name + ':'
      this.replyName = name
    },
    replyValueFunt (e) {
      this.replyText = e.mp.detail.value
    },
    replyFocus (e) {
      // this.getHeight(e)
      // this.maskStatus = true
      // this.inputStatus = true
      // this.replyStatus = false
      // this.replyText = ''
    },
    // 评论上遮罩高度
    focus (e) {
      // this.getHeight(e)
      this.maskBottom = e.mp.detail.height
      // this.maskStatus = true
    },
    replyBlur () {
      this.maskStatus = false
      this.replyText = ''
      this.replyStatus = false
      // this.inputStatus = false
    },
    blur () {
      this.maskStatus = false
      // this.inputStatus = false
      this.focusStatus = false
      this.commentText = ''
    },
    send () {
      if (this.commentText === '') {
        wx.showModal({
          title: '提示',
          content: '评论不能为空',
          success: res => {
            if (res.confirm) {
              this.focusStatus = true
            } else {
              this.focusStatus = false
            }
          }
        })
      } else {
        // 评论
        const infoId = this.infoId
        const msgData = {
          content: this.commentText
        }
        this.$quanzis.api.info.comment(infoId, msgData)
          .then(res => {
            let info = res.comment
            this.circleInfo.commentCount = res.commentCount
            info.createdAt = this.$quanzis.getTime(info.createdAt)
            let NewInfo = info
            this.commentList = [...this.commentList, NewInfo]
            this.focusStatus = false
            this.commentText = ''
          })
      }
    },
    // 回复
    replySend () {
      if (this.replyText === '') {
        wx.showModal({
          title: '提示',
          content: '评论不能为空',
          success: res => {
            if (res.confirm) {
              this.replyStatus = true
            } else if (res.cancel) {
              this.replyStatus = false
            }
          }
        })
      } else {
        const msgData = {
          content: this.replyText,
          // 要回复的评论id
          replyCommentId: this.user_id
        }
        this.$quanzis.api.info.comment(this.infoId, msgData)
          .then(res => {
            if (res.error) return
            let info = res.comment
            this.circleInfo.commentCount = res.commentCount
            info.createdAt = this.$quanzis.getTime(info.createdAt)
            let NewInfo = info
            this.commentList = [...this.commentList, NewInfo]
            this.replyText = ''
            this.replyStatus = false
          })
      }
    },

    async getCircleDetail (id) {
      let res = await this.$quanzis.api.circle.circleId(id)
      if (res.error) return
      this.circleDetail = res
    },

    initState () {
      this.page = 1
      this.noData = false
      this.loading = false
      this.status = false
      this.commentList = []
      this.inputStatus = false
      this.reply = ''
      this.replyName = ''
      this.replyText = ''
      this.delIndex = -1
      this.showDelMask = 0
    }
  },
  onUnload () {
    // 清除评论列表状态
    this.setJumpToStatus(1)
    this.initState()
  },

  onLoad () {
    wx.getUserInfo({
      success: (res) => {
        this.shareUserName = res.userInfo.nickName
        this.shareUserAvatar = res.userInfo.avatarUrl
      }
    })
    this.shareText = ''
    this.show = 0
    this.msg = ''
    // wx.hideShareMenu()
    this.initState()
    this.progress = 0
    // 是否从主题过来
    const { isVisible, circleId, focusStatus } = this.$root.$mp.query
    this.circleId = circleId
    this.isVisible = isVisible
    this.infoId = this.$root.$mp.query.infoId
    // 获取信息详情
    this.$quanzis.api.info.getInfoDetail(this.infoId)
      .then(res => {
        if (res.error) {
          return
        }
        this.circleInfo = res
        this.circleInfo.createdAt = this.$quanzis.getTime(res.createdAt)
        // let id = res.circleId
        if (res.infoType === 7) {
          this.type = 1
          this.shareUrl = res.detail.url
        } else {
          this.type = 2
        }
        this.getCircleDetail(this.circleId)
      })
    // 从评论过来直接聚焦
    if (focusStatus === '1') {
      this.toMsg()
    }
    const param = {
      infoId: this.infoId,
      page: this.page
    }
    // 评论列表
    if (this.isVisible !== '0') {
      this.$quanzis.api.info.getCommentList(param)
        .then(res => {
          if (res.error) {
            return
          }
          this.commentList = res.rows
        })
    }
  }
}
</script>

<style scoped>
.msg-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 100rpx;
  opacity: .1;
  width: 100%;
}
.scroll {
  width: 750rpx;
}
.warp {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 750rpx;
}
.comment-top {
  width: 0;
  height: 0;
  border-left: 30rpx solid transparent;
  border-right: 30rpx solid transparent;
  border-bottom: 30rpx solid #f8f8f8;
  margin-left: 500rpx;
}
.comment-content {
  box-sizing: border-box;
  padding-top: 30rpx;
  padding-left: 40rpx;
  padding-right: 40rpx;
  display: flex;
  flex-direction: column;
  width: 690rpx;
  background-color: #f8f8f8;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  font-size: 28rpx;
}
.comment-box {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}
.name,
.replyed-user{
  color: #de6f6f;
}
.comment-title {
  font-size: 28rpx;
  color: #b2b2b2;
  margin-left: 20rpx;
  margin-right: 20rpx;
}
.content {
  flex-wrap: wrap;
  color: #000;
}
.input {
  box-sizing: border-box;
  padding-left: 30rpx;
  padding-right: 30rpx;
  background-color: #fff;
  width: 690rpx;
  height: 60rpx;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
  /* z-index: 900; */
}
.input-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #f8f8f8;
  width: 100%;
  height: 100rpx;
  margin-top: 30rpx;
  overflow: hidden;
}
.card {
  margin-top: 30rpx;
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.del-show {
  position: absolute;
  top: -50rpx;
  right: 100rpx;
  color: red;
  width: 120rpx;
  height: 50rpx;
  z-index: 1000;
  border-radius: 10rpx;
  text-align: center;
  line-height: 50rpx;
  background-color: #fff;
}
.del-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900; 
  background-color: #fff;
  opacity: 0;
}
</style>
