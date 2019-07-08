<template>
  <div class="contain">

    <div class="booked-title">
      <span class="booked-dot"></span>
      <span class="booked-word">{{ infoPost.title }}</span>
    </div>

    <!-- 一行文字 -->
    <div v-if="infoPost.infoStatus === 0" class="booked-content0">{{ infoPost.msg }}</div>
    <!-- 两行文字 -->
    <div v-if="infoPost.infoStatus === 1" class="booked-content1">
      <p class="booked-content1-p1">{{ infoPost.msg1 }}</p>
      <p class="booked-content1-p2">{{ infoPost.msg2 }}</p>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    infoPost: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
    }
  }
}
</script>

<style scoped>
.booked-title {
  /* position: relative; */
  display: flex;
  align-items: center;
  margin-top: 30rpx;
  width: 690rpx;
  height: 40rpx;
  box-sizing: border-box;
  padding-left: 30rpx;
}

.booked-dot {
  /* position: absolute; */
  /* left: 30rpx; */
  /* top: 16rpx; */
  display: block;
  width: 4rpx;
  height: 24rpx;
  border-radius: 4rpx;
  background-color: #ffcd76;
}
.booked-word {
  font-weight: 500;
  margin-left: 20rpx;
  /* width: 56px; */
  height: 40rpx;
  font-size: 28rpx;
  color: #b2b2b2;
}

.booked-content0 {
  margin-top: 20rpx;
  width: 690rpx;
  height: 56rpx;
  font-family: 'League Gothic';
  font-size: 48rpx;
  text-align: center;
  color: #232323;
}

.booked-content1 {
  margin-top: 20rpx;
  width: 690rpx;
  text-align: center;
  font-weight: 500;
}
.booked-content1-p1 {
  /* width: 345px; */
  height: 48rpx;
  font-size: 34rpx;
  color: #232323;
}
.booked-content1-p2 {
  /* width: 345px; */
  height: 32rpx;
  font-size: 22rpx;
  color: #b2b2b2;
}


</style>
