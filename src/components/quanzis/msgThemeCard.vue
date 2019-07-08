<template>
  <div class="wrap">
    <!-- <div v-if="applyToast">
      <w-apply @showStoast="showStoast" :joinQuestionsList="joinQuestionsList" :joinType="joinType"></w-apply>
    </div> -->
    <div class="box-title">
      <span class="circle-title">{{data.name}}</span>
      <div class="img-box">
        <image class="img" :src="data.cover" />
        <!-- <div class="img-msask">
        </div> -->
      </div>
    </div>
    <div class="intro-box">
      <w-circle-intro :circleCesc="data.desc"></w-circle-intro>
    </div>
    <div class="admin">
      <w-admin :user="data.administrator || {}"></w-admin>
    </div>
    <div class="member">
      <div class="number-key">
        <span class="item-key">圈成员</span>
        <span class="item-number">
          <span>(</span>
          <span class="member-color">{{data.members && data.members.count}}</span>
          <span>)</span>
        </span>
      </div>
      <div>
        <w-member :member="data.members && data.members.rows || []"></w-member>
      </div>
    </div>
    <div class="btn" @click="joinCircle">
      <w-button :text="textName" size="medium" bgColor="black"></w-button>
    </div>
  </div>
</template>

<script>
import WcircleIntro from '@/components/quanzis/circleIntro'
import WadminAvatar from '@/components/quanzis/adminAvatar'
import Wmember from '@/components/quanzis/member'
import Wapply from '@/components/quanzis/apply'
import Wbutton from '@/components/quanzis/button'
import {
  mapActions
} from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      applyToast: false,
      token: false,
      joinType: 0,
      joinQuestionsList: []
    }
  },
  components: {
    'w-circle-intro': WcircleIntro,
    'w-admin': WadminAvatar,
    'w-member': Wmember,
    'w-apply': Wapply,
    'w-button': Wbutton
  },
  computed: {
    textName () {
      let name = '申请加入'
      if (this.data.joinStatus === 2) {
        name = '待审核'
      }
      if (this.data.joinType === 1) {
        name = '加入'
      }
      return name
    }
  },
  methods: {
    ...mapActions([
      'setStatus'
    ]),
    joinCircle () {
      if (this.data.joinStatus === 2) return
      if (this.data) {
        if (this.data.joinQuestions) {
          this.joinQuestionsList = this.data.joinQuestions
          this.joinType = this.data.joinType
        }
        if (this.joinQuestionsList.length === 0) {
          this.joinType = 0
        }
      }
      // 自由加入
      if (this.data.joinType === 1) {
        this.$quanzis.api.circle.circleJoin(this.data.id)
          .then(res => {
            if (res.error) {
              wx.showToast({
                icon: 'none',
                title: res.error.msg
              })
            } else {
              this.setStatus(true)
              wx.showToast({
                title: '申请成功'
              })
              wx.redirectTo({
                url: `../qz-circle/main?id=${this.data.id}`
              })
            }
          })
      } else {
        wx.navigateTo({
          url: `../qz-apply/main?circleId=${this.data.id}`
        })
        // this.applyToast = true
      }
    },
    showStoast (toast, signInStatus, applyList, joinReason) {
      if (signInStatus) {
        const joinAnswers = []
        for (let i = 0; i < this.data.joinQuestions.length; i++) {
          let questionId = this.data.joinQuestions[i].id
          joinAnswers.push({
            'answer': applyList[i],
            'questionId': questionId
          })
        }
        let data = {}
        const joinId = this.data.id
        if (this.data.joinQuestions.length === 0) {
          data = {
            joinReason: joinReason
          }
        } else {
          data = {
            joinAnswers
          }
        }
        this.$quanzis.api.circle.circleJoin(joinId, data)
          .then(res => {
            if (res.error) {
              wx.showToast({
                title: res.error.msg
              })
            } else {
              wx.showToast({
                title: '申请成功'
              })
              this.data.joinStatus = 2
              // wx.redirectTo({
              //   url: `../qz-circle/main?id=${this.data.id}`
              // })
            }
          })
      }
      this.applyToast = toast
    }
  },
  onLoad () {}
}
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 630rpx;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  border-top-right-radius: 100rpx;
}
.box-title {
  width: 540rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 60rpx;
}
.img-box {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  position: relative;
  /* background-color: #fff; */
  overflow: hidden;
}
.circle-title {
  font-size: 34rpx;
  color: #232323;
}
/* .img-msask {
  position: absolute;
  top: 0;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background-color: #fff;
  opacity: .9;
} */
.img {
  width: 100rpx;
  height: 100rpx;
  /* border-radius: 50%; */
  border-radius: 50rpx;
  filter: blur(32rpx);
  overflow: hidden;
}
.admin {
  margin-top: 30rpx;
}
.member {
  width: 570rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  margin-top: 30rpx;
  margin-bottom: 60rpx;
}
.item-key {
  color: #b2b2b2;
}
.item-number {
  margin-left: 30rpx;
}
.member-color {
  color: $decorateColor;
}
.btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 570rpx;
  margin-bottom: 30rpx;
  background-color: #fff;
}
.test {
  width: 750rpx;
  height: 10000rpx;
  opacity: 0.4;
  position: fixed;
  top: 0;
  z-index: 9999;
}
</style>
