<template>
  <div class="my-wrap">
    <div class="toast-mask" @click="offToast">
    </div>
    <div class="toast">
      <div class="toast-title">发表观点</div>
      <div class="toast-text">
        <textarea class="text"
          @input="changeInput"
          maxlength="140"
          type="text" 
          fixed="true"
          placeholder-style="color: #b2b2b2" placeholder="请输入你要一起转发的观点内容">
        </textarea>
      </div>
      <div class="number"><span :class="[valueLength > 0 ?'now-number' : 'old-number']">{{ valueLength }}</span>/140</div>
      <div class="icon-box">
        <span class="iconfont icon-ic_selected"></span>
        <span class="icon-text">顶部</span>
      </div>
      <button class="btn" open-type="share" id="1" @click="share()">
        转发
      </button>
    </div>
  </div>
</template>

<script>
import button from '@/components/quanzis/button'

export default {
  props: {
    shareData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      text: '',
      valueLength: 0,
      signIn: false
    }
  },

  components: {
    'w-button': button
  },

  methods: {
    offToast () {
      let show = 0
      this.$emit('share', show)
    },

    share () {
      let show = 0
      let msg = this.text
      this.$emit('share', show, msg)
    },

    changeInput (e) {
      this.valueLength = e.mp.detail.cursor
      // this.text = e.mp.detail.value
      // this.shareData.extra.shareMsg = this.text
      this.$emit('shareExtra', e.mp.detail.value)
      // if (this.shareData.extra) {
      //   console.log('this.shareData', this.shareData)
      //   this.$api.info.share(this.shareData)
      //     .then((res) => {
      //       this.$emit('share', show, this.text, res.shareId)
      //     })
      // }
    }
  },

  onShow () {
    this.text = ''
    this.valueLength = 0
  }
}
</script>

<style scoped>
.iconfont {
  font-family: iconfont;
}
.my-wrap {
  position: relative;
  width: 750rpx;
}
.toast-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  /* backdrop-filter: blur(32rpx);
  filter: blur(32rpx); */
  /* background-image: linear-gradient(rgba(255, 255, 255, 0), #ffffff 100%, #ffffff); */
  z-index: 100;
}
.toast {
  position: fixed;
  top: 180rpx;
  left: 60rpx;
  right: 60rpx;
  z-index: 101;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;
  width: 630rpx;
  height: 610rpx;
  font-size: 28rpx;
  background-color: #fff;
  box-shadow: 0 16rpx 32rpx -16rpx rgba(0, 0, 0, 0.1);
  z-index: 101;
}
.toast-title {
  box-sizing: border-box;
  padding-left: 60rpx;
  margin-top: 40rpx;
  margin-bottom: 40rpx;
  width: 630rpx;
  text-align: left; 
  font-size: 34rpx;
  font-weight: 500;
  color: #232323;
}
.toast-text {
  box-sizing: border-box;
  padding-left: 20rpx;
  padding-right: 20rpx;
  padding-top: 20rpx;
  width: 550rpx;
  height: 360rpx;
  color: #232323;
  background-color: #fff;
  box-shadow: inset 0 8rpx 8rpx 0 rgba(0, 0, 0, 0.01);
  z-index: 102;
  margin-bottom: 10rpx;
}
.btn {
  position: absolute;
  right: 60rpx;
  bottom: -40rpx;
  z-index: 1001;
  background-image: linear-gradient(256deg, #55f9ff, #55d9ff 51%, #55baff);
  box-shadow: 0 8rpx 16rpx -8rpx #76bdec;
  width: 330rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-weight: 500;
  letter-spacing: 0.1rpx;
  color: #fff;
  border-radius: 40rpx;
}
button::after {
  border: none;
}
.text {
  width: 530rpx
}
.number {
  box-sizing: border-box;
  padding-right: 40rpx;
  width: 630rpx;
  margin-bottom: 30rpx;
  text-align: right;
  font-size: 22rpx;
  color: #eee;
}
.now-number {
  color: #b2b2b2;
}
.old-number {
  color: #eee;
}
.icon-box {
  width: 550rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 80rpx;
}
.icon-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #eee;
  margin-left: 20rpx;
}
</style>
