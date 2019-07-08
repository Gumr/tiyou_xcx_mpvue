<template>
  <div class="warp">
    <!-- 缺失图 -->
    <div v-if="!circleArr.length" :key="noData">
      <image src="https://api.tiyou.techoiceness.com/v1/static/qz-images/img_circle.png" class="icon" />
      <div class="text">
        暂无课程
      </div>
    </div>
    <div v-if="circleArr">
      <div class="item" v-for="(item, index) in courseArr" :key="index">
        <image
          v-if="item.taskType === 101"
          class="course-img"
          @click="toSignInTask(index)"
          mode="aspectFill"
          @load="imageLoad"
          :src="item.detail.cover || defaultCover"
          :style="{height: imgHeight + 'rpx', width: imgWidth + 'rpx'}"
        />
        <div class="course-detail">
          <div class="border-box">
            <span class="border"></span>
            <span class="course">{{ item.detail.title }}</span>
          </div>
          <div class="on-task">
            进行中
          </div>
        </div>
      </div>
    </div>
    <div class="show" v-if="!circleArr">
      暂无
    </div>
  </div>
</template>

<script>

export default {
  props: {
  },
  data () {
    return {
      imgWidth: 0,
      imgHeight: 0,
      courseArr: [],
      circleArr: []
    }
  },

  components: {
  },
  computed: {
    infoList () {
      return this.courseArr
    }
  },
  methods: {
    imageLoad: function (e) {
      let that = this
      let oWidth = e.mp.detail.width
      let oHeight = e.mp.detail.height
      that.imgWidth = 630
      that.imgHeight = oHeight / (oWidth / 630)
    },
    toSignInTask (index) {
      wx.navigateTo({
        url: `../qz-course/main?id=${this.circleArr[index]}&taskId=${this.courseArr[index]._id}`
      })
    },
    async getCourse (cirlceId) {
      const param = {
        page: 1,
        id: cirlceId
      }
      let arr = await this.$quanzis.api.circle.circleTask(param)
      let course = {}
      if (!arr.rows.length) {
        this.courseArr = [...this.courseArr]
      } else {
        course = arr.rows[0]
        this.courseArr = [...this.courseArr, course]
      }
    },
    async getCircleList () {
      const param = {
        checkStatus: 1,
        page: 1,
        circleType: 2
      }
      let res = await this.$quanzis.api.course.joinedCourse(param)
      this.circleArr = [...this.circleArr, ...res.rows]
      this.circleArr = this.circleArr.map(i => {
        return i.circleId
      })
      this.circleArr.forEach(i => {
        this.getCourse(i)
      })
    }
  },
  onLoad () {
    // 已加入的课程圈子
    this.courseArr = []
    this.circleArr = []
    this.getCircleList()
  }
}
</script>

<style lang="scss" scoped>
.warp {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.item {
  width: 630rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
}
.course-img {
  width: 630rpx;
}
.course-detail {
  box-sizing: border-box;
  width: 630rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.course {
  font-size: 28rpx;
  color: #888;
  width: 400rpx;
  height: 40rpx;
  line-height: 40rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 20rpx;
}
.border-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.border {
  width: 4rpx;
  height: 30rpx;
  border-radius: 4rpx;
  background-color: $decorateColor;
}
.on-task {
  font-size: 22rpx;
  color: $decorateColor;
}
.show {
  font-size: 24rpx;
}
.icon {
  width: 432rpx;
  height: 432rpx;
  margin-top: 240rpx;
}
.text {
  width: 432rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  color: #eee;
  font-size: 34rpx;
}
</style>
