import {
  getEditRole,
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead
} from '@/libs/util'
import beforeClose from '@/router/before-close'
import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
import axios from 'axios'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false,
    editRole: {},
    platformName: '',
    filesListShow: false,
    filesList: [],
    filesUploading: false,
    filesIndex: 0,
    mediaAssets: {
      current: 1,
      flag: false,
      formCustom: '',
      scrollTop: 0
    },
    assignName: '' // tab隐藏时指定路由
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.menu, rootState.user.is_admin),
    errorCount: state => state.errorList.length,
    editRole: state => state.editRole,
    getPlatformName: state => state.platformName,
    getFilesList: state => state.filesList,
    getMediaAssetsCurrent: state => state.mediaAssets.current,
    getMediaAssetsFlag: state => state.mediaAssets.flag,
    getMediaAssetsFormCustom: state => state.mediaAssets.formCustom,
    getMediaAssetsScrollTop: state => state.mediaAssets.scrollTop,
    getAssignName: state => state.assignName
  },
  mutations: {
    setEditRole (state, role) {
      state.editRole = getEditRole(role)
    },
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route)
          }
        })
      } else {
        closePage(state, route)
      }
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError (state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus (state, status = true) {
      state.hasReadErrorPage = status
    },
    setPlatformName (state, platformName) {
      state.platformName = platformName
    },
    setFilesListShow (state, flag) {
      state.filesListShow = flag
    },
    setFilesList (state, files) {
      state.filesList = files
    },
    setFilesUploading (state, flag) {
      state.filesUploading = flag
    },
    setFilesIndex (state, index) {
      state.filesIndex = index
    },
    setMediaAssetsCurrent (state, current) {
      state.mediaAssets.current = current
    },
    setMediaAssetsFlag (state, flag) {
      state.mediaAssets.flag = flag
    },
    setMediaAssetsFormCustom (state, formCustom) {
      state.mediaAssets.formCustom = formCustom
    },
    setMediaAssetsScrollTop (state, scrollTop) {
      state.mediaAssets.scrollTop = scrollTop
    },
    setAssignName (state, route) {
      if (route.meta.name) {
        state.assignName = route.meta.name
      } else {
        state.assignName = ''
      }
    }
  },
  actions: {
    addErrorLog ({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
      // const { user: { token, userId, userName } } = rootState
      // let data = {
      //   ...info,
      //   time: Date.parse(new Date()),
      //   token,
      //   userId,
      //   userName
      // }
      // saveErrorLogger(info).then(() => {
      //   commit('' +
      //     '', data)
      // })
    },
    // 上传文件列表
    // 参数： 上传地址， 文件列表
    uploadFiles ({commit, rootState}, filesInfo) {
      if (filesInfo.filesList.length) {
        // 获取之前的filesList, 与本次提交的的文件列表合并 继续上传
        let oldFilesList = rootState.app.filesList
        let url = filesInfo.url
        let fileArr = []
        for (let file in filesInfo.filesList) {
          if (Object.prototype.toString.call(filesInfo.filesList[file]) === '[object File]') {
            filesInfo.filesList[file].status = '等待上传'
            filesInfo.filesList[file].uploadUrl = url
            fileArr.push(filesInfo.filesList[file])
          }
        }
        let newFilesList
        if (!oldFilesList.length) {
          newFilesList = fileArr
        } else {
          newFilesList = oldFilesList.concat(fileArr)
        }
        commit('setFilesList', newFilesList)
        commit('setFilesListShow', true)
        // 如果没有上传，则开始新的上传
        if (!rootState.app.filesUploading) {
          commit('setFilesUploading', true)
          // 上传方法
          let uploadFile = () => {
            let url
            let formData = new FormData()
            let index = rootState.app.filesIndex
            url = rootState.app.filesList[index].uploadUrl
            rootState.app.filesList[index].status = '<e style="color:#2db7f5">上传中，请等待...</e>'
            // 数据管理加传参tableid、xlsfile、type
            if (filesInfo.data) {
              formData.append('tableid', filesInfo.data.tableid)
              formData.append('xlsfile', rootState.app.filesList[index])
              formData.append('type', filesInfo.data.type)
            } else {
              formData.append('uploadFile', rootState.app.filesList[index])
            }
            axios.post(url, formData).then(res => {
              let data = res.data
              if (data.errno === 10000) {
                rootState.app.filesList[index].status = '<e style="color:#19be6b">上传完成</e>'
              } else {
                rootState.app.filesList[index].status = '<e style="color:#ed4014">' + data.errmsg + '</e>'
              }
              let next = index + 1
              commit('setFilesIndex', next)
              if (rootState.app.filesList[next]) {
                uploadFile(url)
              } else {
                commit('setFilesUploading', false)
              }
            })
          }
          uploadFile(url)
        }
      }
    }
  }
}
