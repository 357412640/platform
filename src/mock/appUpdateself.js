export default {
  updateList: {
    "errno":10000,
    "errmsg":"success",
    "data":{
      "total":100,
      "page":1,
      "page_size":10,
      "list":[
        {
          "id":1,
          "name":"设备管理",
          "package_name":"launchaer.apk",
          "version_name":"1.01",
          "version_code":"beta.dms.gome.inc",
          "update_user":"yz",
          "update_time":"1543546515"
        }
      ]
    }
  },
  updateEdit: {
    "errno":10000,
    "errmsg":"success",
  },
  strategyList: {
    errno: 10000,
    errmsg:"success",
    data:{
      total:100,
      "page":1,
      "page_size":10,
      app_name: 'app名称',
      package_name: '包名',
      device_type: '设备类型',
      "list":[{
        "id":1,
        "effect_status":"1",
        "effect_startime":1543546515,
        "effect_endtime":1543546515,
        "strategy_type":"1",
        "update_user":"yz",
        "update_time":"1543546515"
      }
      ],
      "strategy_list": [{
        "id":1,
        "name":"设备ID"
      }]
    }
  },
  updateDetail: {
    "errno":10000,
    "errmsg":"success",
    "data":{
      "id":1,
      "device_type":"tv",
      "name":"设备管理",
      "package_name":"launchaer.apk",
      "version_name":"1.01",
      "version_code":"beta.dms.gome.inc",
      "update_user":"yz",
      "update_time":"1543546515"
    }
  },
  strategyDetail: {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "id": 1,
      "device_type": "TV",
      "app_name": "test",
      "package_name": "test.apk",
      "effect_status": "设备管理",
      "effect_startime": 1543546515,
      "effect_endtime": 1543546515,
      "upgrade_type": "1",
      "strategy_type": "1",
      "strategy_content": [21, 22, 27]
    }
  },
  groupSel: {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "list": {
        "G22": [
          {
            "group_name": "测试",
            "group_id": 25,
            "model_name": "G22",
            "model_id": 31
          },
          {
            "group_name": "测试1",
            "group_id": 28,
            "model_name": "G22",
            "model_id": 31
          }
        ],
        "G19": [
          {
            "group_name": "test",
            "group_id": 27,
            "model_name": "G19",
            "model_id": 28
          }
        ]
      }
    }
  },
  dataList: {
    "errno": 10000,
    "errmsg": "sucess",
    "data": {
      "model":[
        {
          "id":1,
          "name":"aaa",
        },
        {
          "id":2,
          "name":"bbb",
        }
      ],
      "group":[
        {
          "id":3,
          "name":"22",
        },
        {
          "id":4,
          "name":"33",
        }
      ],
      district: [
        {
          "id":5,
          "name":"北京"
        }
      ]
    }
  },
  dataCnt: {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "2019-05-09": {
        "download_successful": "28",
        "download_failed": "22",
        "install_successful": "44",
        "install_failed": "53"
      },
      "2019-05-10": {
        "download_successful": "11",
        "download_failed": "12",
        "install_successful": "67",
        "install_failed": "87"
      },
      "2019-05-13": {
        "download_successful": "32",
        "download_failed": "34",
        "install_successful": "78",
        "install_failed": "76"
      },
      "2019-05-14": {
        "download_successful": "12",
        "download_failed": "23",
        "install_successful": "57",
        "install_failed": "66"
      },
      "2019-05-15": {
        "download_successful": "2",
        "download_failed": "1",
        "install_successful": "33",
        "install_failed": "78"
      }
    }
  }
}
