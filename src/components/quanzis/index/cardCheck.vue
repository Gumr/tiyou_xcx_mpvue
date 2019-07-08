<template>
  <div class="card-check-warp">
    <div class="card"  v-for="(item, index) in noJoinData" :key="index">
      <div class="img-box">
        <image mode="aspectFill" class="img" :src='item && item.cover' />
        <div class="mask">
          <div class="status-box">
            <div class="left-t"></div>
            <image class="status" src="https://api.tiyou.techoiceness.com/v1/static/qz-images/img_statusbg.png" />
            <div class="status-title">
              待审核
            </div>
          </div>
          <div class="title-box">
            <span class="title">
              {{ item && item.name }}
            </span>
            <span class="title-r"></span>
          </div>
          <div class="msg">
            <div class="member-box">
              <span class="member">成员</span>
              <span class="member-munber">{{ item && item.memberCount }}</span>
            </div>
            <div class="message-box">
              <span class="message">信息</span>
              <span class="message-munber">{{ item && item.infoCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import member from '@/components/quanzis/member'
export default {
  props: ['noJoinData'],
  components: {
    'member': member
  },

  data () {
    return {
    }
  },

  methods: {
    // toCircle (id) {
    //   wx.navigateTo({
    //     url: `../qz-circle/main?id=${id}`
    //   })
    // }
  },

  created () {
  }
}
</script>

<style scoped>
  .card {
    position: relative;
    width: 690rpx;
    height: 300rpx;
    margin-bottom: 60rpx;
    /* border-radius: 16rpx; */
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 16rpx 32rpx -16rpx rgba(0, 0, 0, 0.1);
  }
  .mask {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 350rpx;
    height: 300rpx;
    /* background-color: red; */
    /* backdrop-filter: blur(3.7px); */
    background-color: #fff;
    z-index: 9999;
    /* background-image: linear-gradient(98deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7) 0, #ffffff 51%, #ffffff); */
  }
  .left-t {
    position: absolute;
    top: 0;
    right: 300rpx;
    width: 100rpx;
    height: 300rpx;
    transform: skew(-18deg);
    box-shadow: -8rpx 0 16rpx 0 rgba(0, 0, 0, 0.2);
    background-color: #fff;
  }
  .img-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 690rpx;
    height: 300rpx;
    display: inline-block
  }
  .img {
    width: 400rpx;
    height: 300rpx;
    filter: blur(8rpx);
  }
  .status-box {
    position: relative;
  }
  .status {
    margin-right: 40rpx;
    width: 160rpx;
    height: 60rpx;
  }
  .status-title {
    position: absolute;
    top: 0;
    width: 160rpx;
    height: 36rpx;
    text-align: center;
    font-size: 26rpx;
    color: #fff;
    margin-top: 10rpx;
  }
  .avatar-box {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    margin-right: 40rpx;
    margin-top: 40rpx;
    width: 215rpx;
    height: 50rpx;
    opacity: .7;
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
  .avatar1 {
    position: absolute;
    right: 66rpx;
    width: 48rpx;
    height: 48rpx;
    border-radius: 48rpx;
  }
  .avatar2 {
    position: absolute;
    right: 33rpx;
    width: 48rpx;
    height: 48rpx;
    border-radius: 48rpx;
  }
  .avatar3 {
    position: absolute;
    right: 0;
    width: 48rpx;
    height: 48rpx;
    border-radius: 48rpx;
    opacity: .7;
  }
  .title-box {
    box-sizing: border-box;
    width: 690rpx;
    height: 48rpx;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: 90rpx;
    padding-right: 40rpx;
  }
  .title {
    height: 48rpx;
    font-size: 34rpx;
    margin-right: 20rpx;
    color: #b2b2b2;
  }
  .title-r {
    width: 8rpx;
    height: 40rpx;
    border-radius: 4rpx;
    background-color: #b2b2b2;
  }
  .msg {
    box-sizing: border-box;
    margin-right: 40rpx;
    margin-top: 6rpx;
    width: 690rpx;
    height: 36rpx;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    font-size: 26rpx;
    color: #b2b2b2;
  }
  .member-box {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-right: 30rpx;
  }
  .message-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
  .member {
    height: 36rpx;
    margin-right: 10rpx;
  }
  .member-munber {
    height: 36rpx;
    text-align: right;
  }
  .message {
    height: 36rpx;
    margin-right: 10rpx;
  }
  .message-munber {
    height: 36rpx;
    text-align: right;
  }
</style>
