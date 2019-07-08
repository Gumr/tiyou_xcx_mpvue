<template>
  <web-view :src="textImg"></web-view>
</template>

<script>
export default {
  data () {
    return {
      textImg: ''
    }
  },
  onLoad () {
    this.textImg = this.$root.$mp.query.url
  }
}
</script>

<style scoped>
</style>
