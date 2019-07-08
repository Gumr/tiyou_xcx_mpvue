import Vue from 'vue'
import Vuex from 'vuex'

import user from '@/store/modules/user'
import classCourse from '@/store/modules/class'
import course from '@/store/modules/course'
import child from '@/store/modules/child'
import card from '@/store/modules/card'
import calendar from '@/store/modules/calendar'
import successInfo from '@/store/modules/successInfo'
import myLocation from '@/store/modules/myLocation'
import auditionCard from '@/store/modules/auditionCard'

// 社群
import themeDetail from '@/store/quanzis/modules/themeDetail'
import jumpTo from '@/store/quanzis/modules/jumpTo'
import taskDetail from '@/store/quanzis/modules/mission/taskDetail'
import circle from '@/store/quanzis/modules/circle/circle'
import circleTask from '@/store/quanzis/modules/circle/circleTask'
import circleInfo from '@/store/quanzis/modules/circle/circleInfo'
import cTaskDetail from '@/store/quanzis/modules/circle/taskDetail'
import courseTask from '@/store/quanzis/modules/circle/courseTask'
import courseInfo from '@/store/quanzis/modules/courseInfo/courseInfo'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    classCourse,
    course,
    calendar,
    child,
    card,
    successInfo,
    myLocation,
    auditionCard,
    // 社群
    themeDetail,
    jumpTo,
    taskDetail,
    circle,
    circleTask,
    circleInfo,
    cTaskDetail,
    courseTask,
    courseInfo
  }
})

export default store
