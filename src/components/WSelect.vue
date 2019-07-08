<template>
  <div class="contain">

    <div class="item">
      <span class="item-dot"></span>
      <span class="item-word">{{ selectPost.title }}</span>

      <span :class="[ msg.status === 0 ? 'item-select' : 'item-selected' ]">{{ selectPost.msg }}</span>
      <image mode='aspectFill' class="item-img" src="https://api.tiyou.techoiceness.com/v1/static/icon/ic_right.png" />
    </div>

  </div>
</template>

<script>
export default {
  props: {
    selectPost: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
    }
  },

  computed: {
    msg () {
      return this.selectPost
    }
  },

  methods: {
    toPage () {
      // selectPost的selectStatus：0表示选宝宝，1表示选卡券
      if (this.selectPost.selectStatus === 0) {
        // wx.navigateTo({
        //   url: `../selectChild/main`
        // })
        this.emit('toSelectChild')
      }
      if (this.selectPost.selectStatus === 1) {
        // wx.navigateTo({
        //   url: `../selectCard/main`
        // })
        this.emit('toSelectCard')
      }
    }
  }
}
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 30rpx;
  width: 690rpx;
  height: 100rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
}

.item-dot {
  margin-left: 30rpx;
  display: block;
  width: 4rpx;
  height: 24rpx;
  border-radius: 4rpx;
  background-color: #ffcd76;
}
.item-word {
  font-weight: 500;
  margin-left: 20rpx;
  /* width: 56px; */
  height: 40rpx;
  font-size: 28rpx;
  color: #b2b2b2;
}
.item-selected {
  position: absolute;
  right: 88rpx;
  width: 340rpx;
  height: 40rpx;
  font-size: 28rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
  color: #232323;
}

.item-select {
  position: absolute;
  right: 88rpx;
  width: 240rpx;
  height: 40rpx;
  font-size: 28rpx;
  text-align: right;
  color: #eee;
}

.item-img {
  position: absolute;
  right: 30rpx;
  width: 48rpx;
  height: 48rpx;
}


</style>
