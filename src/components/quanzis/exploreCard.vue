<template>
  <div class="card-warp">
    <div class="card" @click="toCircle(item.id)" v-for="(item, index) in rows" :key="index">
      <image class="img" :src="item.cover">
        <div class="mask">
          <div class="member-box">
            <span class="member">成员</span>
            <span class="member-munber">{{item.membersCount}}</span>
          </div>
          <div class="message-box">
            <span class="message">信息</span>
            <span class="message-munber">{{item.infosCount}}</span>
          </div>
          <div class="title">
            {{item.name}}
          </div>
        </div>
      </image>
    </div>
  </div>
</template>

<script>
export default {
  props: ['rows'],
  data () {
    return {
    }
  },

  methods: {
    toCircle (id) {
      wx.navigateTo({
        url: `../qz-circle/main?id=${id}`
      })
    }
  },

  created () {
    // src = '../../static/qz-images/demo.png'
  }
}
</script>

<style scoped>
.card-warp {
  margin-top: 50rpx;
  width: 690rpx;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.card {
  position: relative;
  width: 330rpx;
  height: 400rpx;
  overflow: hidden;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 8rpx 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;
}
.img {
  width: 330rpx;
  height: 300rpx;
}
.mask {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  padding-right: 30rpx;
  width: 330rpx;
  height: 400rpx;
  background-image: linear-gradient(140deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7) 25%, #ffffff 50%, #ffffff);
}
.member-box, .message-box {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 270rpx;
  height: 36rpx;
  padding-left: 130rpx;
  margin-top: 10rpx;
}
.member, .message {
  font-size: 26rpx;
  color: #b2b2b2;
}
.member-munber, .message-munber {
  font-size: 26rpx;
  color: #353535;
}
.title {
  font-size: 34rpx;
  color: #232323;
  margin-bottom: 30rpx;
  margin-top: 20rpx;
}
</style>
