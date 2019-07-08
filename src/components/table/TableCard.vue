<template>
  <div class="contain">
    <div class="course-item">
      <!-- 0表示可预约 -->
      <div :class="['course-time', item.classStatus === 0 ? 'course-timeYellow' : 'course-timeGray']">
        {{ item.startTime }}-{{ item.endTime }}
      </div>
      <image mode='aspectFill'
        class="full-img"
        v-if="item.classStatus === 1 && item.status === 6"
        src="https://api.tiyou.techoiceness.com/v1/static/images/ic_full.png"
      />
      <!-- 精品课 topId 3 -->
      <image
        mode='aspectFill'
        class="top-img"
        v-if="item.topId === 3"
        src="../../static/icon/is_topid3.png"
      />
      <div :class="['course-date', item.classStatus === 0 ? 'course-dateYellow' : 'course-dateGray']">
        {{ item.bookedNum }}/{{ item.maxMembers }}
      </div>

      <div class="course-content">
        <span :class="['course-content-border', item.classStatus === 0 ? 'course-content-borderYellow' : 'course-content-borderGray']"></span>
        <div class="course-content-word">
          <p class="course-content-name">{{ item.courseName }}</p>
          <p class="course-content-type">{{ item.courseType }}</p>
          <p class="course-content-location">{{ item.storeName }}</p>
          <span class="course-content-instance">{{ item.distance }}</span>
        </div>
      </div>

      <div class="course-img">
        <image mode='aspectFill' class="img" :src="item.courseImg"
        placeholder-image="https://api.tiyou.techoiceness.com/v1/static/images/img_default.png" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapActions
} from 'vuex'

export default {
  props: {
    item: {
      type: Object,
      required: () => ({})
    }
  },

  data () {
    return {
    }
  },

  methods: {
    ...mapActions('course', [
      'vuexSetCourseInfo'
    ])
  }
}
</script>

<style scoped>
.course-item {
  position: relative;
  margin: 30rpx 30rpx 0;
  width: 690rpx;
  height: 240rpx;
}

.course-time {
  position: absolute;
  z-index: 4;
  top: 10rpx;
  left: 40rpx;
  /* width: 112rpx; */
  height: 42rpx;
  font-family: 'League Gothic';
  font-size: 34rpx;
}
.course-timeYellow {
  color: #ffcd76;
}
.course-timeGray {
  color: #c8d2dc;
}

.full-img {
  width: 100rpx;
  height: 100rpx;
  position: absolute;
  z-index: 4;
  left: 160rpx;
}

.course-date {
  position: absolute;
  z-index: 4;
  top: 10rpx;
  left: 265rpx;
  width: 44rpx;
  height: 42rpx;
  font-family: 'League Gothic';
  font-size: 34rpx;
  text-align: right;
}
.course-dateYellow {
  color: #ffcd76;
}
.course-dateGray {
  color: #c8d2dc;
}
.course-content {
  position: absolute;
  z-index: 3;
  left: 0;
  bottom: 0;
  width: 344rpx;
  height: 200rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
}
.course-content-border {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 10rpx;
  height: 200rpx;
}
.course-content-borderYellow {
  background-color: #ffdea5;
}
.course-content-borderGray {
  background-color: #c8d2dc;
}
.course-content-word {
  position: absolute;
  left: 40rpx;
  top: 35rpx;
  width: 286rpx;
  height: 148rpx;
}
.course-content-name {
  width: 274rpx;
  height: 48rpx;
  font-weight: 500;
  font-size: 34rpx;
  color: #232323;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.course-content-type {
  width: 274rpx;
  height: 32rpx;
  font-size: 22rpx;
  color: #b2b2b2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.course-content-location {
  margin-top: 6rpx;
  width: 286rpx;
  height: 32rpx;
  font-size: 22rpx;
  color: #888888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.course-content-instance {
  position: absolute;
  left: 0;
  bottom: 0rpx;
  font-size: 22rpx;
  color: #b2b2b2;
}
.course-img {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 346rpx;
  height: 240rpx;
}
.img {
  width: 346rpx;
  height: 240rpx;
}

.top-img {
  width: 100rpx;
  height: 100rpx;
  position: absolute;
  right: -10rpx;
  top: -10rpx;
  z-index: 80;
}
</style>
