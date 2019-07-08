<template>
  <div class="card-warp">
    <div class="card" v-for="(item, index) in joinData" :key="index">
      <!-- <div class="card-box"> -->
      <div class="img-box" @touchstart="touchstart(index, $event)" @touchmove="touchmove(index, $event)"
      :style="{left: item.textLeftStyle + 'rpx'}" @click.stop="toCircle(item && item.id, index)">
        <image mode="aspectFill"  class="img" :src='item && item.cover' />
        <div class="left-t"></div>
        <div class="mask">
          <div class="w-member">
            <w-member :member="item && item.members"></w-member>
          </div>
          <div>
            <div class="title-box">
            <span class="title">
              {{ item && item.name }}
            </span>
            <span class="title-r"></span>
            </div>
            <div class="msg">
              <div class="member-box">
                <span class="member">成员</span>
                <span class="member-munber">{{ item && item.memberCount || 0 }}</span>
              </div>
              <div class="message-box">
                <span class="message">信息</span>
                <span class="message-munber">{{ item && item.infoCount || 0 }}</span>
              </div>
              <div v-if="item.newInfosCount" class="new-message">
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->
      <div class="exit-box" >
        <span v-if="exitStatus" key="exit-status" class="exit" @click="exit(index)">退出</span>
        <span v-else key="quit-status" class="confirm-exit"  @click="quit(item && item.id, index)">确认退出</span>
      </div>
    </div>
  </div>
</template>

<script>
import member from './cardMember'
export default {
  props: {
    joinData: {
      type: Array,
      default: () => ([])
    }
  },

  components: {
    'w-member': member
  },

  data () {
    return {
      startY: '',
      list: '',
      exitStatus: 1,
      textLeft: '',
      startX: '',
      moveX: '',
      moveY: '',
      disX: '',
      touchIndex: '',
      circleId: 0,
      memberData: []
    }
  },

  methods: {
    quit (id, index) {
      this.$emit('quit', id, index)
    },
    // 退出=> 确认退出
    exit (index) {
      this.exitStatus = 0
      this.joinData[index].textLeftStyle = -300
      // this.textLeft 判断位置
      this.textLeft = -300
    },
    touchstart (index, e) {
      if (e.touches.length === 1) {
        // 记录触摸开始位置
        this.startX = e.touches[0].clientX
        this.startY = e.touches[0].clientY
      }
      // 提示按钮状态，点击card退出按钮状态
    },
    touchmove (index, e) {
      this.list = this.joinData
      if (e.touches.length === 1) {
        // 滑动时判断上移距离，大于10返回
        this.moveY = e.touches[0].clientY
        let disY = Math.abs(this.startY - this.moveY)
        if (disY > 10) {
          return
        }
        this.moveX = e.touches[0].clientX
        this.disX = this.startX - this.moveX
        // 确认退出状态时
        if (this.textLeft === -300) {
          if (this.disX === 0 || this.disX < 0) {
            this.textLeft = 0
            this.exitStatus = 1
          } else if (this.disX > 20) {
            // this.exitStatus = 1
            this.textLeft = this.disX
            if (this.disX >= this.textLeft) {
              this.textLeft = -300
            }
          }
        } else {
          if (this.disX === 0 || this.disX < 0) {
            this.textLeft = 0
          } else if (this.disX > 20) {
            this.textLeft = -this.disX
            if (this.disX >= this.textLeft) {
              this.textLeft = -150
            }
          }
        }
        this.list[index].textLeftStyle = this.textLeft
        // 更新视图
        this.joinData = this.list
        // 一个card为退出状态，滑动其它时，前一个card变成正常状态
        for (let i = 0; i < this.joinData.length; i++) {
          if (this.textLeft === -300) {
            if (this.joinData[i].textLeftStyle && index !== i) {
              this.joinData[i].textLeftStyle = 0
              this.textLeft = -150
              this.exitStatus = 1
            }
          } else {
            if (this.joinData[i].textLeftStyle && index !== i) {
              this.joinData[i].textLeftStyle = 0
            }
          }
        }
      }
    },
    toCircle (id, index) {
      // 当前圈子正常状态时 tocircle
      if (this.joinData[index].textLeftStyle === 0 || this.joinData[index].textLeftStyle === undefined) {
        this.exitStatus = 1
        this.circleId = id
        // 进入圈子，所有作左滑清零
        this.joinData = this.joinData.map((i) => {
          return {
            ...i,
            textLeftStyle: 0
          }
        })
        wx.navigateTo({
          url: `../qz-circle/main?id=${this.circleId}`
        })
      }
      // 当前为退出状态
      if (this.joinData[index].textLeftStyle === -150) {
        this.exitStatus = 1
        this.textLeft = 0
        this.joinData[index].textLeftStyle = 0
      }
      // 当前为确认退出状态
      if (this.joinData[index].textLeftStyle === -300) {
        this.exitStatus = 1
        this.joinData[index].textLeftStyle = 0
        this.textLeft = 0
      }
    }
  },

  created () {
    // src = '../../static/qz-images/demo.png'
  },

  onShow () {
    // this.exitStatus = 1
    this.startY = ''
    this.textLeft = ''
    this.startX = ''
    this.moveX = ''
    this.moveY = ''
    this.disX = ''
  },
  onLoad () {
  }
}
</script>

<style lang="scss" scoped>
  .card {
    position: relative;
    width: 690rpx;
    height: 300rpx;
    margin-bottom: 30rpx;
    /* border-radius: 16rpx; */
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 16rpx 32rpx -16rpx rgba(0, 0, 0, 0.1);
  }
  .mask {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    // border-bottom: 300rpx solid #fff;
    // border-left: 80rpx solid transparent;
    // border-right: 80rpx solid transparent;
    width: 350rpx;
    height: 300rpx;
    // transform: skew(-20deg);
    // transform:rotate(9deg);
    background-color: #fff;
    z-index: 9999;
    // background-image: linear-gradient(98deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7) 25%, #ffffff 51%, #ffffff);
  }
  .left-t {
    position: absolute;
    top: 0;
    right: 300rpx;
    // border-right: 80rpx solid transparent;
    width: 100rpx;
    height: 300rpx;
    transform: skew(-18deg);
    box-shadow: -8rpx 0 16rpx 0 rgba(0, 0, 0, 0.2);
    background-color: #fff;
  }
  .img {
    position: absolute;
    top: 0;
    left: 0;
    width: 400rpx;
    height: 300rpx;
    display: inline-block;
    // filter: blur(16rpx);
  }
  .img-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 690rpx;
    height: 300rpx;
    display: inline-block;
    transition: all .5s;
  }
  .exit-box {
    width: 680rpx;
    height: 298rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .exit {
    width: 150rpx;
    height: 300rpx;
    line-height: 300rpx;
    text-align: center;
    background-color: #FF3333;
    color: #fff;
    font-size: 34rpx;
    /* border-top-right-radius: 16rpx;
    border-bottom-right-radius: 16rpx; */
  }
  .confirm-exit {
    width: 300rpx;
    height: 300rpx;
    line-height: 300rpx;
    text-align: center;
    background-color: #FF3333;
    color: #fff;
    font-size: 34rpx;
    /* border-top-right-radius: 16rpx;
    border-bottom-right-radius: 16rpx; */
  }
  .avatar-box {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    margin-right: 40rpx;
    margin-top: 40rpx;
    width: 215rpx;
    height: 50rpx;
    opacity: .7;
  }
  .w-member {
    margin-top: 40rpx;
    margin-right: 40rpx;
    margin-bottom: 90rpx;
  }
  .avatar-bg-l {
    position: absolute;
    right: 165rpx;
    width: 48rpx;
    height: 48rpx;
    background-color: #fcfcfc;
    border-radius: 48rpx;
  }
  .avatar-bg-c {
    position: absolute;
    right: 132rpx;
    width: 48rpx;
    height: 48rpx;
    background-color: #f8f8f8;
    border-radius: 48rpx;
  }
  .avatar-bg-r {
    position: absolute;
    right: 99rpx;
    width: 48rpx;
    height: 48rpx;
    background-color: #f0f0f0;
    border-radius: 48rpx;
  }
  .avatar1 {
    position: absolute;
    right: 66rpx;
    width: 48rpx;
    height: 48rpx;
    border-radius: 48rpx;
  }
  .avatar2 {
    position: absolute;
    right: 33rpx;
    width: 48rpx;
    height: 48rpx;
    border-radius: 48rpx;
  }
  .avatar3 {
    position: absolute;
    right: 0;
    width: 48rpx;
    height: 48rpx;
    border-radius: 48rpx;
    opacity: .7;
  }
  .title-box {
    // box-sizing: border-box;
    width: 690rpx;
    height: 48rpx;
    line-height: 48rpx;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    // margin-top: 90rpx;
    padding-right: 40rpx;
  }
  .title {
    height: 48rpx;
    font-size: 34rpx;
    margin-right: 20rpx;
    color: #232323;
  }
  .title-r {
    width: 8rpx;
    height: 40rpx;
    border-radius: 4rpx;
    background-color: $decorateColor;
    display: flex;
  }
  .msg {
    box-sizing: border-box;
    margin-top: 6rpx;
    width: 690rpx;
    height: 36rpx;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    font-size: 26rpx;
    margin-right: 30rpx;
  }
  .member-box {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-right: 30rpx;
  }
  .message-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin-right: 10rpx;
  }
  .member {
    height: 36rpx;
    color: #b2b2b2;
    margin-right: 10rpx;
  }
  .member-munber {
    height: 36rpx;
    text-align: right;
  }
  .message {
    height: 36rpx;
    color: #b2b2b2;
    margin-right: 10rpx;
  }
  .message-munber {
    height: 36rpx;
    text-align: right;
  }
  .new-message {
    height: 36rpx;
    display: flex;
    align-items: center;
    margin-left: 16rpx;
    margin-right: 4rpx;
  }
  .new-message span {
    display: block;
    width: 28rpx;
    height: 28rpx;
    background-color: #ec7676;
    border-radius: 50%;
    box-shadow: 0 8rpx 16rpx -8rpx #ec7676;
  }
</style>
