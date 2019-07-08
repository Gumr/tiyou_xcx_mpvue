function getTime (t) {
  const time = new Date(t).getTime()
  const date = Math.round(Date.now())
  const diff = date - time
  let day = '0'
  let dayDiff = 0
  if (diff >= 60 * 60 * 24 * 3 * 1000) {
    const d = new Date(time)
    const M = d.getMonth() + 1
    const D = d.getDate()
    day = `${M}月${D}日`
  } else if (diff >= 60 * 60 * 24 * 1000) {
    dayDiff = diff / 60 / 60 / 24 / 1000
    dayDiff = Math.round(dayDiff)
    day = `${dayDiff}天之前`
  } else if (diff >= 60 * 60 * 1000) {
    dayDiff = diff / 60 / 60 / 1000
    dayDiff = Math.round(dayDiff)
    day = `${dayDiff}小时之前`
  } else if (diff >= 60 * 1000) {
    dayDiff = diff / 60 / 1000
    dayDiff = Math.round(dayDiff)
    day = `${dayDiff}分钟之前`
  } else {
    day = `1分钟之内`
  }
  return day
}

function getVoice (time) {
  let day = '0'
  let diff = 1
  let s = 1
  if (diff <= time / 1000) {
    s = time / 1000
    day = `00:0${s}`
  } else if (diff <= time / 1000 / 10) {
    s = time / 1000 / 10
    day = `00:0${s}`
  }
  return day
}

export default {
  getTime,
  getVoice
}
