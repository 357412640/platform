// 媒资库
import axios from '@/libs/api.request'

// 频道列表
export const getChannelList = () => {
  return axios.request({
    url: '/media/channel/list',
    method: 'get'
  })
}

// 内容类型列表
export const getContentList = (cid) => {
  const params = {
    cid
  }
  return axios.request({
    url: '/media/ep/contenttype',
    params,
    method: 'get'
  })
}

// 来源列表
export const getSourceList = () => {
  return axios.request({
    url: '/media/source/list',
    method: 'get'
  })
}

// 专辑列表搜索
export const getEpgList = (params) => {
  return axios.request({
    url: '/media/epg/list',
    params,
    method: 'get'
  })
}

// 视频列表搜索
export const getVideoList = (params) => {
  return axios.request({
    url: '/media/ep/list',
    params,
    method: 'get'
  })
}

// 视频详情
export const getVideoDetail = (ep_id) => {
  const params = {
    ep_id
  }
  return axios.request({
    url: '/media/ep/detail',
    params,
    method: 'get'
  })
}

// 上下架
export const setVideosManage = ({ isOnline, ep_id }) => {
  const data = {
    isOnline,
    ep_id
  }
  return axios.request({
    url: '/media/ep/manage',
    data,
    method: 'post'
  })
}

// 运营结果列表搜索
export const getOperatingResultList = (params) => {
  return axios.request({
    url: '/media/ep/results',
    params,
    method: 'get'
  })
}

// 云视听频道列表
export const getYSTChannelList = () => {
  return axios.request({
    url: '/media/qq/chnlist',
    method: 'get'
  })
}

// 云视听运营结果列表搜索
export const getYSTResultList = (params) => {
  return axios.request({
    url: '/media/qq/results',
    params,
    method: 'get'
  })
}

// 风行频道列表
export const getFXChannelList = () => {
  return axios.request({
    url: '/media/bestv/typelist',
    method: 'get'
  })
}

// 风行付费类型列表
export const getFXPayList = () => {
  return axios.request({
    url: '/media/bestv/paylist',
    method: 'get'
  })
}

// 风行搜索结果列表
export const getFXResultList = (params) => {
  return axios.request({
    url: '/media/bestv/results',
    params,
    method: 'get'
  })
}

// 酷喵频道列表
export const getKMChannelList = () => {
  return axios.request({
    url: '/media/kumiao/typelist',
    method: 'get'
  })
}

// 酷喵标签类型列表
export const getKMLabelList = () => {
  return axios.request({
    url: '/media/kumiao/labellist',
    method: 'get'
  })
}

// 酷喵搜索结果列表
export const getKMResultList = (params) => {
  return axios.request({
    url: '/media/kumiao/results',
    params,
    method: 'get'
  })
}

// 爱奇艺移动端搜索列表
export const getIQYMOList = (params) => {
  return axios.request({
    url: '/media/iqiyimobile/results',
    params,
    method: 'get'
  })
}

// 豆果美食搜索列表
export const getDGMSList = (params) => {
  return axios.request({
    url: '/media/douguo/results',
    params,
    method: 'get'
  })
}
