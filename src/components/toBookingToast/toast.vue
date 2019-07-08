<template>
  <div class="page" @touchmove="true">
    <div class="mask"></div>
    <div class="tip">
      <div class="tipStatus-img" @click="closeTip">
        <image mode='aspectFill' class="tipStatus-image" src="../../static/icon/photo_close.png" />
      </div>
      <p class="tip-title">年卡次数升级为课时</p>
      <div class="content">升级为课时，可赠送一年超值会员权益，并不再需要绑定宝宝使用</div>
      <p class="tip-card">
        <span class="tip-word">年卡剩余次数为</span>
        <span class="tip-price">{{ cardTimes || 0 }}</span>
      </p>
      <p class="tip-card-2 tip-card">
        <span class="tip-word">可兑换课时数为</span>
        <span class="tip-price">{{ cardTimes || 0 }}</span>
      </p>
      <div class="agreement-box">
        <div class="agreee-click" @click="agreeProtocel"></div>
        <div class="agree">
          <image mode='aspectFill'
            class="selected-img"
            :src="agreeStatus ? '../../static/icon/ic_selected.png' : '../../static/icon/ic_select.png'"
          />
          <span class="agree-text">同意</span>
          <span class="description" @click="toProtocel">《体游科学实验室服务协议》</span>
        </div>
      </div>
      <div class="btn2" @click="toBookingBuy(1)">
        <Wbutton text="升级" size="size390" bgColor="confirm" />
      </div>
      <p class="tip-sign">TIPS</p>
    </div>
  </div>
</template>

<script>
import Wbutton from '@/components/Button'

export default {
  props: {
    info: {
      type: Object,
      default: () => ({})
    },

    cardTimes: {
      type: Number,
      default: 0
    }
  },

  components: {
    Wbutton
  },

  data () {
    return {
      agreeStatus: 1
    }
  },

  methods: {
    closeTip () {
      this.$emit('closeTip')
    },

    // 同意/不同意
    agreeProtocel () {
      this.agreeStatus = !this.agreeStatus
    },

    // to 使用协议
    toProtocel () {
      this.$emit('toProtocel')
    },

    // 升级
    toBookingBuy (num) {
      let data = {
        num,
        agreeStatus: this.agreeStatus
      }
      this.$emit('toBookingBuy', data)
    }
  },

  onUnload () {
    this.agreeStatus = 1
  }
}
</script>

<style scoped>
.mask {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  /* width: 100vw; */
  /* height: 100vw; */
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background-color: #000000;
}

.tip {
  position: fixed;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 510rpx;
  height: 720rpx;
  border-radius: 10rpx;
  box-shadow: 0 16rpx 16rpx -8rpx rgba(0, 0, 0, 0.5);
  background-color: #ffffff;
}
.tip-sign {
  z-index: 40;
  position: absolute;
  top: -45rpx;
  left: 80rpx;
  width: 158rpx;
  height: 122rpx;
  font-family: 'League Gothic';
  font-size: 96rpx;
  color: #ffdea5;
}
.tipStatus-img {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 10rpx;
  right: 10rpx;
}
.tipStatus-image {
  width: 24px;
  height: 24px;
}
.tip-title {
  margin: 116rpx 101rpx 20rpx 103rpx;
  width: 306rpx;
  height: 48rpx;
  font-size: 34rpx;
  text-align: center;
  color: #232323;
  font-weight: 500;
}
.tip-card {
  display: flex;
  justify-content: space-between;
  width: 360rpx;
  height: 78rpx;
}
.tip-word {
  font-weight: 500;
  margin-top: 30rpx;
  /* width: 98px; */
  /* height: 20px; */
  font-size: 28rpx;
  color: #c8d2dc;
}
.tip-price {
  /* width: 47px; */
  /* height: 39px; */
  font-family: 'League Gothic';
  font-size: 64rpx;
  letter-spacing: 0.2rpx;
  text-align: right;
  color: #ffcd76;
}
.btn1 {
  margin-top: 60rpx;
}

.introduce-item-images {
  width: 690rpx;
}

.content {
  width: 390rpx;
  text-align: center;
  font-size: 26rpx;
  color: #b2b2b2;
  margin-bottom: 60rpx;
}

.selected-img {
  width: 32rpx;
  height: 32rpx;
  margin-right: 10rpx;
}

.agreement-box {
  width: 510rpx;
  height: 32rpx;
  line-height: 32rpx;
  font-size: 22rpx;
  box-sizing: border-box;
  padding: 0 60rpx;
  margin-top: 60rpx;
  margin-bottom: 10rpx;
  position: relative;
}

.agreee-click {
  position: absolute;
  top: -10rpx;
  left: 0;
  width: 140rpx;
  height: 50rpx;
}

.agree {
  display: flex;
  align-items: center;
}

.tip-card-2 {
  margin-top: 30rpx;
}

.description {
  color: #ffcd76;
}

.agree-text {
  color: #b2b2b2;
}

</style>
