class Video {
  constructor () {
    this.videoContext = {}
    // 上一次id
    this._id = ''
    // 储存上一次的 this
    this._this = ''
  }

  play ({ id, _this }) {
    if (this._id !== id && this._id) {
      this._id = this._id.toString()
      let oldVideoContent = wx.createVideoContext(this._id)
      oldVideoContent.pause()
      this._this.curr_id = ''
    }
    this._id = id
    this._this = _this
    this.start(id)
  }

  // 开始
  start (id) {
    this._this.curr_id = id
    // id = toString(id)
    id = id.toString()
    let myVideoContext = wx.createVideoContext(id)
    myVideoContext.play()
  }

  // 暂停
  pause (id) {
    id = id.toString()
    let myVideoContext = wx.createVideoContext(id)
    myVideoContext.pause()
  }

  // 结束
  end (id) {
    this._this.curr_id = ''
    // id = toString(id)
    id = id.toString()
    let myVideoContext = wx.createVideoContext(id)
    myVideoContext.pause()
  }
}

let getVideoPlay = (function () {
  let video
  return function () {
    if (!video) {
      video = new Video()
    }
    return video
  }
}())

export default getVideoPlay
