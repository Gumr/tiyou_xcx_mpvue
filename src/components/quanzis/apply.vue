<template>
  <div class="my-wrap">
    <div class="toast-mask" @click="offToast">
    </div>
    <div>
      <scroll-view scroll-y class="toast" v-if="joinType">
        <div class="" v-for="(item, index) in joinQuestionsList" :key="index">
          <div class="questions-title">
            {{ item.questionContent }}
          </div>
          <textarea maxlength="140"
            @input="changeInput(index, $event)"
            @linechange="bindlinechange" 
            fixed="true"
            v-model="list[index]"
            class="toast-text"
            type="text" 
            placeholder-style="color: #b2b2b2" placeholder="请输入文字">
          </textarea>
          <div class="number">
            <span :key="index" :class="[ valueArr[index] > 0 ?'now-number' : 'old-number' ]">{{ valueArr[index] }}</span>/140
          </div>
        </div>
        <div @click="sbumit" class="button">
          <w-button text="提交申请" size="medium" bgColor="black" />
        </div>
        <!-- <div class="questions-title">
          Q:我是第一个?
        </div>
        <textarea fixed="true" v-model=textSecond class="toast-text" type="text" placeholder-style="color: #b2b2b2" placeholder="请输入文字">
        </textarea> -->
      </scroll-view>
      <div v-else class="one-question">
        <div class="questions-title">
          请填写申请理由
        </div>
        <div v-for="(item, index) in 1" :key="index">
          <textarea 
            maxlength="140"
            @input="changeInputOne"
            @linechange="bindlinechange" 
            fixed="true"
            v-model="list[index]"
            class="toast-text"
            type="text" 
            placeholder-style="color: #b2b2b2" placeholder="请输入文字">
          </textarea>
          <div class="number">
            <span :key="index" :class="[valueLength > 0 ?'now-number' : 'old-number']">{{ valueLength }}</span>/140
          </div>
        </div>
        <div @click="sbumit" class="one-button">
          <w-button text="提交申请" size="medium" bgColor="black" />
        </div>
      </div>
      <!-- <button formType="submit"> 提交 </button> -->
    </div>
  </div>
</template>

<script>
import button from '@/components/quanzis/button'

export default {
  props: {
    joinQuestionsList: {
      tyep: Array,
      required: true
    },
    joinType: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      valueLength: 0,
      joinReason: '',
      signIn: false,
      list: [],
      text: [],
      valueArr: [0, 0]
    }
  },

  components: {
    'w-button': button
  },

  methods: {
    sbumit () {
      this.toast = false
      this.signIn = true
      this.$emit('showStoast', this.toast, this.signIn, this.list, this.joinReason)
    },

    changeInput (index, e) {
      this.valueArr[index] = e.mp.detail.cursor
      this.list[index] = e.mp.detail.value
    },

    changeInputOne (e) {
      // 字数
      this.valueLength = e.mp.detail.cursor
      // 值
      this.joinReason = e.mp.detail.value
    },

    bindlinechange () {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].length >= 140) {
          wx.showToast({
            icon: 'none',
            title: '最大字数限制为140字'
          })
        }
      }
    },

    offToast () {
      this.toast = false
      this.$emit('showStoast', this.toast)
    }
  },

  onLoad () {
    this.valueLength = 0
    this.valueArr = [0, 0]
  }
}
</script>

<style scoped>
.my-wrap {
  position: relative;
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
  /* opacity: .99; */
  background-color: #fff;
  /* backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.5); */
  z-index: 50;
}
.toast {
  box-sizing: border-box;
  padding-left: 40rpx;
  position: relative;
  position: fixed;
  top: 60rpx;
  left: 60rpx;
  right: 60rpx;
  /* bottom: 60rpx; */
  z-index: 101;
  width: 630rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  background-color: #fff;
  color: #888;
  box-shadow: 0 16rpx 32rpx -16rpx rgba(0, 0, 0, 0.1);
}
.one-question {
  box-sizing: border-box;
  padding-left: 40rpx;
  right: 40rpx;
  position: fixed;
  top: 180rpx;
  left: 60rpx;
  right: 60rpx;
  width: 630rpx;
  height:560rpx;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  background-color: #fff;
  z-index: 101;
}
.toast-text {
  box-sizing: border-box;
  font-size: 28rpx;
  padding-left: 20rpx;
  padding-right: 20rpx;
  padding-top: 20rpx;
  padding-bottom: 20rpx;
  width: 550rpx;
  height: 360rpx;
  color: #232323;
  background-color: #fff;
  box-shadow: inset 0 4px 4px 0 rgba(0, 0, 0, 0.01);
}
.questions-title {
  box-sizing: border-box;
  padding-left: 20rpx;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  width: 510rpx;
  font-size: 28rpx;
  color: #b2b2b2;
}
.button {
  position: absolute;
  right: 60rpx;
  bottom: -100rpx;
  z-index: 1001;
}
.one-button {
  position: absolute;
  right: 60rpx;
  bottom: -40rpx;
}
.number {
  box-sizing: border-box;
  /* padding-right: 40rpx; */
  width: 510rpx;
  margin-bottom: 30rpx;
  text-align: right;
  font-size: 22rpx;
  color: #eee;
  margin-top: 10rpx;
}
.now-number {
  color: #b2b2b2;
}
.old-number {
  color: #eee;
}
</style>
