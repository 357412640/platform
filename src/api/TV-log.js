import axios from '@/libs/http'

export const reqLoglist = data => { return axios.get('/tvlog/log/list', data) }
export const reqModelList = data => { return axios.get('/tvlog/log/model/list', data) }
export const reqVersionList = data => { return axios.get('/tvlog/log/sysverion/list', data) }
export const reqStatusSave = data => { return axios.send('/tvlog/log/status/update', data) }
export const reqStatusEdit = data => { return axios.get('/tvlog/log/status', data) }
