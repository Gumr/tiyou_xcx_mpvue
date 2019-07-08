<template>
  <div class="sign-wrap">
    <!-- 打卡任务，挑战任务详情 -->
    <!-- type === 1 为打卡 -->
    <!-- type === 2 为挑战 -->
    <div v-if="toast">
      <w-toast  @signIn="signIn" @submit="submit" :taskData="data"></w-toast>
    </div>
    <div>
      <div class="scroll-box">
        <!-- type 1  -->
        <div v-if="data.taskType === 1" class="sign-box">
          <div class="mission-item">
            <div class="box-title">
              <div class="box-left">
                <span class="border-l"></span>
                <span class="item-title" v-if="!courseTitle">圈子任务</span>
                <span class="item-title" v-else>{{ courseTitle }}</span>
              </div>
              <div class="box-task-right">
                今天 <span class="right-color">{{ data.todayAttendance || 0 }}</span> 人已打卡
              </div>
            </div>
            <div class="item-content">
              <!-- <span :class="['iconfont', taskSatus ? 'iconTask' : '']">&#xe643;</span> -->
              <div class="box-img">
                <span class="iconfont icon-img icon-ic_punch_gray"></span>
                <!-- <image class="icon-img" v-if="data.doneToday || taskStatus === '1'" src="../../static/qz-images/ic_punch_gray.png" /> -->
                <!-- <image class="icon-img" v-else src="../../static/qz-images/ic_punch.png" /> -->
              </div>
              <div class="content-title">
                <span v-if="data.targetDays !== 0">
                  <span>坚持</span>
                  <span class="time-color"> {{ data.targetDays || 0 }} </span>
                  <span>天: </span>
                </span>
                <span class="title-color">{{ data.name }}</span>
              </div>
            </div>
            <div class="content">
              {{ data.desc }}
            </div>
            <!-- 有限次打卡 -->
            <!-- targetDays 为 0 为无限次打卡 -->
            <div class="progress-content" v-if="data.targetDays" key="times">
              <!-- todo -->
              <div>
                <w-progress :completedDays="data.currentCompletedDays" :targetDays="data.targetDays"></w-progress>
              </div>
              <div>
                <w-progress-value :completedDays="data.currentCompletedDays" :targetDays="data.targetDays"></w-progress-value>
              </div>
            </div>
            <!-- 无限次打卡 -->
            <div v-else key="no-times" class="completedDays-box">
              <div class="completed-days">已完成<span> {{ data.currentCompletedDays || 0 }} </span>天</div>
            </div>
            <div class="btn" @click="signInTask(1)">
              <w-button v-if="taskStatus === '1'" text="已完成"  size="medium" :bgColor="grayColor"></w-button>
              <w-button v-else :text="data && data.doneToday ? task : unTask"  size="medium" :bgColor="data && data.doneToday ? grayColor : blackColor"></w-button>
            </div>
          </div>
        </div>
        <!-- type 2 -->
        <div v-else class="sign-box">
          <div class="mission-item">
            <div class="box-title">
              <div class="box-left">
                <span class="border-l"></span>
                <span class="item-title" v-if="!courseTitle">圈子任务</span>
                <span class="item-title" v-else>{{ courseTitle }}</span>
              </div>
              <div class="box-task-right">
                <span class="right-color">{{ data.answerCount || 0 }}</span> 人已挑战
              </div>
            </div>
            <div class="item-content task-content">
              <div class="box-img">
                <span class="iconfont icon-img icon-ic_qa_gray"></span>
              </div>
              <div class="content-box">
                <div class="content-title" v-for="(item, index) in data && data.questions" :key="index">
                  <!-- <div>
                    问题: <span class="questions"><text>{{item.questionContent}}</text></span>
                  </div> -->
                  <div class="questions-text">
                    <span>问题:</span>
                    <span class="questions">
                      <text>{{ item.content }}</text>
                    </span>
                    <!-- 问题:<span class="questions"><text>{{item.detail.questions[0].questionContent}}</text></span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="btn" @click="signInTask(2)">
              <w-button :text="data.answered ? qtask : qUnTask"  size="medium" :bgColor="data.answered ? grayColor : blackColor"></w-button>
            </div>
          </div>
        </div>
        <!-- type 1 -->
        <div v-if="taskType === 1" class="progress-box">
          <!-- <div class="progress-title">
            打卡情况
          </div> -->
          <div class="item-box">
            <div class="title-item" @click="changeTask(0)">
              <span :class="[ status === 0 ? 'change-name' : 'title-name' ]">打卡详情</span>
              <span :class="[ status === 0 ? 'border' : '' ]"></span>
            </div>
            <div class="title-item" @click="changeTask(1)">
              <span :class="[ status === 1 ? 'change-name' : 'title-name' ]">排行榜</span>
              <span :class="[ status === 1 ? 'border' : '' ]"></span>
            </div>
          </div>
          <!-- 打卡列表 -->
          <!-- 打卡详情 -->
          <div v-if="status === 0">
            <msg-card
              :circleId="circle_id"
              :theme="theme"
              :circleInfo="listTask"
              :joinStatus="1"
            />
          </div>
          <div v-if="punchInRanking.length && status === 1 && data.targetDays" key="targetDays">
            <div class="user-box" v-for="(item, index) in punchInRanking" :key="index">
              <div class="ranking1 item-ranking" v-if="index === 0">1</div>
              <div class="ranking2 item-ranking" v-if="index === 1">2</div>
              <div class="ranking3 item-ranking" v-if="index === 2">3</div>
              <image class="img" :src="item.user.avatar" />
              <div class="box-right">
                <div class="user-time-box">
                  <span class="user-time">
                    <span class="time-color">{{ item.currentCompletedDays || 0 }}</span>/{{ item.targetDays || 0 }}
                  </span>
                  <div class="task-plan">
                    <w-progress :completedDays="item.currentCompletedDays" :targetDays="item.targetDays"></w-progress>
                  </div>
                </div>
                <div class="user-name">
                  <span>{{ item.user.nickname }}</span>
                  <span class="lately-tiem">最近打卡时间： {{ item.lastTime }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 无限次打卡 -->
          <div v-if="punchInRanking.length && status === 1 && data.targetDays === 0" key="no-targetDays">
            <div class="user-box-times" v-for="(item, index) in punchInRanking" :key="index">
              <div class="ranking1 item-ranking" v-if="index === 0">1</div>
              <div class="ranking2 item-ranking" v-if="index === 1">2</div>
              <div class="ranking3 item-ranking" v-if="index === 2">3</div>
              <image class="img" :src="item.user.avatar" />
              <div class="times-name">
                {{ item.user.nickname }}
              </div>
              <div class="times-last-time">
                (最近打卡： {{ item.lastTime }})
              </div>
              <div class="times-time">
                {{ item.currentCompletedDays || 0 }}
              </div>
            </div>
          </div>
          <div v-if="!listTask.length" class="noTask">
            暂无打卡
          </div>
        </div>
        <!-- type 2 -->
        <div v-else class="questions-box">
          <div class="questions-title">
            挑战情况
          </div>
          <div class="questions-content">
            <!-- joinStatus 加入状态 -->
            <w-msgcard
              v-if = "listTask.length"
              :circleInfo = "listTask"
              :joinStatus = "1"
              :circleId = "circle_id"
              :course = "course"
              :taskId = "data.id"
              :needCheck = "data.detail && data.detail.needCheck"
            />
            <div v-else class="noTask">
              暂无回答
            </div>
          </div>
        </div>
      </div>
      <div v-if="listTask.length">
        <view class="weui-loadmore" v-if="loading">
        <view class="weui-loading"></view>
        <view class="weui-loadmore__tips">正在加载</view>
        </view>
        <view class="no-more" v-if="noData">
          已经到底啦~
        </view>
      </div>
    </div>
  </div>
</template>

<script>
import Wbutton from '@/components/quanzis/button'
import Wtoast from '@/components/quanzis/toast'
import WmsgCard from '@/components/quanzis/msgList'
import Wprogress from '@/components/quanzis/progress/progress'
import WprogressValue from '@/components/quanzis/progress/progressValue'
import msgCard from '@/components/quanzis/msgCard'

import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  data () {
    return {
      page: 1,
      // 签到列表
      // listTask: [],
      // 任务详情
      questions: [],
      scrollHeight: 0,
      loading: false,
      noData: false,
      time: '',
      // 打卡任务，是打卡详情，还是排行榜
      status: 0,
      taskType: 0,
      type: 1,
      toast: false,
      questionsToast: false,
      missionTitle: '',
      missinoData: {
        taskSatus: false,
        type: 1
      },
      circle_id: 0,
      taskId: 0,
      task: '已打卡',
      unTask: '打卡',
      qtask: '已挑战',
      qUnTask: '挑战',
      grayColor: 'gray',
      blackColor: 'black',
      taskSatus: false,
      questionType: '',
      listTaskData: [],
      course: '',
      courseTitle: '',
      taskStatus: '',
      punchInRanking: []
    }
  },

  components: {
    'w-button': Wbutton,
    'w-msgcard': WmsgCard,
    'w-toast': Wtoast,
    'w-progress': Wprogress,
    'w-progress-value': WprogressValue,
    'msg-card': msgCard
  },
  onReachBottom () {
    if (this.noData === true) return
    if (this.taskType === 1) {
      // 如果排行榜直接加载完
      if (this.status === 2) return
      this.page += 1
      this.loading = true
      // if (this.taskType === 1) {
      // 打卡列表
      const signParam = {
        circleId: this.circle_id,
        taskId: this.taskId,
        page: this.page,
        courseId: this.course
      }
      this.listTaskData = []
      this.getPunchInList(signParam)
    } else {
      if (this.taskType === 2) {
        this.page += 1
        this.loading = true
        // if (this.taskType === 1) {
        // 打卡列表
        const signParam = {
          circleId: this.circle_id,
          taskId: this.taskId,
          page: this.page,
          courseId: this.course
        }
        this.getAnswerList(signParam)
      }
    }
  },
  computed: {
    ...mapGetters([
      'aGetTaskDetail',
      'aGetTaskList'
    ]),

    ...mapGetters('cTaskDetail', [
      'vuexGetTaskDetail'
    ]),

    data () {
      return this.vuexGetTaskDetail
    },
    listTask () {
      console.log('this. aGetTaskList', this.aGetTaskList)
      return this.aGetTaskList.length ? this.aGetTaskList : []
    }
  },
  methods: {
    ...mapActions('cTaskDetail', [
      'vuexSetTaskDetail',
      'vuexDetailDoneToday'
    ]),
    ...mapActions('circleTask', [
      'vuexDoneToday'
    ]),
    ...mapActions('courseTask', [
      'vuexSetCourseDone'
    ]),
    ...mapActions([
      'aSetTaskList',
      'aSetTaskDetail'
    ]),

    changeTask (status) {
      if (status === this.status) {
        return
      }
      this.status = status
    },

    signInTask (type) {
      if (this.data.doneToday === 1 || this.data.answered === 1) return
      const { questionType } = this.data
      // type 1打卡，2问答
      if (type === 2) {
        if (questionType !== 1) {
          if (this.status === true) return
          // 判断回答问题是哪种形式
          if (this.course) {
            wx.navigateTo({
              url: `../qz-problem/main?taskId=${this.taskId}&circleId=${this.circle_id}&course=${this.course}`
            })
          } else {
            wx.navigateTo({
              url: `../qz-problem/main?taskId=${this.taskId}&circleId=${this.circle_id}`
            })
          }
        } else if (questionType === 1) {
          // 如果是课程进来
          if (this.course) {
            wx.navigateTo({
              url: `../qz-questions/main?circleId=${this.circle_id}&taskId=${this.taskId}&course=${this.course}`
            })
          } else {
            wx.navigateTo({
              url: `../qz-questions/main?circleId=${this.circle_id}&taskId=${this.taskId}`
            })
          }
        }
      } else if (type === 1) {
        if (this.taskStatus === '1') return
        this.toast = true
      }
    },

    signIn (toastStatus, signIn, text, path) {
      this.toast = toastStatus
      if (signIn === false) return
      const signParam = {
        cirlceId: this.circle_id,
        taskId: this.data.id,
        courseId: this.course
      }
      const SignIdData = {
        textContent: text,
        pics: path
      }
      // 打卡
      this.$quanzis.api.circle.circleSignEd(signParam, SignIdData)
        .then(res => {
          if (res.error) return
          // 详情打卡
          // 课程进来
          if (this.course) {
            this.vuexSetCourseDone(this.data.id)
          } else {
            this.vuexDoneToday(this.data.id)
          }
          // 列表打卡
          this.vuexDetailDoneToday(this.data.id)
          res.createdAt = this.$quanzis.getTime(res.createdAt)
          this.aSetTaskList([...this.aGetTaskList, res])
        })
    },

    toMsg () {
      wx.navigateTo({
        url: `../qz-message/main`
      })
    },

    async getPunchInList (signParam) {
      let res = await this.$quanzis.api.circle.punchInList(signParam)
      if (res.error) return
      let arr = res.rows.map(i => {
        return {
          ...i,
          createdAt: this.$quanzis.getTime(i.createdAt)
        }
      })
      this.aSetTaskList(arr)
      res.nextPage = this.aGetTaskList.length - res.count
      if (res.nextPage === 0) {
        this.noData = true
        this.loading = 0
      }
    },

    async getAnswerList (param) {
      let res = await this.$quanzis.api.circle.answerList(param)
      if (res.error) return
      let arr = res.rows.map((i, index) => {
        return {
          ...i,
          createdAt: this.$quanzis.getTime(i.createdAt)
        }
      })
      this.aSetTaskList(arr)
      res.nextPage = this.aGetTaskList.length - res.count
      if (res.nextPage === 0) {
        this.noData = true
        this.loading = 0
      }
    },

    async getPuchInRanking (param) {
      let res = await this.$quanzis.api.circle.apiPunchInRanking(param)
      if (res.error) return
      let arr = res.rows.map((i, index) => {
        return {
          ...i,
          lastTime: this.$quanzis.getTime(i.lastPunchInTime)
        }
      })
      this.punchInRanking = [ ...this.punchInRanking, ...arr ]
      res.nextPage = this.punchInRanking.length - res.count
      if (res.nextPage === 0) {
        this.noData = true
        this.loading = 0
      }
    }
  },
  onUnload () {
    this.aSetTaskDetail('')
  },

  onLoad () {
    this.status = 0
    this.punchInRanking = []
    this.page = 1
    this.loading = false
    this.noData = false
    // this.listTask = []
    this.listTaskData = []
    this.questionsToast = false
    this.toast = false
    this.aSetTaskList([])
    this.taskType = parseInt(this.$root.$mp.query.type)
    this.circle_id = this.$root.$mp.query.id
    this.course = this.$root.$mp.query.course
    this.taskId = this.$root.$mp.query.taskId
    this.courseTitle = this.$root.$mp.query.title
    this.taskStatus = this.$root.$mp.query.taskStatus
    this.aSetTaskDetail(this.taskId)
    // 获取任务详情
    const param = {
      circleId: this.circle_id,
      taskId: this.taskId,
      courseId: this.course
    }
    this.vuexSetTaskDetail(param)
    if (this.taskType === 1) {
      this.missionTitle = '打卡任务'
      // 打卡列表
      // todo
      const signParam = {
        circleId: this.circle_id,
        taskId: this.taskId,
        page: 1,
        courseId: this.course
      }
      this.getPunchInList(signParam)
      this.getPuchInRanking(signParam)
    } else if (this.taskType === 2) {
      this.missionTitle = '挑战任务'
      // 问答列表
      const param = {
        circleId: this.circle_id,
        taskId: this.taskId,
        page: 1,
        courseId: this.course
      }
      this.getAnswerList(param)
    }
    this.taskSatus = this.missinoData.taskSatus
    wx.setNavigationBarTitle({
      title: this.missionTitle
    })
  }
}
</script>

<style lang="scss" scoped>
.iconfont {
  font-family: iconfont;
}
.weui-loading {
  margin: 0 10rpx;
  width: 40rpx;
  height: 40rpx;
  display: inline-block;
  vertical-align: middle;
  -webkit-animation: weuiLoading 1s steps(12, end) infinite;
  animation: weuiLoading 1s steps(12, end) infinite;
  background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
  background-size: 100%;
}
.weui-loadmore {
  width: 100%;
  font-size: 24rpx;
  text-align: center;
  opacity: .5;
}
.weui-loadmore__tips {
  display: inline-block;
  vertical-align: middle;
}
.scroll-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 630rpx;
}
.no-more {
  width: 100%;
  text-align: center;
  line-height: 48rpx;
  opacity: .3;
  font-size: 24rpx;
}
.content-box {
  width: 500rpx;
  display: flex;
  flex-direction: column;
}
.sign-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30rpx;
}
.sign-box {
  box-sizing: border-box;
  padding-top: 30rpx;
  // padding-bottom: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 630rpx;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
}
.mission-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 550rpx;
  position: relative;
}
.box-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 550rpx;
  height: 40rpx;
  margin-bottom: 30rpx;
}
.border-l {
  width: 4rpx;
  height: 30rpx;
  border-radius: 4rpx;
  background-color: $decorateColor;
  margin-right: 20rpx;
}
.item-title {
  font-size: 28rpx;
  color: #888;
}
.icon {
  font-size: 48rpx;
}
.item-content {
  width: 550rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.task-content {
  width: 570rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 70rpx;
}
.questionContent {
  width: 450rpx;
  display: flex;
  flex-direction: column;
}
.content-title {
  width: 450rpx;
  font-size: 28rpx;
  margin-left: 30rpx;
  color: #b2b2b2;
}
.title-color {
  color: #232323;
}
.content {
  width: 550rpx;
  font-size: 22rpx;
  color: #b2b2b2;
  margin-top: 20rpx;
  margin-bottom: 10rpx;
}
.iconTask {
  font-size: 48rpx;
  color: #C0C0C0;
}
.box-right {
  height: 72rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.progress-box {
  width: 630rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.progress-title {
  width: 630rpx;
  height: 48rpx;
  line-height: 48rpx;
  margin-top: 100rpx;
  font-size: 34rpx;
  font-weight: 500;
  color: #232323;
  margin-bottom: 30rpx;
}
.img {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}
.user-box {
  position: relative;
  display: flex;
  flex-direction: row;
  height: 72rpx;
  align-items: center;
  margin-bottom: 40rpx;
}

.user-box-times {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 630rpx;
  height: 72rpx;
  align-items: right;
  margin-bottom: 40rpx;
}

.times-time {
  width: 80rpx;
  color: #232323;
  text-align: right;
  font-size: 64rpx;
  letter-spacing: 0.2rpx;
}

.times-name {
  width: 100rpx;
  height: 72rpx;
  line-height: 72rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #888;
  font-size: 28rpx;
}

.times-last-time {
  width: 320rpx;
  height: 32rpx;
  font-size: 22rpx;
  color: #b2b2b2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  margin-top: 42rpx;
}

.item-ranking {
  position: absolute;
  top: -10rpx;
  left: -10rpx;
  font-size: 48rpx;
  font-family: $my-font;
}

.ranking1 {
  color: #FEF0C2;
}

.ranking2 {
  color: #EEEEEE;
}

.ranking3 {
  color: #E4CD9F;
}
.user-time-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 538rpx;
}
.user-name {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 538rpx;
  font-size: 28rpx;
}
.user-time {
  font-size: 22rpx;
  color: #b2b2b2;
  margin-right: 76rpx;
}
.task-plan {
  width: 400rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10rpx;
}
.progress {
  width: 38rpx;
  height: 10rpx;
  border-radius: 6rpx;
  // background-image: linear-gradient(268deg, #b7f3f5, #76bdec);
}
.progress-border {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 16rpx 0 rgba(0, 0, 0, 0.1);
}
.progress-right {
  width: 342rpx;
  height: 10rpx;
  background-color: #f8f8f8;
}
.lately-tiem {
  font-size: 22rpx;
  color: #b2b2b2;
}

/* type 2 */
.questions-text {
  display: flex;
  flex-direction: row;
  /* align-items: center; */
}
.questions {
  display: flex;
  width: 350rpx;
  color: #232323;
  margin-left: 10rpx;
}
.questions-box {
  width: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.questions-title {
  width: 630rpx;
  height: 48rpx;
  line-height: 48rpx;
  margin-top: 60rpx;
  font-size: 34rpx;
  font-weight: 500;
  color: #232323;
  margin-bottom: 30rpx;
}
.card-content {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30rpx;
  padding-bottom: 30rpx;
  width: 570rpx;
  font-size: 28rpx;
  background-color: #fff;
  box-shadow: 0 8rpx 16rpx -8rpx rgba(0, 0, 0, 0.05);
}
.questions-slot {
  width: 530rpx;
  color: #888;
}
.solution {
  margin-top: 10rpx;
  width: 530rpx;
  color: #232323;
}
.time-color {
  color: $blackColor;
  font-family: $my-font;
}

.box-img {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.questions-content {
  width: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.noTask {
  font-size: 28rpx;
  color: #b2b2b2;
  margin-top: 100rpx;
}
.btn {
  position: absolute;
  right: 20rpx;
  bottom: -40rpx;
}
.box-task-right {
  font-size: 22rpx;
  color: #b2b2b2;
}
.box-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.right-color {
  color: #232323;
  font-weight: 500;
}

.title-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 60rpx;
}

.item-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 630rpx;
  margin-top: 100rpx;
  font-size: 34rpx;
  font-weight: 500;
  color: #232323;
  margin-bottom: 50rpx;
}

.border {
  width: 40rpx;
  height: 6rpx;
  background-color: $decorateColor;
  margin-top: 12rpx;
}

.title-name {
  color: #eee;
}
.change-name {
  margin-top: 18rpx;
  color: #1e2832;
}

.progress-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 550rpx;
  height: 32rpx;
  margin-bottom: 65rpx;
}

.completedDays-box {
  width: 530rpx;
  margin-bottom: 65rpx;
  color: #B2B2B2;
  font-size: 22rpx;
  text-align: right;
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
