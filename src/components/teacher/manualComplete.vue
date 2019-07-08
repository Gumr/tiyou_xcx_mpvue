<template>
  <div class="code">
    <div class="mask"></div>
    <div class="content">
      <div class="title">
        VERIFICATION
      </div>
      <image mode='aspectFill'
        v-if="isPackage"
        key="isPackage"
        class="close-img"
        src="../../../static/icon/photo_close.png"
      />
      <image mode='aspectFill'
        v-else
        key="not-package"
        class="close-img"
        src="../../static/icon/photo_close.png"
      />
      <div class="click-close" @click.stop="closeToast">
      </div>
      <div class="code-text">
        请进行手动核销
      </div>
      <div class="code-desc">
        （请确认学员已到场）
      </div>
      <div>
        <scroll-view
          scroll-y
          class="scroll"
        >
        <div v-for="(item, index) in courseOrders" :key="index" class="item-box">
          <div class="user-box" v-if="item.child && item.child.id && item.status === 3" @click="changeStatus(item.child.id, index)">
            <image mode='aspectFill'
              class="avatar"
              :src='item.child && item.child.avatar || defaultImg'
            />
            <div class="child-name">{{ item.child && item.child.name }} 
              ({{item.child && item.child.birthday}}岁)
            </div>
            <image mode='aspectFill'
              class="selected-img"
              :src="childStatusArr[index] && childStatusArr[index].childStatus  ? '../../../static/icon/ic_selected.png' : '../../../static/icon/ic_select.png'"
            />
          </div>
        </div>
        </scroll-view>
      </div>

      <div @click="toCode">
        <Wbutton 
          text="确认核销"
          bgColor="confirm"
          size="size330"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Wbutton from '@/components/Button'

export default {
  props: {
    isPackage: {
      type: Number,
      default: 1
    },
    orderId: {
      type: Number,
      default: 0
    },

    courseOrders: {
      type: Array,
      default: () => ([])
    },

    childStatusArr: {
      type: Array,
      default: () => ([])
    }
  },

  components: {
    Wbutton
  },

  data () {
    return {
      canvasId: '',
      defaultImg: 'https://api.tiyou.techoiceness.com/v1/static/images/img_6.png'
    }
  },

  methods: {
    closeToast () {
      let status = 0
      let data = {
        status
      }
      this.$emit('closeToast', data)
    },

    changeStatus (id, index) {
      this.childStatusArr[index].childStatus =
      !this.childStatusArr[index].childStatus
    },

    async toCode () {
      let arr = []
      for (let i = 0; i < this.childStatusArr.length; i++) {
        console.log('i', i, this.childStatusArr[i])
        if (this.childStatusArr[i] && this.childStatusArr[i].childStatus) {
          arr.push(this.childStatusArr[i].id)
        }
      }
      if (arr.length <= 0) {
        wx.showToast({
          icon: 'none',
          title: '请选择学员'
        })
        return
      }
      const data = {
        orderIds: arr
      }
      let res = this.$api.teacher.selfScanCode(data)
      if (res.msg) return
      wx.showToast({
        icon: 'none',
        title: '成功'
      })
      let status = 0
      let d = {
        status
      }
      this.$emit('closeToast', d)
    }
  },

  onLoad (options) {
  }
}
</script>

<style scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20000;
  opacity: .5;
  background-color: #000;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 21000;
  width: 510rpx;
  height: 720rpx;
  border-radius: 10rpx;
  box-shadow: 0 16rpx 16rpx -8rpx rgba(0, 0, 0, 0.5);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.code-text {
  margin-top: 116rpx;
  font-size: 34rpx;
  font-weight: 500;
  color: #232323;
}

.code-desc {
  width: 330rpx;
  text-align: center;
  margin-top: 12rpx;
  font-size: 22rpx;
  color: #b2b2b2;
  margin-bottom: 60rpx;
}

.close-img {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 48rpx;
  height: 48rpx;
}

.click-close {
  position: absolute;
  top: 0;
  right: 0;
  width: 64rpx;
  height: 64rpx;
}

.title {
  width: 216rpx;
  height: 116rpx;
  font-size: 96rpx;
  color: #ffdea5;
  text-align: center;
  font-family: 'League Gothic';
  position: absolute;
  top: -46rpx;
  left: 60rpx;
}

.scroll {
  width: 400rpx;
  height: 300rpx;
}

.user-box {
  display: flex;
  align-items: center;
  width: 390rpx;
  height: 100rpx;
  box-sizing: border-box;
  padding: 26rpx 30rpx;
}

.avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
}

.child-name {
  flex: auto;
  width: 180rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #232323;
  margin-left: 40rpx;
  line-height: 48rpx;
  overflow: hidden;
}

.selected-img {
  width: 36rpx;
  height: 36rpx;
}
</style>
