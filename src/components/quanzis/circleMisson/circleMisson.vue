<template>
  <!-- 圈子详情展示 3 个应用 -->
  <div class="page">
    <WmissonCard
      v-for="(item, index) in getCircleTask"
      :key="index"
      :missnoData="item"
      :circleDetail="circleDetail"
    />
    <div v-if="getCircleTask.length && circleDetail.joinStatus === 1">
      <div class="to-all-btn" @click="toAllTask" >
        查看全部应用
      </div>
    </div>
  </div>
</template>

<script>
import WmissonCard from '@/components/quanzis/circleMisson/missonCard'

export default {
  props: {
    taskData: {
      type: Array,
      required: true
    },
    circleDetail: {
      type: Object,
      required: true
    }
  },

  components: {
    'WmissonCard': WmissonCard
  },

  computed: {
    getCircleTask () {
      console.log('task Data', this.taskData)
      return this.taskData
    }
  },

  data () {
    return {
    }
  },

  methods: {
    toAllTask () {
      if (this.circleDetail.joinStatus !== 1) return
      wx.navigateTo({
        url: `../qz-alltasklist/main?id=${this.circleDetail.id}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.iconfont {
  font-family: iconfont;
}
.page {
  width: 690rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow:0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin-top: 30rpx;
}
.item-box {
  width: 630rpx;
  height: 120rpx;
  box-sizing: border-box;
  padding-left: 30rpx;
  padding-right: 30rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: #eee solid 2rpx;
  font-size: 28rpx;
}
.item-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.item-times {
  width: 480rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.item-icon {
  margin-right: 30rpx;
}
.course-name {
  color: #232323;
}
.course-status {
  font-size: 22rpx;
  color: $decorateColor;
}
// taksType 1
.item-color {
  color: #b2b2b2;
}
.to-all-btn {
  width: 390rpx;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 28rpx;
  text-align: center;
  color: $decorateColor;
}
</style>
