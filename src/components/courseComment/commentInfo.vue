<template>
  <div class="page">
    <div class="info-box">
      <div class="time">{{ info.createdAt }}</div>
      <div class="user-box">
        <image mode='aspectFill'
          class="avatar"
          :src="info.user && info.user.avatar || userInfo.avatar"
        />
        <div class="name">{{ info.user && info.user.nickname }}</div>
      </div>
      <div class="content">
        <text v-if="info.content">{{ info.content }}</text>
      </div>
      <div class="img-box">
        <div
          v-for="(item, index) in info.images" :key="index"
        >
          <image mode='aspectFill'
            class="img"
            v-if="item.length > 3"
            @click="lookImg"
            :src="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => ({})
    }
  },

  components: {
  },

  data () {
    return {
      userInfo: {
        nickname: '体游',
        avatar: 'https://api.tiyou.techoiceness.com/v1/static/images/img_6.png'
      }
    }
  },

  methods: {
    lookImg (index) {
      let data = {
        index,
        files: this.info.images
      }
      this.$wxApi.wxLookImg(data)
    }
  }
}
</script>

<style scoped>
.page {
  width: 690rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
  margin-bottom: 30rpx;
  position: relative;
  box-sizing: border-box;
  padding: 30rpx 40rpx 40rpx 40rpx;
}

.user-box {
  display: flex;
  align-items: center;
}

.avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
}

.name {
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #888;
}

.time {
  position: absolute;
  width: 610rpx;
  text-align: end;
  font-size: 22rpx;
  color: #b2b2b2;
  top: 30rpx;
}

.content {
  width: 610rpx;
  font-size: 28rpx;
  color: #232323;
  margin-bottom: 20rpx;
  margin-top: 30rpx;
  /* width: 618rpx; */
}

.img-box {
  width: 624rpx;
  display: flex;
  flex-wrap: wrap;
}

.img {
  width: 200rpx;
  height: 200rpx;
  margin-right: 8rpx;
  margin-bottom: 8rpx;
}
</style>
