<template>
  <div class="wrap">
    <div v-for="(item, index) in statusList" class="item" :key="index" @click.stop="setStatus(index)">
      <div :class="['status-item', index !== 0 ? 'status-name' : '']" :style="{color: colorStatus[index]}">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    status: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      colorStatus: [ '#ffe597', '#55d9ff', '#b2b2b2', '#ec7676' ]
    }
  },

  components: {
  },

  computed: {
    statusList () {
      let list = [ '置顶', '优质', '普通', '驳回' ]
      // needCheck 0 未设置回答
      if (this.status === 0) {
        list = [ '置顶', '优质', '普通', '删除' ]
      }
      return list
    }
  },

  methods: {
    setStatus (index) {
      this.$emit('wSetStatus', index)
    }
  },

  onShow () {
  }
}
</script>

<style scoped>
.wrap {
  box-sizing: border-box;
  padding-top: 20rpx;
  padding-bottom: 20rpx;
  width: 150rpx;
  box-shadow: 0 8rpx 16rpx -8rpx rgba(0, 0, 0, 0.1);
  background-color: #fff;
  font-size: 26rpx;
}
.status-item {
  width: 150rpx;
  text-align: center;
  color: #ffe597;
}
.status-name {
  margin-top: 30rpx;
}
</style>
