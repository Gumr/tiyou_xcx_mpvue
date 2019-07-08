<template>
  <div class="wrap">
    <div class="card" @click="closeChild">
      <div class="goods-img">
        <image mode='aspectFill'
          class="avatar"
          :src="child.avatar || defaultImg"
        />
      </div>
      <div class="card-right">
        <div class="right-top">
          <span class="name">{{ child.name }}</span>
          <span class="relationship">{{ child.relationship }}</span>
        </div>
        <div class="birthday">
          生日：{{ child.birthday }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    child: {
      type: Object,
      default: () => ({})
    }
  },

  components: {
  },

  computed: {
  },

  data () {
    return {
      defaultImg: 'https://api.tiyou.techoiceness.com/v1/static/images/img_6.png'
    }
  },

  methods: {
    closeChild () {
      this.$emit('closeChild')
    }
  },

  onLoad () {
  }
}
</script>

<style scoped>
.wrap {
  width: 100%;
  width: 630rpx;
  height: 220rpx;
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card {
  width: 630rpx;
  height: 220rpx;
  border-radius: 8rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 30rpx;
  display: flex;
  font-size: 28rpx;
  color: #c8d2dc;
  transition: all 0.3s;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  margin-right: 60rpx;
}

.card-right {
  flex: auto;
}

.right-top {
  display: flex;
  align-items: center;
}

.name {
  flex: auto;
  /* width: 240rpx; */
  overflow: hidden;
  color: #232323;
}

.birthday {
  margin-top: 10rpx;
  margin-bottom: 10rpx;
}
</style>
