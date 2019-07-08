<template>
  <div class="page">
    <div class="title">
      <p class="title-p" @click="selectNoCard(noCard)">不使用卡券</p>
    </div>
    <div v-if="cardList.length" key="hasList"  class="page-card">
      <div v-for="(item, index) in yearsCard" :key="index" @click="selectChild(item.id, index)">
        <WCard
          :card="item"
        />
      </div>
      <div v-for="(item2, index2) in experienceCard" @click="selectExper(item2.id, index2)" :key="index2">
        <WexperienceCard
          :card="item2"
        />
      </div>
      <div class="">
        <p class="not-use">不可用卡券</p>
        <div v-for="(item3, index3) in usedYearsCard" :key="index3">
          <WCard
            :card="item3"
          />
        </div>
        <div v-for="(item4, index4) in usedExperienceCard" :key="index4">
          <WexperienceCard
            :card="item4"
          />
        </div>

        <div v-for="(item5, index5) in auditionList" :key="index5">
          <WauditionCard
            :card="item5"
          />
        </div>
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
import WCard from '@/components/yearsCard/card'
import WexperienceCard from '@/components/yearsCard/experienceCard'
import WauditionCard from '@/components/yearsCard/auditionCard'
import Wbutton from '@/components/Button'
export default {
  components: {
    WCard,
    Wbutton,
    WexperienceCard,
    WauditionCard
  },

  data () {
    return {
      cardList: [],
      // 年卡
      yearsCard: [],
      usedYearsCard: [],
      // 体验卡
      experienceCard: [],
      childId: '',
      noCard: -1,
      usedExperienceCard: [],
      typeList: [],
      // 试听卡
      auditionList: []
    }
  },

  computed: {
    ...mapGetters('card', [
      'vuexGetCardInfo'
    ]),

    ...mapGetters('child', [
      'vuexGetChildInfo'
    ]),

    // 获取数据
    cardInfo () {
      let cardInfo = this.vuexGetCardInfo
      return cardInfo
    }
  },

  methods: {
    ...mapActions('card', [
      'vuexSetCardInfo'
    ]),

    selectChild (id, index) {
      let info = this.yearsCard[index]
      const child = {
        cardId: id,
        cardTypeId: info.cardType.id,
        myCardType: 2
      }
      this.vuexSetCardInfo(child)
      wx.navigateBack({})
    },

    selectExper (id, index) {
      let info = this.experienceCard[index]
      const child = {
        cardId: id,
        cardTypeId: info.cardType.id,
        myCardType: 1
      }
      this.vuexSetCardInfo(child)
      wx.navigateBack({})
    },

    selectNoCard (id) {
      const child = {
        cardId: id,
        cardTypeId: this.typeList[0].id
      }
      this.vuexSetCardInfo(child)
      wx.navigateBack({})
    },

    async myCardList () {
      let res = await this.$api.card.myCardList()
      this.cardList = res.list.map((i) => ({
        ...i,
        deadline: this.$wxApi.getTime(i.deadline),
        myCardCode: i.cardType && i.cardType.code
      }))
      // 可使用年卡（未绑定孩子)
      // this.yearsCard = this.cardList.filter(i => (i.myCardCode === 'TY1002' || i.myCardCode === 'TY1001') && (i.childId === 0 || i.childId === this.childId))
      // 体验卡
      this.experienceCard = this.cardList.filter(i => i.myCardCode === 'TY1003' && i.remainingTimes > 0)
      // 不可用(孩子id过来，除开年卡绑定的孩子，其他绑定都不可以用)
      // this.usedYearsCard = this.cardList.filter(i => (i.myCardCode === 'TY1002' || i.myCardCode === 'TY1001') && i.childId !== this.childId && i.childId !== 0)
      // 不可用体验卡
      // this.usedExperienceCard = this.cardList.filter(i => i.myCardCode === 'TY1003' && i.remainingTimes <= 0)
      // 试听卡不可用
      // this.auditionList = this.cardList.filter(i => i.myCardCode === 'TY1004')
    },

    // 卡类型
    async getCardType () {
      let res = await this.$api.card.cardType()
      if (res.msg) return
      this.typeList = res.list.filter(i => i.code === 'TY1002')
    },

    initState () {
      this.typeList = []
      this.childId = ''
      this.cardList = []
      this.usedYearsCard = []
      this.yearsCard = []
      this.experienceCard = []
      this.usedExperienceCard = []
      this.auditionList = []
    },

    onUnload () {
      this.initState()
    }
  },

  onLoad (options) {
    let { childId } = options
    childId = parseInt(childId, 10)
    this.childId = childId
    this.cardList = []
    this.myCardList()
    this.getCardType()
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
