<template>
  <div class="page">
    <div class="avatar-box">
      <image mode='aspectFill'
        v-if="!paths[0]"
        key="noPaths"
        @click="chanageImg"
        class="avatar"
        :src="userInfo.avatar"
      />
      <image mode='aspectFill'
        v-else
        key="hasPaths"
        @click="closeImg"
        class="avatar"
        :src="paths[0]"
      />
      <div class="paths-text" v-if="!paths[0]">
        请上传宝宝头像
      </div>
    </div>

    <div class="info-item">
      <span class="border"></span>
      <span class="item-title">昵称</span>
      <!-- <span class="item-value"></span> -->
      <input type="text"
        class="input"
        placeholder-style="color: #eee"
        placeholder="请输入宝宝真实姓名"
        v-model="name"
        maxlength="16"
      />
    </div>

     <div class="info-item">
      <span class="border"></span>
      <span class="item-title">性别</span>
      <!-- <span class="item-value">请选择性别</span> -->
      <div class="section">
        <picker @change="bindPickerChange" value="index" :range="array">
          <div class="item-value" v-if="!sex" key="no-sex">请选择性别</div>
          <div class="sex" v-else key="sex">
            {{ sex }}
          </div>
        </picker>
      </div>
      <image mode='aspectFill'
        class="item-right"
        src="../../../static/icon/ic_right.png"
      />
    </div>

    <div class="info-item">
      <span class="border"></span>
      <span class="item-title">生日</span>
      <!-- <span class="item-value">请选择出生日期</span> -->
      <div class="section">
        <picker @change="bindPickerData" mode="date"
          start="1949-01-01"
          end="2022-01-01" value="index" :range="array">
          <div class="item-value" v-if="!birthday" key="no-birthday">请选择出生日期</div>
          <div class="sex" v-else key="birthday">
            {{ birthday }}
          </div>
        </picker>
      </div>
      <image mode='aspectFill'
        class="item-right"
        src="../../../static/icon/ic_right.png"
      />
    </div>

    <div class="info-item">
      <span class="border"></span>
      <span class="item-title">关系</span>
      <!-- <span class="item-value"></span> -->
      <input type="text"
        class="input"
        placeholder-style="color: #eee"
        placeholder="请输入你们的关系"
        v-model="bind"
        maxlength="8"
      />
    </div>

    <div class="btn" @click="addChild">
      <Wbutton text="保存" size="size690" bgColor="confirm" />
    </div>
  </div>
</template>

<script>
import Wbutton from '@/components/Button'
export default {
  components: {
    Wbutton
  },

  data () {
    return {
      userInfo: {
        avatar: 'https://api.tiyou.techoiceness.com/v1/static/images/img_6.png'
      },
      paths: [],
      array: [
        '男',
        '女'
      ],
      sex: '',
      birthday: '',
      bind: '',
      name: '',
      uploadImg: [],
      childId: ''
    }
  },

  methods: {
    async chooseImage () {
      let res = await this.$wxApi.wxChooseImage({
        len: this.paths.length
      })
      this.paths = [ ...res ]
      // 单张
      let pathArr = await this.$wxApi.upLoadImg(this.paths[0])
      this.uploadImg = [ pathArr ]
    },

    chanageImg () {
      this.chooseImage()
    },

    // 长按删除
    async closeImg () {
      let res = await this.$wxApi.wxCloseImage()
      if (res === 1) {
        this.paths.splice(0, 1)
        this.uploadImg.splice(0, 1)
      }
    },

    bindPickerChange (e) {
      let index = parseInt(e.mp.detail.value, 10)
      this.sex = this.array[index]
    },

    bindPickerData (e) {
      this.birthday = e.mp.detail.value
    },

    async addChild () {
      let sex = 1
      if (this.sex === '男') {
        sex = 1
      } else {
        sex = 2
      }
      let time = new Date(`${this.birthday}`)
      if (!this.name) {
        wx.showToast({
          title: '请填写孩子昵称',
          icon: 'none'
        })
        return
      }
      if (!this.sex) {
        wx.showToast({
          title: '请选择孩子性别',
          icon: 'none'
        })
        return
      }
      if (!this.birthday) {
        wx.showToast({
          title: '请选择孩子生日',
          icon: 'none'
        })
        return
      }
      if (!this.bind) {
        wx.showToast({
          title: '请填写你们关系',
          icon: 'none'
        })
        return
      }
      let data = {
        name: this.name,
        avatar: this.uploadImg[0],
        sex: sex,
        birthday: time,
        relationship: this.bind
      }
      // 修改孩子信息
      let res = {}
      if (this.childId) {
        res = await this.$api.child.putChild(data, this.childId)
      } else {
        res = await this.$api.child.addChild(data)
      }
      if (res.msg) return
      wx.showToast({
        title: '成功',
        icon: 'none'
      })
      if (this.childId) {
        let type = 2
        wx.navigateTo({
          url: `../../successPage/main?type=${type}`
        })
      } else {
        let type = 3
        wx.navigateTo({
          url: `../../successPage/main?type=${type}`
        })
      }
    },

    async getChildDetail (id) {
      let res = await this.$api.child.getChildById(id)
      if (res.msg) return
      this.name = res.name
      this.bind = res.relationship
      this.sex = res.sex
      if (res.sex === 1) {
        this.sex = '男'
      }
      if (res.sex === 2) {
        this.sex = '女'
      }
      this.birthday = this.$wxApi.getTime(res.birthday)
      this.paths = [ res.avatar ]
      this.uploadImg = [ res.avatar ]
    },

    initState () {
      this.name = ''
      this.childId = ''
      this.uploadImg = []
      this.paths = []
      this.sex = ''
      this.bind = ''
      this.birthday = ''
      this.relationship = ''
    }
  },
  onLoad (options) {
    let { childId } = options
    childId = parseInt(childId, 10)
    this.childId = childId
    if (childId) {
      this.getChildDetail(childId)
      wx.setNavigationBarTitle({
        title: '修改家庭成员信息'
      })
    }
  },

  onUnload () {
    this.initState()
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.paths-text {
  font-size: 28rpx;
  color: #b2b2b2;
  margin-top: 30rpx;
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
  width: 206rpx;
  flex: auto;
}

.item-value {
  flex: auto;
  width: 360rpx;
  overflow: hidden;
  color: #eee;
  text-align: right;
}

.sex {
  flex: auto;
  width: 360rpx;
  overflow: hidden;
  color: #232323;
  text-align: right;
}

.input {
  text-align: right;
}

.item-right {
  width: 48rpx;
  height: 48rpx;
  margin-left: 10rpx;
}

.btn {
  position: fixed;
  bottom: 68rpx;
  flex: auto;
}
</style>
