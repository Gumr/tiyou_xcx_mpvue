<template>
  <div class="code" @touchmove="true">
    <div class="mask"></div>
    <div class="content">
      <div class="title">
        QR CODE
      </div>
      <image mode='aspectFill'
        v-if="isPackage"
        key="isPackage"
        class="close-img"
        src="../../../static/icon/photo_close.png"
      />
      <image mode='aspectFill'
        v-else
        key="not-package"
        class="close-img"
        src="../../static/icon/photo_close.png"
      />
      <div class="click-close" @click.stop="closeToast">
      </div>
      <div class="code-text">
        签到码
      </div>
      <div class="code-desc">
        到达上课现场后，请出示该二维码给老师进行扫码核销签到
      </div>
      <canvas
        class="canvas"
        :canvas-id="canvasId"
        :style="{ width: 152 + 'px', height: 152 + 'px' }">
      </canvas>
    </div>
  </div>
</template>

<script>
import QRCode from 'weapp-qrcode'
export default {
  props: {
    isPackage: {
      type: Number,
      default: 1
    },
    orderId: {
      type: Number,
      default: 0
    }
  },

  components: {
  },

  data () {
    return {
      canvasId: ''
    }
  },

  methods: {
    closeToast () {
      let status = 0
      let data = {
        status
      }
      this.$emit('closeToast', data)
    },

    createQrcode (id) {
      this.canvasId = (new Date()).getTime()
      QRCode({
        text: `${id}`,
        canvasId: `${this.canvasId}`,
        width: 150,
        height: 150
      })
    }
  },

  onLoad (options) {
    this.createQrcode(this.orderId)
  }
}
</script>

<style scoped>
/* .code {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 19000;
} */
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20000;
  opacity: .5;
  background-color: #000;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 21000;
  width: 510rpx;
  height: 720rpx;
  border-radius: 10rpx;
  box-shadow: 0 16rpx 16rpx -8rpx rgba(0, 0, 0, 0.5);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.code-text {
  margin-top: 116rpx;
  font-size: 34rpx;
  font-weight: 500;
  color: #232323;
}

.code-desc {
  width: 330rpx;
  text-align: center;
  margin-top: 12rpx;
  font-size: 22rpx;
  color: #b2b2b2;
  margin-bottom: 60rpx;
}

.close-img {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 48rpx;
  height: 48rpx;
}

.click-close {
  position: absolute;
  top: 0;
  right: 0;
  width: 64rpx;
  height: 64rpx;
}

.title {
  /* width: 216rpx; */
  height: 116rpx;
  font-size: 96rpx;
  color: #ffdea5;
  text-align: center;
  font-family: 'League Gothic';
  position: absolute;
  top: -46rpx;
  left: 60rpx;
}
</style>
