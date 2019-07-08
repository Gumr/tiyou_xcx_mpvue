<template>
  <div class="page">
    <div class="avatar-box">
      <image mode='aspectFill'
        class="avatar"
        :src="userInfo.avatar"
      />
    </div>

    <div class="info-item">
      <span class="border"></span>
      <span class="item-title">昵称</span>
      <span class="item-value">{{ userInfo.nickname }}</span>
    </div>

    <div class="info-item">
      <span class="border"></span>
      <span class="item-title">UID</span>
      <span class="item-value">{{ userInfo.id }}</span>
    </div>

    <div class="info-item">
      <span class="border"></span>
      <span class="item-title">手机号码</span>
      <span class="item-value">{{ userInfo.phoneNo || '未绑定' }}</span>
    </div>

    <!-- 家庭关系 -->
    <div class="family">
      <div class="family-top">
        <span class="border"></span>
        <span class="item-title">家庭关系</span>
      </div>

      <div v-for="(item, index) in childList" :key="index" @click="toChildDetail(item.id)">
        <WfamilyMember
          :child="item"
          @delGoods="delGoods"
          @toCardManagement="toCardManagement"
        />
      </div>

      <div class="addUser" @click="toFamilyMember">
        新增家庭成员
      </div>
    </div>
  </div>
</template>

<script>
import WfamilyMember from '@/components/familyMember/memberCard'

export default {
  components: {
    WfamilyMember
  },

  data () {
    return {
      userInfo: {
        nickname: '体游',
        id: '',
        phoneNo: '',
        avatar: 'https://api.tiyou.techoiceness.com/v1/static/images/img_6.png'
      },
      childList: []
    }
  },

  onPullDownRefresh: function () {
    this.getUserInfo()
    wx.stopPullDownRefresh()
  },

  methods: {
    toFamilyMember (options) {
      wx.navigateTo({
        url: `../addFamilyMember/main`
      })
    },

    async getUserInfo () {
      let res = await this.$api.my.profile()
      if (res.msg) {
        return
      }
      this.userInfo = res
      this.childList = res.children.map(i => ({
        ...i,
        birthday: this.$wxApi.getTime(i.birthday)
      }))
    },

    // async getChild () {
    //   let res = await this.$api.child.childList()
    //   if (res.msg) return
    //   this.childList = res
    // },

    toChildDetail (id) {
      wx.navigateTo({
        url: `../addFamilyMember/main?childId=${id}`
      })
    },

    async delGoods (id) {
      let res = await this.$api.child.delChild(id)
      if (res.msg) return
      this.childList = this.childList.filter(user => user.id !== id)
    },

    toCardManagement (options) {
      let { childId } = options
      wx.navigateTo({
        url: `../cardManagement/main?childId=${childId}`
      })
    }
  },

  onShow () {
    this.getUserInfo()
  },

  onLoad () {
    // this.getChild()
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 60rpx
}

.avatar-box {
  margin-top: 60rpx;
  margin-bottom: 60rpx;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
}

.info-item {
  width: 690rpx;
  height: 100rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 30rpx;
  display: flex;
  align-items: center;
  font-size: 28rpx;
}

.border {
  width: 4rpx;
  height: 24rpx;
  border-radius: 4rpx;
  background-color: #ffcd76;
  margin-right: 20rpx;
}

.item-title {
  color: #b2b2b2;
}

.item-value {
  flex: auto;
  width: 360rpx;
  overflow: hidden;
  color: #232323;
  text-align: right;
}

.family {
  width: 690rpx;
  box-sizing: border-box;
  padding: 30rpx;
}

.family-top {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  margin-bottom: 30rpx;
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
