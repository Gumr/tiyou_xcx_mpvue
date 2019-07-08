<template>
  <div class="avatar">
    <div class="card-user">
      <image class="uers-avatar" :src="user && user.avatar" />
      <span class="user-name">{{user && user.nickname}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['user']
}
</script>

<style scoped>
.card-user {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 630rpx;
  height: 72rpx;
  font-size: 28rpx;
  color: #888;
  overflow: hidden;
  text-overflow: ellipsis;
}
.uers-avatar {
  width: 72rpx;
  height: 72rpx;
  box-shadow: 0 4rpx 8rpx 0 rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  margin-right: 30rpx;
}
</style>
