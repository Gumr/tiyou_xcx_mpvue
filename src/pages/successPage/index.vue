<template>
  <div class="contain">
    <div class="status">
      <image class="status_img" src="https://api.tiyou.techoiceness.com/v1/static/images/img_5.png" mode="aspectFill" />
      <p class="status_name">{{ title }}</p>
      <!-- <p class="status_desc">{{ content }}</p> -->
    </div>
    <div v-if="backStatus === 0" class="main_btn" @click="back">
      <WButton :text="btnLeft" size="big" bgcolor="red"/>
    </div>
    <div class="aid_btn" @click="toHome">
      <WButton :text="btnRight" size="big" bgcolor="white"/>
    </div>

  </div>
</template>

<script>
import WButton from '@/components/WButtonCover'
import {
  mapActions
} from 'vuex'

export default {
  data () {
    return {
      title: '成功',
      content: '操作成功',
      btnLeft: '返回',
      btnRight: '回到首页',
      type: 0,
      pageStatus: 0,
      orderId: 0
    }
  },

  components: {
    WButton
  },

  methods: {
    ...mapActions('setInputValue', [
      'veuxSetInput'
    ]),

    setText (type) {
      if (type === '1') {
        this.title = '预约成功'
        // this.content = '预约成功'
        this.btnRight = '回到首页'
        this.backStatus = 1
      }
      if (type === '2') {
        this.title = '修改家庭成员成功'
        this.btnRight = '返回'
        this.backStatus = 1
      }
      if (type === '3') {
        this.title = '添加家庭成员成功'
        this.btnRight = '返回'
        this.backStatus = 1
      }
    },

    back () {
      if (this.pageStatus) {
        wx.navigateBack({
          delta: 3
        })
      } else {
        wx.navigateBack({})
      }
      this.veuxSetInput(1)
    },

    toHome () {
      let type = this.type
      switch (type) {
        case '1':
          wx.switchTab({
            url: `../course/main`
          })
          break
        case '2': case '3':
          wx.navigateBack({
            delta: 2
          })
          break
        default:
          wx.switchTab({
            url: `../order/main`
          })
      }
    },

    initState () {
      this.title = '成功'
      this.content = '操作成功'
      this.btnLeft = '返回'
      this.btnRight = '回到首页'
      this.orderId = 0
    }
  },

  onUnload () {
    this.initState()
  },

  onLoad () {
    this.type = 0
    this.pageStatus = 0
    const { type, pageStatus, orderId } = this.$root.$mp.query
    if (pageStatus === '1') {
      this.pageStatus = pageStatus
    }
    if (orderId) {
      this.orderId = parseInt(orderId, 10)
    }
    this.type = type
    this.setText(type)
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
