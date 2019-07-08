<template>
  <cover-view :class="['button', size, bgcolor]">
    {{ text }}
  </cover-view>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    bgcolor: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
  .button {
    text-align: center;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
  }
  .red {
    color: #fff;
    background-color: #de6f6f;
  }
  .eee {
    color: #fff;
    background-color: #eee;
  }
  .big {
    width: 690rpx;
  }

  .size330 {
    width: 330rpx;
  }

  .white {
    box-sizing: border-box;
    border: 4rpx solid #de6f6f;
    color: #de6f6f;
    background-color: #fff;
  }
</style>
