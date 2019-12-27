import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
import {forEach, hasOneOf, objEqual} from '@/libs/tools'

export const TOKEN_KEY = 'token'

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, {expires: config.cookieExpires || 1})
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, menu) => {
  if (item.meta && item.meta.key) {
    if (~menu.indexOf(item.meta.key)) return true
    else return false
  } else return true
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 *        {Array} menu 用户权限菜单key列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, menu, is_admin) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      // debugger
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && (showThisMenuEle(item, menu) || is_admin === 1)) {
        obj.children = getMenuByRouter(item.children, menu, is_admin)
        if (obj.children.length) {
          res.push(obj)
        }
      } else {
        if (item.meta && item.meta.href) obj.href = item.meta.href
        if (showThisMenuEle(item, menu) || is_admin === 1) res.push(obj)
      }
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = {...homeRoute, icon: homeRoute.meta.icon}
  let routeMetched = route.matched
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hideInBread
  }).map(item => {
    let meta = {...item.meta}
    if (meta.title && typeof meta.title === 'function') meta.title = meta.title(route)
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{...homeItem, to: homeRoute.path}, ...res]
}

export const getRouteTitleHandled = (route) => {
  let router = {...route}
  let meta = {...route.meta}
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') title = meta.title(router)
    else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => {
  let title = item.meta.title
  if (!title) return
  if (vm.$config.useI18n) {
    if (title.includes('{{') && title.includes('}}') && vm.$config.useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
    else title = vm.$t(item.name)
  } else title = (item.meta && item.meta.title) || item.name
  return title
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const {name, path, meta} = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({name, path, meta})
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (menu, route) => {
  if (route.meta && route.meta.key) return ~menu.indexOf(route.meta.key)
  else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, menu, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(menu, item)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t')
      }).map(item => {
        return item[0].split(',')
      })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上传的不是Csv文件'))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}

export const sessionSave = (key, value) => {
  sessionStorage.setItem(key, value)
}

export const sessionRead = (key) => {
  return sessionStorage.getItem(key) || ''
}

// 获取被修改的角色信息
export const getEditRole = (role) => {
  let newRole = role
  return newRole
}

// 克隆对象
export const deepClone = (obj) => {
  let result
  let oClass = isClass(obj)
  // 确定result的类型
  if (oClass === 'Object') {
    result = {}
  } else if (oClass === 'Array') {
    result = []
  } else {
    return obj
  }
  for (let key in obj) {
    let copy = obj[key]
    if (isClass(copy) === 'Object') {
      result[key] = deepClone(copy)// 递归调用
    } else if (isClass(copy) === 'Array') {
      result[key] = deepClone(copy)
    } else {
      result[key] = obj[key]
    }
  }
  return result
}
export const isClass = (o) => {
  if (o === null) return 'Null'
  if (o === undefined) return 'Undefined'
  return Object.prototype.toString.call(o).slice(8, -1)
}

export const isDev = () => {
  return process.env.NODE_ENV !== 'production'
}

// 修改时间格式 2018.11.11 14:14:14，传入的是秒时间戳
export const resetTime = (t) => {
  let time = t * 1000
  // time 是时间戳格式
  if (isNaN(time) || time === 0) {
    // console.log(time + '不是时间戳')
    return '-'
  }
  let date = new Date(time)
  let year = date.getFullYear()
  let month = (date.getMonth() + 1).toString().length > 1 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  let day = date.getDate().toString().length > 1 ? date.getDate() : '0' + date.getDate()
  let hour = date.getHours().toString().length > 1 ? date.getHours() : '0' + date.getHours()
  let minute = date.getMinutes().toString().length > 1 ? date.getMinutes() : '0' + date.getMinutes()
  let second = date.getSeconds().toString().length > 1 ? date.getSeconds() : '0' + date.getSeconds()
  return year + '.' + month + '.' + day + ' ' + hour + ':' + minute + ':' + second
}
// Date返回年月日组成的字符串 20190116
export const resetTime2 = (t) => {
  let date = new Date(t)
  let year = date.getFullYear()
  let month = (date.getMonth() + 1).toString().length > 1 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  let day = date.getDate().toString().length > 1 ? date.getDate() : '0' + date.getDate()
  return year + month + day
}
// 20190116 时间个格式修改 2019-01-16
export const resetTime3 = (time) => {
  let year = time.slice(0, 4)
  let month = time.slice(4, 6)
  let day = time.slice(6, 8)
  return year + '-' + month + '-' + day
}

// 秒 改 分秒 3000 -> 50'00''
export const resetTime4 = (seconds) => {
  console.log(seconds)
  let min = parseInt(seconds / 60)
  let sec = (seconds % 60).toString().length > 1 ? seconds % 60 : '0' + seconds % 60
  return min + '\'' + sec + '\'\''
}

// 设置当前页序号 根据当前页数，展示数量
export const setSerialNum = (list, pageInfo) => {
  let current = pageInfo.current
  let pageSize = pageInfo.page_size
  let startNum
  if (!current) {
    current = 1
  }
  if (!pageSize) {
    pageSize = 20
  }
  startNum = (current - 1) * pageSize + 1
  for (let i = 0; i < list.length; i++) {
    list[i].number = startNum
    startNum++
  }
  return list
}

// 选择器数组头部插入全部选项，默认为{id: -1, name: 全部}
export const setSelectAll = (li, obj) => {
  let list = li
  let allItem = obj || {id: -1, name: '全部'}
  list.unshift(allItem)
  return list
}
