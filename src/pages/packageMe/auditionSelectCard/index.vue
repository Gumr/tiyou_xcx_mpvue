<template>
  <div class="page">
    <div class="title">
      <p class="title-p" @click="selectNoCard(noCard)">不使用卡券</p>
    </div>
    <div v-if="auditionList.length" key="hasList"  class="page-card">
      <div v-for="(item, index) in auditionList" :key="index" @click="selectExper(item.id, index)">
        <WauditionCard
          :card="item"
        />
      </div>
    </div>
    <div v-else key="noList">
      <image mode='aspectFit'
        class="img-default"
        src="https://api.tiyou.techoiceness.com/v1/static/images/no_card.png"
      />
      <div class="default-text">
        暂无卡劵
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import WauditionCard from '@/components/yearsCard/auditionCard'
export default {
  components: {
    WauditionCard
  },

  data () {
    return {
      cardList: [],
      // 试听卡
      auditionList: []
    }
  },

  computed: {
    ...mapGetters('card', [
      'vuexGetCardInfo'
    ])
  },

  methods: {
    ...mapActions('card', [
      'vuexSetCardInfo'
    ]),

    selectExper (id, index) {
      let info = this.auditionList[index]
      const card = {
        cardId: id,
        cardTypeId: info.cardType.id
      }
      this.vuexSetCardInfo(card)
      wx.navigateBack({})
    },

    selectNoCard () {
      const card = {
        cardId: -1
      }
      this.vuexSetCardInfo(card)
      wx.navigateBack({})
    },

    async myCardList () {
      let res = await this.$api.card.myCardList()
      this.cardList = res.list.map((i) => ({
        ...i,
        deadline: this.$wxApi.getTime(i.deadline),
        cardType: i.cardType
      }))
      // 试听卡
      // let arr = r.list.filter(i => i.remainingTimes > 0 && i.childId === 0 && i.cardType.topCategories[0] && i.cardType.topCategories[0].id === 3)
      this.auditionList = this.cardList.filter(i => i.remainingTimes > 0 && i.cardType && i.cardType.topCategories && i.cardType.topCategories[0] && i.cardType.topCategories[0].id === 3)
    },

    initState () {
      this.cardList = []
      this.auditionList = []
    },

    onUnload () {
      this.initState()
    }
  },

  onLoad () {
    this.cardList = []
    this.myCardList()
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 200rpx;
}

.page-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 200rpx;
}

.title {
  margin: 30rpx 58rpx 60rpx 60rpx;
  width: 632rpx;
  height: 100rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
}
.title-p {
  width: 632rpx;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 28rpx;
  letter-spacing: 0.2px;
  text-align: center;
  color: #ffcd76;
}

.btn {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
  padding: 30rpx 30rpx 68rpx 30rpx;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  z-index: 1000;
}

.img-default {
  margin-top: 120rpx;
  width: 400rpx;
  height: 300rpx;
}

.default-text {
  margin-top: 30rpx;
  font-size: 34rpx;
  font-weight: 500;
  color: #eee;
  text-align: center;
}

.not-use {
  width: 630rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #c8d2dc;
  margin-bottom: 30rpx;
}
</style>
