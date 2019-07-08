<template>
  <!-- 课程型圈子 courescircle -->
  <div class="course-warp">
    <div class="no-join">
      <div class="course-cover">
        <image
          class="nojoin-cover"
          @load="nojoinCover"
          :style="{ height: coverHeight + 'rpx', width: coverWidth + 'rpx' }"
          mode="aspectFill"
          :src="courseInfo && courseInfo.cover"
        />
      </div>
      <div class="course-detail">
        <div class="nojoin-title">
          <span class="nojoin-left"></span>
          <span class="nojoin-name">
            <text>
              {{ courseInfo.title }}
            </text>
          </span>
        </div>
        <div class="course-member">
          <!-- 头像 -->
          <div class="avatar">
            <image class="avatar-img" mode="aspectFill" :src="vuexGetAdmin.avatar"/>
            <span class="name-box">{{ vuexGetAdmin.name }}</span>
          </div>
          <!-- 成员数 -->
          <div class="member-number" v-if="vuexGetMembers.count">
            课程成员 <span>(</span><span>{{ vuexGetMembers.count }}</span><span>)</span>
          </div>
          <div class="member-number" v-else>
            课程成员 <span>(</span><span>0</span><span>)</span>
          </div>
          <!-- 成员头像 -->
          <div class="">
            <w-member :member="vuexGetRows"></w-member>
          </div>
        </div>
        <div class="course-desc">
          <text>
            {{ courseInfo.desc }}
          </text>
        </div>
        <div class="course-poster" v-if="courseInfo.poster">
          <div class="nojoin-cover-box" v-if="nojoinUpDown">
            <image
            class="nojoin-poster"
            @load="nojoinPoster"
            :style="{height: imgHeight + 'rpx', width: imgWidth + 'rpx'}"
            mode="aspectFill"
            :src="courseInfo.poster"
            />
          </div>
          <div v-else>
            <image
            class="nojoin-poster"
            @load="nojoinPoster"
            :style="{height: imgHeight + 'rpx', width: imgWidth + 'rpx'}"
            mode="aspectFill"
            :src="courseInfo.poster"
            />
          </div>
          <div class="nojoin-up-down" @click="noJoinUpDown">
            <span v-if="nojoinUpDown" class="iconfont up-down-img icon-ic_down" :key="up"></span>
            <span v-else class="iconfont up-down-img icon-ic_up" :key="down"></span>
            <!-- <image mode="aspectFill" v-if="nojoinUpDown" class="up-down-img" src="../../static/qz-images/ic_down.png" /> -->
            <!-- <image mode="aspectFill" v-else class="up-down-img" src="../../static/qz-images/ic_up.png" /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WcompleteTask from '@/components/quanzis/course/completeTask'
import WcourseComplete from '@/components/quanzis/course/courseComplete'
import Wmission from '@/components/quanzis/mission'
import Wloading from '@/components/quanzis/loading'
import Wbutton from '@/components/quanzis/button'
import member from '@/components/quanzis/index/cardMember'
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  components: {
    'w-complete-task': WcompleteTask,
    'w-course-complete': WcourseComplete,
    'w-mission': Wmission,
    'w-loading': Wloading,
    'w-button': Wbutton,
    'w-member': member
  },
  props: {
    // courseInfo: {
    //   type: Object,
    //   required: true
    // },
    member: {
      type: Object,
      required: true
    },
    administrator: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // 课程，未加入 0, 已加入 1
      courseJoinStatus: 1,
      imgHeight: 0,
      imgWidth: 0,
      // 未加入,cover
      coverHeight: 0,
      coverWidth: 0,
      circleId: 0,
      taskList: [],
      page: 1,
      courseTaskId: '',
      // courseInfo: {},
      loading: false,
      noData: false,
      title: '',
      canCreateInfo: '',
      upDown: true,
      nojoinUpDown: true,
      text: '申请加入'
    }
  },
  computed: {
    ...mapGetters('circle', [
      'vuexGetCicleDetail',
      'vuexCourseCircle',
      'vuexGetAdmin',
      'vuexGetMembers',
      'vuexGetRows',
      'vuexGetName'
    ]),
    courseInfo () {
      if (this.vuexCourseCircle.joinType === 1) {
        this.text = '加入'
      }
      console.log('v', this.vuexCourseCircle)
      return this.vuexCourseCircle
    }
  },
  methods: {
    ...mapActions([
      'setCourseId'
    ]),
    imageLoad (e) {
      let oWidth = e.mp.detail.width
      let oHeight = e.mp.detail.height
      this.imgWidth = 550
      this.imgHeight = oHeight / (oWidth / 550)
    },
    nojoinCover (e) {
      let oWidth = e.mp.detail.width
      let oHeight = e.mp.detail.height
      this.coverWidth = 750
      this.coverHeight = oHeight / (oWidth / 750)
    },
    nojoinPoster (e) {
      let oWidth = e.mp.detail.width
      let oHeight = e.mp.detail.height
      this.imgWidth = 630
      this.imgHeight = oHeight / (oWidth / 630)
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
    // 为加入课程
    noJoinUpDown () {
      this.nojoinUpDown = !this.nojoinUpDown
    }
  },
  onUnload () {
  },
  onShow () {
    this.page = 1
    this.loading = false
    this.noData = false
    this.courseTaskId = this.$root.$mp.query.taskId
    this.circleId = this.$root.$mp.query.id
    this.setCourseId(this.courseTaskId)
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
.join-course {
  width: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.img {
  width: 48rpx;
  height: 48rpx;
  margin-right: 30rpx;
}
.course-name {
  width: 550rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 28rpx;
  margin-top: 30rpx;
  margin-bottom: 24rpx;
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
  color: #55d9ff;
}
.completedDays {
  font-size: 48rpx;
  color: $decorateColor;
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

/* 未加入 */
.no-join {
  width: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nojoin-cover {
  width: 750rpx;
}
.course-detail {
  width: 670rpx;
  margin-top: 40rpx;
}
.nojoin-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30rpx;
}
.nojoin-left {
  width: 4rpx;
  height: 30rpx;
  border-radius: 4rpx;
  background-color: $decorateColor;
}
.nojoin-name {
  font-size: 34rpx;
  color: #232323;
  font-weight: 500;
  margin-left: 20rpx;
}
.course-desc {
  font-size: 22rpx;
  color: #b2b2b2;
  margin-top: 30rpx;
  margin-bottom: 40rpx
}
.nojoin-poster {
  width: 630rpx;
}
.course-poster {
  position: relative;
  width: 670rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 130rpx;
}
.nojoin-cover-box {
  width: 610rpx;
  height: 620rpx;
  overflow: hidden;
}
.nojoin-up-down {
}
.btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 750rpx;
  height: 110rpx;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  z-index: 10;
}
.course-member {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.avatar {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.avatar-img {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}
.name-box {
  width: 160rpx;
  height: 40rpx;
  line-height: 40rpx;
  overflow: hidden;
  font-size: 28rpx;
  color: #232323;
}
.member-number {
  font-size: 28rpx;
  color: #b2b2b2;
}
.member-number span {
  color: #232323;
}
</style>
