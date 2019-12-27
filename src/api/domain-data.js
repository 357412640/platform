// 域名管理接口
import axios from '@/libs/api.request'
// 资源管理
// 资源列表
export const getResourceList = ({page, page_size, name, identification}) => {
  const params = {
    page,
    page_size,
    name,
    identification
  }
  return axios.request({
    url: '/dns/resource/selectlist',
    params,
    method: 'get'
  })
}
// 资源创建/更新
export const saveResource = ({id, name, identification, default_official_domain_name, default_test_domain_name, contacts, act}) => {
  const data = {
    id,
    name,
    identification,
    default_official_domain_name,
    default_test_domain_name,
    contacts,
    act
  }
  return axios.request({
    url: '/dns/resource/insert',
    data,
    method: 'post'
  })
}
// 资源删除
export const deleteResource = (id) => {
  const data = {
    id
  }
  return axios.request({
    url: '/dns/resource/delete',
    data,
    method: 'post'
  })
}
// 资源详情
export const getResourceDetail = (id) => {
  const params = {
    id
  }
  return axios.request({
    url: '/dns/resource/select',
    params,
    method: 'get'
  })
}

// 分组域名
// 域名列表
export const getDomainList = ({group_name, page, page_size}) => {
  const params = {
    group_name,
    page,
    page_size
  }
  return axios.request({
    url: '/dns/domain/list',
    params,
    method: 'get'
  })
}

// 新建域名
export const createDomain = ({device_gp_id, domain_group}) => {
  const data = {
    device_gp_id,
    domain_group
  }
  return axios.request({
    url: '/dns/domain/create',
    data,
    method: 'post'
  })
}

// 更新域名
export const updateDomain = ({id, device_gp_id, domain_group}) => {
  const data = {
    id,
    device_gp_id,
    domain_group
  }
  return axios.request({
    url: '/dns/domain/update',
    data,
    method: 'post'
  })
}

// 域名详情
export const getDomainDetail = (id) => {
  const params = {
    id
  }
  return axios.request({
    url: '/dns/domain/detail',
    params,
    method: 'get'
  })
}

// 获取域名下设备分组
export const getDeviceGroup = (id) => {
  const params = {
    id
  }
  return axios.request({
    url: '/dns/domain/devicegroup',
    params,
    method: 'get'
  })
}
