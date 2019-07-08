<template>
  <div class="warp">
    <div :class="[isPrivateStatus ? 'filter' : '', 'avatar-box']">
      <span class="avatar-bg-l"></span>
      <span class="avatar-bg-c"></span>
      <span class="avatar-bg-r"></span>
      <image v-for="(item, index) in memberData" :key="index" :src="item" class="avatar" :style="{right: (2 - index) * 33 + 'rpx'}">
      </image>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    member: {
      type: Array,
      default: () => ([])
    },
    isPrivate: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      leng: 3,
      default: 'https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_default.png'
    }
  },
  computed: {
    memberData () {
      const memberList = []
      for (let i = 0; i < this.leng; i++) {
        if (this.member[i] === undefined) {
          memberList[this.leng - 1 - i] = this.default
        } else {
          memberList[this.leng - 1 - i] = this.member[i].user && this.member[i].user.avatar
        }
      }
      return memberList
    },
    isPrivateStatus () {
      let status = 0
      status = this.isPrivate
      return status
    }
  },
  onLoad () {
  }
}
</script>

<style scoped>
  .warp {
    overflow: hidden;
  }
  .avatar-box {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 215rpx;
    height: 50rpx;
    opacity: .7;
  }
  .filter {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 215rpx;
    height: 50rpx;
    opacity: .99;
    filter: blur(16rpx);
  }
  .avatar-bg-l {
    position: absolute;
    right: 165rpx;
    width: 48rpx;
    height: 48rpx;
    background-color: #fcfcfc;
    border-radius: 48rpx;
  }
  .avatar-bg-c {
    position: absolute;
    right: 132rpx;
    width: 48rpx;
    height: 48rpx;
    background-color: #f8f8f8;
    border-radius: 48rpx;
  }
  .avatar-bg-r {
    position: absolute;
    right: 99rpx;
    width: 48rpx;
    height: 48rpx;
    background-color: #f0f0f0;
    border-radius: 48rpx;
  }
  .avatar {
    position: absolute;
    /* right: 66rpx; */
    width: 48rpx;
    height: 48rpx;
    border-radius: 48rpx;
    z-index: 0;
  }
  .privacy {
    position: absolute;
    width: 218rpx;
    height: 48rpx;
    backdrop-filter: blur(8px);
    background-color: rgba(255, 255, 255, 0.5);
  }
</style>
