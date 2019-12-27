import axios from 'axios'

// 自定义上传进度
export const uploadRequest = (data, callback1) => {
  return axios.request({
    url: 'http://api.scloud.gome.inc/uploadfile/uploadFdfs',
    method: 'post',
    data,
    onUploadProgress (progressEvent) {
      if (progressEvent.lengthComputable) {
        callback1(progressEvent)
      }
    }
  }).then(res => {
    return res.data
  }).catch(err => {
    return err
  })
}
