<template>
  <div class="course-warp">
    <div class="course">
      <div class="warp">
        <div class="border-box">
          <div class="border-l"></div>
          <div class="course-box">
            <div class="course-slot">
              <!-- 完成度 -->
              <w-course-complete :completion="courseInfo.completion"></w-course-complete>
            </div>
          </div>
        </div>
        <div>
          <!-- 进行中 -->
          <w-complete-task :number="1" :type="3"></w-complete-task>
        </div>
      </div>
      <div class="course-name">
        <span class="iconfont img icon-ic_courses_gray"></span>
        <div class="course-title">{{ courseInfo.courseDetail && courseInfo.courseDetail.title }}</div>
      </div>
      <div class="course-content">
        {{ courseInfo.courseDetail && courseInfo.courseDetail.desc }}
      </div>
      <!-- 折叠cover -->
      <div v-if="courseInfo.courseDetail && courseInfo.courseDetail.poster">
        <div class="cover-box" v-if="upDown">
          <image @load="imageLoad" :style="{ height: imgHeight + 'rpx', width: imgWidth + 'rpx' }" mode="aspectFill"
            :src="courseInfo.courseDetail && courseInfo.courseDetail.poster" />
          <div class="cover-mask">
          </div>
        </div>
        <div class="cover-box-up" v-else @click="lookImg(courseInfo.courseDetail && courseInfo.courseDetail.poster)">
          <image @load="imageLoad" :style="{ height: imgHeight + 'rpx', width: imgWidth + 'rpx' }"
            mode="aspectFill" class="cover" :src="courseInfo.courseDetail && courseInfo.courseDetail.poster" />
        </div>
        <div class="up-down" @click="changeUpDown">
          <span v-if="upDown" class="iconfont up-down-img icon-ic_down" :key="up"></span>
          <span v-else class="iconfont up-down-img icon-ic_up" :key="down"></span>
        </div>
      </div>
      <div class="mission">
        <div class="task">
          <div class="task-title">
            打卡任务
          </div>
          <div class="task-number">
            <span class="completedDays">{{ courseInfo && courseInfo.completedPunchInTaskCount || 0 }}</span>
            <span>/</span>
            <span class="targetDays">{{ courseInfo.courseDetail && courseInfo.courseDetail.punchInChildTaskCount || 0 }}</span>
          </div>
        </div>
        <div class="task">
          <div class="task-title">
            挑战任务
          </div>
          <div class="">
            <div class="task-number">
              <span class="completedDays">{{ courseInfo && courseInfo.completedQaTaskCount || 0 }}</span>
              <span>/</span>
              <span class="targetDays">{{ courseInfo.courseDetail && courseInfo.courseDetail.qaChildTaskCount || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 课程资料 -->
    <div class="course-data" @click="toCourseInfo">
      <span class="data-name">课程资料</span>
      <span class="iconfont icon-right icon-ic_right"></span>
    </div>
    <div class="task-t">
      任务列表
    </div>
    <div class="task-list">
      <w-mission
        v-if="taskList.length"
        :circleId="circleId"
        @signIn="signIn"
        :joinStatus="1"
        :taskData="taskList"
        :courseTaskId="courseTaskId"
        :courseTitle="title"
      />
      <div v-else class="noTask">
        暂无任务
      </div>
    </div>
    <div v-if="taskList.length" class="loading">
      <w-loading
        :loading="loading"
        :noData="noData"
      />
    </div>
  </div>
</template>

<script>
import WcompleteTask from '@/components/quanzis/course/completeTask'
import WcourseComplete from '@/components/quanzis/course/courseComplete'
import Wmission from '@/components/quanzis/mission'
import Wloading from '@/components/quanzis/loading'
import {
  mapActions, mapGetters
} from 'vuex'

export default {
  components: {
    'w-complete-task': WcompleteTask,
    'w-course-complete': WcourseComplete,
    'w-mission': Wmission,
    'w-loading': Wloading
  },
  data () {
    return {
      imgHeight: 0,
      imgWidth: 0,
      circleId: 0,
      page: 1,
      courseTaskId: '',
      courseInfo: {},
      loading: false,
      noData: false,
      title: '',
      canCreateInfo: '',
      upDown: true
    }
  },
  onPullDownRefresh: function () {
    this.initState()
    const param = {
      circleId: this.circleId,
      courseTaskId: this.courseTaskId
    }
    // 获取课程详情
    this.getCourseDetail(param)
    this.getCourseTask()
    wx.stopPullDownRefresh()
  },
  onReachBottom () {
    if (!this.vuexTaskCourseNext || this.vuexTaskCourseNext < 0) {
      this.loading = 0
      this.noData = 1
      return
    }
    this.page += 1
    this.getCourseTask()
  },
  computed: {
    ...mapGetters('courseTask', [
      'vuexGetCourseTask',
      'vuexTaskCourseNext'
    ]),
    taskList () {
      return this.vuexGetCourseTask
    }
  },
  methods: {
    ...mapActions([
      'setCourseId'
    ]),
    ...mapActions('courseTask', [
      'vuexSetCourseTask',
      'vuexSetClearCourse',
      'vuexSetCourseDone'
    ]),
    initState () {
      // 清空
      this.vuexSetClearCourse([])
      this.courseInfo = {}
      this.page = 1
      this.loading = 0
      this.noData = 0
    },
    imageLoad (e) {
      let oWidth = e.mp.detail.width
      let oHeight = e.mp.detail.height
      this.imgWidth = 550
      this.imgHeight = oHeight / (oWidth / 550)
    },
    lookImg (cover) {
      wx.previewImage({
        current: cover,
        urls: [cover]
      })
    },
    changeUpDown () {
      this.upDown = !this.upDown
    },
    // 确认签到
    signIn (text, _id, path) {
      const signParam = {
        cirlceId: this.circleId,
        taskId: _id,
        courseId: this.courseId
      }
      const SignIdData = {
        textContent: text,
        pics: path
      }
      this.$quanzis.api.circle.circleSignEd(signParam, SignIdData)
        .then(res => {
          if (res.error) return
          this.vuexSetCourseDone(_id)
        })
    },
    toCourseInfo () {
      wx.navigateTo({
        url: `../qz-courseinfo/main?id=${this.circleId}&taskId=${this.courseTaskId}&title=${this.title}&canCreateInfo=${this.canCreateInfo}`
      })
    },

    getCourseTask () {
      const courseParam = {
        id: this.circleId,
        page: this.page,
        // courseId: this.courseTaskId
        courseId: this.courseTaskId
      }
      this.vuexSetCourseTask(courseParam)
    },

    async getCourseDetail (param) {
      let res = await this.$quanzis.api.circle.courseList(param)
      if (res.error) return
      this.courseInfo = res
      this.courseInfo.completion = this.courseInfo.completion.toFixed(2) * 100
      this.canCreateInfo = res.canCreateInfo
      this.title = this.courseInfo.courseDetail.title
      let name = res.name
      wx.setNavigationBarTitle({
        title: `${name}`
      })
    }
  },
  onUnload () {
    this.initState()
  },
  onLoad () {
    this.$quanzis.VoicePlay().voiceInit()
    this.courseTaskId = this.$root.$mp.query.taskId
    this.circleId = this.$root.$mp.query.id
    this.setCourseId(this.courseTaskId)
    const param = {
      circleId: this.circleId,
      courseTaskId: this.courseTaskId
    }
    this.getCourseDetail(param)
    this.getCourseTask()
  }
}
</script>

<style lang="scss" scoped>
.iconfont {
  font-family: iconfont;
}
.course-warp {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.border-box {
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
.item-title {
  font-size: 28rpx;
  color: #888;
  margin-left: 20rpx;
}
.course-slot {
  margin-left: 10rpx;
  font-size: 28rpx;
}
.warp {
  padding-top: 30rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 550rpx;
}
.course-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.course {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 630rpx;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}
.img {
  font-size: 48rpx;
  margin-right: 30rpx;
}
.course-name {
  width: 550rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 28rpx;
  margin-top: 30rpx;
  margin-bottom: 20rpx;
  color: #232323;
}
.course-content {
  width: 550rpx;
  font-size: 22rpx;
  color: #b2b2b2;
  text-align: left;
  margin-bottom: 20rpx;
}
.mission {
  box-sizing: border-box;
  width: 550rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: 30rpx;
  margin-bottom: 30rpx;
}
.task-title {
  font-size: 28rpx;
  color: #888;
  margin-right: 30rpx;
}
.task {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.task-number {
  font-size: 28rpx;
  color: #b2b2b2;
}
.completedDays {
  font-size: 48rpx;
  font-weight: 500;
  color: $blackColor;
  font-family: $my-font;
}
.course-data {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 40rpx;
  padding-right: 30rpx;
  width: 630rpx;
  height: 100rpx;
  margin-top: 30rpx;
  margin-bottom: 60rpx;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
}
.icon-right {
  font-size: 48rpx;
  // color: #C0C0C0;
}
.data-name {
  font-size: 28rpx;
  color: $decorateColor;
}
.task-t {
  width: 630rpx;
  height: 48rpx;
  line-height: 48rpx;
  font-size: 34rpx;
  font-weight: 500;
  color: #232323;
  margin-bottom: 30rpx;
}
.noTask {
  font-size: 28rpx;
  color: #b2b2b2;
  margin-top: 100rpx;
  margin-bottom: 30rpx;
}
.task-list {
  width: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cover-box {
  position: relative;
  width: 550rpx;
  height: 120rpx;
  overflow: hidden;
}
.cover-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 550rpx;
  height: 120rpx;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff);
}
.up-down {
  width: 550rpx;
  height: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10rpx;
}
.up-down-img {
  width: 48rpx;
  height: 48rpx;
}
.cover-box-up {
  width: 550rpx;
}
.cover {
  width: 550rpx;
}
</style>
