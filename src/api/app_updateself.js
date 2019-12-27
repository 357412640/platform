import axios from '@/libs/http'
import oldAxios from '@/libs/api.request'


export const requestUpgradeList = data => { return axios.get('/upgrade/upgrade/list', data) }
export const requestStrategyList = data => { return axios.get('/upgrade/strategy/list', data) }
export const requestUpgradeEdit = data => { return axios.send('/upgrade/upgrade/edit', data) }
export const requestStrategyEdit = data => { return axios.send('/upgrade/strategy/edit', data) }
export const requestStrategyDelete = data => { return axios.get('/upgrade/strategy/delete', data) }
export const requestUpgradeDelete = data => { return axios.get('/upgrade/upgrade/delete', data) }
export const reqUpgradeDetail = data => { return axios.get('/upgrade/upgrade/version', data) }
export const reqStrategyDetail = data => { return axios.get('/upgrade/strategy/select', data) }
export const reqStrategyGroup = data => { return axios.get('/upgrade/strategy/group', data) }

//
export const dataList = (params) => {
  return oldAxios.request({
    url: '/upgrade/data/list',
    params,
    method: 'get'
  })
}

export const dataCnt = (params) => {
  return oldAxios.request({
    url: '/upgrade/data/cnt',
    params,
    method: 'get'
  })
}
