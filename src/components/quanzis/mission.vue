<template>
  <div class="warp">
    <!-- 圈子任务组件 -->
    <div v-if="toast">
      <w-toast @signIn="signIn"></w-toast>
    </div>
    <!-- <div v-if="questionsToast"> -->
      <!-- <w-qtoast @showStoast="showStoast" :list="questions"></w-qtoast> -->
    <!-- </div> -->
    <div class="mission-wrap">
      <div class="mission-box" v-for="(item, index) in taskData" :key="index">
        <image v-if="item.taskType === 101"
          class="course-img"
          @click="toSignInTask(index)"
          mode="aspectFill"
          @load="imageLoad"
          :src="item.courseDetail.cover || defaultCover"
          :style="{height: imgHeight + 'rpx', width: imgWidth + 'rpx'}"
        />
        <div :class="[item.taskType === 101 ? 'course-item' : '', 'mission-item']">
          <div class="box-title">
            <div class="border-box" @click="toSignInTask(index)">
              <div class="border-left">
                <div class="border-l"></div>
                <div v-if="item.taskType === 1" class="item-title">打卡任务</div>
                <div v-if="item.taskType === 2" class="item-title">挑战任务</div>
                <div class="course-box" v-if="item.taskType === 101">
                  <!-- tasktype101 -->
                  <div class="course">{{ item.courseDetail.title }}</div>
                </div>
              </div>
              <div v-if="item.taskType === 101" class="on-task">
                进行中
              </div>
              <div v-if="item.taskType === 1" class="task-number">
                <span class="count">今天 </span>
                {{ item.todayAttendance }} 
                <span class="count">人已打卡</span>
              </div>
              <div v-if="item.taskType === 2" class="task-number">
                {{ item.answerCount }} <span class="count"> 人已挑战</span>
              </div>
            </div>
          </div>
          <div class="item-name" v-if="item.taskType !== 101" @click="toSignInTask(index, item.targetDays, item.currentCompletedDays)">
            <div class="item-name-l">
              <div class="box-img" v-if="item.taskType === 1">
                <span class="iconfont icon-ic_punch_gray"></span>
              </div>
              <div class="box-img" v-if="item.taskType === 2">
                <span class="iconfont icon-ic_qa_gray"></span>
              </div>
              <div v-if="item.taskType === 1" class="item-time-box">
                <span class="item-time" v-if="item.targetDays !== 0">
                  <span>坚持</span>
                  <span class="time-color"> {{ item.targetDays }} </span>
                  <span>天:</span>
                </span>
                <span class="mission-name">{{ item.name }}</span>
              </div>
              <div v-if="item.taskType === 2" class="content-title">
                <div class="questions-text">
                  <span>问题:</span>
                  <span class="questions">
                    <text>{{ item.questions[0].content }}</text>
                  </span>
                  <!-- 问题:<span class="questions"><text>{{item.detail.questions[0].questionContent}}</text></span> -->
                </div>
                <div v-if="item.questions[1]">
                  <div class="questions-text">
                    <span>问题:</span>
                    <span class="questions">
                      <text>{{ item.questions[1].content }}</text>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 加入不等于101显示 -->
            <div v-if="joinStatus === 1 && item.taskType !== 101">
              <span class="iconfont icon-right icon-ic_right"></span>
            </div>
          </div>
          <!-- 有限次打卡 -->
          <div class="progress" v-if="item.taskType === 1 && joinStatus === 1 && item.targetDays !== 0" key="tiems">
            <div class="progress-content">
              <div>
                <w-progress :completedDays="item.currentCompletedDays" :targetDays="item.targetDays"></w-progress>
              </div>
              <div>
                <w-progress-value :completedDays="item.currentCompletedDays" :targetDays="item.targetDays"></w-progress-value>
              </div>
            </div>
          </div>
          <!-- 无限次打卡 -->
          <div v-if="item.taskType === 1 && joinStatus === 1 && item.targetDays === 0" key="no-times" class="completedDays-box">
            <div class="completed-days">已完成<span> {{ item.currentCompletedDays || 0 }} </span>天</div>
          </div>
          <div v-if="joinStatus === 1" class="margin-b"></div>
          <div v-if="item.taskType === 1 && joinStatus === 1 "
          @click.stop="sign(item.id, item.doneToday, item.targetDays, item.currentCompletedDays)"
          class="button">
            <w-button v-if="item.targetDays===item.currentCompletedDays" text="已完成"  size="medium" :bgColor="grayColor"></w-button>
            <w-button v-else :text="item.doneToday ? task : unTask"  size="medium" :bgColor="item.doneToday ? grayColor : blackColor"></w-button>
          </div>
          <div v-if="item.taskType === 2 && joinStatus === 1" @click="toSignInTask(index, item.targetDays, item.currentCompletedDays, 1)" class="button">
          <!-- <div v-if="item.taskType === 2 && joinStatus === 1" @click="toSignInTask(index, 1)" class="button"> -->
            <w-button :text="item.answered ? answer : unAnswer"  size="medium" :bgColor="item.answered ? grayColor : blackColor"></w-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import button from '@/components/quanzis/button'
import Wtoast from '@/components/quanzis/toast'
import Wqtoast from '@/components/quanzis/questionsToast'
import Wprogress from '@/components/quanzis/progress/progress'
import WprogressValue from '@/components/quanzis/progress/progressValue'
import WcompleteTask from '@/components/quanzis/course/completeTask'
import WcourseComplete from '@/components/quanzis/course/courseComplete'

// cirlceId 圈子id，joinStatus 加入状态，未加入不显示完全，taskData 任务列表
export default {
  props: {
    circleId: {
      type: Number,
      required: true
    },
    taskData: {
      type: Array,
      required: true
    },
    joinStatus: {
      type: Number,
      required: true
    },
    courseTaskId: {
      type: Number
    },
    courseTitle: {
      type: String
    }
  },
  data () {
    return {
      index: -1,
      t_taskId: 0,
      questionsToast: false,
      questions: [],
      imgHeight: 0,
      imgWidth: 0,
      toast: false,
      id: 0,
      _id: 0,
      task: '已打卡',
      unTask: '打卡',
      unAnswer: '挑战',
      answer: '已挑战',
      grayColor: 'gray',
      blackColor: 'black',
      defaultCover: 'https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_default.png'
    }
  },

  components: {
    'w-button': button,
    'w-toast': Wtoast,
    'w-progress': Wprogress,
    'w-progress-value': WprogressValue,
    'w-complete-task': WcompleteTask,
    'w-course-complete': WcourseComplete,
    'w-qtoast': Wqtoast
  },

  methods: {
    imageLoad: function (e) {
      let that = this
      let oWidth = e.mp.detail.width
      let oHeight = e.mp.detail.height
      that.imgWidth = 630
      that.imgHeight = oHeight / (oWidth / 630)
    },
    sign (id, status, targetDays, completedDays) {
      if (this.joinStatus !== 1) return
      if (targetDays === completedDays && targetDays !== 0) return
      if (status === 1) return
      this.toast = true
      this._id = id
    },

    toSignInTask (_index, targetDays, completedDays, status) {
      if (this.joinStatus !== 1) {
        return
      }
      let taskType = this.taskData[_index].taskType
      let taskId = this.taskData[_index].id
      this.t_taskId = this.taskData[_index].id
      let questionType = this.taskData[_index].questionType
      this.questions = this.taskData[_index].questions
      if (!questionType) {
        questionType = 101
      }
      if (this.taskData[_index].answered && status === 1) return
      // 进入圈子课程
      if (taskType === 101) {
        wx.navigateTo({
          url: `../qz-course/main?id=${this.circleId}&taskId=${taskId}`
        })
        // 课程型圈子
        // wx.navigateTo({
        //   url: `../coursecircle/main?id=${this.circleId}&taskId=${taskId}`
        // })
      } else {
        if (this.courseTaskId) {
          let taskOver = 0
          if (targetDays === completedDays && targetDays !== 0) {
            taskOver = 1
          }
          // 如果是课程下的任务
          if (status === 1) {
            if (questionType === 1) {
              wx.navigateTo({
                url: `../qz-questions/main?circleId=${this.circleId}&taskId=${taskId}&course=${this.courseTaskId}`
              })
              this.index = _index
            } else {
              wx.navigateTo({
                url: `../qz-problem/main?taskId=${taskId}&circleId=${this.circleId}&course=${this.courseTaskId}`
              })
            }
          } else {
            wx.navigateTo({
              url: `../qz-mission/main?id=${this.circleId}&taskId=${taskId}&type=${taskType}&course=${this.courseTaskId}&title=${this.courseTitle}&taskStatus=${taskOver}`
            })
          }
        } else {
          // 如果打卡天数已经完成
          let taskOver = 0
          if (targetDays === completedDays && targetDays !== 0) {
            taskOver = 1
          }
          if (status === 1) {
            if (questionType === 1) {
              wx.navigateTo({
                url: `../qz-questions/main?circleId=${this.circleId}&taskId=${taskId}`
              })
              // this.questionsToast = true
              this.index = _index
            } else {
              wx.navigateTo({
                url: `../qz-problem/main?taskId=${taskId}&circleId=${this.circleId}`
              })
            }
          } else {
            wx.navigateTo({
              url: `../qz-mission/main?id=${this.circleId}&taskId=${taskId}&type=${taskType}&taskStatus=${taskOver}`
            })
          }
        }
      }
    },

    // 签到
    signIn (toast, status, text, path) {
      this.toast = toast
      this.status = status
      if (status === false) return
      this.$emit('signIn', text, this._id, path)
    }
  },
  onLoad () {
    this.toast = false
    this.questionsToast = false
  }
}
</script>

<style lang="scss" scoped>
.iconfont {
  font-family: iconfont;
}
.mission-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 630rpx;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 60rpx;
}
.mission-item {
  padding-top: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 550rpx;
  position: relative;
}
.box-title {
  height: 40rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.border-box {
  width: 550rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.on-task {
  font-size: 22rpx;
  color: $proceed;
}
.course-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.margin-b {
    margin-top: 40rpx;
}
.course {
  font-size: 28rpx;
  color: #888;
  width: 400rpx;
  height: 40rpx;
  /* word-break: break-all; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 20rpx;
}
.course-slot {
  display: flex;
  flex-direction: row;
  margin-left: 10rpx;
  font-size: 22rpx;
}
.border-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.border-l {
  width: 4rpx;
  height: 30rpx;
  border-radius: 4rpx;
  background-color: $decorateColor;
}
.item-name {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}
.item-name-l {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.item-title {
  font-size: 28rpx;
  color: #888;
  margin-left: 20rpx;
}
.item-time {
  font-size: 28rpx;
  color: #b2b2b2;
  /* margin-left: 30rpx; */
  margin-right: 10rpx;
}
.mission-name {
  font-size: 28rpx;
  color: #232323;
}
.iconTask {
  font-size: 48rpx;
  color: #C0C0C0;
}
.icon-right {
  font-size: 48rpx;
  // color: #C0C0C0;
}
.progress {
  margin-bottom: 30rpx;
}
.time-color {
  color: $blackColor;
  font-family: $my-font;
}
.button {
  position: absolute;
  right: 20rpx;
  bottom: -40rpx;
}
.img {
  width: 48rpx;
  height: 48rpx;
}
.box-img {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 30rpx;
}
.progress-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 550rpx;
  height: 32rpx;
}
.content-title {
  display: flex;
  flex-direction: column;
  font-size: 28rpx;
  color: #b2b2b2;
}
.title-color {
  color: #232323;
}
.course-name {
  font-size: 28rpx;
  color: #232323;
}
.course-content {
  font-size: 22rpx;
  color: #b2b2b2;
  margin-bottom: 30rpx;
}
.count {
  font-size: 22rpx;
  color: #b2b2b2;
}
.course-img {
  width: 630rpx;
  margin-bottom: 10rpx;
}
.item-time-box {
  width: 400rpx;
  line-height: 34rpx;
}
.questions-text {
  display: flex;
  flex-direction: row;
  /* align-items: center; */
}
.questions {
  display: flex;
  width: 330rpx;
  color: #232323;
  margin-left: 10rpx;
}
.task-number {
  color: $blackColor;
  font-family: $my-font;
  font-size: 22rpx;
  font-weight: 500;
}

.completedDays-box {
  width: 530rpx;
  color: #B2B2B2;
  font-size: 22rpx;
  text-align: right;
  margin-bottom: 20rpx;
}

.completed-days {
  width: 300rpx;
  height: 48rpx;
  margin-left: auto;
  text-align: center;
}

.completed-days span {
  font-size: 48rpx;
  color: #232323;
  font-family: $my-font;
  text-align: center;
}
</style>
