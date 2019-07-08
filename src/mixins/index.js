import wx from '@/utils/wx'

export default {
  data () {
    return {
      stauts: 0
    }
  },

  computed: {
    AppIsIpx () {
      return this.stauts
    }
  },

  created () {
    // wx.loadFontFace({
    //   family: 'League Gothic',
    //   source: 'url("https://api.tiyou.techoiceness.com/v1/static/font/LeagueGothic.otf")',
    //   success: (res) => {
    //     console.log('res', res)
    //   },
    //   fail: (err) => {
    //     console.log('eer', err)
    //   }
    // })

    wx.getSystemInfo({
      success: (res) => {
        // 根据 model 进行判断
        if (res.model.search('iPhone X') !== -1) {
          this.stauts = 1
        }
        if (res.model.search('iPhone Xs') !== -1) {
          this.stauts = 1
        }
        if (res.model.search('iPhone Xr') !== -1) {
          this.stauts = 1
        }
        if (res.model.search('iPhone Xs Max') !== -1) {
          this.stauts = 1
        }
      }
    })
  }
}
