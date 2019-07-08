<template>
  <div :class="['button', size, bgcolor]">
    {{ text }}
  </div>
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
    background-color: #ffcd76;
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
    border: 4rpx solid #ffcd76;
    color: #ffcd76;
    background-color: #fff;
  }
</style>
