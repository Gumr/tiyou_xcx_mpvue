<template>
  <div class="wrap">
    <div class="border">
    </div>
    <div class="title-box">
      <span class="title">圈子简介</span>
      <span class="content">{{ circleCesc || '简介'}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['circleCesc']
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 570rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.border {
  width: 4rpx;
  height: 120rpx;
  border-radius: 4rpx;
  background-color: $decorateColor;
  margin-right: 20rpx;
  margin-top: 8rpx;
}
.title-box {
  display: flex;
  flex-direction: column;
}
.title {
  font-size: 28rpx;
  color: #888;
  margin-bottom: 10rpx;
}
.content {
  font-size: 28rpx;
  width: 546rpx;
  color: #232323;
  word-break: break-all;
}
</style>
