<template>
  <div class="wrap">
    <div class="card" @touchstart="touchstart"
      @touchmove="touchmove(child.id, $event)"
      :style="{left: textLeftStyle + 'rpx'}"
    >
      <div class="goods-img">
        <image mode='aspectFill'
          class="avatar"
          :src="child.avatar || defaultImg"
        />
      </div>
      <div class="card-right">
        <div class="right-top">
          <span class="name">{{ child.name }}</span>
          <!-- <span class="relationship">{{ child.relationship }}</span> -->
        </div>
        <div class="birthday">
          生日：{{ child.birthday }}
        </div>
        <div class="relationship">{{ child.relationship }}</div>
        <!-- <div class="no-card" v-if="!child.card && status" key="hasCard">
          未绑年卡
        </div>
        <div class="btn" @click.stop="toCardList(child.id)" v-if="!child.card && !status" key="no-card">
          绑卡
        </div>
        <div class="has-card" v-if="child.card" key="hasCard">
          已绑年卡
        </div> -->
      </div>
    </div>
    <div class="exit-box">
      <div class="del" v-if="delStatus" key="exit-status" @click.stop="changeDel">
        删除
      </div>
      <div v-else key="quit-status" class="confirm-exit"
        @click.stop="del">
        确认删除
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    child: {
      type: Object,
      default: () => ({})
    },
    status: {
      type: String,
      default: 0
    }
  },

  components: {
  },

  computed: {
  },

  data () {
    return {
      defaultImg: 'https://api.tiyou.techoiceness.com/v1/static/images/img_6.png',
      textLeftStyle: 0,
      delStatus: 1,
      moveX: 0,
      startX: 0,
      moveY: 0,
      startY: 0
    }
  },

  methods: {
    toCardList (id) {
      // 如果是选择宝宝页面
      // if (this.status) {
      //   this.$emit('bindCard')
      //   return
      // }
      // let data = {
      //   childId: id
      // }
      // this.$emit('toCardManagement', data)
      // wx.navigateTo({
      //   url: `../packageMe/cardManagement/main?childId=${id}`
      // })
    },

    touchstart (e) {
      if (e.touches.length === 1) {
        this.startX = e.touches[0].clientX
        this.startY = e.touches[0].clientY
      }
    },

    touchmove (id, e) {
      if (e.touches.length === 1) {
        this.moveX = e.touches[0].clientX
        this.moveY = e.touches[0].clientY
        let disY = Math.abs(this.startY - this.moveY)
        if (disY > 10) {
          return
        }
        let disX = this.moveX - this.startX
        if (disX > 10) {
          this.textLeftStyle = 0
          this.delStatus = 1
        } else if (disX < -20) {
          this.textLeftStyle = -150
        }
      }
    },

    changeDel () {
      this.delStatus = 0
      this.textLeftStyle = -300
    },

    del () {
      this.$emit('delGoods', this.child.id)
      this.delInit()
    },

    delInit () {
      this.startX = 0
      this.moveX = 0
      this.moveY = 0
      this.startY = 0
      this.delStatus = 1
      this.textLeftStyle = 0
    }
  },

  onShow () {
    this.delInit()
  },

  onLoad () {
  }
}
</script>

<style scoped>
.wrap {
  width: 100%;
  width: 630rpx;
  height: 220rpx;
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.card {
  position: absolute;
  top: 0;
  left: 0;
  width: 630rpx;
  height: 220rpx;
  border-radius: 8rpx;
  box-shadow: 0 8rpx 8rpx -4rpx rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 30rpx;
  display: flex;
  font-size: 28rpx;
  color: #c8d2dc;
  transition: all 0.3s;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  margin-right: 60rpx;
}

.card-right {
  flex: auto;
}

.right-top {
  display: flex;
  align-items: center;
}

.name {
  flex: auto;
  /* width: 240rpx; */
  overflow: hidden;
  color: #232323;
}

.relationship {
  width: 350rpx;
  line-height: 60rpx;
  height: 60rpx;
  text-align: right;
  flex: auto;
}

.birthday {
  margin-top: 10rpx;
  margin-bottom: 10rpx;
}

.btn {
  width: 120rpx;
  height: 60rpx;
  border-radius: 30rpx;
  background-color: #ffcd76;
  color: #fff;
  text-align: center;
  line-height: 60rpx;
  font-weight: 500;
  margin-left: 230rpx;
}

.has-card {
  width: 120rpx;
  height: 40rpx;
  color: #ffcd76;
  text-align: center;
  line-height: 40rpx;
  font-weight: 500;
  margin-left: 230rpx;
  font-size: 28rpx;
}
.no-card {
  width: 120rpx;
  height: 40rpx;
  color: #c8d2dc;
  text-align: center;
  line-height: 40rpx;
  font-weight: 500;
  margin-left: 230rpx;
  font-size: 28rpx;
}

.exit-box {
  width: 630rpx;
  height: 220rpx;
  background-color: #de6f6f;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-radius: 8rpx;
}

.del {
  width: 150rpx;
  height: 220rpx;
  line-height: 220rpx;
  text-align: center;
  font-size: 36rpx;
  color: #fff;
}

.confirm-exit {
  width: 300rpx;
  height: 220rpx;
  line-height: 220rpx;
  text-align: center;
  font-size: 36rpx;
  color: #fff;
}
</style>
