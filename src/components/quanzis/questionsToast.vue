<template>
  <div class="my-wrap">
    <div class="toast-mask" @click="offToast">
    </div>
    <scroll-view scroll-y class="toast" v-if="arrStatus" :key="arr">
      <div class="toast-title">参加挑战</div>
      <div v-for="(item, index) in list" :key="index">
        <div class="questions-title">
          {{ item.questionContent }}
        </div>
        <textarea maxlength="140" @input="changeInput(index, $event)" @linechange="bindlinechange" 
          fixed="true" v-model="answers[index]" class="toast-text" type="text" 
          placeholder-style="color: #b2b2b2" placeholder="请输入文字">
        </textarea>
        <div class="number">
          <span :key="index" :class="[ valueArr[index] > 0 ?'now-number' : 'old-number' ]">{{ valueArr[index] }}</span>/140
        </div>
      </div>
      <div @click="sbumit" class="button">
        <w-button text="提交答案" size="medium" bgColor="black" />
      </div>
    </scroll-view>
    <!-- 只有一个问题时 -->
    <div class="one-question" v-else :key="one">
      <div class="toast-title">参加挑战</div>
      <div v-for="(item, index) in list" :key="index">
        <div class="questions-title">
          {{ item.questionContent }}
        </div>
        <textarea maxlength="140" @input="changeInputOne" @linechange="bindlinechange" 
          fixed="true" v-model="answers[index]" class="toast-text" type="text" 
          :key="index"
          placeholder-style="color: #b2b2b2" placeholder="请输入文字">
        </textarea>
        <div class="number">
          <span :key="index" :class="[valueLength > 0 ?'now-number' : 'old-number']">{{ valueLength }}</span>/140
        </div>
      </div>
      <div @click="sbumit" class="one-button">
        <w-button text="提交答案" size="medium" bgColor="black" />
      </div>
    </div>
  </div>
</template>

<script>
import button from '@/components/quanzis/button'

export default {
  props: ['list'],
  data () {
    return {
      answers: [],
      valueLength: 0,
      status: false,
      valueArr: [0, 0]
    }
  },

  components: {
    'w-button': button
  },
  computed: {
    arrStatus () {
      return this.list[1]
        ? 1
        : 0
    }
  },
  methods: {
    changeInput (index, e) {
      this.valueArr[index] = e.mp.detail.cursor
    },
    changeInputOne (e) {
      this.valueLength = e.mp.detail.cursor
    },
    bindlinechange () {
      for (let i = 0; i < this.answers.length; i++) {
        if (this.answers[i].length >= 140) {
          wx.showToast({
            icon: 'none',
            title: '最大字数限制为140字'
          })
        }
      }
    },
    sbumit () {
      const list = this.list.map((item, index) => ({
        questionId: item._id,
        textAnswer: this.answers[index]
      }))
      this.status = true
      this.$emit('showStoast', list, this.status)
      // this.$emit('submit', list)
      // this.offToast()
    },

    offToast () {
      this.$emit('showStoast', 'list', this.status)
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
  /* backdrop-filter: blur(8px); */
  background: #fff;
  /* background-color: rgba(255, 255, 255, 0.5); */
  z-index: 100
}
.toast {
  box-sizing: border-box;
  padding-left: 40rpx;
  position: relative;
  position: fixed;
  top: 60rpx;
  left: 60rpx;
  right: 60rpx;
  bottom: 60rpx;
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
  height: 650rpx;
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
.toast-title {
  box-sizing: border-box;
  padding-left: 20rpx;
  margin-top: 40rpx;
  width: 510rpx;
  text-align: left; 
  font-size: 34rpx;
  font-weight: 500;
  color: #232323;
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
