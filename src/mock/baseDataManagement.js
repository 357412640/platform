const baseDataManagement = {}

baseDataManagement.getList = req => {
  return {
    'errno': 10000,
    'errmsg': 'sucess',
    'data': {
      'list': [
        {
          'id': 2,
          'tablename': '网络监控',
          'tablecode': 'Net_Montior',
          'issetrange': 0,
          'update_time': 1545288451,
          'operator': '李四',
          'columns': [
            {
              'id': 13,
              'columncode': 'Type',
              'columnname': 'Type',
              'columnorder': 1
            },
            {
              'id': 14,
              'columncode': 'Value',
              'columnname': 'Value',
              'columnorder': 2
            }
          ]
        },
        {
          'id': 1,
          'tablename': '产品型号',
          'tablecode': 'MODEL_Defines',
          'issetrange': 0,
          'update_time': 1545288451,
          'operator': '张三',
          'columns': [
            {
              'id': 1,
              'columncode': 'ProductType',
              'columnname': '产品类型',
              'columnorder': 1
            },
            {
              'id': 2,
              'columncode': 'Manufactory',
              'columnname': 'manufactory',
              'columnorder': 2
            },
            {
              'id': 3,
              'columncode': 'Platform',
              'columnname': 'Platform',
              'columnorder': 3
            },
            {
              'id': 4,
              'columncode': 'Model',
              'columnname': 'Model',
              'columnorder': 4
            },
            {
              'id': 5,
              'columncode': 'Channel',
              'columnname': 'Channel',
              'columnorder': 5
            },
            {
              'id': 6,
              'columncode': 'DeviceModel',
              'columnname': '设备型号',
              'columnorder': 6
            },
            {
              'id': 7,
              'columncode': 'CloudDisplayModel',
              'columnname': 'Cloud后台显示型号',
              'columnorder': 7
            },
            {
              'id': 8,
              'columncode': 'ro.product.name',
              'columnname': 'ro.product.name',
              'columnorder': 8
            },
            {
              'id': 9,
              'columncode': 'ro.product.device',
              'columnname': 'ro.product.device',
              'columnorder': 9
            },
            {
              'id': 10,
              'columncode': 'ro.product.model',
              'columnname': 'ro.product.model',
              'columnorder': 10
            },
            {
              'id': 11,
              'columncode': 'UIVersion',
              'columnname': 'UI版本',
              'columnorder': 11
            },
            {
              'id': 12,
              'columncode': 'Description',
              'columnname': '描述',
              'columnorder': 12
            }
          ]
        }
      ],
      'page': 1,
      'page_size': 20,
      'total': 2
    }
  }
}

baseDataManagement.delete = req => {
  return {
    errno: 10000,
    errmsg: '删除成功'
  }
}

baseDataManagement.add = req => {
  return {
    errno: 10000,
    errmsg: '添加成功'
  }
}

baseDataManagement.update = req => {
  return {
    errno: 10000,
    errmsg: '修改成功'
  }
}

baseDataManagement.detail = req => {
  return {
    'errno': 10000,
    'errmsg': 'sucess',
    'data': {
      'id': 2,
      'tablecode': 'Net_Montior',
      'tablename': '网络监控',
      'issetrange': 0,
      'isinactivity': 0,
      'update_time': 1545288451,
      'operator': '李四',
      'columns': [
        {
          'id': 13,
          'columncode': 'ProductType',
          'columnname': 'Type',
          'columnorder': 1
        },
        {
          'id': 14,
          'columncode': 'ro.product.device',
          'columnname': 'Value',
          'columnorder': 2
        },
        {
          id: 1,
          columncode: 'CloudDisplayModel',
          columnname: '设备1',
          update_time: '111111111',
          operator: '太空人'
        },
        {
          id: 4,
          columncode: 'DeviceModel',
          columnname: '设备2',
          update_time: '111111111',
          operator: '太空人'
        }
      ]
    }
  }
}

baseDataManagement.dataList = req => {
  return {
    'errno': 10000,
    'errmsg': 'sucess',
    'data': {
      'list': [
        {
          'id': 73,
          'update_time': 0,
          'operator': '11',
          'ProductType': '虚拟现实头盔',
          'Manufactory': 'Qualcomm',
          'Platform': 'APQ8096',
          'Model': 'LEVRMAX1',
          'Channel': '',
          'DeviceModel': 'LeVR Max1',
          'CloudDisplayModel': 'LEVRMAX1',
          'ro.product.name': 'LeVR Max1',
          'ro.product.device': 'LeVR Max1',
          'ro.product.model': 'LeVR Max1',
          'UIVersion': 'UI5.8',
          'Description': '',
          'rangeId': 0
        },
        {
          'id': 72,
          'update_time': 0,
          'operator': '',
          'ProductType': '车机',
          'Manufactory': 'Qualcomm',
          'Platform': '',
          'Model': 'N5100',
          'Channel': '',
          'DeviceModel': 'N5100',
          'CloudDisplayModel': 'N5100',
          'ro.product.name': '',
          'ro.product.device': '',
          'ro.product.model': '',
          'UIVersion': '',
          'Description': '',
          'rangeId': 0
        },
        {
          'id': 71,
          'update_time': 0,
          'operator': '',
          'ProductType': '路由器',
          'Manufactory': 'Qualcomm',
          'Platform': 'IPQ4018',
          'Model': 'LEWIFI2',
          'Channel': '',
          'DeviceModel': 'LEWiFi2',
          'CloudDisplayModel': 'LEWiFi2',
          'ro.product.name': '',
          'ro.product.device': '',
          'ro.product.model': '',
          'UIVersion': '',
          'Description': '',
          'rangeId': 0
        },
        {
          'id': 70,
          'update_time': 0,
          'operator': '',
          'ProductType': '路由器',
          'Manufactory': 'Qualcomm',
          'Platform': 'QC9531',
          'Model': 'LEEXPANDOR',
          'Channel': '',
          'DeviceModel': 'LEExpandor',
          'CloudDisplayModel': 'LEExpandor',
          'ro.product.name': '',
          'ro.product.device': '',
          'ro.product.model': '',
          'UIVersion': '',
          'Description': '2016-7-21：卢锋，Align with臧超，创建Model。',
          'rangeId': 0
        }
      ],
      'page': 1,
      'length': 20,
      'total': 73
    }
  }
}

baseDataManagement.dataDetail = req => {
  return {
    'errno': 10000,
    'errmsg': 'sucess',
    'data': {
      'id': 1,
      'update_time': 0,
      'operator': '',
      'ProductType': '盒子',
      'Manufactory': 'Amlogic',
      'Platform': 'M6',
      'Model': 'C1',
      'Channel': '',
      'DeviceModel': 'C1',
      'CloudDisplayModel': 'C1',
      'ro.product.name': '',
      'ro.product.device': '',
      'ro.product.model': 'Letv C1',
      'UIVersion': 'UI1.5、UI2.3、UI3.0',
      'Description': '',
      'rangeId': 0
    }
  }
}

baseDataManagement.importList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'page': 1,
      'length': 20,
      'total': 73,
      'list': [
        {
          'id': 73,
          'filename': '虚拟现实头盔',
          'fileurl': 'www.baidu.com',
          'resultfileurl': 'APQ8096',
          'datacount': '8',
          'status': '导入失败',
          'update_time ': '2018.11.20'
        },
        {
          'id': 72,
          'filename': '虚拟现实头盔',
          'fileurl': 'www.baidu.com',
          'resultfileurl': 'APQ8096',
          'datacount': '8',
          'status': '导入失败',
          'update_time ': '2018.11.20'
        },
        {
          'id': 71,
          'filename': '虚拟现实头盔',
          'fileurl': 'www.baidu.com',
          'resultfileurl': 'APQ8096',
          'datacount': '8',
          'status': '导入失败',
          'update_time ': '2018.11.20'
        },
        {
          'id': 70,
          'filename': '虚拟现实头盔',
          'fileurl': 'www.baidu.com',
          'resultfileurl': 'APQ8096',
          'datacount': '8',
          'status': '导入失败',
          'update_time ': '2018.11.20'
        }
      ]
    }
  }
}

export default baseDataManagement
