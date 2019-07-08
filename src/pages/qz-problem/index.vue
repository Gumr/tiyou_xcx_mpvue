<template>
  <div class="publish-wrap">
    <div class="title" v-for="(item, index) in vuexGetQuestions" :key="index">
      {{ item.content }}
    </div>
    <div class="text-box">
      <textarea @linechange="bindlinechange" maxlength="1000" v-model="textContent" class="text" placeholder="请回答" placeholder-style="color: #b2b2b2"></textarea>
    </div>
    <!-- voice -->
    <div v-if="type === 3">
      <div v-if="voiceStatus" class="voice-box">
        <span class="iconfont voice-img icon-ic_mic"></span>
        <div v-if="textStatus" class="voicebtn" @click="startVoice">点击开始录音</div>
        <div v-else class="voicebtn" @click="stopVoice">点击结束</div>
      </div>
      <div v-else class="voice-over" @click="playVoice">
      <div class="voice-top">
        <span class="iconfont icon icon-ic_voice_"></span>
        <div v-if="msgAudioStatus" class="voice-time">
          <span>{{ voiceTime }}</span>
          <span class="voice-time-color">s</span>
        </div>
        <div v-else class="voice-time">
          <span>{{ msgAudioTime }}</span>
          <span class="voice-time-color">s</span>
        </div>
        </div>
        <span class="iconfont choseVoice icon-ic_close"  @click.stop="closeVoice"></span>
      </div>
    </div>
    <!-- img -->
    <div v-if="type === 2">
      <div v-if="!tempFilePaths.length" class="box-img">
        <span class="iconfont img icon-ic_photo" @click="chooseImage"></span>
      </div>
      <div class="box">
        <div v-if="tempFilePaths.length" class="show-image-box">
          <div class="show-img" v-for="(item, index) in tempFilePaths" :key="index">
            <image mode="aspectFill" class="showImage" :src="item" />
            <div class="mask" @click="lookImg(index)">
              <span class="iconfont close icon-ic_close" @click.stop="closeImage(index)"></span>
            </div>
          </div>
        </div>
        <div v-if="tempFilePaths.length && tempFilePaths.length != 9" @click="chooseImage" class="img-box">
          <span class="iconfont img icon-ic_photo"></span>
        </div>
      </div>
    </div>
    <!-- video -->
    <div v-if="type === 4">
      <div v-if="!videoSrc.length" class="video">
        <span class="iconfont chooseVideo icon-ic_video" @click="chooseVideo"></span>
      </div>
      <div v-if="videoSrc.length" class="video-box">
        <!-- 播放视频时隐藏 删除按钮和蒙版 -->
        <div :class="[ videoPlayStatus ? 'video-img-box-play' : 'video-img-box']">
          <video :src="videoSrc" class="video-src"
            @play="bindplay"
            @pause="bindpause"
            @ended="bindended"
            @error="binderror"
          />
          <div v-if="!videoPlayStatus">
            <cover-view @click="closeVideo" class="iconfont video-close-img icon-ic_close"></cover-view>
          </div>
        </div>
      </div>
    </div>
    <div class="btn" @click="publish">
      <w-button text="发布" size="big" :bgColor="'black'"></w-button>
    </div>
  </div>
</template>

<script>
import Wbutton from '@/components/quanzis/button'
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  components: {
    'w-button': Wbutton
  },

  data () {
    return {
      title: '',
      tempFilePaths: [],
      urls: [],
      options: {},
      recorderManager: {},
      voiceSrc: '',
      voiceTime: 0,
      voiceStatus: true,
      textStatus: true,
      innerAudioContext: null,
      videoSrc: '',
      textContent: '',
      file: '',
      pics: [],
      videoTime: 0,
      question: {},
      course: '',
      uploadStatus: false,
      msgAudioTime: 0,
      msgAudioStatus: true,
      timer: null,
      videoPlayStatus: 0,
      upLoadSize: 0
    }
  },
  computed: {
    ...mapGetters([
      'aGetTaskDetail',
      'aGetTaskList'
    ]),

    ...mapGetters('cTaskDetail', [
      'vuexGetTaskDetail',
      'vuexGetQuestions',
      'vuexGetQuestionType'
    ]),

    type () {
      return this.vuexGetQuestionType
    }
  },
  methods: {
    ...mapActions('cTaskDetail', [
      'vuexSetTaskDetail',
      'vuexDetailAnswered'
    ]),

    ...mapActions('circleTask', [
      'vuexAnswered'
    ]),

    ...mapActions('courseTask', [
      'vuexSetCourseAnsered'
    ]),

    ...mapActions([
      'aSetTaskDetail',
      'aSetTaskList'
    ]),
    bindlinechange () {
      if (this.textContent.length >= 1000) {
        wx.showToast({
          icon: 'none',
          title: '最大字数限制为1000字'
        })
      }
    },
    // 选择图片
    chooseImage () {
      let number = 9 - this.tempFilePaths.length
      if (number <= 0) {
        number = 0
      }
      wx.chooseImage({
        count: number,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          if (res.tempFilePaths.length > 0) {
            const p = res.tempFilePaths.map((path, index) => {
              this.tempFilePaths.push(path)
              return this.upLoadImg(path, 'image')
            })
            Promise.all(p)
              .then(d => {
                this.uploadStatus = true
                this.pics = [...this.pics, ...d]
              })
          } else {
            const filePath = res.tempFilePaths[0]
            this.upload(filePath, 'image')
            this.tempFilePaths = res.tempFilePaths
          }
        }
      })
    },

    // 取消图片
    closeImage (id) {
      let index = id
      this.tempFilePaths.splice(index, 1)
      this.pics.splice(index, 1)
      // if (this.tempFilePaths.length === 0) {
      //   this.type = 0
      // }
    },

    // 预览图片
    lookImg (id) {
      var current = this.tempFilePaths[id]
      wx.previewImage({
        current: current,
        urls: this.tempFilePaths
      })
    },

    startVoice () {
      this.recorderManager.start(this.options)
      this.textStatus = false
      this.recorderManager.onStart(() => {
      })
      // this.wxStopVoice()
    },

    stopVoice () {
      this.recorderManager.stop()
      this.textStatus = true
      this.wxStopVoice()
    },
    // 停止录音
    wxStopVoice () {
      this.recorderManager.onStop(res => {
        this.voiceSrc = res.tempFilePath
        this.innerAudioContext = wx.createInnerAudioContext()
        this.voiceTime = res.duration
        this.upload(res.tempFilePath, 'audio')
        this.voiceTimefun(this.voiceTime)
        this.voiceStatus = false
      })
    },

    playVoice () {
      if (this.msgAudioStatus === false) return
      clearInterval(this.timer)
      this.msgAudioTime = this.voiceTime
      this.msgAudioStatus = false
      this.innerAudioContext = wx.createInnerAudioContext()
      this.innerAudioContext.src = this.voiceSrc
      this.innerAudioContext.play()
      this.innerAudioContext.onPlay((res) => {
        this.timer = setInterval(this.voiceDown, 1000)
      })
      this.innerAudioContext.onEnded(() => {
        this.innerAudioContext.destroy()
        this.msgAudioStatus = true
      })
      this.innerAudioContext.onError(() => {
        wx.showToast({
          icon: 'none',
          title: '音频播放错误'
        })
        this.msgAudioStatus = true
        this.innerAudioContext.destroy()
      })
    },

    voiceDown () {
      if (this.msgAudioTime === 0) {
        this.msgAudioStatus = true
        clearInterval(this.timer)
        this.msgAudioTime = this.voiceTime
      } else {
        this.msgAudioTime--
      }
    },

    chooseVideo () {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: res => {
          this.videoSrc = res.tempFilePath
          this.videoTime = Math.ceil(res.duration)
          this.upload(res.tempFilePath, 'video')
        }
      })
    },

    voiceTimefun (voiceTime) {
      this.voiceTime = Math.ceil(voiceTime / 1000)
      this.msgAudioTime = this.videoTime
    },

    closeVoice () {
      this.voiceTime = 0
      this.voiceSrc = ''
      this.voiceStatus = true
      // if (this.voiceStatus === true) {
      //   this.type = 0
      // }
    },

    // video
    // 播放
    bindplay () {
      this.videoPlayStatus = 1
    },

    // 暂停
    bindpause () {
      this.videoPlayStatus = 0
    },

    // 结束
    bindended () {
      this.videoPlayStatus = 0
    },

    // 播放错误
    binderror () {
      this.videoPlayStatus = 0
    },

    closeVideo () {
      this.videoSrc = ''
      // if (this.videoSrc.length === 0) {
      //   this.type = 0
      // }
    },
    upLoadImg (filePath, fileType) {
      return new Promise((resolve, reject) => {
        var that = this
        this.$quanzis.api.user.uploadToken(fileType)
          .then(res => {
            if (res.error) return
            const token = res.uploadToken
            wx.uploadFile({
              filePath,
              url: 'https://upload-z2.qiniup.com',
              name: 'file',
              header: {
                'content-type': 'multipart/form-data'
              },
              formData: {
                token
              },
              success: function (res) {
                const data = JSON.parse(res.data)
                if (that.type === 2) {
                  that.files = []
                }
                // that.files.push(data.url)
                resolve(data.url)
              }
            })
          })
      })
    },
    upload (filePath, fileType) {
      const that = this
      this.$quanzis.api.user.uploadToken(fileType)
        .then(res => {
          if (res.error) return
          const token = res.uploadToken
          wx.uploadFile({
            filePath,
            url: 'https://upload-z2.qiniup.com',
            name: 'file',
            header: {
              'content-type': 'multipart/form-data'
            },
            formData: {
              token
            },
            success: function (res) {
              that.uploadStatus = true
              const data = JSON.parse(res.data)
              if (that.type === 2) {
                that.pics.push(data.url)
              } else {
                that.upLoadSize = data.size
                that.file = data.url
              }
            }
          })
        })
    },
    publish () {
      if (!this.textContent) {
        wx.showToast({
          icon: 'none',
          title: '请输入内容'
        })
        return
      }
      if (this.type === 2 && this.pics.length === 0) {
        wx.showToast({
          icon: 'none',
          title: '请上传图片'
        })
        return
      }
      if (this.type === 4 && !this.file) {
        wx.showToast({
          icon: 'none',
          title: '请上传视频'
        })
        return
      }
      if (this.type === 3 && !this.file) {
        wx.showToast({
          icon: 'none',
          title: '请上传音频'
        })
        return
      }
      if (this.uploadStatus === false) {
        wx.showToast({
          icon: 'none',
          title: '等待上传中'
        })
        return
      }
      const answers = []
      let answer = {
        questionId: this.vuexGetQuestions[0].id
      }
      switch (this.type) {
        case 2:
          answer = {
            ...answer,
            pics: this.pics
          }
          // img
          break
        case 3:
          answer = {
            ...answer,
            audio: {
              url: this.file,
              size: this.upLoadSize,
              duration: parseInt(this.voiceTime)
            }
          }
          break
        case 4:
          answer = {
            ...answer,
            video: {
              url: this.file,
              size: this.upLoadSize,
              duration: parseInt(this.videoTime)
            }
          }
          break
        default:
          answer = {}
      }
      answers.push(answer)
      const data = {
        answers,
        textContent: this.textContent
      }
      const params = {
        data,
        circleId: this.circleId,
        taskId: this.taskId,
        courseId: this.course
      }
      this.$quanzis.api.circle.answerQuestion(params)
        .then(res => {
          if (res.error) return
          if (this.course) {
            this.vuexSetCourseAnsered(this.taskId)
          } else {
            this.vuexAnswered(this.taskId)
          }
          this.vuexDetailAnswered(this.taskId)
          res.createdAt = this.$quanzis.getTime(res.createdAt)
          // 任务详情回答，打卡列表
          this.aSetTaskList([ res, ...this.aGetTaskList ])
          wx.showToast({
            title: '发布成功'
          })
          if (this.course) {
            wx.navigateBack({
              url: `../qz-course/main?id=${this.circleId}&taskId=${this.course}`
            })
          } else {
            wx.navigateBack({
              url: `../qz-circle/main?id=${this.circleId}`
            })
          }
        })
    }

  },

  onShow () {
  },
  onLoad () {
    this.$quanzis.VoicePlay().voiceInit()
    this.pics = []
    this.textContent = ''
    this.tempFilePaths = []
    this.videoSrc = ''
    this.videoPlayStatus = 0
    this.voiceStatus = true
    this.uploadStatus = false
    this.upLoadSize = 0
    const { circleId, taskId, course } = this.$root.$mp.query
    this.course = course
    const param = {
      circleId,
      taskId,
      courseId: course
    }
    this.circleId = circleId
    this.taskId = Number(taskId)
    this.vuexSetTaskDetail(param)
    const recorderManager = wx.getRecorderManager()
    const options = {
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }
    this.options = options
    this.recorderManager = recorderManager
  }
}
</script>

<style lang="scss" scoped>
.iconfont {
  font-family: iconfont;
}
.title {
  width: 630rpx;
  color: #888;
  font-size: 28rpx;
  margin-top: 60rpx;
}
.publish-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 28rpx;
  margin-bottom: 125rpx;
}
.text {
  width: 630rpx;
  height: 300rpx;
}
.text-box {
  margin-top: 30rpx;
  width: 630rpx;
  height: 300rpx;
  margin-bottom: 60rpx;
  overflow: hidden;
}
.box-img {
  width: 630rpx;
  margin-top: 60rpx;
}
.img-box {
  width: 200rpx;
  height: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.img {
  width: 96rpx;
  height: 96rpx;
}
.box {
  width: 630rpx;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 130rpx;
}
.voice-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 630rpx;
  /* margin-top: 60rpx; */
}
.voice-img {
  margin-right: 30rpx;
}
.voicebtn {
  width: 492rpx;
  height: 80rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  border-radius: 12rpx;
  text-align: center;
  color: #b2b2b2;
  background-color: #fff;
  box-shadow: 0 8rpx 16rpx -8rpx rgba(0, 0, 0, 0.05);
}
.show-image-box {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.show-img {
  position: relative;
  background-color: #fff;
}
.close {
  width: 50rpx;
  height: 50rpx;
}
.mask {
  text-align: right;
  position: absolute;
  top: 0;
  width: 200rpx;
  height: 200rpx;
  background-color: #000;
  opacity: .3;
}
.showImage {
  width: 200rpx;
  height: 200rpx;
  background-color: #fff;
  margin-right: 10rpx;
}
.voice-over {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 610rpx;
  height: 80rpx;
  border-radius: 12rpx;
  background-color: #fff;
  box-shadow: 0 8rpx 32rpx -16rpx rgba(0, 0, 0, 0.1);
}
.icon {
  margin-left: 40rpx;
  margin-right: 20rpx;
}
.voice-time {
  font-size: 28rpx;
  color: $blackColor;
  font-family: $my-font;
}
.voice-top {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.voiceImg {
  width: 48rpx;
  height: 48rpx;
  margin-right: 20rpx;
}
.video {
  width: 630rpx;
  margin-top: 60rpx;
}
.video-box {
  position: relative;
  margin-top: 60rpx;
  width: 610rpx;
  height: 360rpx;
  margin-bottom: 125rpx;
}
.video-src {
  width: 610rpx;
  height: 360rpx;
  margin-bottom: 125rpx;
  z-index: 100;
}
.btn {
  position: fixed;
  bottom: 30rpx;
  left: 30rpx;
  z-index: 1001;
}
.video-img {
  width: 96rpx;
  height: 96rpx;
}
.video-close-img {
  position: absolute;
  z-index: 9999;
  right: 16rpx;
  top: 16rpx;
}
.video-img-box {
  width: 610rpx;
  height: 360rpx;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  background-color:	#E8E8E8;
}

.video-img-box-play {
  width: 610rpx;
  height: 360rpx;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  background-color: #000;
}

.voice-time-color {
  color: #b2b2b2;
}
</style>
