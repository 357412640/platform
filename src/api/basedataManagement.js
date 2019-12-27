import axios from '@/libs/http'

export const getList = (params) => {
  return axios.request({
    url: '/basedata/table/list',
    params,
    method: 'get'
  })
}
export const deleteTable = (data) => {
  return axios.request({
    url: '/basedata/table/delete',
    data,
    method: 'post'
  })
}

export const addForm = (data) => {
  return axios.request({
    url: '/basedata/table/create',
    data,
    method: 'post'
  })
}

export const updateForm = (data) => {
  return axios.request({
    url: '/basedata/table/update',
    data,
    method: 'post'
  })
}

export const getDetail = (params) => {
  return axios.request({
    url: '/basedata/table/detail',
    params,
    method: 'get'
  })
}

// 数据
export const getDataList = (params) => {
  return axios.request({
    url: '/basedata/data/list',
    params,
    method: 'get'
  })
}

export const deleteData = (data) => {
  return axios.request({
    url: '/basedata/data/delete',
    data,
    method: 'post'
  })
}

export const addData = (data) => {
  return axios.request({
    url: '/basedata/data/insert',
    data,
    method: 'post'
  })
}

export const updateData = (data) => {
  return axios.request({
    url: '/basedata/data/update',
    data,
    method: 'post'
  })
}

export const getDataDetail = (params) => {
  return axios.request({
    url: '/basedata/data/detail',
    params,
    method: 'get'
  })
}

export const getImportList = (data) => {
  return axios.request({
    url: '/basedata/data/importList',
    data,
    method: 'post'
  })
}

export const exportTemplate = (data) => {
  return axios.request({
    url: '/basedata/data/exportTemplate',
    data,
    method: 'post'
  })
}

export const dataExport = (data) => {
  return axios.request({
    url: '/basedata/data/export',
    data,
    method: 'post'
  })
}

export const dataImport = (data) => {
  return axios.request({
    url: '/basedata/data/import',
    data,
    method: 'post'
  })
}
