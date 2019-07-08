<template>
  <div class="page">
    <map
      class="map"
      id="myMap"
      :style="{ height: windowHeight + 'px' }"
      :latitude="lat"
      :longitude="lon"
      :markers="markers"
      show-location="1"
    />
  </div>
</template>

<script>
export default {
  components: {
  },

  data () {
    return {
      lat: '',
      lon: '',
      windowHeight: '',
      windowWidth: '',
      markers: [],
      myLng: '',
      myLat: ''
    }
  },

  methods: {
    initState () {
      this.lat = ''
      this.lon = ''
      this.windowHeight = ''
      this.windowWidth = ''
      this.markers = []
      this.myLng = ''
      this.myLat = ''
    }
  },

  onLoad (options) {
    let { lat, lon, myLng, myLat } = options
    this.lat = lat
    this.lon = lon
    this.myLng = myLng
    this.myLat = myLat
    wx.getSystemInfo({
      success: (res) => {
        this.windowHeight = res.windowHeight
        this.windowWidth = res.windowWidth
      }
    })
    // this.markers = [{
    //   latitude: this.lat,
    //   longitude: this.lon,
    //   iconPath: '../../static/icon/location.png'
    // }]
    // this.markers = [{
    //   latitude: this.myLat,
    //   longitude: this.myLng,
    //   iconPath: '../../static/icon/location.png'
    // }]
    this.markers = [
      {
        id: 1,
        latitude: this.lat,
        longitude: this.lon
      }]
  },

  onUnload () {
    this.initState()
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 500rpx;
  box-sizing: border-box;
  padding: 30rpx;
}
</style>
