import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import { getTableData, getDragList } from './data'

import * as role from './role'
import * as device from './device'
import * as domain from './domain'
import baseDataManagement from './baseDataManagement'
import * as media from './media'
import launcher_content from './launcher_content'
import * as launcher from './launcher'
import updateself from './appUpdateself'
import log from './log'

// 登录相关和获取用户信息
Mock.mock(/\/platform\/user\/login/, login)
Mock.mock(/\/platform\/showTree/, getUserInfo)
Mock.mock(/\/platform\/logout/, logout)
Mock.mock(/\/platform\/get_table_data/, getTableData)
Mock.mock(/\/platform\/get_drag_list/, getDragList)
Mock.mock(/\/platform\/save_error_logger/, 'success')

// 角色管理 接口
// 获取角色列表
Mock.mock(/\/platform\/role\/list/, role.getRoleList)
Mock.mock(/\/platform\/role\/create/, role.createRole)
Mock.mock(/\/platform\/role\/detail/, role.detailRole)
Mock.mock(/\/platform\/role\/update/, role.updateRole)
Mock.mock(/\/platform\/role\/delete/, role.deleteRole)

// 用户列表
Mock.mock(/\/platform\/user\/list/, role.getUserList)
Mock.mock(/\/platform\/user\/detail/, role.getUserDetail)
Mock.mock(/\/platform\/user\/save/, role.saveUser)

// 设备管理
Mock.mock(/\/dms\/model\/selectlist/, device.getModelList)
// Mock.mock(/\/dms\/model\/typelist/, device.getDeviceList)
Mock.mock(/\/dms\/model\/insert/, device.saveModel)
Mock.mock(/\/dms\/model\/delete/, device.deleteModel)
Mock.mock(/\/dms\/group\/selectlist/, device.getGroupList)
// Mock.mock(/\/dms\/model\/modelist/, device.getModelTypeList)
Mock.mock(/\/dms\/group\/typelist/, device.getTypeList)
Mock.mock(/\/dms\/group\/select/, device.getGroupDetail)
Mock.mock(/\/dms\/group\/insert/, device.saveOrUpdateGroup)
Mock.mock(/\/dms\/group\/delete/, device.deleteGroup)
Mock.mock(/\/dms\/group\/grouplist/, device.getGroupTypeList)
Mock.mock(/\/dms\/device\/selectlist/, device.getEquipList)
Mock.mock(/\/dms\/device\/select/, device.getEquipDetail)
Mock.mock(/\/dms\/device\/update/, device.updateEquip)
Mock.mock(/\/dms\/upload\/selectlist/, device.getUploadsList)
Mock.mock(/\/dms\/upload\/typelist/, device.getStatusList)
Mock.mock(/\/dms\/upload\/index/, device.uploadFile)
// Mock.mock(/\/dms\/actives\/list/, device.getActivieList)
// Mock.mock(/\/dms\/model\/group/, device.getModelGroup)

// 域名管理
Mock.mock(/\/dns\/resource\/selectlist/, domain.getResourceList)
Mock.mock(/\/dns\/resource\/insert/, domain.saveResource)
Mock.mock(/\/dns\/resource\/delete/, domain.deleteResource)
Mock.mock(/\/dns\/resource\/select/, domain.getResourceDetail)
Mock.mock(/\/dns\/domain\/list/, domain.getDomainList)
Mock.mock(/\/dns\/domain\/create/, domain.createDomain)
Mock.mock(/\/dns\/domain\/update/, domain.updateDomain)
Mock.mock(/\/dns\/domain\/detail/, domain.getDomainDetail)
Mock.mock(/\/dns\/domain\/devicegroup/, domain.getDeviceGroup)

// 基础数据管理
Mock.mock(/\/basedata.admin\/basedata\/table\/list/, baseDataManagement.getList)
Mock.mock(/\/basedata.admin\/basedata\/table\/delete/, baseDataManagement.delete)
Mock.mock(/\/basedata.admin\/basedata\/table\/create/, baseDataManagement.add)
Mock.mock(/\/basedata.admin\/basedata\/table\/update/, baseDataManagement.update)
Mock.mock(/\/basedata.admin\/basedata\/table\/detail/, baseDataManagement.detail)
Mock.mock(/\/basedata.admin\/basedata\/data\/list/, baseDataManagement.dataList)
Mock.mock(/\/basedata.admin\/basedata\/data\/delete/, baseDataManagement.delete)
Mock.mock(/\/basedata.admin\/basedata\/data\/add/, baseDataManagement.add)
Mock.mock(/\/basedata.admin\/basedata\/data\/update/, baseDataManagement.update)
Mock.mock(/\/basedata.admin\/basedata\/data\/detail/, baseDataManagement.dataDetail)
Mock.mock(/\/basedata.admin\/basedata\/data\/importList/, baseDataManagement.importList)

// 媒资库
// Mock.mock(/\/media\/channel\/list/, media.getChannelList)
// Mock.mock(/\/media\/ep\/contenttype/, media.getContentList)
// Mock.mock(/\/media\/source\/list/, media.getSourceList)
// Mock.mock(/\/media\/epg\/list/, media.getEpgList)
// Mock.mock(/\/media\/ep\/list/, media.getVideoList)
// Mock.mock(/\/media\/ep\/detail/, media.getVideoDetail)
// Mock.mock(/\/media\/ep\/manage/, media.setVideosManage)
// Mock.mock(/\/media\/ep\/results/, media.getOperatingResultList)
Mock.mock(/\/media\/qq\/chnlist/, media.getYSTChannelList)
Mock.mock(/\/media\/qq\/results/, media.getYSTResultList)
// 风行
Mock.mock(/\/media\/bestv\/typelist/, media.getFXChannelList)
Mock.mock(/\/media\/bestv\/paylist/, media.getFXPayList)
Mock.mock(/\/media\/bestv\/results/, media.getFXResultList)
// 酷喵
// Mock.mock(/\/media\/kumiao\/typelist/, media.getKMChannelList)
// Mock.mock(/\/media\/kumiao\/labellist/, media.getKMLabelList)
// Mock.mock(/\/media\/kumiao\/results/, media.getKMResultList)

// 爱奇艺移动
Mock.mock(/\/media\/iqiyimobile\/results/, media.getIQYMOList)
// 豆果美食
Mock.mock(/\/media\/douguo\/results/, media.getDGMSList)
// launcher

// Mock.mock(/\/content\/preview/, launcher_content.preview2)
// Mock.mock(/\/channel\/edit/, launcher_content.channelEdit)
// Mock.mock(/\/channel\/show/, launcher_content.chanelDetail)
// Mock.mock(/\/module\/list/, launcher_content.moduleList)
// Mock.mock(/\/content\/save/, launcher_content.TVpreview)
// Mock.mock(/\/content\/publish/, launcher_content.publish)
// Mock.mock(/\/channel\/list/, launcher_content.chanelList)
// Mock.mock(/\/channel\/preview/, launcher_content.TVpreview)
// Mock.mock(/\/launch\/rule\/list/, launcher_content.ruleList)
// Mock.mock(/\/channel\/typelist/, launcher_content.typelist)
// Mock.mock(/\/channel\/updatesort/, launcher_content.TVpreview)
//
// Mock.mock(/\/launcher\/rule\/list/, launcher.getRuleList)
// Mock.mock(/\/launcher\/tag\/list/, launcher.getTagList)
// Mock.mock(/\/launcher\/tag\/channel\/select/, launcher.getChannelList)
// Mock.mock(/\/launcher\/tag\/video\/suggest/, launcher.getVideoList)
// Mock.mock(/\/launcher\/tag\/actor\/suggest/, launcher.getActorList)
// Mock.mock(/\/launcher\/video\/count/, launcher.getMovieCount)
// Mock.mock(/\/launcher\/rule\/details/, launcher.getRuleDetails)
// Mock.mock(/\/launcher\/rule\/create/, launcher.saveRule)
// Mock.mock(/\/launcher\/tag\/source/, launcher.getSourceList)
//
// Mock.mock(/\/launcher\/directional\/edit/, launcher.saveDirectional)
// Mock.mock(/\/launcher\/directional\/detail/, launcher.getDirectionalDetail)
// Mock.mock(/\/launcher\/directional\/list/, launcher.getDirectionalList)
// Mock.mock(/\/launcher\/directional\/delete/, launcher.deleteDirectional)
// Mock.mock(/\/launcher\/channel\/channel/, launcher.getDirectionalChannel)
// Mock.mock(/\/upgrade\/strategy\/group/, launcher.getDirectionalContent)

// 专题管理
// Mock.mock(/\/launcher\/topic\/list/, launcher.getProjectList)
// Mock.mock(/\/launcher\/topic\/edit/, launcher.saveProject)
// Mock.mock(/\/launcher\/topic\/search/, launcher.getVideoById)
// Mock.mock(/\/launcher\/topic\/detail/, launcher.getProjectDetail)

// 应用自升级
// Mock.mock(/\/upgrade\/upgrade\/list/, updateself.updateList)
// Mock.mock(/\/upgrade\/upgrade\/edit/, updateself.updateEdit)
// Mock.mock(/\/upgrade\/strategy\/list/, updateself.strategyList)
// Mock.mock(/\/upgrade\/strategy\/edit/, updateself.updateEdit)
// Mock.mock(/\/upgrade\/upgrade\/delete/, updateself.updateEdit)
// Mock.mock(/\/upgrade\/strategy\/delete/, updateself.updateEdit)
// Mock.mock(/\/upgrade\/upgrade\/version/, updateself.updateDetail)
// Mock.mock(/\/upgrade\/strategy\/select/, updateself.strategyDetail)
// Mock.mock(/\/upgrade\/strategy\/group/, updateself.groupSel)

// Mock.mock(/\/upgrade\/data\/list/, updateself.dataList)
// Mock.mock(/\/upgrade\/data\/cnt/, updateself.dataCnt)



// log
// Mock.mock(/\/tvlog\/log\/list/, log.logList)
// Mock.mock(/\/tvlog\/log\/model\/list/, log.modelList)
// Mock.mock(/\/tvlog\/log\/sysverion\/list/, log.versionList)
// Mock.mock(/\/tvlog\/log\/status\/update/, log.updateSave)
// Mock.mock(/\/tvlog\/log\/status/, log.statusDetail)

export default Mock
