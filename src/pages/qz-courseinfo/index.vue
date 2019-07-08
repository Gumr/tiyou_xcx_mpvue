<template>
  <div class="wrap">
    <div>
      <div v-if="vuexGetCourseInfo.length" >
        <div v-for="(item, index) in vuexGetCourseInfo" :key="index">
          <w-info
            :type="item"
            :joinStatus="item && item.isVisible"
            :dataDetail="item && item.detail"
          />
        </div>
      </div>
      <div v-if="!vuexGetCourseInfo.length">
        <image src="https://api.tiyou.techoiceness.com/v1/static/qz-images/img_circle.png" class="icon" />
        <div class="text">
          未发布课程资料
        </div>
      </div>
    </div>
    <div class="high-member" v-if="canCreateInfo === '1'"
      :style="{ bottom: ball.ballBottom + 'rpx', right: ball.ballRight + 'rpx' }">
      <div class="high-box" @click="toPublish">
        <!-- <image class="high-img" :src="src" /> -->
        <span class="iconfont high-img icon-ic_publish"></span>
      </div>
    </div>
    <div v-if="vuexGetCourseInfo.length" class="loading">
      <w-loading
        :loading="loading"
        :noData="noData"
      />
    </div>
  </div>
</template>

<script>
import WcourseInfo from '@/components/quanzis/courseInfo'
import Wloading from '@/components/quanzis/loading'
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  components: {
    'w-info': WcourseInfo,
    'w-loading': Wloading
  },
  data () {
    return {
      courseTaskId: '',
      circleId: '',
      infoListData: [],
      page: 1,
      loading: false,
      noData: false,
      ball: {
        ballBottom: 120,
        ballRight: 60
      },
      src: 'https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_publish.png',
      canCreateInfo: '',
      title: '圈子'
    }
  },
  methods: {
    ...mapActions('courseInfo', [
      'vuexClearCourseInfo',
      'vuexSetCourseInfo'
    ]),

    toPublish () {
      wx.navigateTo({
        url: `../qz-publish/main?id=${this.circleId}&courseTaskId=${this.courseTaskId}`
      })
    },

    async getCourseInfo (param) {
      let res = await this.$quanzis.api.info.courseInfo(param)
      if (res.error) return
      this.infoListData = [...this.infoListData, ...res.rows]
      res.nextPage = this.infoListData.length - res.count
      if (res.nextPage === 0) {
        this.noData = true
        this.loading = false
      }
      // this.infoListData = [...this.infoListData, ...res.rows].map(i => {
      //   return {
      //     ...i,
      //     createdAt: this.$quanzis.getTime(i.createdAt)
      //   }
      // })
      this.vuexSetCourseInfo(this.infoListData)
    }
  },

  computed: {
    ...mapGetters('courseInfo', [
      'vuexGetCourseInfo'
    ])
  },

  onReachBottom () {
    if (this.noData === true) return
    this.page += 1
    const param = {
      page: this.page,
      circleId: this.circleId,
      courseTaskId: this.courseTaskId
    }
    this.getCourseInfo(param)
  },

  onUnload () {
    this.vuexClearCourseInfo()
  },

  onLoad () {
    this.page = 1
    this.loading = false
    this.noData = false
    this.infoListData = []
    this.courseTaskId = this.$root.$mp.query.taskId
    this.circleId = this.$root.$mp.query.id
    this.canCreateInfo = this.$root.$mp.query.canCreateInfo
    this.title = this.$root.$mp.query.title
    wx.setNavigationBarTitle({
      title: this.title
    })
    const param = {
      page: this.page,
      circleId: this.circleId,
      courseTaskId: this.courseTaskId
    }
    this.getCourseInfo(param)
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30rpx;
}
.high-member {
  position: fixed;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 16rpx 32rpx -16rpx rgba(0, 0, 0, 0.3);
  z-index: 10;
}
.high-img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 48rpx;
  height: 48rpx;
  z-index: 12;
}
.high-box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 96rpx;
  height: 96rpx;
  /* background-color: red; */
  border-radius: 50%;
  background-color: $btnColor;
  z-index: 11;
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
