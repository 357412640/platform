// launcher
// 规则管理
// 获取规则列表
export const getRuleList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 100,
      'page': 1,
      'page_size': 20,
      'list': [
        {'id': '5bd9475f7a042be8950041a7', 'name': '电影_好莱坞', 'update_name': 'yangzhuang', 'update_time': '1543546515'},
        {'id': '5bd9475f7a042be8950041a7', 'name': '电影_好莱坞', 'update_name': 'yangzhuang', 'update_time': '1543546515'},
        {'id': '5bd9475f7a042be8950041a7', 'name': '电影_好莱坞', 'update_name': 'yangzhuang', 'update_time': '1543546515'}

      ]
    }
  }
}

// 视频来源列表
export const getSourceList = req => {
  return {
    "errno":10000,
    "errmsg":"success",
    "data":{
      "list":[
        {
          "name":"爱奇艺",
          "value":"iqiyi"
        },
        {
          "name":"腾讯视频",
          "value":"tencent"
        },
        {
          "name":"B站",
          "value":"bilibili"
        }
      ]
    }
  }
}

// 查询标签
export const getTagList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'source': {
        'formType': 'select',
        'name': '来源',
        'list': [
          {'name': '爱奇艺', 'value': 'iqiyi'},
          {'name': '腾讯视频', 'value': 'tencent'},
          {'name': 'B站', 'value': 'bilibili'}
        ]
      },
      'channel': {
        'formType': 'tag',
        'name': '频道'
      },
      'isMember': {
        'formType': 'select',
        'name': '是否会员',
        'list': [
          {'name': '是', 'value': '1'},
          {'name': '否', 'value': '0'}
        ]
      },
      'videoTag': {
        'formType': 'text',
        'name': '视频标签'
      },
      'actor': {
        'formType': 'text',
        'name': '演员'
      },
      'contentType': {
        'formType': 'select',
        'name': '内容',
        'list': [
          {'name': '正片', 'value': 'featureFilm'},
          {'name': '花絮', 'value': 'interestingSidelights'},
          {'name': '预告片', 'value': 'theTrailer'}
        ]

      },
      'heatValue': {
        'formType': 'value',
        'name': '热度值',
        'where':
          {'$lt': '<', '$gte': '≥'},

        'value': ''
      },
      'grade': {
        'formType': 'value',
        'name': '评分',
        'where':
          {'$lt': '<', '$gt': '>', '$eq': '=', '$lte': '≤', '$gte': '≥'},

        'value': ''
      },
      'putawayTime': {
        'formType': 'DatePicker',
        'name': '上架时间',
        'startTime': '',
        'endTime': ''
      },
      'beOnTime': {
        'formType': 'DatePicker',
        'name': '上映时间',
        'startTime': '',
        'endTime': ''
      }
    }
  }
}

// 频道suggest接口
export const getChannelList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': [
      {
        'name': '电影',
        'value': 'v电影'
      },
      {
        'name': '电视',
        'value': 'v电视'
      },
      {
        'name': '动漫',
        'value': 'v动漫'
      }
    ]
  }
}

// 视频标签suggest接口
export const getVideoList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': [
      {
        'name': '古装',
        'value': 'v古装'
      },
      {
        'name': '现代',
        'value': 'v现代'
      }
    ]
  }
}

// 演员suggest接口
export const getActorList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': [
      {
        'name': '古天乐',
        'value': 'v古天乐'
      },
      {
        'name': '林青霞',
        'value': 'v林青霞'
      },
      {
        'name': '吴彦祖',
        'value': 'v吴彦祖'
      }
    ]
  }
}

// 影片数量接口
export const getMovieCount = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      count: 1024
    }
  }
}

// 获取规则详情
export const getRuleDetails = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      "condition":'[[{"isNot":"false","key":"source","formType":"select","value":"iqiyi","name":"来源：爱奇艺"}]]',
    "name":"测试",
    "source":"tencent",
    "user_name":"wangxingpan",
    "time":1551952401
    }
  }
}

// 规则保存
export const saveRule = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
    }
  }
}

// 定向推广
// 1、保存推广
export const saveDirectional = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {}
  }
}

// 2、获取推广详情
export const getDirectionalDetail = req => {
  return {
    "errno":10000,
    "errmsg":"success",
    "data":{
      "id":"5c8f5a1f70d1fea66e8b4583",
      "pageId":"5c90b35b36f8cae3d0b62076",
      "position":{
        "row":1,
        "item":3
      },
      "recommendType":"fixation",
      "title":"aaaaa",
      "description":"bbbbb",
      "openType":"hejia",
      "openSubType":"video",
      "img":"https://static.ptguomei.gitv.tv/group1/M00/00/03/CnOICVxFU5GAULJXAAEBYEXHgHI106.jpg",
      "openSpecialId":90023000,
      "openEqId":90023000,
      "openEpId":90023000,
      "openGameId":9001300,
      "openParam":"",
      "directionalType":"deviceModel",
      "directionalContent":[
        31,28
      ]
    }
  }
}

// 3、推广列表/搜索
export const getDirectionalList = req => {
  return {
    "errno":10000,
    "errmsg":"success",
    "data":{
      "total": 100,
      "page_size": 20,
      "page": 3,
      "list": [
        {
          "id":"5c8f5a1f70d1fea66e8b4583",
          "pageId":"5c8f5a2b36f8cae3d0b5addc",
          "position":{
            "row":1,
            "item":3
          },
          "recommendType":"fixation",
          "title":"aaaaa",
          "directionalType":"deviceId"
        }
      ]
    }
  }
}

// 4、删除
export const deleteDirectional = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {}
  }
}

// 5、频道列表
export const getDirectionalChannel = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "list": [
        {
          "pageId": "5c8f2d9d36f8cae3d0b59afa",
          "pageName": "首页"
        },
        {
          "pageId": "5c8f5a2b36f8cae3d0b5addc",
          "pageName": "电视剧"
        },
        {
          "pageId": "5c90b35b36f8cae3d0b62076",
          "pageName": "电影"
        },
        {
          "pageId": "5c92f8fc36f8cae3d0b6c290",
          "pageName": "动漫"
        }
      ]
    }
  }
}

// 6设备分组数据接口
export const getDirectionalContent = req => {
  return {
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
  }
}

// 专题管理接口
// 专题列表
export const getProjectList = req => {
  return {
    "errno":10000,
    "errmsg":"success",
    "data":{
      "total": 100,
      "page_size": 20,
      "page": 3,
      "list":[
        {
          "id":"1",
          "name":"端午节专题",
          "create_user":"yanzhuang",
          "update_time":"1529031232"
        }
      ]
    }
  }
}

// 保存专题
export const saveProject = req => {
  return {
    "errno":10000,
    "errmsg":"success"
  }
}

// 视频查询
export const getVideoById = req => {
  return {
    "errno":10000,
    "errmsg":"success",
    "data":{
      "list":[
        {
          "id":"1",
          "name":"舞出我人生"
        }
      ]
    }
  }
}

// 专题详情
export const getProjectDetail = req => {
  return {
    "errno":10000,
    "errmsg":"success",
    "data":{
      "id":"1",
      "name":"test",
      "description":"1",
      "img_url":"1",
      "video_data":[
        {
          "mid":"12312312312",
          "id":"1",
          "name":"123213123"
        },
        {
          "mid":"12312312312",
          "id":"1",
          "name":"123213123"
        }
      ]
    }
  }
}
