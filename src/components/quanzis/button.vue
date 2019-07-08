<template>
  <div :class="['button', size, bgColor]">
    {{ text }}
  </div>
</template>

<script>
export default {
  props: ['text', 'size', 'bgColor']
}
</script>

<style scoped>
  .button {
    text-align: center;
    line-height: 80rpx;
    font-size: 34rpx;
    color: #fff;
    border-radius: 40rpx;
  }
  .small {
    width: 150rpx;
    height: 80rpx;
    font-weight: 500;
  }
  .medium {
    width: 330rpx;
    height: 80rpx;
    font-weight: 500;
  }
  .big330 {
    width: 330rpx;
    height: 80rpx;
  }
  .big {
    width: 690rpx;
    height: 80rpx;
  }
  .black {
    /* background-image: linear-gradient(256deg, #55f9ff, #55d9ff 51%, #55baff);
    box-shadow: 0 8rpx 16rpx -8rpx #76bdec; */
    box-shadow: 0 16rpx 16rpx -8rpx #ffdea5;
    background-color: #ffcd76;
  }
  .big580 {
    width: 580rpx;
    height: 80rpx;
  }
  .gray {
    background-color: #eee;
  }
</style>
