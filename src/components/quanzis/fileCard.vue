<template>
  <div class="file-card">
    <image v-if="filecard === 'application/zip'" class="img-size" src="https://api.tiyou.techoiceness.com/v1/static/qz-images/img_zip.png" />
    <image v-if="filecard === 'application/vnd.ms-excel'" class="img-size" src="https://api.tiyou.techoiceness.com/v1/static/qz-images/img_xls.png" />
    <image v-if="filecard === 'application/pdf'" class="img-size" src="https://api.tiyou.techoiceness.com/v1/static/qz-images/img_pdf.png" />
    <!-- <image v-if="mimeType === 'ppt'" class="img-size" src="../../static/qz-images/img_ppt.png" /> -->
    <image v-if="filecard === 'application/msword'" class="img-size" src="https://api.tiyou.techoiceness.com/v1/static/qz-images/img_doc.png" />
    <div class="file-right">
      <span class="file-size">{{ dataSize }}</span>
      <span class="file-category">{{ filename }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['filecard', 'size', 'filename'],
  data () {
    return {
      fileSize: '',
      dataSize: ''
    }
  },

  computed: {
  },

  methods: {
    bytesToSize (bytes) {
      if (bytes === 0) return '0 B'
      let k = 1000
      let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let i = Math.floor(Math.log(bytes) / Math.log(k))
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
    }
  },
  onLoad () {
    this.dataSize = this.bytesToSize(this.size)
  }
}
</script>

<style>
.file-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 610rpx;
  height: 160rpx;
  background-color: #fff;
  box-shadow: 0 8rpx 16rpx -8rpx rgba(0, 0, 0, 0.05);
}
.img-size {
  width: 200rpx;
  height: 160rpx;
}
.file-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  margin-bottom: 20rpx;
  margin-right: 40rpx;
}
.file-size {
  font-size: 28rpx;
  color: #b2b2b2;
}
.file-category {
  text-align: right;
  width: 360rpx;
  font-size: 34rpx;
  color: #232323;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
/* essay */
</style>
