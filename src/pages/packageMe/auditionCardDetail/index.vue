<template>
  <div class="page">
    <div class="card-box">
      <WauditionCard  
        :card="cardInfo"
      />
    </div>

    <div
      v-for="(item, index) in cardInfo.cardType && cardInfo.cardType.descriptions"
      :key="index"
    >
    <div class="info-item" v-if="item.title && item.content">
      <div class="item-title-box">
        <span class="item-border"></span>
        <text class="item-title">{{ item.title }}</text>
      </div>
      <text class="item-content">{{ item.content }}</text>
    </div>
    </div>

    <div v-if="detail" class="detail">
      <rich-text :nodes="detail"></rich-text>
    </div>

    <div v-if="detail">
      <rich-text :nodes="direction"></rich-text>
    </div>

    <div :class="[ AppIsIpx ? 'isx-btn' : 'btn']" @click="toAuditionCourse">
      <Wbutton text="马上约课" size="size690" bgColor="confirm" />
    </div>
  </div>
</template>

<script>
import {
  mapActions
} from 'vuex'

import WauditionCard from '@/components/yearsCard/auditionCard'
import Wbutton from '@/components/Button'
export default {
  components: {
    WauditionCard,
    Wbutton
  },

  data () {
    return {
      // 试听卡信息
      cardInfo: {},
      detail: '',
      direction: ''
    }
  },

  methods: {
    ...mapActions('auditionCard', [
      'vuexSetAuditionInfo'
    ]),

    async getCardDetail (data) {
      let res = await this.$api.card.cardDetail(data)
      if (res.msg) return
      const regex = new RegExp('<img', 'gi')
      res.deadline = this.$wxApi.getTime(res.deadline)
      this.cardInfo = res
      // this.detail = res.cardType.detail
      // this.direction = res.cardType.direction
      this.direction = res.cardType.direction.replace(regex, `<img style="max-width: 100%;"`)
      this.detail = res.cardType.detail.replace(regex, `<img style="max-width: 100%;"`)
    },

    toAuditionCourse () {
      let data = {
        branchId: this.cardInfo.branchId,
        organizationId: this.cardInfo.organizationId,
        storeId: this.cardInfo.cardType && this.cardInfo.cardType.stores
      }
      this.vuexSetAuditionInfo(data)
      wx.navigateTo({
        url: `../auditionCourse/main`
      })
    },

    initState () {
      this.cardInfo = {}
      this.detail = ''
      this.direction = ''
      this.vuexSetAuditionInfo({
        organizationId: '',
        branchId: ''
      })
    }
  },

  onLoad (options) {
    let { cardId } = options
    let data = {
      cardId: cardId
    }
    this.getCardDetail(data)
  },

  onUnload () {
    this.initState()
  }
}
</script>

<style scoped>
.page {
  margin-top: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-bottom: 300rpx;
}

.card-box {
  margin-bottom: 60rpx;
}

.btn {
  position: fixed;
  bottom: 30rpx;
  left: 30rpx;
  right: 30rpx;
}

.isx-btn {
  position: fixed;
  bottom: 68rpx;
  left: 30rpx;
  right: 30rpx;
}

.info-item {
  width: 630rpx;
  display: flex;
  flex-direction: column;
  margin-bottom: 30rpx;
}

.item-border {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background-color: #dfe6ed;
  margin-right: 20rpx;
}

.item-title-box {
  display: flex;
  align-items: center;
}

.item-title {
  font-size: 28rpx;
  color: #232323;
}

.item-content {
  font-size: 22rpx;
  color: #b2b2b2;
  margin-left: 44rpx;
  margin-top: 10rpx;
}

.detail {
  margin-bottom: 60rpx;
}
</style>
