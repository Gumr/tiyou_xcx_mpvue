<template>
  <div class="page">
    <image mode='aspectFill'
      class="years-card-img"
      src="https://api.tiyou.techoiceness.com/v1/static/images/card_2.png"
    />
    <div class="info">
      <div class="info-top">
        <image mode='aspectFill'
          class="https-card-img"
          src="https://api.tiyou.techoiceness.com/v1/static/images/experience.png"
        />
        <!-- <span class="id-font">ID {{ card.code }}</span>
        <span class="time">有效期至{{ card.deadline }}</span> -->
      </div>
      <!-- <div class="user" v-if="card.childId === 0" key="user">
        <image mode='aspectFill'
          class="avatar"
          :src="userInfo.avatar"
        />
        <div class="name">未绑定</div>
      </div>
      <div class="user" v-else key="hasUser">
        <image mode='aspectFill'
          class="child-avatar"
          :src="card.child && card.child.avatar || defaultImg"
        />
        <div class="name">{{ card.child && card.child.name }}</div>
      </div> -->
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
  z-index: 10;
}

.https-card-img {
  width: 126rpx;
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
  background-color: #ff8880;
}

.info-top {
  display: flex;
  align-items: center;
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
  align-items: center;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  margin-right: 30rpx;
}

.child-avatar {
  width: 80rpx;
  height: 80rpx;
  margin-right: 30rpx;
  border-radius: 50%;
}

.name {
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

.id-font {
  font-family: 'League Gothic';
  font-size: 34rpx;
}
</style>
