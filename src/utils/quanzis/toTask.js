function toUrl (circleId, id) {
  // 挑战任务
  let taskType = 2
  let taskOver = 0
  wx.navigateTo({
    url: `../qz-mission/main?id=${circleId}&taskId=${id}&type=${taskType}&taskStatus=${taskOver}`
  })
}

function toTask (index = 0, circleInfo = []) {
  let id = circleInfo[index].detail.task.id
  let circleId = circleInfo[index].circleId
  toUrl(circleId, id)
}

function msgToTask (circleInfo = []) {
  let id = circleInfo.detail.task.id
  let circleId = circleInfo.circleId
  toUrl(circleId, id)
}

export default {
  toTask,
  msgToTask
}
