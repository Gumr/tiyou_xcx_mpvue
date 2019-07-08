<template>
  <div class="warp">
    完成度<span class="number">{{ completion }}</span> %
  </div>
</template>

<script>
export default {
  props: ['completion']
}
</script>

<style lang="scss" scoped>
.warp {
  color: #888;
  font-size: 28rpx;
}
.number {
  font-weight: 500;
  color: $blackColor;
  font-family: $my-font;
}
</style>
