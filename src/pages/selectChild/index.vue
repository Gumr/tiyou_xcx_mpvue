<template>
  <div class="page">
    <div v-for="(item, index) in childList" :key="index" @click="chooseChlid(item.id, item.age, item.name)">
      <WfamilyMember
        :child="item"
        status="1"
        @delGoods="delGoods"
        @toCardManagement="toCardManagement"
      />
      <!-- @bindCard="bindCard(item.id)" -->
    </div>

    <div class="addUser" @click="toFamilyMember">
      新增家庭成员
    </div>
  </div>
</template>

<script>
import {
  mapActions
} from 'vuex'
import WfamilyMember from '@/components/familyMember/memberCard'

export default {
  components: {
    WfamilyMember
  },

  data () {
    return {
      childList: [],
      cardId: 0
    }
  },

  methods: {
    ...mapActions('child', [
      'vuexSetChildInfo'
    ]),

    async getChild () {
      let res = await this.$api.child.childList()
      if (res.msg) return
      this.childList = res.map(i => ({
        ...i,
        birthday: this.$wxApi.getTime(i.birthday),
        age: i.birthday
      }))
    },

    async delGoods (id) {
      let res = await this.$api.child.delChild(id)
      if (res.msg) return
      this.childList = this.childList.filter(user => user.id !== id)
    },

    toFamilyMember () {
      wx.navigateTo({
        url: `../packageMe/addFamilyMember/main`
      })
    },

    toCardManagement (options) {
      let { childId } = options
      wx.navigateTo({
        url: `../packageMe/cardManagement/main?childId=${childId}`
      })
    },

    bindCard (id) {
      wx.showModal({
        title: '提示',
        content: '孩子信息将与该年卡绑定，不可再用于他人，是否确认绑定？',
        success: (res) => {
          if (res.confirm) {
            let data = {
              cardId: this.cardId,
              childId: id
            }
            this.$api.card.bindChild(data)
              .then((r) => {
                if (r.msg) return
                wx.showToast({
                  title: '绑定成功',
                  icon: 'none'
                })
              })
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    chooseChlid (id, birthday, name) {
      let age = this.$wxApi.getChildYears(birthday)
      const child = {
        childId: id,
        age,
        name
      }
      this.vuexSetChildInfo(child)
      wx.navigateBack({})
    }
  },

  onLoad (options) {
    if (options.cardId) {
      const { cardId } = options
      this.cardId = parseInt(cardId, 10)
    }
    // this.getChild()
  },

  onShow () {
    this.getChild()
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60rpx;
  margin-bottom: 60rpx;
}

.addUser {
  width: 622rpx;
  height: 100rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
  line-height: 100rpx;
  text-align: center;
  font-size: 28rpx;
  letter-spacing: 0.2rpx;
  color: #ffcd76;
}
</style>
