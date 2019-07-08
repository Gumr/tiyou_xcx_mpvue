<template>
  <div class="wrap-avatar">
    <div class="admin">
      管理员
    </div>
    <div class="name-box">
      <span class="name">{{ user.nickname }}</span>
      <image mode="aspectFill" class="img" :src="user.avatar" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.wrap-avatar {
  width: 570rpx;
  height: 40rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.admin {
  width: 140rpx;
  height: 40rpx;
  font-size: 28rpx;
  color: #b2b2b2;
}
.name-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.name {
  width: 400rpx;
  overflow: hidden;
  text-align: right;
  font-size: 28rpx;
  color: #232323;
}
.img {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  margin-left: 20rpx;
}
</style>
