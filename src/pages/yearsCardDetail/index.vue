<template>
  <div class="page">
    <!-- 年卡详情 -->
    <WCard
      :card="cardDetail"
    />
    <div class="refund">
      <!-- <div class="refund-text">
        <div>
          全额返退购卡金
        </div>
        <div class="card-number">
          <span class="current">{{ currentTimes }}</span>
          <span>/{{ allTimes }}</span>
        </div>
      </div> -->

      <!-- <div class="progress-box">
        <span v-for="(item, index) in allTimes" :key="index" :class="[ currentTimes >= index + 1 ? 'current-progress' : 'target-progress']"></span>
        <div class="price">
          <span class="price-text">返退 ¥ </span>
          <span class="card-price"> {{ cardDetail.cardType && cardDetail.cardType.price }}</span>
        </div>
      </div> -->

      <!-- status: 1, // 1:已领取 2:已体验 3:已购买年卡 -->
      <div class="gift-box">
        <div class="gift-text">赠卡小福利</div>
        <div class="user-item" v-for="(item, index) in user" :key="index">
          <image class="title-img"
            :src="item.status === 3 || item.status === 1 ? 'https://api.tiyou.techoiceness.com/v1/static/images/img_7.png' : 'https://api.tiyou.techoiceness.com/v1/static/images/img_8.png'"
            mode="aspectFill"
          />
          <image v-if="item.status !== 4" class="avatar"
            :src="item.user && item.user.avatar || avatarImg"
            mode="aspectFill"
          />
          <div v-if="item.status !== 4" class="user-name">
            {{ item.user && item.user.nickname }}
          </div>
          <div v-if="item.status === 3" class="already-buy">
            已购年卡
          </div>

          <div v-if="item.status === 1" class="already-get">
            已领取
          </div>

          <div v-if="item.status === 4" class="no-get">
            未领取
          </div>
        </div>
      </div>
    </div>

    <div class="btn-box" v-if="status === 1" key="len">
      <label class="btn" for="share">
        <Wbutton :text="text" size="size690" :bgColor="bgColor" />
      </label>
      <button
        id="share"
        class="share-button"
        open-type="share" />
    </div>

    <div class="btn-box" v-else key="noLen">
      <div class="btn" for="share">
        <Wbutton :text="text" size="size690" :bgColor="bgColor" />
      </div>
    </div>
  </div>
</template>

<script>
import WCard from '@/components/yearsCard/card'
import Wbutton from '@/components/Button'

export default {
  components: {
    WCard,
    Wbutton
  },

  data () {
    return {
      // 返现
      // 达到次数返现
      allTimes: 0,
      // 当前次数
      currentTimes: 0,
      text: '赠卡',
      bgColor: 'confirm',
      cardDetail: {},
      userId: '',
      cardId: '',
      // 是否可以分享 0 不可分享 1 可分享
      cardActivityId: '',
      // 分享次数
      times: 0,
      // 1 已领取 2 已体验 3 已经购买年卡
      user: [],
      // 是否可以赠卡
      status: 1,
      avatarImg: 'https://api.tiyou.techoiceness.com/v1/static/images/img_6.png'
    }
  },

  // 分享
  onShareAppMessage: function () {
    this.profile()
    if (!this.userId) {
      wx.showToast({
        icon: 'none',
        title: '分享失败,请重新分享'
      })
    }
    let text = '赠送科学体验卡'
    const t = {
      title: `${text}`,
      desc: '',
      imageUrl: 'https://api.tiyou.techoiceness.com/v1/static/images/share_image.png',
      path: `pages/yearsCardShare/main?userId=${this.userId}&cardId=${this.cardId}`
    }
    return t
  },

  methods: {
    async getCardDetail (id) {
      let data = {
        cardId: id
      }
      let res = await this.$api.card.cardDetail(data)
      if (res.msg) return
      res.deadline = this.$wxApi.getTime(res.deadline)
      this.cardDetail = res
      // 深拷贝
      this.user = [ ...res.cardActivityRecords ]
      for (let i = 0; i < 5; i++) {
        if (!this.user[i]) {
          // 没有5个时，数组为5个状态为3的值
          let obj = {
            status: 4
          }
          this.user.push(obj)
        }
      }
      // 需要分享次数返现
      this.allTimes = res.cardActivity.passLine
      this.times = res.cardActivity.lines
      // 当前次数
      this.currentTimes = res.cardActivityRecords.length
      this.cardDetail.cardType.price = this.cardDetail.cardType.price / 100
      let len = this.times - res.cardActivityRecords.length
      this.text = `赠卡（剩余${len}张）`
      if (len <= 0) {
        this.text = '已赠完(剩余0张)'
        this.bgColor = 'not-clickable'
        this.status = 2
      }
    },

    async profile () {
      let res = await this.$api.my.profile()
      if (res.msg) return
      this.userId = res.id
    },

    initState () {
      this.cardDetail = {}
      this.userId = ''
      this.text = '赠卡'
      this.bgColor = 'confirm'
      this.allTimes = 0
      this.cardDetail = 0
      this.times = 0
      this.status = 1
    }
  },

  onUnload () {
    this.initState()
  },

  onLoad (options) {
    let { cardId } = options
    cardId = parseInt(cardId, 10)
    this.cardId = cardId
    this.getCardDetail(cardId)
    this.profile()
  }
}
</script>

<style scoped>
.page {
  margin-top: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 260rpx;
}

.refund-text {
  width: 630rpx;
  box-sizing: border-box;
  font-size: 34rpx;
  font-weight: 500;
  color: #232323;
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.card-number {
  font-size: 40rpx;
  margin-left: 20rpx;
  color: #c8d2dc;
  font-family: 'League Gothic'
}

.current {
  color: #ffcd76;
}

.progress-box {
  display: flex;
  align-items: center;
  margin-bottom: 60rpx;
}

.current-progress {
  width: 50rpx;
  height: 20rpx;
  border-radius: 10rpx;
  background-color: #ffcd76;
  margin-right: 10rpx;
}

.target-progress {
  width: 50rpx;
  height: 20rpx;
  border-radius: 10rpx;
  background-color: #dfe6ed;
  margin-right: 10rpx;
}

.price {
  width: 180rpx;
  height: 60rpx;
  border-radius: 30rpx;
  background-color: #dfe6ed;
  margin-left: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.price-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
  margin-right: 5rpx;
}

.card-price {
  font-size: 48rpx;
  letter-spacing: 0.2rpx;
  color: #fff;
  font-family: 'League Gothic';
}

.gift-box {
  width: 630rpx;
}

.gift-text {
  font-size: 34rpx;
  font-weight: 500;
  color: #232323;
  margin-bottom: 30rpx;
}

.user-item {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.title-img {
  width: 90rpx;
  height: 80rpx;
  margin-right: 26rpx;
}

.avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  margin-right: 40rpx;
}

.user-name {
  flex: auto;
  font-size: 28rpx;
  font-weight: 500;
  color: #232323;
}

.already-buy {
  font-size: 28rpx;
  font-weight: 500;
  color: #232323;
}

.already-get {
  font-size: 28rpx;
  font-weight: 500;
  color: #ffcd76;
}

.no-get {
  font-size: 28rpx;
  font-weight: 500;
  color: #c8d2dc;
  flex: auto;
  text-align: right;
}

.btn-box {
  width: 100%;
  height: 200rpx;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn {
  margin-top: 50rpx;
}

.share-button::after {
  border: 0;
}

.share-button {
  width: 0;
  height: 0;
}
</style>
