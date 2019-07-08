<template>
  <div :class="isVisible === '0' ? 'msg-wrap' : ''">
    <!-- <progress  v-if="progress" class="progressClass" :percent="progress" forwards /> -->
    <div class="msg-box-title">
      <span class="msg-title" @click.stop="toTheme(item)" v-for="(item, index) in (type && type.topics)" :key="index"># {{item}}</span>
      <span v-if="type.infoType !== 8">
        <text>{{ lookContent }}</text>
      </span>
    </div>
    <div v-if="texStatus" @click.stop="lookTxt">
      <div class="all" v-if="lookAllStatus">全部</div>
      <div class="all" v-else>收起</div>
    </div>
    <!-- img -->
    <div v-if="type.infoType === 3" class="img-content">
      <div :class="[type.detail.pics.length === 1 ? 'img-one-class' : 'img-size']" @click.stop="lookImg(index)" v-for="(item, index) in type.detail.pics" :key="index">
        <image mode="aspectFill" :class="[type.detail.pics.length === 1 ? 'img-one-class' : 'img-size']" :src="item" />
      </div>
    </div>
    <!-- record -->
    <div v-if="type.infoType === 4" class="record-content" @click.stop="playVoice">
      <span class="iconfont icon-ic_voice_ record-icon"></span>
      <span v-if="msgAudioStatus" class="record-time">
        <span>{{ type.detail.duration }}</span>
        <span class="voice-time-color">s</span>
      </span>
      <span v-else class="record-time">
        <span>{{ msgAudioTime }}</span>
        <span class="voice-time-color">s</span>
      </span>
    </div>
    <div v-if="type.infoType === 11" class="voice-box">
      <image v-if="playLogVideoStatus" @click.stop="playLogVideo" class="voice-play" mode="aspectFill" src="https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_voicePlay.png" />
      <image v-else @click.stop="stopLogVideo" class="voice-play" mode="aspectFill" src="https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_voicePause.png" />
      <div class="voice-box-right">
        <div class="voice-progress">
          <span class="start-progress" :style="{ 'width': playTimeWidth + 'rpx' }"></span>
          <span class="all-progress" :style="{ 'width': allTimeWidth + 'rpx' }"></span>
        </div>
        <div class="voice-time">
          <span>{{ playTime }}</span>
          <span class="all-time">/{{ logVideo }}</span>
        </div>
      </div>
    </div>
    <!-- 后台相册 -->
    <div v-if="type.infoType === 10" class="essay">
      <image mode="aspectFill" class="essay-img" :src="type.detail.cover" />
      <div class="essay-mask">
        <span class="essay-title">{{ type.detail.title }}</span>
      </div>
    </div>
    <!-- video -->
    <div v-if="type.infoType === 5" @click.stop="playVideo(1)">
      <video v-if="curr_id === type.id"
        :style="{height: imgHeight + 'rpx', width: imgWidth + 'rpx'}"
        @pause="bindpause(type.id)"
        :id="type.id"
        @play="bindVideoPlay(type.id)"
        @ended="bindended"
        objectFit="contain"
        :src="type.detail.url"></video>
      <div v-else
        @click.stop="playVideo(type.id)"
        class="img-mask-box" :style="{height: imgHeight + 'rpx', width: imgWidth + 'rpx'}">
        <image mode="aspectFill" @load="imageLoad" :style="{height: imgHeight + 'rpx', width: imgWidth + 'rpx'}"
          class="video-img-mask" :src="type.detail && type.detail.thumbUrl"></image>
        <div class="video-time">{{type.detail.duration}}s</div>
        <div class="mask-bg" :style="{height: imgHeight + 'rpx', width: imgWidth + 'rpx'}">
          <!-- <image class="img-play" src="../../static/qz-images/ic_play.png" /> -->
          <span class="iconfont img-play icon-ic_play"></span>
        </div>
      </div>
    </div>
    <!-- 文件 -->
    <div v-if="type.infoType === 6" class="category" @click="downFile(type.detail.url)">
      <w-filecard :filename="type.detail.filename" :filecard="type.detail.mimeType" :size="type.detail.size"></w-filecard>
    </div>
    <!-- 图文 -->
    <div v-if="type.infoType === 7" class="essay"  @click.stop="toImgText(type.detail.url)">
      <image mode="aspectFill" class="essay-img" :src="type.detail.cover" />
      <div class="essay-mask">
        <span class="essay-title">{{ type.detail.title }}</span>
      </div>
    </div>
    <!-- sign-in progress -->
    <!-- <div v-if="type.infoType === 8" class="progress"> -->
    <div v-if="type.infoType === 8" class="progress">
      <!-- 有限次打卡 -->
      <!-- todo -->
      <div class="progress-content" v-if="dataDetail.task.targetDays" key="times">
        <div>
          <w-progress :completedDays="dataDetail.currentCompletedDays"
            :targetDays="dataDetail.task.targetDays"></w-progress>
        </div>
        <div>
          <w-progress-value :completedDays="dataDetail.currentCompletedDays"
            :targetDays="dataDetail.task.targetDays"></w-progress-value>
        </div>
      </div>
      <!-- 无限次打卡 -->
      <!-- todo -->
      <div v-else key="no-times">
        <div class="my-push-tiems">
          成功打卡<span> {{ dataDetail.currentCompletedDays || 0 }} </span>天
        </div>
        <div class="push-border">
        </div>
      </div>
      <div class="progress-title">
        <span class="progress-time">{{ lookContent }}</span>
      </div>
      <div class="push-img-box" v-if="dataDetail.pics[0].length > 1 || !dataDetail.pics.length">
        <image mode="aspectFill"
          @click.stop="lookTaskPics"
          class="push-img" :src="dataDetail.pics && dataDetail.pics[0] || defaultPics" />
      </div>
    </div>
    <!-- questions -->
    <div v-if="type.infoType === 9" class="questions">
      <div v-if="dataDetail.task && dataDetail.task.questionType === 1" class="text-content">
        <div class="taskQuestion" v-for="(item, index) in lookAnswers" :key="index">
          <div class="textContent">Q: {{ item.questionContent }}</div>
          <div class="textAnswer"><span class="text-color">A: </span>
            <text>{{ item.textAnswer }}</text>
          </div>
          <div v-if="item.answerStatus" @click.stop="lookTextAnswer(index)" class="all-answer">
            <div class="all" v-if="item.lookAllAnswers">全部</div>
            <div class="all" v-else>收起</div>
          </div>
        </div>
      </div>
      <div v-if="dataDetail.task && dataDetail.task.questionType === 2" class="questions-box">
        <div class="content-flex" v-for="(item, index) in dataDetail.answers" :key="index">
          <div :class="[item.pics.length === 1 ? 'img-one-class' : 'img-size']" v-for="(picsItem, picsIndex) in item.pics" :key="picsIndex">
            <image mode="aspectFill" @click.stop="questionLookImg(picsIndex)" :class="[item.pics.length === 1 ? 'img-one-class' : 'img-size']" :src="picsItem" />
          </div>
        </div>
      </div>
      <div v-if="dataDetail.task && dataDetail.task.questionType === 3" class="questions-box">
        <div class="record-content" @click.stop="questionPlayVoice(index)" v-for="(item, index) in dataDetail.answers" :key="index">
          <span class="iconfont icon-ic_voice_ record-icon"></span>
          <span v-if="audioStatus" class="record-time">
            <span>{{ item.audio.duration }}</span>
            <span class="voice-time-color">s</span>
          </span>
          <span v-else class="record-time">
            <span>{{ voiceTime }}</span>
            <span class="voice-time-color">s</span>
          </span>
        </div>
      </div>
      <div v-if="dataDetail.task && dataDetail.task.questionType === 4" class="questions-box">
        <div class="questions-video" @click.stop="playVideo(1)" v-for="(item, index) in (dataDetail && dataDetail.answers)" :key="index">
          <video v-if="curr_id === type.id"
            :style="{ height: imgHeight + 'rpx', width: imgWidth + 'rpx' }"
            @pause="bindpause(type.id)"
            @play="bindVideoPlay(type.id)"
            @ended="bindended(type.id)"
            :id="type.id"
            objectFit="contain"
            :src="item.video.url"></video>
          <div v-else
            @click.stop="playVideo(type.id)"
            class="img-mask-box" :style="{height: imgHeight + 'rpx', width: imgWidth + 'rpx'}">
            <image mode="aspectFill" @load="imageLoad" :style="{ height: imgHeight + 'rpx', width: imgWidth + 'rpx' }"
              class="video-img-mask" :src="item.video.thumbUrl" />
            <div class="video-time">{{ item && item.video.duration }}s</div>
            <div class="mask-bg" :style="{ height: imgHeight + 'rpx', width: imgWidth + 'rpx' }">
              <!-- <image class="img-play" src="../../static/qz-images/ic_play.png" /> -->
              <span class="iconfont img-play icon-ic_play"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Wprogress from '@/components/quanzis/progress/progress'
import WprogressValue from '@/components/quanzis/progress/progressValue'
import WfileCard from '@/components/quanzis/fileCard'

export default {
  props: {
    type: {
      type: Object,
      required: true
    },
    dataDetail: {
      type: Object,
      required: true
    },
    isVisible: {
      type: String
    }
  },
  components: {
    'w-filecard': WfileCard,
    'w-progress': Wprogress,
    'w-progress-value': WprogressValue
  },
  data () {
    return {
      defaultPics: 'https://api.tiyou.techoiceness.com/v1/static/qz-images/ic_default.png',
      innerAudioContext: {},
      pinnerAudioContext: {},
      timer: null,
      voiceTime: 0,
      audioIndex: 0,
      audioStatus: true,
      msgAudioTime: 0,
      msgAudioStatus: true,
      msgTimer: null,
      // video对象
      videoContent: {},
      curr_id: '',
      imgWidth: 0,
      imgHeight: 0,
      progress: 0,
      cont: false,
      answer: false,
      // lookAnswers: []
      // 长音频状态
      playLogVideoStatus: 1,
      loginnerAudioContext: {},
      playTime: '00:00',
      playTimeWidth: 0,
      allTimeWidth: 360,
      // 是否暂停 0 不暂停，1 暂停
      palyVideoStatus: 0,
      // 放抖动
      longNoClick: 0
    }
  },
  computed: {
    lookContent () {
      let content = ''
      content = this.type.textContent
      if (this.type.textContent && this.type.textContent.length > 100) {
        content = this.type.textContent.substring(0, 100)
      }
      if (this.cont === true) {
        content = this.type.textContent
      }
      return content
    },
    lookAllStatus () {
      let status = false
      if (this.lookContent && this.lookContent.length >= 100) {
        status = true
      }
      if (this.cont === true) {
        status = false
      }
      return status
    },

    lookAnswers () {
      let lookAnswers = []
      if (this.dataDetail && this.dataDetail.answers) {
        // 深度拷贝
        lookAnswers = JSON.parse(JSON.stringify(this.dataDetail.answers)).map((i) => {
          if (i.textAnswer && i.textAnswer.length > 100) {
            i.textAnswer = i.textAnswer.substring(0, 100)
            i.answerStatus = true
            i.lookAllAnswers = true
          }
          return i
        })
      }
      return lookAnswers
    },
    texStatus () {
      let status = false
      if (this.type.textContent && this.type.textContent.length >= 100) {
        status = true
      }
      return status
    },
    logVideo () {
      return this.formatSecond(this.type.detail && this.type.detail.duration)
    }
  },
  methods: {
    lookTaskPics () {
      var current = 0
      wx.previewImage({
        current: current,
        urls: this.type.detail.pics
      })
    },

    formatSecond (result) {
      let m = Math.floor((result / 60) % 60)
      let s = Math.floor(result % 60)
      if (!result) {
        m = 0
        s = 0
      }
      const sm = m > 10 ? `${m}` : `0${m}`
      const ss = s > 10 ? `${s}` : `0${s}`
      return `${sm}:${ss}`
    },
    playLogVideo () {
      if (this.palyVideoStatus === 1) {
        this.$quanzis.VoicePlay().longOnPlay()
      } else {
        // 如果是暂停状态
        if (this.longNoClick === 1) {
          return
        }
        const data = {
          src: this.type.detail.url,
          content: wx.createInnerAudioContext(),
          _this: this,
          _id: this.type.id
        }
        if (data.content) {
          this.longNoClick = 1
        }
        this.$quanzis.VoicePlay().longAdd(data)
      }
    },
    stopLogVideo () {
      this.$quanzis.VoicePlay().longStop()
    },
    lookTextAnswer (index) {
      this.answer = !this.answer
      if (this.answer) {
        this.lookAnswers[index].lookAllAnswers = false
        this.lookAnswers[index].textAnswer = this.dataDetail.answers[index].textAnswer
      } else {
        this.lookAnswers[index].lookAllAnswers = true
        this.lookAnswers[index].textAnswer = this.dataDetail.answers[index].textAnswer.substring(0, 100)
      }
    },
    toTheme (topic) {
      wx.navigateTo({
        url: `../qz-theme/main?topic=${topic}`
      })
    },
    // 预览图片
    lookImg (id) {
      var current = this.type.detail.pics[id]
      wx.previewImage({
        current: current,
        urls: this.type.detail.pics
      })
    },
    lookTxt () {
      this.cont = !this.cont
    },
    questionLookImg (id) {
      var current = this.dataDetail.answers[0].pics[id]
      wx.previewImage({
        current: current,
        urls: this.dataDetail.answers[0].pics
      })
    },
    // 播放音频
    playVoice () {
      if (this.msgAudioStatus === false) return
      this.msgAudioTime = this.type.detail.duration
      this.msgAudioStatus = false
      const data = {
        src: this.type.detail.url,
        content: wx.createInnerAudioContext(),
        _id: this.type.id,
        _this: this
      }
      this.$quanzis.VoicePlay().add(data)
      this.$quanzis.VoicePlay().voiceContent.onPlay((res) => {
        this.timer = setInterval(this.voiceDown, 1000)
      })
    },
    // 播放问题音频
    questionPlayVoice (index) {
      if (this.audioStatus === false) return
      this.voiceTime = this.dataDetail.answers[index].audio.duration
      this.audioStatus = false
      const data = {
        src: this.dataDetail.answers[index].audio.url,
        content: wx.createInnerAudioContext(),
        _id: this.type.id,
        _this: this
      }
      this.$quanzis.VoicePlay().add(data)
      this.audioIndex = index
      this.$quanzis.VoicePlay().voiceContent.onPlay(() => {
        this.msgTimer = setInterval(this.questionVoiceDown, 1000)
      })
    },
    questionVoiceDown () {
      if (this.voiceTime === 0) {
        this.audioStatus = true
        clearInterval(this.msgTimer)
        this.voiceTime = this.dataDetail.answers[this.audioIndex].audio.duration
      } else {
        this.voiceTime--
      }
    },
    voiceDown () {
      if (this.msgAudioTime === 0) {
        this.msgAudioStatus = true
        clearInterval(this.timer)
        this.msgAudioTime = this.type.detail.duration
      } else {
        this.msgAudioTime--
      }
    },

    // 开始播放
    playVideo (id) {
      if (id === 1) {
        return
      }
      const data = {
        id,
        _this: this
      }
      this.$quanzis.VideoPlay().play(data)
    },

    // 播放到结尾
    bindended (id) {
      this.$quanzis.VideoPlay().end(id)
    },
    // 视频播放/继续
    bindVideoPlay (id) {
      this.$quanzis.VideoPlay().start(id)
    },
    // 暂停
    bindpause (id) {
      this.$quanzis.VideoPlay().pause(id)
    },

    toImgText (url) {
      wx.navigateTo({
        url: `../qz-webview/main?url=${url}`
      })
    },
    downFile (url) {
      // let that = this
      wx.showModal({
        title: '提示',
        content: '是否下载该文件',
        success: res => {
          if (res.confirm) {
            const downloadTask = wx.downloadFile({
              url: url,
              success: res => {
                let tempFilePath = res.tempFilePath
                wx.openDocument({
                  filePath: tempFilePath,
                  success: res => {
                  },
                  fail: res => {
                  }
                })
              }
            })
            downloadTask.onProgressUpdate((res) => {
              this.$emit('progress', res.progress, true)
              if (res.progress === 100) {
                this.$emit('progress', res.progress, false)
              }
            })
          }
        }
      })
    },
    initVoice () {
      this.$quanzis.VoicePlay().voiceInit()
      this.msgAudioStatus = true
      this.audioStatus = true
      this.playTimeWidth = ''
      this.allTimeWidth = 360
      this.playLogVideoStatus = 1
      this.playTime = '00:00'
      this.playLogVideoStatus = 1
    },
    imageLoad: function (e) {
      let that = this
      let oWidth = e.mp.detail.width
      let oHeight = e.mp.detail.height
      if (oWidth - oHeight >= 0) {
        that.imgWidth = 610
        that.imgHeight = oHeight / (oWidth / 610)
      } else {
        that.imgWidth = 480
        that.imgHeight = oHeight / (oWidth / 480)
      }
      // this.imgWidth = e.mp.detail.
    }
  },
  onLoad () {
    this.initVoice()
  },
  onUnload () {
    this.initVoice()
  },

  onHide () {
    this.initVoice()
  }
}
</script>

<style lang="scss" scoped>
.msg-wrap {
  filter: blur(14rpx);
}
.msg-box-title {
  width: 610rpx;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #232323;
}
.progressClass {
  display: fixed;
  top: 0;
  width: 750rpx;
  height: 10rpx;
  margin-bottom: 20rpx;
}
.msg-title {
  margin-right: 20rpx;
  color: $decorateColor;
}
/* text */
.text-content {
  width: 620rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.taskQuestion {
  margin-bottom: 30rpx;
  width: 610rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 8rpx 16rpx -8rpx rgba(0, 0, 0, 0.05);
  font-size: 28rpx;
  color: #b2b2b2;
}
.text-color {
  color: #b2b2b2;
}
.questionContent {
  width: 530rpx;
  font-size: 28rpx;
  margin-bottom: 30rpx;
}
.textContent {
  width: 530rpx;
  font-size: 28rpx;
  margin-top: 30rpx;
  margin-bottom: 10rpx;
}
.textAnswer {
  width: 530rpx;
  font-size: 28rpx;
  color: #232323;
  margin-bottom: 30rpx;
}
.img-size {
  width: 200rpx;
  height: 200rpx;
  margin-right: 5rpx;
  margin-bottom: 5rpx;
}
.img-content {
  width: 620rpx;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.questions-box {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding-top: 30rpx; */
  /* padding-bottom: 30rpx; */
  width: 620rpx;
  font-size: 28rpx;
  background-color: #ffffff;
  // box-shadow: 0 8rpx 16rpx -8rpx rgba(0, 0, 0, 0.05);
}
/* record */
.record-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 610rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
  background-color: #fff;
  box-shadow: 0 8rpx 16rpx -8rpx rgba(0, 0, 0, 0.05);
  border-radius: 12rpx;
}
.record-icon {
  margin-left: 30rpx;
  margin-right: 30rpx;
}
.record-time {
  font-size: 28rpx;
  color: $blackColor;
  font-family: $my-font;
}
/* video */
.video-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 610rpx;
}
.img-mask-box {
  position: relative;
  background: #000;
  display: flex;
  flex-direction: column;
}
.video-time {
  width: 100rpx;
  height: 50rpx;
  text-align: center;
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  font-size: 34rpx;
  color: #fff;
}

/* progress */
.progress-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 530rpx;
  height: 32rpx;
}
.progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 610rpx;
}
.progress-title {
  width: 570rpx;
  color: #232323;
  font-size: 28rpx;
  margin-bottom: 18rpx;
  margin-top: 30rpx;
}
.progress-time {
  color: #232323;
}

/* questions */
.questions-video {
  width: 600rpx;
  color: #232323;
}
.solution {
  margin-top: 10rpx;
  width: 530rpx;
  color: #232323;
}
.essay {
  width: 610rpx;
  height: 360rpx;
  position: relative;
}
.essay {
  position: relative;
  width: 610rpx;
}
.essay-img {
  width: 610rpx;
  height: 360rpx;
}
.essay-title {
  display: block;
  box-sizing: border-box;
  margin-top: 80rpx;
  padding-right: 40rpx;
  padding-left: 40rpx;
  width: 610rpx;
  height: 60rpx;
  font-size: 34rpx;
  color: #fff;
  line-height: 60rpx;
  text-align: right;
}
.essay-mask {
  position: absolute;
  top: 200rpx;
  width: 610rpx;
  height: 160rpx;
  /* opacity: .3; */
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3) 49%, rgba(0, 0, 0, 0.5));
}
.content-flex {
  width: 630rpx;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* padding-top: 30rpx; */
  /* padding-bottom: 30rpx; */
}
.img-play {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 48rpx;
  height: 48rpx;
  // box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
}
.mask-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  background-color: #000;
  opacity: .1;
}
.img-one-class {
  width: 610rpx;
  height: 610rpx;
}
.all {
  font-size: 26rpx;
  color: $decorateColor;
  margin-bottom: 20rpx;
}
.all-answer {
  width: 530rpx;
}
.voice-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
/* ---长音频----- */
.voice-play {
  width: 48rpx;
  height: 48rpx;
  // margin-left: 30rpx;
}
.voice-time {
  width: 140rpx;
  text-align: right;
  height: 32rpx;
  font-size: 22rpx;
  margin-left: 30rpx;
  color: #232323;
}
.voice-box-right {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.all-time {
  color: #b2b2b2;
}
.voice-progress {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 360rpx;
  height: 10rpx;
  border-radius: 6rpx;
  // margin-top: 8rpx;
}
.start-progress {
  /* width: 200rpx; */
  height: 10rpx;
  background-color: $longVideo;
}
.all-progress {
  /* width: 472rpx; */
  height: 10rpx;
  background-color: #f8f8f8;
  border-radius: 6rpx;
}
.voice-time-color {
  color: #b2b2b2;
}
.my-push-tiems {
  width: 610rpx;
  font-size: 26rpx;
  color: #232323;
  text-align: center;
}

.my-push-tiems span {
  font-size: 80rpx;
  font-family: $my-font;
  color: $decorateColor;
}

.push-border {
  width: 610rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background-color: rgba(248,248,248,1);
  margin: 20rpx 0 0 0;
}
</style>
