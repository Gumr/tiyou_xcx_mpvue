<template>
  <div class="wrap">
    <!-- <div class="progress-number">
      <span class="time-color">{{ completedDays }}</span>/{{ targetDays }}
    </div> -->
    <div class="task-number">
      <span class="completedDays">{{ completedDays || 0 }}</span>
      <span>/</span>
      <span class="targetDays">{{ targetDays || 0 }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['completedDays', 'targetDays']
}
</script>

<style lang="scss" scoped>
.progress-number {
  font-size: 22rpx;
  color: #b2b2b2;
}
.time-color {
  color: $blackColor;
  font-family: $my-font;
  font-size: 22rpx;
  font-weight: 500;
}

.task-number {
  font-size: 26rpx;
  color: #b2b2b2;
}
.completedDays {
  font-size: 48rpx;
  font-weight: 500;
  color: $blackColor;
  font-family: $my-font;
}
</style>
