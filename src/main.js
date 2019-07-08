import Vue from 'vue'
import App from './App'
import store from '@/store'
import wxApi from '@/utils/wxApi'
import api from '@/utils/api'
import wxLogin from '@/utils/wxLogin'
import index from '@/utils/index'
import mixins from '@/mixins/index'
import quanzis from '@/utils/quanzis/index.js' // 社群
// 全局引入字体
import '../static/style/font.css'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$quanzis = quanzis // 社群
Vue.prototype.$store = store
Vue.prototype.$api = api
Vue.prototype.$index = index
Vue.prototype.$wxApi = wxApi
Vue.prototype.$wxLogin = wxLogin

Vue.mixin(mixins)

const app = new Vue({
  store,
  ...App
})
app.$mount()
