<template>
  <div class="contain">
    <div class="status">
      <image class="status_img" src="https://api.tiyou.techoiceness.com/v1/static/images/img_5.png" mode="aspectFill" />
      <p class="status_name">{{ title }}</p>
      <p class="status_desc">{{ content }}</p>
    </div>
    <div class="main_btn" @click="back">
      <WButton :text="btnLeft" size="big" bgcolor="red"/>
    </div>
    <div class="aid_btn" @click="toHome">
      <WButton :text="btnRight" size="big" bgcolor="white"/>
    </div>

  </div>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'
import WButton from '@/components/WButtonCover'

export default {
  data () {
    return {
      title: '成功',
      content: '操作成功',
      btnLeft: '返回',
      btnRight: '回到首页',
      type: 0
    }
  },

  components: {
    WButton
  },

  computed: {
    ...mapGetters('successInfo', [
      'vuexGetSucInfo'
    ])
  },

  methods: {
    ...mapActions('successInfo', [
      'vuexClearSucInfo'
    ]),

    setText (type) {
      if (type === 4) {
        this.title = '兑换成功'
        this.content = this.vuexGetSucInfo
        this.btnLeft = '前往预约'
        this.btnRight = '查看卡劵'
      }
      if (type === 5) {
        this.title = '兑换成功'
        this.content = this.vuexGetSucInfo
        this.btnLeft = '马上约课'
        this.btnRight = '返回首页'
      }
      if (type === 6) {
        this.title = '购买成功'
        this.content = this.vuexGetSucInfo
        this.btnLeft = '马上约课'
        this.btnRight = '返回首页'
      }
      if (type === 7) {
        this.title = '购买成功'
        this.content = this.vuexGetSucInfo
        this.btnLeft = '马上约课'
        this.btnRight = '返回首页'
      }
      if (type === 8) {
        this.title = '预约成功'
        this.content = this.vuexGetSucInfo
        this.btnLeft = '查看预约'
        this.btnRight = '返回首页'
      }
    },

    back () {
      let type = this.type
      switch (type) {
        case 4:
          wx.switchTab({
            url: `../course/main`
          })
          break
        case 5:
          wx.navigateTo({
            url: `../packageMe/auditionCourse/main`
          })
          break
        case 6:
          wx.navigateTo({
            url: `../packageMe/auditionCourse/main`
          })
          break
        case 7:
          wx.navigateTo({
            url: `../packageMe/auditionCourse/main`
          })
          break
        case 8:
          wx.switchTab({
            url: `../booked/main`
          })
          break
        default:
          wx.switchTab({
            url: `../course/main`
          })
      }
    },

    toHome () {
      let type = this.type
      switch (type) {
        case 4:
          wx.navigateTo({
            url: `../packageMe/cardManagement/main`
          })
          break
        case 5:
          wx.switchTab({
            url: `../course/main`
          })
          break
        case 6:
          wx.switchTab({
            url: `../course/main`
          })
          break
        case 7:
          wx.switchTab({
            url: `../course/main`
          })
          break
        default:
          wx.switchTab({
            url: `../course/main`
          })
      }
    },

    initState () {
      this.title = '成功'
      this.content = '操作成功'
      this.btnLeft = '返回'
      this.btnRight = '回到首页'
      this.type = 0
    }
  },

  onUnload () {
    this.initState()
    this.vuexClearSucInfo()
  },

  onLoad () {
    const { type } = this.$root.$mp.query
    this.type = parseInt(type, 10)
    this.setText(this.type)
  }
}
</script>

<style scoped>
.contain {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: PingFangSC;
  color: #232323;
  text-align: center;
}

.status {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status_img {
  height: 240rpx;
  width: 240rpx;
  margin-top: 180rpx;
}

.status_name {
  width: 630rpx;
  height: 48rpx;
  margin-top: 60rpx;
  font-size: 34rpx;
  font-weight: 500;
}

.status_desc {
  width: 630rpx;
  height: 36rpx;
  margin-top: 28rpx;
  font-size: 26rpx;
  color: #b2b2b2;
}

.main_btn {
  margin-top: 120rpx;
}

.aid_btn {
  margin-top: 30rpx;
}
</style>
