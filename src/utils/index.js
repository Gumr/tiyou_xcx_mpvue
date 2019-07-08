function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

// 把数字转化为周几，参数：系统周几的数字
function dayTurnWeek (w) {
  // 0-6对应为星期日到星期六
  let wWeek = ''
  w = Number(w)
  if (w === 0) {
    wWeek = '日'
  }
  if (w === 1) {
    wWeek = '一'
  }
  if (w === 2) {
    wWeek = '二'
  }
  if (w === 3) {
    wWeek = '三'
  }
  if (w === 4) {
    wWeek = '四'
  }
  if (w === 5) {
    wWeek = '五'
  }
  if (w === 6) {
    wWeek = '六'
  }
  return wWeek
}

export default {
  formatNumber,
  formatTime,
  dayTurnWeek
}
