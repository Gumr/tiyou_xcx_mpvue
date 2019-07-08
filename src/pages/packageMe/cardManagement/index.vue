<template>
  <div class="page">
    <div v-if="cardList.length" key="hasList">
      <!-- <div v-for="(item, index) in yearsCard" :key="index" @click="toSelectChild(item.id)"> -->
      <div v-for="(item, index) in yearsCard" :key="index">
        <WCard
          :card="item"
        />
      </div>
      <div v-for="(item2, index2) in experienceCard" :key="index2">
        <WexperienceCard 
          :card="item2"
        />
      </div>

      <div v-for="(item3, index3) in auditionList" :key="index3" @click="toAudition(item3.id)">
        <WauditionCard
          :card="item3"
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
    <div class="btn">
      <div @click="toBuyCard">
        <Wbutton text="购买" size="size330" bgColor="confirm" />
      </div>
      <div @click="toSendCard">
        <Wbutton text="兑换" size="size330"
        bgColor="white-confirm" />
      </div>
    </div>
  </div>
</template>

<script>
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
      // 体验卡
      experienceCard: [],
      childId: '',
      auditionList: []
    }
  },

  methods: {
    toSelectChild (id) {
      // 如果是从孩子页面过来，直接绑卡
      if (this.childId) {
        this.bindCard(this.childId, id)
      } else {
        wx.navigateTo({
          url: `../../yearsCardDetail/main?cardId=${id}`
        })
      }
    },

    toAudition (id) {
      wx.navigateTo({
        url: `../auditionCardDetail/main?cardId=${id}`
      })
    },

    bindCard (id, cardId) {
      wx.showModal({
        title: '提示',
        content: '孩子信息将与该年卡绑定，不可再用于他人，是否确认绑定？',
        success: (res) => {
          if (res.confirm) {
            let data = {
              cardId,
              childId: id
            }
            this.$api.card.bindChild(data)
              .then((r) => {
                if (r.msg) return
                wx.showToast({
                  title: '绑定成功',
                  icon: 'none'
                })
                wx.navigateBack({})
              })
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    async myCardList () {
      let res = await this.$api.card.myCardList()
      if (res.msg) return
      this.cardList = res.list.map((i) => ({
        ...i,
        deadline: this.$wxApi.getTime(i.deadline),
        myCardCode: i.cardType && i.cardType.code,
        cardType: i.cardType
      }))
      // 1 TY1001 无限科学年卡 999 699 无限次 一年 无限制 需要 适用于科学大类；
      // 2 TY1002 科学年卡 999 699 18次 一年 无限制 需要  适用于科学大类；
      // 3 TY1003 科学体验卡 198 99 1次 1张 不需要 适用于科学大类；
      // 4 TY1004 试听卡 198 99 1次 1张 不需要 适用于试听活动大类；
      this.yearsCard = this.cardList.filter(i => (i.myCardCode === 'TY1002' || i.myCardCode === 'TY1001') && i.remainingTimes >= 1)
      this.experienceCard = this.cardList.filter(i => i.myCardCode === 'TY1003' && i.remainingTimes >= 1)
      // 试听卡
      this.auditionList = this.cardList.filter(i => i.remainingTimes > 0 && i.cardType && i.cardType.topCategories && i.cardType.topCategories[0] && i.cardType.topCategories[0].id === 3)
    },

    toBuyCard () {
      // to 购买课时
      wx.navigateTo({
        url: `../buyLesson/main`
      })
    },

    toSendCard () {
      wx.navigateTo({
        url: `../sendCard/main`
      })
    },

    setToken (data) {
      const { token = '', sessionKey = '', phoneNo } = data
      wx.setStorageSync('token', token)
      wx.setStorageSync('sessionKey', sessionKey)
      this.phone = !phoneNo
    },

    initState () {
      this.childId = ''
      this.cardList = []
      this.auditionList = []
    },

    onUnload () {
      this.initState()
    }
  },

  onLoad (options) {
    const { childId } = options
    this.childId = parseInt(childId, 10)
    this.cardList = []
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          let _token = wx.getStorageSync('token')
          if (!_token) {
            this.$wxLogin.wxLogin(this)
          } else {
            this.myCardList()
          }
        } else {
          wx.redirectTo({
            url: `../../login/main?pageType=13`
          })
        }
      }
    })
  }
}
</script>

<style scoped>
.page {
  margin-top: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 200rpx;
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
  /* background-color: #fff; */
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
</style>
