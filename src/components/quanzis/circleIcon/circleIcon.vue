<template>
  <!-- 圈子详情展示 3 个应用 -->
  <div :class="['page', marginL]">
    <image mode="aspectFill" class="img" :src="imageSrc" />
    <div class="text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  props: {
    imageSrc: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    // 非必选
    marginL: {
      type: String,
      default: ''
    }
  },

  components: {
  },

  computed: {
  },

  data () {
    return {
    }
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 64rpx;
  height: 96rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.img {
  width: 64rpx;
  height: 64rpx;
}
.text {
  width: 64rpx;
  height: 32rpx;
  font-size: 22rpx;
  color: #b2b2b2;
  text-align: center;
  line-height: 32rpx;
}
.margin20 {
  margin-right: 40rpx;
}
</style>
