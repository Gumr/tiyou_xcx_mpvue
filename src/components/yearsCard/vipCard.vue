<template>
  <div class="page">
    <!-- <image mode='aspectFill'
      class="years-card-img"
      src="https://api.tiyou.techoiceness.com/v1/static/images/card_1.png"
    /> -->
    <div class="card-bg years-card-img">
    </div>
    <image mode='aspectFit'
      class="viptext-img"
      src="https://api.tiyou.techoiceness.com/v1/static/icon/img_14.png"
    />
    <div class="info">
      <div class="info-top">
        <image mode='aspectFit'
          class="https-card-img"
          src="https://api.tiyou.techoiceness.com/v1/static/icon/img_viptext.png"
        />
        <span class="id-font">{{ cardInfo.VIPExpiredAt }} 到期</span>
      </div>
      <div class="user">
        <image mode='aspectFill'
          class="avatar"
          :src="cardInfo.avatar"
        />
        <div class="name"> {{ cardInfo.nickname }}</div>
      </div>
    </div>
    <div class="bg">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    cardInfo () {
      return this.card
    }
  },

  components: {
  },

  data () {
    return {
      userInfo: {
        name: '',
        avatar: 'https://api.tiyou.techoiceness.com/v1/static/images/img_6.png'
      },
      defaultImg: 'https://api.tiyou.techoiceness.com/v1/static/images/img_6.png'
    }
  }
}
</script>

<style scoped>
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 60rpx;
  width: 630rpx;
  height: 390rpx;
}

.years-card-img {
  position: absolute;
  width: 600rpx;
  height: 360rpx;
  border-radius: 20rpx;
  background-color: #FFDEA5;
  z-index: 10;
}

.viptext-img {
  position: absolute;
  width: 180rpx;
  height: 180rpx;
  z-index: 12;
  right: 70rpx;
  bottom: 50rpx;
}

.https-card-img {
  width: 110rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

.info {
  position: absolute;
  width: 600rpx;
  height: 360rpx;
  box-sizing: border-box;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 10;
}

.bg {
  position: absolute;
  left: 30rpx;
  top: 30rpx;
  width: 600rpx;
  height: 360rpx;
  z-index: 9;
  opacity: 0.5;
  border-radius: 20rpx;
  -webkit-filter: blur(16rpx);
  filter: blur(16rpx);
  background-color: #ffdea5;
}

.info-top {
  display: flex;
  align-items: flex-start;
  font-size: 30rpx;
  letter-spacing: 0.4rpx;
  color: #fff;
}

.info-title {
  margin-right: 10rpx;
  letter-spacing: 0.4rpx;
}

.user {
  display: flex;
  /* align-items: center; */
  align-items: flex-end;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  margin-right: 30rpx;
  border-radius: 50%;
}

.child-avatar {
  width: 80rpx;
  height: 80rpx;
  margin-right: 30rpx;
  border-radius: 50%;
}

.name {
  width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  overflow: hidden;
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
}

.time {
  flex: auto;
  text-align: right;
  font-size: 22rpx;
  font-weight: 500;
  color: #fff;
}

.time-box {
  display: flex;
  flex-direction: column;
  font-size: 22rpx;
  color: #fff;
  font-weight: 500;
}

.times-box {
  font-size: 22rpx;
  text-align: right;
}

.times {
  text-align: right;
  font-size: 34rpx;
  font-family: 'League Gothic';
}

.id-font {
  font-family: 'League Gothic';
  font-size: 22rpx;
  flex: auto;
  text-align: right;
  color: #BA9657;
}

.name {
  font-size: 28rpx;
  color: #fff;
}
</style>
