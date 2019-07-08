<template>
  <div class="wrap-page">
    <div class="wrap" v-if="canvasStatus">
    <!-- <div class="wrap"> -->
      <!-- 常规型圈子 -->
      <div class="cnavas-img">
        <div class="box-img">
          <image class="img" @load="imageLoad" mode="aspectFill" :src="circleData.cover" />
        </div>
        <div class="content">
          <div class="box-title">
            <div class="border-box">
              <span v-if="circleData.circleType === 2" class="border-left"></span>
              <span class="circle-title">{{ circleData.name }}</span>
            </div>
            <div v-if="circleData.price > 0" class="box-title-right">
              <span class="yuan">¥</span>
              <span class="price">{{ circleData.price / 100 }}</span>
            </div>
          </div>
          <div class="member-box">
            <div class="admin-box-left">
              <image mode="aspectFill" class="admin-avatar" :src="circleData.administrator && circleData.administrator.avatar" />
              <span class="admin-name">{{ circleData.administrator && circleData.administrator.nickname }}</span>
            </div>
            <div class="member-box-right">
              <span class="member-number">{{ count || 0 }}</span>
              <w-member :member="member"></w-member>
            </div>
          </div>
          <div class="desc">
            {{ circleData.desc || '简介' }}
          </div>
        </div>
        <div class="share-bottom-box">
          <div class="share-box-left">
            <image mode="aspectFill" class="quanzi-default" src="https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_share_img.png" />
            <div class="share-text-box">
              <span>长按识别，加入圈子</span>
              <!-- <span>子</span> -->
            </div>
          </div>
          <div class="xcx-code-box">
            <image mode="aspectFill" class="xcx-code" :src="xcxImg" />
          </div>
          <div @click="save" class="save-img">保存图片</div>
        </div>
        <div class="btn">
          <button class="xcxBtn" open-type="share" id="1">
            直接转发
          </button>
          <!-- <w-button text="直接转发" size="medium" bgColor="black"></w-button> -->
        </div>
      </div>
      <image mode="aspectFill" class="bg" src="https://api.tiyou.techoiceness.com/v1/static/qz-images/bg.png" />
    </div>
    <canvas class="canvas" canvas-id="myCanvas"></canvas>
  </div>
</template>

<script>
import Wmember from '@/components/quanzis/member'
import Wbutton from '@/components/quanzis/button'

export default {
  components: {
    'w-member': Wmember,
    'w-button': Wbutton
  },

  data () {
    return {
      circleData: {},
      member: [],
      screenHeight: 0,
      screenWidth: 0,
      imgWidth: 315,
      count: 0,
      defaultLength: 6,
      canvasStatus: 1,
      shareUserName: '',
      shareId: '',
      cover: '',
      xcxImg: '',
      default: 'https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_default.png',
      defaultImg: 'https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_share_img.png',
      nativeCover: 'https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_default.png',
      writePhotosAlbum: 0,
      openSetting: 0,
      getSatus: 0,
      mList: [],
      adminAvatar: 'https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_default.png',
      xcxCodeImg: '',
      shareUserAvatar: '',
      circleId: '',
      userId: 0
    }
  },

  onShareAppMessage: function (res) {
    let text = '邀请你加入圈子'
    if (this.circleData.circleType === 2) {
      text = '邀请你加入课程'
    }
    if (res.from === 'button') {
      return {
        title: `${this.shareUserName}${text}`,
        path: `/pages/qz-share/main?id=${this.circleId}&type=0&shareUserName=${this.shareUserName}&shareUserAvatar=${this.shareUserAvatar}`
      }
    }
  },

  methods: {
    ctxDrawImage (ctx, data) {
      const { src, x, y, w, h } = data
      ctx.drawImage(src, x, y, w, h)
    },

    ctxCoverImg (ctx, data) {
      const { src, x, y, w, h } = data
      ctx.drawImage(src, x, y, w, h)
    },

    ctxFillText (ctx, data) {
      const { textColor, fontSize, circleName, x, y, maxWidth = 275 } = data
      // 圈子名字
      ctx.setFillStyle(textColor)
      ctx.setFontSize(fontSize)
      ctx.fillText(circleName, x, y, maxWidth)
    },

    ctxAdminArc (ctx, data) {
      const { arcColor = '#fff', x, y, r, e, c } = data
      ctx.beginPath()
      ctx.setStrokeStyle(arcColor)
      ctx.arc(x, y, r, e, c)
      ctx.stroke()
      ctx.clip()
    },

    ctxMemberArc (ctx, data, member) {
      const { arcColor = '#fff', x, y, r, e, c } = data
      ctx.beginPath()
      ctx.setStrokeStyle(arcColor)
      ctx.arc(x, y, r, e, c)
      ctx.stroke()
      ctx.clip()
    },

    saveImg () {
      this.canvasStatus = 0
      const ctx = wx.createCanvasContext('myCanvas')
      ctx.draw()
      const imgData = {
        src: this.nativeCover,
        x: -((this.imgWidth - 315) / 2),
        y: 0,
        w: this.imgWidth,
        h: 200
      }
      // this.ctxDrawImage(ctx, imgData)
      this.ctxCoverImg(ctx, imgData)
      const priceIcon = {
        textColor: '#eee',
        fontSize: 17,
        circleName: '¥',
        x: 240,
        y: 230
      }
      const circlePrice = {
        textColor: '#55d9ff',
        fontSize: 24,
        circleName: this.circleData.price / 100,
        x: 253,
        y: 230
      }
      let textData = {}
      // ctx.drawImage(this.circleData.cover, 0, 0, 315, 200)
      if (this.circleData.circleType === 1) {
        textData = {
          textColor: '#232323',
          fontSize: 17,
          circleName: this.circleData.name,
          x: 20,
          y: 230
        }
      }
      // 课程
      if (this.circleData.circleType === 2) {
        ctx.setFillStyle('#55d9ff')
        ctx.fillRect(20, 218, 2, 15)
        textData = {
          textColor: '#232323',
          fontSize: 17,
          circleName: this.circleData.name,
          x: 30,
          y: 230
        }
      }
      this.ctxFillText(ctx, textData)
      // 收费
      if (this.circleData.price > 0) {
        this.ctxFillText(ctx, priceIcon)
        this.ctxFillText(ctx, circlePrice)
      }
      // 保存上下文
      ctx.save()
      // 管理员
      const arcData = {
        x: 32,
        y: 272,
        r: 12,
        e: 0,
        c: 12
      }
      const adminData = {
        src: this.adminAvatar,
        x: 20,
        y: 260,
        w: 24,
        h: 24
      }
      this.ctxAdminArc(ctx, arcData)
      this.ctxDrawImage(ctx, adminData)
      // 恢复上下文
      ctx.restore()
      // 截取多余名字
      let nickname = ''
      if (this.circleData.administrator.nickname.length > 8) {
        nickname = this.circleData.administrator.nickname.slice(0, 7) + '...'
      } else {
        nickname = this.circleData.administrator.nickname
      }
      const nameData = {
        textColor: '#232323',
        fontSize: 14,
        circleName: nickname,
        x: 54,
        y: 277,
        maxWidth: 100
      }
      this.ctxFillText(ctx, nameData)
      // 多余消息 99+
      let memberCount = ''
      if (this.count > 99) {
        memberCount = '99+'
      } else {
        memberCount = this.count
      }
      const countData = {
        textColor: '#232323',
        fontSize: 14,
        circleName: memberCount,
        x: 160,
        y: 277,
        maxWidth: 80
      }
      // ctx.fillText(this.circleData.administrator.nickname + '哈哈哈啊哈哈', 54, 277, 100)
      this.ctxFillText(ctx, countData)
      // ---
      ctx.save()
      // 成员头像
      for (let i = 0; i < this.defaultLength; i++) {
        ctx.save()
        if (this.member.length === this.defaultLength) {
          // 成员有 6 个
          const memberData = {
            x: 205 + i * 16,
            y: 272,
            r: 12,
            e: 0,
            c: 12
          }
          const memberImg = {
            // src: this.default,
            src: this.mList[i],
            x: 193 + i * 16,
            y: 260,
            w: 24,
            h: 24
          }
          this.ctxMemberArc(ctx, memberData)
          this.ctxDrawImage(ctx, memberImg)
        }
        if (this.member.length !== this.defaultLength) {
          if (this.member.length + i - this.defaultLength < 0) {
            const memberData = {
              x: 205 + i * 16,
              y: 272,
              r: 12,
              e: 0,
              c: 12
            }
            const memberImg = {
              src: this.default,
              x: 193 + i * 16,
              y: 260,
              w: 24,
              h: 24
            }
            this.ctxMemberArc(ctx, memberData)
            this.ctxDrawImage(ctx, memberImg)
          } else {
            const memberData = {
              x: 205 + i * 16,
              y: 272,
              r: 12,
              e: 0,
              c: 12
            }
            let _index = Math.abs(this.defaultLength - i - 1)
            const memberImg = {
              // src: this.default,
              src: this.mList[_index],
              x: 193 + i * 16,
              y: 260,
              w: 24,
              h: 24
            }
            this.ctxMemberArc(ctx, memberData)
            this.ctxDrawImage(ctx, memberImg)
          }
        }
        ctx.restore()
      }
      // 简介
      let desc = this.circleData.desc
      // let desc = '圈子小程序解决方案是由圈子（深圳）科技有限公司研发为各行业进行社群工具能力赋能的企业级应用。主要功能包括：社群建立、圈子管理、圈子内容能力、圈子任务能力、圈子课程能力、分享能力、有价值行为记录与成长。'
      let descArr = desc.split('')
      // let iLength = Math.ceil(ctx.measureText(desc).width / 275)
      let temp = ''
      let row = []
      for (let i = 0; i < descArr.length; i++) {
        if (ctx.measureText(temp).width < 340) {
          temp += descArr[i]
          if (i === descArr.length - 1) {
            // 最后一段需要 push
            row.push(temp)
          }
        } else {
          i--
          row.push(temp)
          temp = ''
        }
      }
      for (let j = 0; j < row.length; j++) {
        const descData = {
          textColor: '#b2b2b2',
          fontSize: 11,
          circleName: row[j],
          x: 20,
          y: 310 + j * 20,
          maxWidth: 275
        }
        this.ctxFillText(ctx, descData)
      }
      ctx.restore()
      let len = row.length
      // 左侧圈子半截图
      const Img = {
        src: this.defaultImg,
        x: 0,
        y: 340 + len * 20,
        w: 90,
        h: 55
      }
      this.ctxDrawImage(ctx, Img)
      // 长按识别,加入圈子
      const timeText = {
        textColor: '#232323',
        fontSize: 14,
        circleName: '长按识别，加入圈子',
        x: 100,
        y: 370 + len * 20
      }
      const xcxImg = {
        src: this.xcxCodeImg,
        x: 235,
        y: 310 + len * 20,
        w: 64,
        h: 64
      }
      this.ctxDrawImage(ctx, xcxImg)
      this.ctxFillText(ctx, timeText)
      if (!this.xcxCodeImg) {
        return
      }
      ctx.draw(false, setTimeout(() => {
        // wx.canvasGetImageData()
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          fileType: 'jpg',
          quality: 1,
          width: 315,
          height: 390 + len * 20,
          // destWidth: 315,
          // destHeight: 310 + len * 20,
          success: (res) => {
            // 获得图片临时路径
            // this.imageTempPath = res.tempFilePath
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: (res) => {
                wx.showToast({
                  icon: 'none',
                  title: '保存成功'
                })
                ctx.draw()
                this.canvasStatus = 1
              },
              fail: () => {
                this.canvasStatus = 1
              }
            })
          }
        })
      }, 5)
      )
    },

    save () {
      if (this.writePhotosAlbum === 1) {
        this.openSetting = 0
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.writePhotosAlbum']) {
              this.saveImg()
            }
          }
        })
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: (res) => {
            this.saveImg()
          },
          fail: (fail) => {
            // 拒绝授权，调用设置接口
            this.openSetting = 1
          }
        })
      }
      if (this.openSetting === 1) {
        wx.openSetting({
          success: (res) => {
          }
        })
      }
      if (this.getSatus === 1) {
        this.saveImg()
      }
    },

    async getxcxCodeImg () {
      let res = await this.$api.my.profile()
      if (res.error) {
        return
      }
      this.userId = res.id
      const data = {
        scene: `${this.circleId}&0&${this.userId}`,
        page: `pages/qz-share/main`,
        width: this.screenWidth,
        height: this.screenWidth
      }
      this.$api.share.shareImg(data)
        .then((res) => {
          this.xcxImg = res.xcxCodeImg
          // this.xcxCodeM = res
          wx.getImageInfo({
            src: res.xcxCodeImg,
            success: (res) => {
              this.xcxCodeImg = res.path
            }
          })
        })
    },

    imageLoad (e) {
      let oWidth = e.mp.detail.width
      let oHeight = e.mp.detail.height
      let ratio = oHeight / 200
      this.imgWidth = oWidth / ratio
    },

    async getProfile () {
      let res = await this.$api.my.profile()
      this.userId = res.id
    }
  },

  onLoad () {
    this.userId = 0
    this.canvasStatus = 1
    this.imgWidth = 315
    this.getSatus = 0
    this.openSetting = 0
    this.writePhotosAlbum = 0
    this.xcxImg = ''
    this.nativeCover = 'https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_default.png'
    this.adminAvatar = 'https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_default.png'
    this.mList = []
    wx.getSystemInfo({
      success: (res) => {
        this.screenHeight = res.windowHeight
        this.screenWidth = res.windowWidth
      }
    })
    wx.getUserInfo({
      success: (res) => {
        this.shareUserName = res.userInfo.nickName
        this.shareUserAvatar = res.userInfo.avatarUrl
      }
    })
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          // 没有授权过
          this.writePhotosAlbum = 1
        } else {
          this.getSatus = 1
        }
      }
    })
    const { circleId } = this.$root.$mp.query
    this.circleId = Number(circleId)
    this.$api.circle.circleId(this.circleId)
      .then((res) => {
        if (res.error) {
          return
        }
        this.member = res.members
        this.count = res.memberCount
        this.cover = res.cover
        this.circleData = res
        for (let i = 0; i < res.members.length; i++) {
          wx.getImageInfo({
            src: res.members[i].user.avatar,
            success: (res) => {
              this.mList.push(res.path)
            },
            fail: (err) => {
              console.log('err', err)
            }
          })
        }
        wx.getImageInfo({
          src: res.administrator.avatar,
          success: (res) => {
            this.adminAvatar = res.path
          }
        })
        if (res.circleType === 2) {
          wx.setNavigationBarTitle({
            title: '加入课程'
          })
          const t = {
            page: 1,
            id: this.circleId
          }
          this.$api.circle.circleTask(t)
            .then((r) => {
              if (r.rows[0].taskType === 101) {
                let detail = r.rows[0].courseDetail
                const course = {
                  cover: detail.cover,
                  name: detail.title,
                  price: res.price,
                  desc: detail.desc,
                  administrator: res.administrator,
                  circleType: res.circleType
                }
                this.circleData = course
                wx.getImageInfo({
                  src: this.circleData.cover,
                  success: (res) => {
                    this.nativeCover = res.path
                  }
                })
              } else {
                this.circleData = res
                wx.getImageInfo({
                  src: res.cover,
                  success: (res) => {
                    this.nativeCover = res.path
                  }
                })
              }
            })
        }
        // 常规圈子
        if (res.circleType === 1) {
          this.circleData = res
          wx.getImageInfo({
            src: res.cover,
            success: (res) => {
              // this.cover = res
              this.nativeCover = res.path
            }
          })
          this.cover = res.cover
        }
      })
    // const data = {
    //   shareType: 1,
    //   circleId: this.circleId,
    //   extra: {
    //     type: 0
    //   }
    // }
    // this.$api.info.share(data)
    //   .then(res => {
    //     this.shareId = res.shareId
    //   })
    this.getxcxCodeImg()
  }
}
</script>

<style lang="scss" scoped>
.wrap-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 750rpx; 
}
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 750rpx;
  padding-top: 60rpx;
  position: relative;
}
.box-img {
  width: 630rpx;
  height: 400rpx;
}
.img {
  width: 630rpx;
  height: 400rpx;
}
.box-title {
  width: 540rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 40rpx;
  height: 48rpx;
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}
.circle-title {
  width: 200rpx;
  overflow: hidden;
  font-size: 34rpx;
  color: #232323;
}
.yuan {
  font-size: 34rpx;
  color: #eee;
}
.price {
  font-size: 48rpx;
  color: $decorateColor;
  margin-left: 10rpx;
}
.admin-box-left,
.member-box-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.member-box {
  width: 550rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 30rpx;
}
.admin-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
}
.admin-name {
  width: 160rpx;
  margin-left: 20rpx;
  overflow: hidden;
  font-size: 24rpx;
  color: #232323;
}
.member-number {
  font-size: 28rpx;
  color: #b2b2b2;
  margin-right: 10rpx;
}
.desc {
  width: 550rpx;
  height: 128rpx;
  font-size: 22rpx;
  color: #b2b2b2;
  margin-bottom: 70rpx;
}
.save-img {
  position: absolute;
  bottom: -70rpx;
  right: 50rpx;
  z-index: 101;
  font-size: 28rpx;
  color: #888;
}
.canvas {
  position: absolute;
  top: 60rpx;
  width: 630rpx;
  height: 950rpx;
  z-index: 101;
}
.share-bottom-box {
  display: flex;
  flex-direction: row;
}
.share-box-left {
  display: flex;
  flex-direction: row;
  margin-top: 45rpx;
}
.quanzi-default {
  width: 180rpx;
  height: 110rpx;
}
.share-text-box {
  margin-left: 30rpx;
  display: flex;
  flex-direction: column;
  // align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #232323;
}
.xcx-code {
  width: 128rpx;
  height: 128rpx;
}
.bg {
  position: absolute;
  top: 60rpx;
  width: 630rpx;
  height: 1050rpx;
  filter: drop-shadow(-2rpx 2rpx 4rpx rgba(0,0,0,0.1));
  z-index: 99;
  padding-bottom: 20rpx;
}
.cnavas-img {
  position: absolute;
  top: 60rpx;
  border-radius: 40rpx;
  z-index: 100;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 630rpx;
  box-sizing: border-box;
  padding-left: 40rpx;
  padding-right: 40rpx;
}
.btn {
  position: absolute;
  bottom: -120rpx;
  left: 0;
}
.xcxBtn::after{
  border: 0;
}
.xcxBtn {
  text-align: center;
  line-height: 80rpx;
  font-size: 34rpx;
  color: #fff;
  border-radius: 40rpx;
  width: 330rpx;
  height: 80rpx;
  font-weight: 500;
  letter-spacing: 0.1rpx;
  // box-shadow: 0 8rpx 16rpx -8rpx #76bdec;
  background-color: $btnColor;
}
.xcx-code-box {
  margin-left: 10rpx;
}
.border-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.border-left {
  width: 4rpx;
  height: 30rpx;
  border-radius: 4rpx;
  background-color: $decorateColor;
  margin-right: 20rpx;
}
</style>
