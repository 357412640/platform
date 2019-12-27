import axios from '@/libs/http'
import {CancelToken} from 'axios'

export let cancel
export const getPreview = (params) => {
  // cancel && cancel()
  return axios.request({
    url: `/launcher/content/preview`,
    params,
    method: 'get',
    cancelToken: new CancelToken(function executor(c) {
      // executor 函数接收一个 cancel 函数作为参数
      cancel = c
    })
  })
}

export const httpChannelEdit = (data) => {
  return axios.request({
    url: '/launcher/channel/edit',
    data,
    method: 'post'
  })
}

export const httpChannelDetail = (params) => {
  return axios.request({
    url: '/launcher/channel/show',
    params,
    method: 'get'
  })
}

export const httpModuleList = (data) => {
  return axios.request({
    url: '/launcher/module/list',
    data,
    method: 'post'
  })
}

export const httpSave = (data) => {
  return axios.request({
    url: '/launcher/content/save',
    data,
    method: 'post'
  })
}

export const httpPublish = (data) => {
  return axios.request({
    url: '/launcher/content/publish',
    data,
    method: 'post'
  })
}

export const httpTVPreview = (data) => {
  return axios.request({
    url: '/launcher/channel/preview',
    data,
    method: 'post'
  })
}

export const httpChannelList = (params) => {
  return axios.request({
    url: '/launcher/channel/list',
    params,
    method: 'get'
  })
}

export const httpRuleList = (params) => {
  return axios.request({
    url: '/launcher/rule/list',
    params,
    method: 'get'
  })
}

export const httpUpdateSort = (data) => {
  return axios.request({
    url: '/launcher/channel/updatesort',
    data,
    method: 'post'
  })
}

export const reqTypelist = data => { return axios.send('/launcher/content/typelist', data) }
