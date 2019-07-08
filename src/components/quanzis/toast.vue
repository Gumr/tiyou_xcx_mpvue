<template>
  <div class="my-wrap">
    <div class="toast-mask" @click="offToast">
    </div>
    <div class="toast">
      <div class="toast-title">打卡内容</div>
      <div class="toast-text">
        <textarea class="text" @input="changeInput" maxlength="140" v-model='text'          fixed="true" type="text" 
          placeholder-style="color: #b2b2b2" placeholder="请输入你的打卡内容">
        </textarea>
      </div>
      <div class="number">
        <span :class="[valueLength > 0 ?'now-number' : 'old-number']">
          {{ valueLength }}</span>/140
      </div>
      <div class="img-box" v-if="paths.length <= 0" key="no-paths" >
        <span class="iconfont icon-ic_photo" @click="chooseImage"></span>
      </div>
      <div v-else key="paths" class="paths-box">
        <div v-for="(item, index) in paths" :key="index">
          <image mode="aspectFill" :src="item" class="img" />
          <div class="mask" @click="lookImg(index)">
            <span class="iconfont choseVoice icon-ic_close" @click.stop="closeImage(index)"></span>
          </div>
        </div>
      </div>
      <div @click.stop="sbumit" class="btn">
        <w-button text="确认打卡" size="medium" bgColor="black"></w-button>
      </div>
    </div>
  </div>
</template>

<script>
import button from '@/components/quanzis/button'

export default {
  data () {
    return {
      text: '',
      valueLength: 0,
      signIn: false,
      paths: [],
      upload: []
    }
  },

  components: {
    'w-button': button
  },

  methods: {
    // 选择图片
    async chooseImage () {
      const data = {
        len: this.paths
      }
      let img = await this.$quanzis.wxApi.wxChooseImage(data)
      this.paths = img
      const p = this.paths.map((path, index) => {
        return this.$quanzis.wxApi.upLoadImg(path)
      })
      this.upload = await Promise.all(p)
    },

    // 预览
    lookImg (index) {
      this.$quanzis.wxApi.wxLookImg({
        index: index,
        files: this.paths
      })
    },

    closeImage (index) {
      this.paths.splice(index, 1)
      this.upload.splice(index, 1)
    },

    sbumit () {
      if (this.text.length === 0) {
        this.text = ''
      }
      this.toast = false
      this.signIn = true
      // if (this.upload === 0) {
      //   this.upload = []
      // }
      this.$emit('signIn', this.toast, this.signIn, this.text, this.upload)
    },

    offToast () {
      this.toast = false
      this.signIn = false
      this.$emit('signIn', this.toast, this.signIn)
    },

    changeInput (e) {
      this.valueLength = e.mp.detail.cursor
    }
  },

  onLoad () {
    this.text = ''
    this.valueLength = 0
    this.paths = []
    this.upload = []
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
  background-color: #fff;
  /* backdrop-filter: blur(32rpx);
  filter: blur(32rpx); */
  /* background-image: linear-gradient(rgba(255, 255, 255, 0), #ffffff 100%, #ffffff); */
  z-index: 11000;
}
.toast {
  position: fixed;
  top: 120rpx;
  left: 60rpx;
  right: 60rpx;
  z-index: 101;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;
  width: 630rpx;
  /* height: 610rpx; */
  font-size: 28rpx;
  background-color: #fff;
  box-shadow: 0 16rpx 32rpx -16rpx rgba(0, 0, 0, 0.1);
  z-index: 11001;
}
.toast-title {
  box-sizing: border-box;
  padding-left: 60rpx;
  margin-top: 40rpx;
  margin-bottom: 40rpx;
  width: 630rpx;
  text-align: left; 
  font-size: 34rpx;
  font-weight: 500;
  color: #232323;
}
.toast-text {
  box-sizing: border-box;
  padding-left: 20rpx;
  padding-right: 20rpx;
  padding-top: 20rpx;
  width: 550rpx;
  height: 360rpx;
  color: #232323;
  background-color: #fff;
  box-shadow: inset 0 8rpx 8rpx 0 rgba(0, 0, 0, 0.01);
  z-index: 11002;
  margin-bottom: 10rpx;
}
.btn {
  position: absolute;
  right: 60rpx;
  bottom: -40rpx;
  z-index: 11003;
}
.text {
  width: 530rpx
}
.number {
  box-sizing: border-box;
  padding-right: 40rpx;
  width: 630rpx;
  margin-bottom: 30rpx;
  text-align: right;
  font-size: 22rpx;
  color: #eee;
  margin-bottom: 60rpx;
}
.now-number {
  color: #b2b2b2;
}
.old-number {
  color: #eee;
}

.img-box {
  width: 550rpx;
  padding-left: 20rpx;
  padding-bottom: 186rpx;
}

.img {
  width: 200rpx;
  height: 200rpx;
}

.paths-box {
  position: relative;
  width: 550rpx;
  padding-left: 20rpx;
  padding-bottom: 80rpx;
}

.mask {
  text-align: right;
  position: absolute;
  top: 0;
  width: 200rpx;
  height: 200rpx;
  background-color: #000;
  opacity: .1;
}
</style>
