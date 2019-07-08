<template>
  <div class="warp">
    <div class="title-box">
      <div class="title-item" @click="changeTask(0)">
        <span :class="[ status === 0 ? 'change-name' : 'title-name' ]">全部</span>
        <span :class="[ status === 0 ? 'border' : '' ]"></span>
      </div>
      <div class="title-item" @click="changeTask(101)">
        <span :class="[ status === 101 ? 'change-name' : 'title-name' ]">课程</span>
        <span :class="[ status === 101 ? 'border' : '' ]"></span>
      </div>
      <div class="title-item" @click="changeTask(1)">
        <span :class="[ status === 1 ? 'change-name' : 'title-name' ]">打卡</span>
        <span :class="[ status === 1 ? 'border' : '' ]"></span>
      </div>
      <div class="title-item" @click="changeTask(2)">
        <span :class="[ status === 2 ? 'change-name' : 'title-name' ]">挑战</span>
        <span :class="[ status === 2 ? 'border' : '' ]"></span>
      </div>
    </div>
    <div class="mission">
      <w-mission
        :circleId="circleId"
        @signIn="signIn"
        :joinStatus="1"
        :taskData="getTask"
      />
    </div>
    <w-loading
      :loading='loading'
      :noData='noData'
    />
  </div>
</template>

<script>
import Wmission from '@/components/quanzis/mission'
import Wloading from '@/components/quanzis/loading'
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  components: {
    'w-mission': Wmission,
    'w-loading': Wloading
  },
  data () {
    return {
      circleId: 0,
      page: 1,
      signPage: 1,
      coursePage: 1,
      questionsPage: 1,
      taskList: [],
      loading: false,
      noData: false,
      status: 0,
      // 已经加载过
      statusList: [ 0 ]
    }
  },
  onReachBottom () {
    if (!this.vuexTaskNext(this.status) || this.vuexTaskNext(this.status) < 0) {
      this.loading = 0
      this.noData = 1
      return
    }
    if (!this.status) {
      this.page += 1
      this.getTaskList()
    }
    if (this.status === 1) {
      this.signPage += 1
      this.getSignLIst()
    }
    if (this.status === 2) {
      this.questionsPage += 1
      this.getQuestionsList()
    }
    if (this.status === 101) {
      this.coursePage += 1
      this.getCourserList()
    }
  },

  computed: {
    ...mapGetters('circleTask', [
      'vuexTaskNext',
      'vuexGetTask',
      'vuexAllTaskClass'
    ]),

    getTask () {
      return this.vuexAllTaskClass(this.status)
    },

    ...mapGetters([
    ])
  },

  methods: {
    ...mapActions('circleTask', [
      'vuexSetCricleTask',
      'vuexClearTask',
      'vuexDoneToday',
      'vuexSetAllTaskSign',
      'vuexSetAllCourse',
      'vuexSetAllQuestions'
    ]),

    changeTask (s) {
      if (this.status === s) return
      this.status = s
      // 是否加载过，加载过之后切换就不在加载
      let findElment = this.statusList.find(i => i === s)
      if (findElment || findElment === 0) {
        return
      }
      if (!this.status) {
        this.getTaskList()
      }
      if (this.status === 1) {
        this.getSignLIst()
      }
      if (this.status === 2) {
        this.getQuestionsList()
      }
      if (this.status === 101) {
        this.getCourserList()
      }
      this.statusList.push(s)
    },

    initState () {
      // 清空任务
      this.vuexClearTask([])
      this.taskList = []
      this.statusList = []
      this.page = 1
      this.signPage = 1
      this.coursePage = 1
      this.questionsPage = 1
      this.loading = 0
      this.noData = 0
    },
    signIn (text, _id, path) {
      const signParam = {
        cirlceId: this.circleId,
        taskId: _id
      }
      const SignIdData = {
        textContent: text,
        pics: path
      }
      this.$quanzis.api.circle.circleSignEd(signParam, SignIdData)
        .then(res => {
          if (res.error) {
            return
          }
          this.vuexDoneToday(_id)
        })
    },
    getTaskList () {
      let data = {
        id: this.circleId,
        page: this.page
      }
      this.vuexSetCricleTask(data)
    },

    getSignLIst () {
      let data = {
        id: this.circleId,
        page: this.signPage
      }
      this.vuexSetAllTaskSign(data)
    },

    getQuestionsList () {
      let data = {
        id: this.circleId,
        page: this.questionsPage
      }
      this.vuexSetAllQuestions(data)
    },

    getCourserList () {
      let data = {
        id: this.circleId,
        page: this.coursePage
      }
      this.vuexSetAllCourse(data)
    }
  },

  onLoad () {
    this.$quanzis.VoicePlay().voiceInit()
    // 0 全部
    this.initState()
    this.status = 0
    const { id, taskStatus } = this.$root.$mp.query
    this.circleId = id
    if (taskStatus) {
      this.status = parseInt(taskStatus)
    }
    if (this.status === 1) {
      this.getSignLIst()
    }
    if (this.status === 2) {
      this.getQuestionsList()
    }
    if (this.status === 101) {
      this.getCourserList()
    }
    if (!this.status) {
      this.getTaskList()
    }
    this.statusList.push(this.status)
  }
}
</script>

<style lang="scss" scoped>
.warp {
  width: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30rpx;
}
.title-box {
  box-sizing: border-box;
  padding-left: 60rpx;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 750rpx;
  height: 120rpx;
  box-shadow: 0 32rpx 64rpx -32rpx rgba(0, 0, 0, 0.1);
  background-color: #fff;
  z-index: 9999;
}
.mission {
  margin-top: 160rpx;
}
.title-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30rpx;
}
.border {
  width: 40rpx;
  height: 6rpx;
  background-color: $decorateColor;
}
.title-name {
  font-size: 48rpx;
  color: #eee;
  font-weight: 500;
}
.change-name {
  margin-top: 6rpx;
  font-size: 48rpx;
  color: #1e2832;
  font-weight: 500;
}
</style>
