<template>
  <div class="page">
    <rich-text :nodes="info.detail"></rich-text>
  </div>
</template>

<script>
export default {
  components: {
  },

  data () {
    return {
      info: {}
    }
  },

  methods: {
    // 获取协议信息
    async getAgreement (data) {
      let res = await this.$api.lesson.agreement(data)
      if (res.msg) return
      this.setTitle(res.title)
      this.info = res
    },

    // 改变标题
    setTitle (title) {
      wx.setNavigationBarTitle({
        title: `${title}`
      })
    },

    initState () {
      this.info = {}
    }
  },

  onLoad (options) {
    let { code = '' } = options
    let data = {
      code
    }
    this.getAgreement(data)
  },

  onUnlaod () {
    this.initState()
  }
}
</script>

<style scoped>
</style>
