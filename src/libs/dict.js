const dict = {
  database: {
    status: {
      '1': '上传成功',
      '2': '处理中',
      '8': '导入失败',
      '9': '处理完成'
    },
    type: {
      1: '覆盖导入',
      2: '增量导入'
    }
  },
  appUpdate: {
    upgrade_type: {
      'all': '全部',
      'mac': '设备ID',
      'model': '设备型号',
      'group': '设备分组'
    }
  },
  log: {
    1: '未处理',
    2: '处理中',
    3: '已处理',
    4: '无效',
    5: '关闭'
  }
}

export default dict
