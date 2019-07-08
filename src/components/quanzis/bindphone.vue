<template>
  <div class="my-wrap">
    <div class="toast-mask" @click="offToast">
    </div>
    <div class="toast">
      <div v-if="textPhone">
        <div class="toast-title">
          验证手机
        </div>
        <input v-model="phone" class="input" maxlength="11" type="text" placeholder-style="opacity: 0.2" placeholder="请输入手机号码"/>
        <div @click="sendCode" class="button">
          <w-button text="发送验证码" size="medium" bgColor="black"></w-button>
        </div>
      </div>
      <div v-else>
        <div class="toast-title">
          输入六位验证码
        </div>
        <div class="writeCode">
          <div @click="writeCode" v-for="(item, index) in length" :key="index" :class="[value.length === index ? 'nowInput' : 'codeBox']">
            <input class="codeInput" type="text" disabled="true" :value="value.length >= index + 1 ? value[index] : ''"/>
          </div>
          <input class="ipt" type="text" :focus="isFocus" @blur="isBlur" :maxlength="maxlength" @input="setInputValue">
        </div>
        <div @click="sendCode" class="button">
          <w-button :text="sendCodetext" size="medium" :bgColor="sendPhoneCode ? 'black' : 'gray'"></w-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import button from '@/components/quanzis/button'

export default {
  data () {
    return {
      black: 'black',
      gray: 'gray',
      sendCodetext: '120s 后可重发',
      length: 6,
      isFocus: false,
      value: '',
      maxlength: -1,
      text: '',
      signIn: false,
      textPhone: true,
      phone: '',
      timer: null,
      code: '',
      time: 120,
      sendPhoneCode: true
    }
  },

  components: {
    'w-button': button
  },

  methods: {
    setToken (token) {
      try {
        wx.setStorageSync('token', token)
        wx.setStorageSync('phone', 'ok')
      } catch (e) {
      }
    },
    setInputValue (e) {
      this.value = e.mp.detail.value
      let reg = /^[0-9]*$/
      if (this.value.length >= 6) {
        if (!reg.test(this.value)) {
          wx.showToast({
            icon: 'none',
            title: '请输入正确的验证码'
          })
        } else {
          const _bindPhoneNoToken = wx.getStorageSync('bindPhoneNoToken')
          if (!_bindPhoneNoToken) {
            wx.showToast({
              icon: 'none',
              title: '绑定码已无效，请清除小程序内存重新登陆'
            })
            wx.removeStorageSync('bindPhoneNoToken')
            return
          }
          const data = {
            bindPhoneNoToken: _bindPhoneNoToken,
            fromSms: {
              countryCode: 86,
              phoneNo: this.phone,
              smsCode: this.value
            }
          }
          this.$api.auth.bindPhoneNo(data)
            .then((res) => {
              if (res.error) {
              } else {
                // 弹窗状态
                let login = true
                let toast = false
                this.setToken(res.token)
                this.$emit('sendCode', toast, login)
              }
            })
        }
      }
    },

    isBlur () {
      this.isFocus = false
    },

    writeCode () {
      this.isFocus = true
    },

    sendCode () {
      if (this.sendPhoneCode === false) return
      let reg = 11 && /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (!reg.test(this.phone)) {
        wx.showToast({
          icon: 'none',
          title: '请输入正确的手机号'
        })
      } else {
        this.$api.auth.smsCode(this.phone)
          .then((res) => {
            if (res.error) {
            } else {
              this.textPhone = false
              this.sendPhoneCode = false
              this.timer = setInterval(this.countDown, 1000)
            }
          })
      }
      // this.$emit('sendCode', this.toast, this.signIn, this.text)
    },

    offToast () {
      // 弹窗
      let toast = false
      this.$emit('sendCode', toast)
    },

    countDown () {
      this.sendCodetext = this.time + 's 后可重发'
      if (this.time - 1 === 0) {
        clearInterval(this.timer)
        this.time = 120
        this.sendCodetext = '重新发送'
        this.sendPhoneCode = true
      } else {
        this.time--
      }
    }
  },
  onUnload () {
    this.textPhone = true
    this.sendPhoneCode = true
  },
  onLoad () {
  }
}
</script>

<style scoped>
.iconfont {
  font-family: iconfont;
}
.my-wrap {
  position: relative;
  width: 750rpx;
  height: 100%;
}
.toast-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
  /* opacity: 1; */
  background-color: #fff;
  z-index: 100;
}
.toast {
  position: fixed;
  width: 630rpx;
  height: 348rpx;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 101;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  z-index: 101;
}
.button {
  position: absolute;
  bottom: -40rpx;
  right: 60rpx;
}
.input {
  width: 570rpx;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 34rpx;
  background-color: #fff;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 60rpx;
  text-align: center;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  font-family: PingFangSC;
}
.toast-title {
  width: 510rpx;
  height: 48rpx;
  line-height: 48rpx;
  font-size: 34rpx;
  color: #232323;
  font-weight: 500;
  margin-bottom: 60rpx;
  margin-top: 30rpx;
}
.writeCode {
  width: 570rpx;
  height: 100rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 60rpx;
}
.codeBox {
  width: 70rpx;
  height: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* box-shadow: 0 8rpx 16rpx -8rpx #76bdec; */
  box-shadow: 0 8rpx 16rpx -8rpx rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  text-align: center;
  /* border: solid 0 #b7dcf5; */
}
.nowInput {
  width: 70rpx;
  height: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 16rpx -8rpx #76bdec;
  background-color: #ffffff;
  text-align: center;
}

.ipt {
  width: 0;
  height: 0;
}
</style>
