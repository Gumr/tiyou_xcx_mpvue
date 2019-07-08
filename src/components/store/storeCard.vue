<template>
  <div class="page">
    <div class="stores-item">
      <image mode='aspectFill' class="stores-item-img" :src="store.covers && store.covers[0] || img" />
      <div class="stores-item-word">
        <p class="stores-item-name">{{ store.name || '体游' }}</p>
        <p class="stores-item-location">{{ store.address }}</p>
        <span class="stores-item-instance">{{ store.distance }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    store: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      img: 'https://api.tiyou.techoiceness.com/v1/static/images/img_default.png'
    }
  },

  components: {
  }
}
</script>

<style scoped>
.stores-item {
  display: flex;
  align-items: center;
  margin: 30rpx 30rpx 0;
  width: 690rpx;
  height: 180rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
}
.stores-item-img {
  margin: 30rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 100%;
  background-color: #dfe6ed;
}
.stores-item-word {
  position: relative;
  width: 480rpx;
  height: 120rpx;
}
.stores-item-name {
  height: 48rpx;
  font-size: 34rpx;
  color: #232323;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap
}
.stores-item-location {
  height: 32rpx;
  font-size: 22rpx;
  color: #888888;
}
.stores-item-instance {
  position: absolute;
  right: 0;
  height: 32rpx;
  font-size: 22rpx;
  text-align: right;
  color: #b2b2b2;
}
</style>
