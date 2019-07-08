class Voice {
  constructor () {
    this.voiceContent = {}
    this._id = ''
    this.src = ''
    // 储存上一次的 this
    this._this = ''
  }

  add ({ src, content, _this, _id }) {
    if (this._id !== _id && this.src) {
      // 销毁上一个实例
      this.destroy()
    }
    if (this._this) {
      this._this.longNoClick = 0
    }
    // 创建音频对象
    this.voiceContent = content
    this.voiceContent.src = src
    this.src = src
    this._this = _this
    this._id = _id
    // this._this = this
    this.play()
  }

  play (src) {
    this.voiceContent.play()
    this.voiceContent.onError(() => {
      wx.showToast({
        icon: 'none',
        title: '音频播放错误'
      })
      this._this.audioStatus = true
      this._this.msgAudioStatus = true
      this.voiceContent.destroy()
    })
    this.voiceContent.onEnded(() => {
      this.voiceContent.destroy()
    })
  }

  longAdd ({ src, content, _this, _id }) {
    if (this._id !== _id && this.src) {
      // 销毁上一个实例
      this.destroy()
    }
    // if (this.voiceContent === content) {
    //   this.voiceContent.destroy()
    // }
    // 创建音频对象
    this.voiceContent = content
    this.voiceContent.src = src
    this.src = src
    this._this = _this
    this._id = _id
    // this._this = this
    this.longPlay()
  }

  // 长音频播放
  longPlay () {
    this.longContentPlay()
    this.voiceContent.onTimeUpdate(() => {
      let w = this.voiceContent.currentTime / this.voiceContent.duration * 360
      let all = (this.voiceContent.duration - this.voiceContent.currentTime) / this.voiceContent.duration * 360
      this._this.playTimeWidth = `${w}`
      this._this.allTimeWidth = `${all}`
      this._this.playTime = this._this.formatSecond(this.voiceContent.currentTime)
    })
    this.voiceContent.onError(() => {
      wx.showToast({
        icon: 'none',
        title: '音频播放错误'
      })
      this.voiceInit()
    })
    this.voiceContent.onEnded(() => {
      this._this.allTimeWidth = 360
      this.longInit()
    })
  }

  // 长音频暂停后播放
  longOnPlay () {
    this.longContentPlay()
    this.voiceContent.onTimeUpdate(() => {
      let w = this.voiceContent.currentTime / this.voiceContent.duration * 360
      let all = (this.voiceContent.duration - this.voiceContent.currentTime) / this.voiceContent.duration * 360
      this._this.playTimeWidth = `${w}`
      this._this.allTimeWidth = `${all}`
      this._this.playTime = this._this.formatSecond(this.voiceContent.currentTime)
    })
  }

  // 长音频暂停
  longStop () {
    this.voiceContent.pause()
    this.voiceContent.onPause(() => {
      this._this.playLogVideoStatus = 1
      this._this.palyVideoStatus = 1
    })
  }

  destroy () {
    this.voiceContent.destroy()
    // 录音状态init
    this._this.audioStatus = true
    this._this.msgAudioStatus = true
    clearInterval(this._this.msgTimer)
    clearInterval(this._this.timer)
    // 长音频init
    this.longInit()
  }

  longContentPlay () {
    this.voiceContent.play()
    this.voiceContent.onPlay(() => {
      this._this.playLogVideoStatus = 0
    })
  }

  longInit () {
    this._this.playLogVideoStatus = 1
    this._this.playTimeWidth = ''
    this._this.palyVideoStatus = 0
    this._this.playTime = this._this.formatSecond(0)
    this.src = ''
    this._this.longNoClick = 0
  }

  voiceInit () {
    if (!this._id) return
    this.voiceContent.destroy()
    this._this.longNoClick = 0
    this.longInit()
    this._this.audioStatus = true
    this._this.msgAudioStatus = true
    clearInterval(this._this.msgTimer)
    clearInterval(this._this.timer)
    this.voiceContent = {}
    this._id = ''
    this.src = ''
    this._this = ''
  }
}

let getVoicePlay = (function () {
  let voice
  return function () {
    if (!voice) {
      voice = new Voice()
    }
    return voice
  }
}())

export default getVoicePlay
