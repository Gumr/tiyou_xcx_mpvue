<template>
<div class="wrap">
  <textarea maxlength="140"
    fixed="true"
    v-model="comment"
    class="toast-text"
    type="text" 
    placeholder-style="color: #b2b2b2"
    placeholder="欢迎点评～"
  />
  <div v-if="paths.length" class="img-box">
    <div v-for="(item, index) in paths" :key="index" class="item-img">
      <image mode='aspectFill'
        class="upload-img"
        @longpress="closeImg"
        @click="lookImg(index)"
        :src="item"
      />
    </div>
  </div>
  <div class="photo-box">
    <image mode='aspectFill'
      v-if="paths.length < 9 "
      class="photo-img"
      @click="chooseImage"
      src="https://api.tiyou.techoiceness.com/v1/static/images/ic_photo.png"
    />
    <div class="img-text" v-if="paths.length < 9">
      请上传图片
    </div>
  </div>
  <div :class="[ AppIsIpx ? 'isx-btn' : 'btn']" @click="toComment">
    <Wbutton 
      :text="text"
      bgColor="confirm"
      size="size690"
    />
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
      paths: [],
      uploadImg: [],
      orderId: '',
      courseId: '',
      classScheduleId: '',
      comment: '',
      type: 0,
      commentId: '',
      text: '评价'
    }
  },

  methods: {
    async chooseImage () {
      let res = await this.$wxApi.wxChooseImage({
        len: this.paths.length,
        imgNumber: 9
      })
      this.paths = [ ...this.paths, ...res ]
      // 单张
      const p = this.paths.map(i => {
        return this.$wxApi.upLoadImg(i)
      })
      Promise.all(p)
        .then(res => {
          this.uploadImg = [ ...res ]
        })
    },

    lookImg (index) {
      let data = {
        files: this.uploadImg,
        index
      }
      this.$wxApi.wxLookImg(data)
    },

    async toComment () {
      if (this.type === 1) {
        let data = {
          courseOrderId: this.orderId,
          courseId: this.courseId,
          classScheduleId: this.classScheduleId,
          content: this.comment,
          images: this.uploadImg
        }
        let res = await this.$api.order.courseComment(data)
        if (res.msg) return
        wx.showToast({
          title: '评价成功',
          icon: 'none'
        })
      }
      if (this.type === 2) {
        let d = {
          data: {
            content: this.comment,
            images: this.uploadImg
          },
          id: this.commentId
        }
        let res = await this.$api.order.putComment(d)
        if (res.msg) return
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
      }
    },

    async getCommentDetail (data) {
      let res = await this.$api.order.commentDetail(data)
      if (res.msg) return
      this.content = res.content
      this.paths = res.images
      this.comment = res.content
      this.uploadImg = res.images
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

    initState () {
      this.paths = []
      this.uploadImg = []
      this.orderId = ''
      this.courseId = ''
      this.classScheduleId = ''
      this.comment = ''
      this.type = 0
      this.commentId = ''
      this.text = '评价'
    }
  },

  onUnload () {
    this.initState()
  },

  onLoad (options) {
    let { orderId, courseId, classScheduleId, type = 0, commentId } = options
    this.orderId = parseInt(orderId, 10)
    this.courseId = parseInt(courseId, 10)
    this.classScheduleId = parseInt(classScheduleId, 10)
    this.type = parseInt(type, 10)
    this.commentId = parseInt(commentId, 10)
    if (this.type === 2) {
      // 修改评论
      let data = {
        id: this.commentId
      }
      this.getCommentDetail(data)
      this.text = '修改评价'
    }
  }
}
</script>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.toast-text {
  margin-top: 60rpx;
  width: 630rpx;
  height: 300rpx;
  margin-bottom: 60rpx;
  font-size: 28rpx;
}

.btn {
  width: 690rpx;
  position: fixed;
  bottom: 30rpx;
  left: 30rpx;
}

.isx-btn {
  width: 690rpx;
  position: fixed;
  bottom: 68rpx;
  left: 30rpx;
}

.photo-img {
  width: 96rpx;
  height: 96rpx;
}

.img-text {
  font-size: 28rpx;
  color: #b2b2b2;
  margin-left: 60rpx;
}

.photo-box {
  display: flex;
  align-items: center;
  width: 630rpx;
}

.img-box {
  display: flex;
  flex-wrap: wrap;
  width: 645rpx;
}

.item-img {
  width: 200rpx;
  height: 200rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
}

.upload-img {
  width: 200rpx;
  height: 200rpx;
}
</style>
