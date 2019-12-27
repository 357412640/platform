// launcher
import axios from '@/libs/api.request'

// 规则管理
// 获取规则列表
export const getRuleList = (params) => {
  return axios.request({
    url: '/launcher/rule/list',
    params,
    method: 'get'
  })
}

// 获取来源列表
export const getSourceList = () => {
  return axios.request({
    url: '/launcher/tag/source',
    method: 'get'
  })
}

// 获取标签列表
export const getTagList = (params) => {
  return axios.request({
    url: '/launcher/tag/list',
    params,
    method: 'get'
  })
}

// 影片数量接口
export const getMovieCount = (params) => {
  return axios.request({
    url: '/launcher/rule/video/count',
    method: 'get',
    params: params
  })
}

// 获取规则详情
export const getRuleDetails = (id) => {
  const params = {
    id
  }
  return axios.request({
    url: '/launcher/rule/details',
    method: 'get',
    params
  })
}

// 规则保存
export const saveRule = (data) => {
  return axios.request({
    url: '/launcher/rule/create',
    method: 'post',
    data
  })
}

// 定向推广
// 1、保存推广
export const saveDirectional = (data) => {
  return axios.request({
    url: '/launcher/directional/edit',
    method: 'post',
    data
  })
}

// 2、获取推广详情
export const getDirectionalDetail = (id) => {
  const params = {
    id
  }
  return axios.request({
    url: '/launcher/directional/detail',
    method: 'get',
    params
  })
}

// 3、推广列表/搜索
export const getDirectionalList = (params) => {
  return axios.request({
    url: '/launcher/directional/list',
    method: 'get',
    params
  })
}

// 4、删除
export const deleteDirectional = (id) => {
  const data = {
    id
  }
  return axios.request({
    url: '/launcher/directional/delete',
    method: 'post',
    data
  })
}

// 5、频道列表
export const getDirectionalChannel = () => {
  return axios.request({
    url: '/launcher/channel/channel',
    method: 'get'
  })
}

// 6、设备分组数据
export const getDirectionalContent = () => {
  return axios.request({
    url: '/upgrade/strategy/group',
    method: 'get'
  })
}


// 专题管理接口
// 专题列表
export const getProjectList = (params) => {
  return axios.request({
    url: '/launcher/topic/list',
    params,
    method: 'get'
  })
}

// 保存专题
export const saveProject = (data) => {
  return axios.request({
    url: '/launcher/topic/edit',
    data,
    method: 'post'
  })
}

// 视频查询
export const getVideoById = (params) => {
  return axios.request({
    url: '/launcher/topic/search',
    params,
    method: 'get'
  })
}

// 专题详情
export const getProjectDetail = (params) => {
  return axios.request({
    url: '/launcher/topic/detail',
    params,
    method: 'get'
  })
}
