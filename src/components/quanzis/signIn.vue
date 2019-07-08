<template>
  <div class="wrap">
    <div v-if="toast">
      <w-toast @signIn="signIn"></w-toast>
    </div>
    <div class="sign-in" v-for="(item, index) in taskData" :key="index">
      <div class="task-l">
        <div class="task-title">
          <span class="task-time" v-if="item.targetDays !== 0">
            <span>坚持</span>
            <span class="time-color"> {{ item.targetDays }} </span>
            <span>天：</span>
          </span>
          <span class="task-essay">{{ item.taskName }}</span>
        </div>
        <div class="task-number">
          <div :style="{ opacity: item.doneToday ? unStatuOpacity : statusOpacity }">
            <w-progress-value :completedDays="item.currentCompletedDays" :targetDays="item.targetDays"></w-progress-value>
          </div>
          <div  v-if="item.targetDays !== 0" key="times" 
            :style="{ opacity: item.doneToday ? statusOpacity : unStatuOpacity }">
            <w-progress-value :completedDays="item.currentCompletedDays" :targetDays="item.targetDays"></w-progress-value>
          </div>
          <div v-else key="no-times" class="times-task">
            <span>已完成</span> {{ item.currentCompletedDays || 0 }}<span>天</span>
          </div>
        </div>
        <div>
          <w-progress :completedDays="item.currentCompletedDays" :targetDays="item.targetDays"></w-progress>
        </div>
      </div>
      <div class="task-r" @click="sign(item.doneToday, item.taskId, item.circleId, item.targetDays, item.currentCompletedDays, index)">
        <w-button v-if="item.targetDays === item.currentCompletedDays" text="已完成"  size="small" :bgColor="grayColor"></w-button>
        <w-button v-else :text="item.doneToday ? task : unTask"  size="small" :bgColor="item.doneToday ? grayColor : blackColor"></w-button>
      </div>
    </div>
  </div>
</template>

<script>
import Wbutton from '@/components/quanzis/button'
import Wtoast from '@/components/quanzis/toast'
import Wprogress from '@/components/quanzis/progress/progress'
import WprogressValue from '@/components/quanzis/progress/progressValue'

export default {
  props: {
    taskData: {
      type: Array,
      required: true
    }
  },
  components: {
    'w-button': Wbutton,
    'w-progress': Wprogress,
    'w-toast': Wtoast,
    'w-progress-value': WprogressValue
  },

  data () {
    return {
      signStatus: true,
      task: '已打卡',
      unTask: '打卡',
      toast: false,
      grayColor: 'gray',
      blackColor: 'black',
      statusOpacity: '0',
      unStatuOpacity: '1',
      status: null,
      taskNumber: '3',
      id: 0,
      circleId: 0,
      index: 0
    }
  },

  methods: {
    sign (status, taskId, circleId, targetDays, completedDays, signIndex) {
      if (status === 1) return
      if (targetDays === completedDays && targetDays !== 0) return
      this.toast = true
      this.id = taskId
      this.circleId = circleId
      this.index = signIndex
    },

    signIn (toast, status, text, path) {
      this.toast = toast
      if (status === false) {
        return
      }
      this.status = status
      this.$emit('goSignIn', text, this.id, this.circleId, path, this.index)
    }
  },

  mounted () {
  },
  onShow () {
  },
  onLoad () {
    this.toast = false
  }
}
</script>

<style lang="scss" scoped>
  .wrap {
    width: 630rpx;
  }
  .sign-in {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 630rpx;
    background-color: #ffffff;
    box-shadow: 0 16rpx 32rpx -16rpx rgba(0, 0, 0, 0.1);
    margin-bottom: 30rpx;
    padding: 30rpx 30rpx 30rpx 0;
  }
  .task-r {
    display: flex;
    justify-content: center;
    width: 150rpx;
    height: 80rpx;
  }
  .task-r span{
    font-size: 34rpx;
    font-weight: 500;
    line-height: 80rpx;
    color: #fff;
  }
  .task-r-status {
    display: flex;
    justify-content: center;
    width: 150rpx;
    height: 80rpx;
    background-color: rgba(178, 178, 178, 0.5);
  }
  .task-r-status span{
    font-size: 34rpx;
    font-weight: 500;
    line-height: 80rpx;
    color: #fff;
  }
  .task-l {
    margin-left: 40rpx;
  }
  .task-time {
    font-size: 28rpx;
    color: #b2b2b2;
  }
  .task-essay {
    font-size: 28rpx;
    color: #232323;
  }
  .task-number {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 400rpx;
    height: 32rpx;
    font-size: 22rpx;
    color: #b2b2b2;
  }
  .time-color {
    color: $blackColor;
    font-family: $my-font;
  }
  .task-title {
    width: 400rpx;
    margin-bottom: 20rpx;
    line-height: 34rpx;
  }

  .times-task {
    font-size:48rpx;
    color:#232323;
    font-family: $my-font;
  }
  .times-task span {
    font-size: 22rpx;
    color: #b2b2b2;
    letter-spacing: 0.2rpx;
  }
</style>
