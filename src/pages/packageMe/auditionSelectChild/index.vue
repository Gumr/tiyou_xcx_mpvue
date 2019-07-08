<template>
  <div class="page">
    <div v-for="(item, index) in childList" :key="index">
      <WchildCard
        :child="item"
        @closeChild="closeChild(item)"
      />
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
import WchildCard from '@/components/audition/childCard'

export default {
  components: {
    WchildCard
  },

  data () {
    return {
      childList: []
    }
  },

  methods: {
    ...mapActions('child', [
      'vuexSetChildInfo'
    ]),

    // 获取我的孩子列表
    async getChild () {
      let res = await this.$api.child.childList()
      if (res.msg) return
      this.childList = res.map(i => ({
        ...i,
        birthday: this.$wxApi.getTime(i.birthday),
        age: i.birthday
      }))
    },

    toFamilyMember () {
      wx.navigateTo({
        url: `../addFamilyMember/main`
      })
    },

    // emit
    closeChild (item) {
      let age = this.$wxApi.getChildYears(item.age)
      let data = {
        childId: item.id,
        name: item.name,
        age
      }
      if (!data.childId) return
      this.vuexSetChildInfo(data)
      wx.navigateBack({})
    },

    initState () {
      this.childList = []
    }
  },

  onUnload () {
    this.initState()
  },

  // onLoad () {
  //   this.getChild()
  // },

  onShow () {
    this.getChild()
  }
}
</script>

<style scoped>
.page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100rpx;
  margin-top: 30rpx;
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
