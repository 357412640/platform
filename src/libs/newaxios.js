import axios from 'axios'
import qs from 'qs'
import store from '@/store'
// const addErrorLog = errorInfo => {
//   const { statusText, status, request: { responseURL } } = errorInfo
//   let info = {
//     type: 'ajax',
//     code: status,
//     mes: statusText,
//     url: responseURL
//   }
//   if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
// }

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      if (config.method === 'post') {
        config.data = qs.stringify(config.data)
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      if (res.status === 200) {
        return res.data
      } else {
        // this.$Notice.error({ description: '服务器错误' })
        return false
      }
    }, error => {
      this.destroy(url)
      return Promise.reject(error.response ? error.response.statusText : error)
    })
  }
  // 原axios方式
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
  // 以下为自己封装的简易调用方式
  get (apiName, params, header) {
    return this.Request(apiName, params, 'get', header)
  }
  send (apiName, params, header) {
    return this.Request(apiName, params, 'post', header)
  }
  Request (apiName, opts = {}, method = 'post', header) {
    const instance = axios.create()
    this.interceptor(instance, apiName)
    if (!apiName) {
      throw new Error('apiName is not defined!')
    }

    if (opts && typeof opts === 'object' && method === 'get') {
      opts = { params: opts }
    }
    if (opts && typeof opts === 'object' && method === 'post') {
      opts = { data: opts }
    }
    const { data, params, ...rest } = opts
    const headers = header ? {'Content-Type': 'multipart/form-data'} : { 'Content-Type': 'application/x-www-form-urlencoded', charset: 'UTF-8' }
    return instance.request({
      baseURL: '',
      url: apiName,
      method: method,
      data: data ? (header ? data : qs.stringify(data)) : null,
      headers,
      params,
      ...rest
    })
  }
  interceptor (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      if (res.status === 200) {
        return res.data
      } else {
        return false
      }
    }, error => {
      this.destroy(url)
      return Promise.reject(error.response ? error.response.statusText : error)
    })
  }
}
export default HttpRequest
