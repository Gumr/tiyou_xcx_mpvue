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
  font-weight: 500;
  font-size: 28rpx;
  color: #fff;
  border-radius: 40rpx;
}

.size690 {
  width: 690rpx;
  height: 80rpx;
}
.size390 {
  width: 390rpx;
  height: 80rpx;
}
.size346 {
  width: 346rpx;
  height: 80rpx;
}

.size330 {
  width: 330rpx;
  height: 80rpx;
}

/* 可点击（黄色按钮） */
.confirm {
  box-shadow: 0 16rpx 16rpx -8rpx #ffdea5;
  background-color: #ffcd76;
}

/* 中等（黄色边框按钮） */
.middle-confirm {
  font-size: 28rpx;
  box-shadow: 0 16rpx 16rpx -8rpx #ffdea5;
  background-color: #ffcd76;
}
/* 中等（黄色边框按钮） */
.middle-border {
  color: #ffcd76;
  font-size: 28rpx;
  border-radius: 40rpx;
  border: solid 4rpx #ffcd76;
}

/* 可点击白色按钮 */
.white-confirm {
  border-radius: 40rpx;
  /* box-shadow: 0 16rpx 16rpx -8rpx #ffdea5; */
  border: solid 4rpx #ffcd76;
  color: #ffcd76;
  background-color: #fff;
}

.not-clickable {
  color: #fff;
  background-color: #dfe6ed;
}
</style>
