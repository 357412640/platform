
export function formatDate (date, precise = false) {
  date = new Date(date * 1000)
  const year = String(date.getUTCFullYear())
  let month = String(date.getMonth() + 1)
  let day = String(date.getDate())
  month = month.length === 1 ? '0' + month : month
  day = day.length === 1 ? '0' + day : day
  if (precise) {
    let hour = String(date.getHours())
    let minute = String(date.getMinutes())
    let second = String(date.getSeconds())
    hour = hour.length === 1 ? '0' + hour : hour
    minute = minute.length === 1 ? '0' + minute : minute
    second = second.length === 1 ? '0' + second : second
    return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':')
  }
  return [year, month, day].join('-')
}

// 当选择截止时间为1月时候，应该到2月前一秒
export function delayMonth (time) {
  let month = new Date(time).getMonth() + 1
  let year = new Date(time).getFullYear()
  let newTime
  if (month === 12) {
    year = year + 1
    month = 1
  } else {
    month = month + 1
  }
  newTime = `${year}-${month}-01 00:00:00`
  return Math.floor((new Date(newTime).valueOf() - 1) / 1000)
}

export function delayDay (time) {
  return Math.floor((time + 86399000) / 1000)
}

export function delayYear (time) {
  let year = new Date(time).getFullYear() + 1
  const newTime = `${year}-01-01 00:00:00`
  return Math.floor((new Date(newTime).valueOf() - 1) / 1000)
}
