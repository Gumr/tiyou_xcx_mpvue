
<template>
  <div class="theme-wrap">
    <div class="theme-box">
      <div class="theme-name">
        # {{ topicDetail.content }}
      </div>
      <div class="user">
        <div class="user-title">
          创建者
        </div>
        <div class="user-name">
          <div class="name">{{ topicDetail.user && topicDetail.user.nickname }}</div>
           <image class="avatar" :src="topicDetail.user && topicDetail.user.avatar || defaultAvatar" />
        </div>
      </div>
      <div class="message-box">
        <div class="message-title">
          信息数量
        </div>
        <div class="message-count">
          {{ topicDetail.infoCount || 0 }}
        </div>
      </div>
    </div>
    <div class="msg-box">
      <w-msg-card
        :toMsg="toMsg"
        :theme="theme"
        :circleInfo="infoList"
      />
    </div>
    <w-loading
      :loading='loading'
      :noData='noData'
    />
  </div>
</template>

<script>
import WmsgCard from '@/components/quanzis/msgCard'
import Wloading from '@/components/quanzis/loading'
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  components: {
    'w-loading': Wloading,
    'w-msg-card': WmsgCard
  },

  data () {
    return {
      loading: false,
      noData: false,
      theme: true,
      infoList: [],
      topic: '',
      page: 1,
      topicDetail: {},
      defaultAvatar: 'https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_default.png'
    }
  },

  computed: {
    ...mapGetters({
      'themeJoinStatus': 'themeJoinStatus',
      'themeCircleID': 'themeCircleID'
    })
  },
  methods: {
    ...mapActions([
      'setStatus',
      'setCircle'
    ]),
    // api
    async getTopicDetail (topic) {
      let res = await this.$quanzis.api.topic.topicDetail(topic)
      if (res.error) return
      this.topicDetail = res
    },
    // api
    async getInfo (param) {
      let res = await this.$quanzis.api.topic.topicInfo(param)
      if (res.error) return
      this.loading = false
      let resList = res.rows.map(i => {
        return {
          ...i,
          createdAt: this.$quanzis.getTime(i.createdAt)
        }
      })
      this.infoList = [...this.infoList, ...resList]
      res.nextPage = this.infoList.length - res.count
      if (res.nextPage === 0) {
        this.noData = true
      }
    },
    initState () {
      this.infoList = []
      this.topicDetail = {}
      this.loading = false
      this.noData = false
      this.page = 1
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    this.initState()
    const param = {
      topic: this.topic,
      page: this.page
    }
    this.loading = true
    this.getInfo(param)
    this.getTopicDetail(this.topic)
  },
  onReachBottom () {
    if (this.noData === true) return
    this.page += 1
    this.loading = true
    const param = {
      topic: this.topic,
      page: this.page
    }
    this.getInfo(param)
  },
  onUnload () {
    this.setStatus(false)
    this.setCircle(-1)
    this.initState()
  },
  onShow () {
    if (!this.themeJoinStatus) return
    let id = this.themeCircleID
    // this.infoList[index].isVisible = 1
    let arr = []
    arr = this.infoList.map(i => {
      let obj = {
        ...i
      }
      if (obj.circleId === id) {
        obj.isVisible = 1
      }
      return obj
    })
    this.infoList = arr
  },
  onLoad () {
    // this.initState()
    const { topic } = this.$root.$mp.query
    this.topic = topic
    wx.setNavigationBarTitle({
      title: this.topic
    })
    this.getTopicDetail(this.topic)
    const param = {
      topic: this.topic,
      page: this.page
    }
    this.getInfo(param)
  }
}
</script>

<style lang="scss" scoped>
.theme-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.theme-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 630rpx;
  height: 268rpx;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 30rpx;
}
.theme-name {
  width: 550rpx;
  height: 48rpx;
  line-height: 48rpx;
  font-size: 34rpx;
  color: $decorateColor;
  margin-top: 40rpx;
  margin-bottom: 30rpx;
}
.user {
  width: 550rpx;
  height: 48rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.user-title {
  width: 138rpx;
  height: 40rpx;
  font-size: 28rpx;
  color: #b2b2b2;
}
.user-name {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.name {
  width: 300rpx;
  height: 40rpx;
  line-height: 40rpx;
  margin-right: 20rpx;
  text-align: right;
  font-size: 28rpx;
  color: #232323;
}
.avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  box-shadow: 0 4rpx 8rpx 0 rgba(0, 0, 0, 0.05);
}
.message-box {
  width: 550rpx;
  height: 40rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 26rpx;
  margin-bottom: 40rpx;
}
.message-title {
  width: 208rpx;
  height: 40rpx;
  font-size: 28rpx;
  color: #b2b2b2;
}
.message-count {
  width: 200rpx;
  height: 40rpx;
  line-height: 40rpx;
  font-size: 28rpx;
  color: #231916;
  text-align: right;
}
.no-join{
  position: relative;
  width: 690rpx;
  height: 206rpx;
}
.img {
  width: 690rpx;
  height: 206rpx;
}
.mask {
  position: absolute;
  top: 0;
  width: 690rpx;
  height: 206rpx;
  background-color: #fff;
  opacity: .7;
  backdrop-filter: blur(14rpx);
  line-height: 206rpx;
  text-align: center;
  font-size: 26rpx;
  color: #b2b2b2;
}
</style>
