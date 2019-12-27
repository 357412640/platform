import axios from '@/libs/api.request'
import {default as dyAxios} from '@/libs/http'
// 设备管理请求
// 获取型号列表
export const getModelList = ({ name, page, page_size }) => {
  const params = {
    name,
    page,
    page_size
  }
  return axios.request({
    url: '/dms/model/selectlist',
    params,
    method: 'get'
  })
}
// 获取设备类型
export const getDeviceList = () => {
  return axios.request({
    url: '/dms/model/typelist',
    method: 'get'
  })
}
// 保存型号
export const saveModel = ({ name, external_name, device_type }) => {
  const data = {
    name,
    external_name,
    device_type
  }
  return axios.request({
    url: '/dms/model/insert',
    data,
    method: 'post'
  })
}

// 删除型号
export const deleteModel = (id) => {
  const data = {
    id
  }
  return axios.request({
    url: '/dms/model/delete',
    data,
    method: 'post'
  })
}

// 获取分组列表
export const getGroupList = ({ name, model_id, type, page, page_size }) => {
  const params = {
    name,
    model_id,
    type,
    page,
    page_size
  }
  return axios.request({
    url: '/dms/group/selectlist',
    params,
    method: 'get'
  })
}

// 获取分组信息
export const getGroupDetail = (id) => {
  const params = {
    id
  }
  return axios.request({
    url: '/dms/group/select',
    params,
    method: 'get'
  })
}

// 获取型号列表
export const getModelTypeList = (params) => {
  return axios.request({
    url: '/dms/model/modelist',
    method: 'get',
    params
  })
}

// 获取类型列表
export const getTypeList = () => {
  return axios.request({
    url: '/dms/group/typelist',
    method: 'get'
  })
}

// 保存/更新分组信息
export const saveOrUpdateGroup = ({ id, name, model_id, type, remark, act }) => {
  const data = {
    id,
    name,
    model_id,
    type,
    remark,
    act
  }
  return axios.request({
    url: '/dms/group/insert',
    data,
    method: 'post'
  })
}

// 删除分组
export const deleteGroup = (id) => {
  const data = {
    id
  }
  return axios.request({
    url: '/dms/group/delete',
    data,
    method: 'post'
  })
}

// 获取设备列表
export const getEquipList = ({ mac, sn, group_id, model_id, page, page_size }) => {
  const params = {
    mac,
    sn,
    group_id,
    model_id,
    page,
    page_size
  }
  return axios.request({
    url: '/dms/device/selectlist',
    params,
    method: 'get'
  })
}

// 获取分组列表
export const getGroupTypeList = ({model_id, type}) => {
  let params = {
    model_id,
    type
  }
  return axios.request({
    params,
    url: '/dms/group/grouplist',
    method: 'get'
  })
}

// 设备详情
export const getEquipDetail = (id) => {
  let params = {
    id
  }
  return axios.request({
    url: '/dms/device/select',
    params,
    method: 'get'
  })
}

// 更新设备
export const updateEquip = ({id, group_id}) => {
  let data = {
    id,
    group_id
  }
  return axios.request({
    url: '/dms/device/update',
    data,
    method: 'post'
  })
}

// 导入记录列表
export const getUploadsList = ({status, start_time, end_time, page, page_size}) => {
  let params = {
    status,
    start_time,
    end_time,
    page,
    page_size
  }
  return axios.request({
    url: '/dms/upload/selectlist',
    params,
    method: 'get'
  })
}

// 获取状态列表
export const getStatusList = () => {
  return axios.request({
    url: '/dms/upload/typelist',
    method: 'get'
  })
}

// 激活list
export const getActiveList = (params) => {
  return dyAxios.request({
    url: '/dms/active/list',
    method: 'get',
    params
  })
}

// 设备分组联动接口
export const getModelGroup = (params) => {
  return dyAxios.request({
    url: '/dms/model/group',
    method: 'get',
    params
  })
}
