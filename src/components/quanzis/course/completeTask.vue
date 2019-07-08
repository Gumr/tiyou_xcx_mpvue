<template>
  <div class="warp">
    <div v-if="type === 1">
      <span class="number">{{number}} </span>人已打卡
    </div>
    <div v-if="type === 2">
      <span class="number">{{number}} </span>人已挑战
    </div>
    <div v-if="type === 3">
      <span class="number">进行中</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    number: {
      type: Number,
      requires: true
    },
    type: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.warp {
  font-size: 22rpx;
  color: #b2b2b2;
}
.number {
  color: $decorateColor;
}
</style>
