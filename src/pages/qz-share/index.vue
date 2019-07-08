<template>
  <div class="wrap">
    <div v-if="codeToast">
      <w-bindphone
        @sendCode = "sendCode"
      />
    </div>
    <!-- 分享内容 -->
    <label v-if="phone" for="phone" class="test">授权手机号登陆</label>
    <button id="phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" />
    <div v-if="!phone">
      <div v-if="type === 2" class="share-content">
      <div class="share">
        <span class="title">{{ circleInfo.name || name }}</span>
        <span v-if="joined === 1" @click="toCircle" class="to-circle">进入圈子</span>
        <span v-else class="join-circle">未加入</span>
      </div>
      <!-- 内容再造 -->
      <div v-if="extra" class="extra-box">
        <image mode="aspectFill" class="extra-img" :src="shareUserAvatar" />
        <div class="extra-msg">{{ extra }}</div>
      </div>
      <div v-if="joined === 1" class="msg">
        <w-msgcard
          :circleInfo="msgData"
          :circleId="circleInfo.id"
          :joinStatus="1"
          :shareType="type"
        />
      </div>
      <!-- 未加入圈子 -->
      <div v-if="joined !== 1" class="apply-join">
        <image mode="aspectFill" class="mask-img" :src="circleInfo.cover" />
        <div class="mask">
        </div>
        <div class="msg-box">
          <div class="mask-title">
            加入圈子后可展开查看
          </div>
          <div>
            <w-share-card :data="circleInfo" @joinSatus="joinSatus" />
          </div>
          <div class="share-bottom"></div>
        </div>
      </div>
    </div>
    <!-- 分享圈子 -->
    <div v-if="type === 0" class="share-circle">
      <image mode="aspectFill" class="circle-img" :src="circleInfo.cover" />
      <div class="circle-mask">
        <div class="title-box">
          <image mode="aspectFill" class="avatar-img" :src="shareUserAvatar" />
          <div class="push">
            &nbsp; {{ shareUserName }}向您推荐了
          </div>
        </div>
        <div>
          <w-share-card :data="circleInfo" />
        </div>
      </div>
    </div>
    <!-- 分享图文 -->
    <div v-if="type === 1" class="share-content">
      <!-- 已经加入圈子 -->
      <web-view v-if="joined" :src="shareUrl"></web-view>
        <!-- 未加入圈子 -->
      <div v-else class="view-share">
        <div class="share">
          <span class="title">{{ circleInfo.name }}</span>
          <span class="join-circle">未加入</span>
        </div>
        <div v-if="1" class="apply-join">
          <image class="mask-img" :src="circleInfo.cover" />
          <div class="mask">
          </div>
          <div class="msg-box">
            <div class="mask-title">
              加入圈子后可展开查看
            </div>
            <div>
              <w-share-card :data="circleInfo" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import WmsgCard from '@/components/quanzis/msgCard'
import msgCardSlot from '@/components/quanzis/msgCardSlot'
import shareCard from '@/components/quanzis/shareCard'
import Wbindphone from '@/components/quanzis/bindphone'

export default {
  components: {
    'w-msgcard': WmsgCard,
    'w-msg-slot': msgCardSlot,
    'w-share-card': shareCard,
    'w-bindphone': Wbindphone
  },
  data () {
    return {
      isInfo: false,
      isCircle: false,
      joined: 0,
      msgData: [],
      type: '',
      phone: false,
      codeToast: false,
      bindPhoneNoToken: '',
      name: '体游',
      infoId: '',
      shareUrl: '',
      extra: '',
      circleInfo: {
        name: '',
        desc: '',
        membersCount: 0,
        administrator: {}
      },
      sharer: {
        nickname: '',
        avatar: '',
        id: ''
      },
      shareUserName: '体游',
      shareUserAvatar: '',
      shareOptions: {},
      inviterUserId: ''
    }
  },
  methods: {
    joinSatus (show) {
      // 申请后已经加入
      this.joined = 1
      if (!this.shareScene) {
        this.getShareData()
      }
      if (this.shareScene) {
        // this.getScene()
        this.getShareData()
      }
    },

    bindPhone () {
      this.codeToast = true
      this.phone = false
    },

    async getScene () {
      let res = await this.$api.info.getShare(this.shareScene)
      if (res.error) {
        return
      }
      this.shareUserName = res.sharer.nickname
      this.shareUserAvatar = res.sharer.avatar
      let circleRes = await this.$api.circle.circleId(res.circle.id)
      if (circleRes.error) {
        return
      }
      this.joined = circleRes.joinStatus
      this.name = circleRes.name
      this.circleInfo = circleRes
      if (this.type === 0 && circleRes.joinStatus === 1) {
        wx.redirectTo({
          url: `../qz-circle/main?id=${circleRes.id}`
        })
      }
      this.setTitle(this.type)
    },

    async getShareData () {
      let circleId = Number(this.id)
      let infoId = this.$root.$mp.query.infoId
      // if (this.shareOptions.scene) {
      //   circleId = this.shareOptions.scene
      // }
      if (this.inviterUserId && !this.shareUserAvatar) {
        let p = {
          userId: Number(this.inviterUserId)
        }
        let user = await this.$api.sharer.shareGetUser(p)
        // if (user.error) {
        //   return
        // }
        this.shareUserAvatar = user.avatar
        this.shareUserName = user.nickname
      }
      let res = await this.$api.circle.circleId(circleId)
      if (res.error) {
        return
      }
      this.circleInfo = res
      this.joined = res.joinStatus
      this.name = res.name
      if (this.type === 2) {
        // 内容分享
        let infoRes = await this.$api.info.getInfoDetail(infoId)
        const info = {
          ...infoRes,
          createdAt: this.$getTime(infoRes.createdAt)
        }
        this.msgData = []
        this.msgData.push(info)
      }
      if (this.type === 0 && res.joinStatus === 1) {
        wx.redirectTo({
          url: `../qz-circle/main?id=${circleId}`
        })
      }
      if (this.type === 1) {
        this.shareUrl = res.extra.shareUrl
      }
      this.setTitle(this.type)
    },
    toCircle () {
      wx.redirectTo({
        url: `../qz-circle/main?id=${this.id}`
      })
    },

    setToken (data) {
      const { token = '', outNo = '', circleAccount = {} } = data
      wx.setStorageSync('token', token)
      wx.setStorageSync('outNo', outNo)
      wx.setStorageSync('phone', 'ok')
      wx.setStorageSync('circleAccount', circleAccount)
      this.getShareData()
      this.phone = 0
    },

    sendCode (codeToast, login) {
      this.codeToast = codeToast
      if (login === true) {
        this.phone = false
        this.getShareData()
      } else {
        this.phone = true
      }
    },

    getPhoneNumber (e) {
      // 如果拒绝，需绑定手机号
      this.$wxLogin.getPhoneNumber(e, this)
    },

    setTitle (type) {
      switch (type) {
        case 0:
          wx.setNavigationBarTitle({
            title: this.shareUserName + '邀请你加入圈子'
          })
          break
        case 1:
          wx.setNavigationBarTitle({
            title: this.shareUserName + '分享了图文'
          })
          break
        case 2:
          if (this.extra) {
            wx.setNavigationBarTitle({
              title: this.shareUserName + '再造了内容'
            })
          } else {
            wx.setNavigationBarTitle({
              title: this.shareUserName + '分享了内容'
            })
          }
          break
      }
    }
  },
  onShow () {
    const _token = wx.getStorageSync('token')
    if (!_token) {
      this.$wxLogin.wxLogin(this)
    }
  },
  onLoad (options) {
    // const id = this.$root.$mp.query.id
    const { id, type, shareUserName, shareUserAvatar, infoId, extra, inviterUserId } = this.$root.$mp.query
    // id 为圈子 circleId
    this.id = id
    this.type = Number(type)
    this.shareUserAvatar = shareUserAvatar
    this.shareUserName = shareUserName
    this.infoId = infoId
    this.extra = extra
    this.shareScene = options.scene
    this.inviterUserId = inviterUserId
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          const _token = wx.getStorageSync('token')
          if (!_token) return
          // 已加入圈子列表
          if (!this.shareScene) {
            this.getShareData()
          }
          // 识别小程序码进入
          if (this.shareScene) {
            let arr = this.shareScene.split('&')
            this.id = arr[0]
            this.type = 0
            this.shareUserName = '体游'
            // this.shareUserAvatar = arr[3]
            this.inviterUserId = arr[2]
            // this.getScene()
            this.getShareData()
          }
        } else {
          wx.redirectTo({
            url: `../login/main?id=${this.id}&scene=${this.shareScene}&shareUserName=${this.shareUserName}&type=${this.type}&shareUserAvatar=${this.shareUserAvatar}&infoId=${this.infoId}&extra=${this.extra}&inviterUserId=${inviterUserId}`
          })
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.share {
  box-sizing: border-box;
  padding-left: 60rpx;
  padding-right: 60rpx;
  width: 750rpx;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-top: 60rpx;
  margin-bottom: 30rpx;
}
.title {
  font-size: 34rpx;
  color: #232323;
}
.to-circle {
  font-size: 26rpx;
  color: $decorateColor;
}
.join-circle {
  font-size: 26rpx;
  color: #b2b2b2;
}
.apply-join {
  width: 750rpx;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.mask-img {
  position: absolute;
  left: 30rpx;
  right: 30rpx;
  width: 690rpx;
  height: 950rpx;
  filter: blur(18rpx);
  opacity: .5;
}
.mask {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  width: 750rpx;
  height: 1074rpx;
  background-color: #fff;
  /* opacity: .5; */
}
.msg-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  width: 750rpx;
  /* height: 1074rpx; */
}
.mask-title {
  font-size: 26rpx;
  color: #b2b2b2;
  text-align: center;
  width: 630rpx;
  margin-top: 180rpx;
  margin-bottom: 190rpx;
}
.share-circle {
  position: relative;
  width: 630rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.circle-img {
  width: 750rpx;
  height: 750rpx;
  filter: blur(16rpx);
}
.circle-mask {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 750rpx;
  /* height: 750rpx; */
  /* backdrop-filter: blur(8rpx); */
  background-image: linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.85) 15%, rgba(255, 255, 255, 0.7) 51%, #ffffff 86%, #ffffff);
}
.title-box {
  width: 610rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 70rpx;
  margin-bottom: 60rpx;
}
.push {
  height: 40rpx;
  font-size: 28rpx;
  line-height: 40rpx;
  color: #888;
}
.avatar-img {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}
.view-share {
  width: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.msg {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.test {
  width: 690rpx;
  height: 100rpx;
  border-radius: 16rpx;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  color: $decorateColor;
  font-size: 28rpx;
  text-align: center;
  line-height: 100rpx;
  margin-bottom: 30rpx;
  position: fixed;
  top: 60rpx;
}
.extra-img {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
}
.extra-box {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: space-between;
  padding-left: 40rpx;
  padding-right: 40rpx;
  padding-top: 40rpx;
  padding-bottom: 50rpx;
  width: 690rpx;
  margin-left: 30rpx;
  margin-bottom: 60rpx;
  border-bottom-left-radius: 96rpx;
  background-color: #fff;
  box-shadow: 0 8rpx 16rpx -8rpx rgba(0, 0, 0, 0.05);
}
.extra-msg {
  width: 488rpx;
  font-size: 28rpx;
  color: #232323;
}
/* 防止靠近底部 */
.share-bottom {
  width: 1rpx;
  height: 1rpx;
  background-color: #fff;
  margin-top: 100rpx;
}
</style>
