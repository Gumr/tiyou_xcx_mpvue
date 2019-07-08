<template>
  <!-- 日历组件 -->
  <div class="contain">
    <!-- <div v-if="newdayList.length"> -->
    <div>
      <div class="scroll-day" scroll-x>
        <div v-for="(item, index) in newdayList"
        :key="index"
        @click="changeDate(item.time, index)"
        :class="['scroll-item', index % 2 !== 0 ? 'scroll-item-white' : 'scroll-item-gray']"
        :style="item.clickStatus === 0 ? 'background-color: #ffcd76;' : ''">
          <p class="scroll-item-week" :style="item.clickStatus === 0 ? 'color: #ffffff;' : 'color: #b2b2b2;'">{{ item.week }}</p>
          <p class="scroll-item-day" :style="item.clickStatus === 0 ? 'color: #ffffff;' : 'color: #888888;'">{{ item.day }}</p>
          <p class="scroll-item-month" :style="item.clickStatus === 0 ? 'color: #ffdea5;' : 'color: #eeeeee;'">{{ item.month }}</p>
          <p v-if="item.total > 0" class="scroll-item-booked">
            <!-- 颜色：e满了、yellow充足，>5，点击：e满了、#ffffff充足 -->
            <span v-if="item.status === 0" class="scroll-item-booked-eee">满</span>
            <span v-if="item.status === 1" :style="item.clickStatus === 0 ? 'color: #ffffff;' : 'color: #ffcd76;'">
              余{{ item.remainingNumber || 1 }}
            </span>
            <span v-if="item.status === 2" :style="item.clickStatus === 0 ? 'color: #ffffff;' : 'color: #ffcd76;'">充足</span>
          </p>
          <p v-if="item.total <= 0" class="scroll-item-booked">
            <span v-if="item.status === 4" class="scroll-item-booked-none">无</span>
            <span v-if="item.status === 3" class="scroll-item-booked-none">满</span>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

// import moment from 'moment'
export default {
  props: {
    calendartype: {
      type: String
    },
    calendarClass: {
      type: Object,
      default: () => ({})
    },
    dayList: {
      type: Array,
      default: () => ([])
    }
  },

  data () {
    return {
      // dayList: [],
      clickIndex: 0
    }
  },

  computed: {
    ...mapGetters('calendar', [
      'vuexGetCalendarList'
    ]),

    newdayList () {
      console.log('mapGetters', this.vuexGetCalendarList)
      return this.vuexGetCalendarList
    }
  },

  methods: {
    ...mapActions('calendar', [
      'vuexSetCalendarList'
    ]),

    initState () {
      this.clickIndex = 0
    },

    // 切换日历到某一天
    changeDate (date, index) {
      let arr = [ ...this.vuexGetCalendarList ]
      // 如果没有arr return 不然undefined
      if (!arr.length) {
        return
      }
      if (arr[index] && arr[index].clickStatus === 0) {
        return
      }
      const data = {
        type: this.calendartype,
        date: date,
        index
      }
      // 更新日期点击状态
      // arr[this.clickIndex].clickStatus = 1
      arr[index].clickStatus = 0
      for (let i = 0; i < arr.length; i++) {
        if (i !== index) {
          arr[i].clickStatus = 1
        }
      }
      this.vuexSetCalendarList(arr)
      this.clickIndex = index
      this.$emit('setDateByCalender', data)
    }
  },

  onLoad () {
    this.initState()
  },

  onUnload () {
    this.initState()
  }

}
</script>

<style scoped>
.contain {
  background-color: #fff;
}

.scroll-day {
  width: 100%;
  height: 160rpx;
  white-space: nowrap;
  display: flex;
  justify-content: center;
}
.scroll-item {
  position: relative;
  text-align: center;
  width: 100rpx;
  height: 160rpx;
  display: inline-block;
}
.scroll-item-yellow {
  background-color: #ffcd76;
}

.scroll-item-gray {
  background-color: #f8f8f8;
}
.scroll-item-white {
  background-color: #ffffff;
}

.scroll-item-week {
  margin-top: 10rpx;
  width: 100rpx;
  height: 32rpx;
  font-size: 22rpx;
  font-weight: 500;
  line-height: 32rpx;
}

.scroll-item-day {
  z-index: 1;
  position: relative;
  margin: 10rpx 0;
  width: 100rpx;
  height: 56rpx;
  font-family: 'League Gothic';
  font-size: 48rpx;
  line-height: 56rpx;
}

.scroll-item-month {
  position: absolute;
  right: 10rpx;
  bottom: 42rpx;
  width: 60rpx;
  height: 32rpx;
  font-size: 22rpx;
  font-weight: 500;
  line-height: 32rpx;
}

.scroll-item-booked {
  width: 100rpx;
  height: 32rpx;
  font-size: 22rpx;
  font-weight: 500;
  line-height: 32rpx;
}

.scroll-item-booked-eee {
  color: #eeeeee;
}
.scroll-item-booked-none {
  color: #eeeeee;
}

</style>
