<template>
  <!-- 圈子详情展示 3 个应用 -->
  <div class="page">
    <!-- 101 课程 -->
    <div class="item-box" v-if="missnoData.taskType === 101" @click="toCourse">
      <div class="item-left">
        <span class="iconfont icon-ic_courses_gray item-icon"></span>
        <span class="course-name">{{ missnoData.courseDetail.title }}</span>
      </div>
      <!-- 1 进行中 2已结束 -->
      <span class="course-status">{{ courserStatus }}</span>
      <!-- <span class="iconfont icon-right icon-ic_right"></span> -->
    </div>
    <!-- 打卡 -->
    <div class="item-box" v-if="missnoData.taskType === 1" @click="toTaskDetail(missnoData.targetDays, missnoData.currentCompletedDays)">
      <div class="item-left">
        <span class="iconfont icon-ic_punch_gray item-icon"></span>
        <span class="item-times">
          <span v-if="missnoData.targetDays !== 0" class="item-color">坚持</span>
          <span v-if="missnoData.targetDays !== 0"> {{ missnoData.targetDays }} </span>
          <span v-if="missnoData.targetDays !== 0" class="item-color">天：</span>
          <span class="content">{{ missnoData.name }}</span>
        </span>
      </div>
      <span v-if="circleDetail.joinStatus === 1" class="iconfont icon-right icon-ic_right"></span>
    </div>
    <!-- 挑战 -->
    <div class="item-box" v-if="missnoData.taskType === 2" @click="toTaskDetail">
      <div class="item-left">
        <span class="iconfont icon-ic_qa_gray item-icon"></span>
        <span class="item-times">
          <span class="item-color">{{ questionsType || '挑战任务' }}：</span>
          <span class="content">{{ missnoData.questions[0].content }}</span>
        </span>
      </div>
      <span v-if="circleDetail.joinStatus === 1" class="iconfont icon-right icon-ic_right"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    missnoData: {
      type: Object,
      required: true
    },
    circleDetail: {
      type: Object,
      required: true
    }
  },

  computed: {
    courserStatus () {
      return this.missnoData.status === 1 ? '进行中' : '已完成'
    },

    questionsType () {
      // 图片挑战
      if (this.missnoData.questionType === 2) {
        return '图片挑战'
      }
      if (this.missnoData.questionType === 3) {
        return '音频挑战'
      }
      if (this.missnoData.questionType === 4) {
        return '视频挑战'
      }
      if (this.missnoData.questionType === 1) {
        return '文字挑战'
      }
      if (this.missnoData.questionType === 0) {
        return ''
      }
    }
  },

  components: {
  },

  data () {
    return {
    }
  },

  methods: {
    // 未加入 阻止点击
    stopTo () {
      return this.circleDetail.joinStatus
    },

    // 圈子前往课程
    toCourse () {
      if (this.stopTo() !== 1) return
      wx.navigateTo({
        url: `../qz-course/main?id=${this.circleDetail.id}&taskId=${this.missnoData.id}`
      })
    },

    toTaskDetail (targetDays, currentCompletedDays) {
      if (this.stopTo() !== 1) return
      let taskOver = 0
      // 如果目标和完成天数相等, 0为无限打卡
      if (targetDays === currentCompletedDays && targetDays !== 0) {
        taskOver = 1
      }
      wx.navigateTo({
        url: `../qz-mission/main?id=${this.circleDetail.id}&taskId=${this.missnoData.id}&type=${this.missnoData.taskType}&taskStatus=${taskOver}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.iconfont {
  font-family: iconfont;
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
</style>
