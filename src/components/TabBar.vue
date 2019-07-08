<template>
  <div :class="[ AppIsIpx ? 'isx-wrap' : 'wrap'] ">
    <!-- <div :class="['bar', tab === 'index' ? 'bar-box' : '']" @click="changeBar('index')">
      <image mode='aspectFill' class="img" src="../../static/images/ic_study.png" />
      <div class="text">学习</div>
    </div> -->
    <div class="bar" @click="changeBar('course')">
      <image mode='aspectFill' class="img" :src="tab === 'course' ? '../../static/icon/ic_course.png' : '../../static/icon/ic_course_gray.png'" />
      <div :class="tab === 'course' ? 'text' : 'text-gray'">课程</div>
    </div>
    <!-- <div class="bar" @click="changeBar('qz-home')">
      <image mode='aspectFill' class="img" :src="tab === 'qz-home' ? '../../static/icon/ic_circle.png' : '../../static/icon/ic_circle_gray.png'" />
      <div :class="tab === 'qz-home' ? 'text' : 'text-gray'">社群</div>
    </div> -->
    <div class="bar" @click="changeBar('booked')">
      <image mode='aspectFill' class="img" :src="tab === 'booked' ? '../../static/icon/ic_booked.png' : '../../static/icon/ic_booked_gray.png'" />
      <div :class="tab === 'booked' ? 'text' : 'text-gray'">预约</div>
    </div>
    <div class="bar" @click="changeBar('me')">
      <image mode='aspectFill' class="img" :src="tab === 'me' ? '../../static/icon/ic_me.png' : '../../static/icon/ic_me_gray.png'" />
      <div :class="tab === 'me' ? 'text' : 'text-gray'">我</div>
    </div>
  </div>
</template>

<script>
// import {
//   mapGetters
// } from 'vuex'

export default {
  components: {
  },

  data () {
    return {
    }
  },

  computed: {
    // ...mapGetters('isIphoneX', [
    //   'isIPX'
    // ]),

    tab () {
      return this.$root.$mp.page.route.split('/').slice(1, 2).pop()
    }
  },

  methods: {
    changeBar (page) {
      if (this.tab === page) return
      wx.switchTab({
        url: `../${page}/main`
      })
    }
  }
}
</script>

<style scoped>
.wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100rpx;
  z-index: 9999;
  display: flex;
  background-color: #fff;
  flex-direction: row;
  justify-content: space-between;
}
.isx-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 166rpx;
  z-index: 9999;
  display: flex;
  flex-direction: row;
  background-color: #fff;
  justify-content: space-between;
  border-top: 2rpx solid #f8f8f8;
}
.img {
  margin-top: 6rpx;
  width: 54rpx;
  height: 54rpx;
}
.text {
  font-size: 20rpx;
  color: #FFCD76;
  font-weight: 500;
}
.text-gray {
  font-size: 20rpx;
  color: #DFE6ED;
  font-weight: 500;
}
.bar {
  box-sizing: border-box;
  padding-top: 10rpx;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* opacity: .5; */
}
</style>
