// 获取型号列表
export const getModelList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 100,
      'page': 3,
      'page_size': 20,
      'list': [
        {'id': 1, 'name': 'G85', 'external_name': 'G85', 'create_time': '1543546515'},
        {'id': 2, 'name': 'G85', 'external_name': 'G85', 'create_time': '1543546515'},
        {'id': 3, 'name': 'G85', 'external_name': 'G85', 'create_time': '1543546515'}
      ]
    }
  }
}
// 获取设备类型
export const getDeviceList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'list': [
        {
          'id': '1',
          'name': 'TV'
        }
      ]
    }
  }
}

// 保存型号
export const saveModel = req => {
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}

// 删除设备型号
export const deleteModel = req => {
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}

// 获取分组列表
export const getGroupList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 100,
      'page': 1,
      'page_size': 20,
      'list': [
        {
          'id': 1,
          'name': 'G85_CN_商用组',
          'model_name': 'G85',
          'type': '测试',
          'remark': 'OS自测',
          'create_time': '1543546515'
        }
      ],
      'model_list': [
        {
          'id': '1',
          'name': 'G85'
        }
      ],
      'type_list': [
        {
          id: '1',
          name: '正式'
        },
        {
          id: '2',
          name: '测试'
        }
      ]
    }
  }
}

// 获取型号列表
export const getModelTypeList = () => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'list': [
        {
          'id': '21',
          'name': 'G80'
        }
      ]
    }
  }
}

// 获取类型列表
export const getTypeList = () => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'list': [
        {
          'id': '1',
          'name': '正式'
        },
        {
          'id': '2',
          'name': '测试'
        }
      ]
    }
  }
}

// 获取分组信息
export const getGroupDetail = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'id': 1,
      'name': 'G85_CN_商用组',
      'model_name': 'G85',
      'type': '测试',
      'remark': 'OS自测',
      'create_time': '1543546515',
      'model_list': [
        {
          'id': '1',
          'name': 'G85'
        }
      ],
      'type_list': [
        {
          id: '1',
          name: '正式'
        },
        {
          id: '2',
          name: '测试'
        }
      ]
    }
  }
}

// 保存/更新分组信息
export const saveOrUpdateGroup = req => {
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}

// 删除分组
export const deleteGroup = req => {
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}

// 获取设备列表
export const getEquipList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 100,
      'page': 1,
      'page_size': 20,
      'list': [
        {
          'id': '1',
          'mac': 'c80e77eff3be',
          'sn': 'B01BD20E0A71',
          'model_name': 'G60',
          'group_name': 'G60_CN_商用组',
          'create_time': '1543546515',
          'user_name': '张梦云'
        }
      ],
      'model_list': [
        {
          'id': '1',
          'name': 'G60'
        }
      ],
      'group_list': [
        {
          'id': '1',
          'name': 'G60_CN_商用组'
        }
      ]
    }
  }
}

// 获取分组列表
export const getGroupTypeList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'list': [
        {
          'id': '1',
          'name': 'G85_CN_商用组'
        },
        {
          'id': '2',
          'name': 'G85_CN_商用组'
        }
      ]
    }
  }
}

// 设备详情
export const getEquipDetail = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'id': '1',
      'mac': 'c80e77eff3be',
      'sn': 'B01BD20E0A71',
      'model_name': 'G60',
      'group_name': 'G85_CN_商用组',
      'create_time': '1543546515',
      'user_name': '张梦云',
      'activate_time': '未激活'
    }
  }
}

// 更新设备
export const updateEquip = req => {
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}

// 上传记录列表
export const getUploadsList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 100,
      'page': 1,
      'page_size': 10,
      'list': [
        {
          'id': '1',
          'file_name': '设备导入模板.xls',
          'row_number': '100',
          'status': 'success',
          'source_file_url': '/upload/source/yuanwenjian.xls',
          'fail_file_url': '/upload/fail/failwenjian.xls',
          'create_time': '1543564440'
        }
      ]
    }
  }
}

// 获取状态列表
export const getStatusList = () => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'list': [
        {
          'id': '0',
          'name': '全部'
        },
        {
          'id': '1',
          'name': '导入中'
        }
      ]
    }
  }
}

// 上传文件
export const uploadFile = req => {
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}

// 激活列表
export const getActivieList = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "list": [
        {
          "time":"2019/03/12",
          "model_total_count": 100,
          "model_active_count": 100,
          "model_total_add_count": 100,
          "model_active_add_count": 100
        },
        {
          "time":"2019/03/12",
          "model_total_count": 200,
          "model_active_count": 200,
          "model_total_add_count": 200,
          "model_active_add_count": 200
        },
      ]
    }
  }
}

// 设备分组联动接口
export const getModelGroup = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "list": [
        {
          "id":"1",
          "name": 'G80'
        },
        {
          "id":"2",
          "name": 'G80'
        }
      ]
    }
  }
}
