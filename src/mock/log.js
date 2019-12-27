export default {
  logList: {
      "errno":10000,
      "errmsg":"success",
      "data":{
        "total":100,
        "page":1,
        "page_size":20,
        "list":[
          {
            "id":1,
            "mac":"sadasdasdad",
            "type":"正式",
            "model_name":"G85",
            "system_version":"1.0.1",
            "create_time":"12312312312",
            "status":"未处理",
            "file_url":"http://www.baidu.com"
          }
        ]
      }
    },
  modelList:
    {
      "errno":10000,
      "errmsg":"success",
      "data":{
        "list":[
          {
            id: 1,
            "name":"GM86"
          }
        ]
      }
    },
  versionList: {
    "errno":10000,
    "errmsg":"success",
    "data":{
      "list":[
        {
          id: 1,
          "system_version":"1.0.1"
        }
      ]
    }
  },
  updateSave:{
    "errno":10000,
    "errmsg":"success",
  },
  statusDetail:
    {
      "errno":10000,
      "errmsg":"success",
      "data":{
        "id":2,
        "status": 1,
        "remark":"123"
      }
    }
}
