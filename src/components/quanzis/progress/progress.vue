<template>
  <div class="progress-plan">
    <span class="progress-left" :style="{width: completedDays * (400 - 12) / targetDays +'rpx'}"></span>
    <span class="progress-border"></span>
    <span class="progress-right" :style="{width: (targetDays - completedDays) * (400 - 12) / targetDays + 'rpx'}"></span>
    </div>
</template>

<script>
export default {
  props: ['completedDays', 'targetDays'],
  data () {
    return {
      completedDays: 0
    }
  },
  onShow () {

  }
}
</script>

<style lang="scss" scoped>

.progress-plan {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 400rpx;
}
.progress-left {
  height: 10rpx;
  border-bottom-left-radius: 100rpx;
  border-top-left-radius: 100rpx;
  background-color: $proceed;
}
.progress-border {
  width: 18rpx;
  height: 18rpx;
  border-radius: 10rpx;
  background-color: #fff;
  box-shadow: 0 0 32rpx 0 rgba(#de6f6f, 0.3);
}
.progress-right {
  height: 10rpx;
  border-bottom-right-radius: 6rpx;
  border-top-right-radius: 6rpx;
  background-color: #f8f8f8;
}
</style>
