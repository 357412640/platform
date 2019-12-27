// 域名管理
// 资源列表查询
export const getResourceList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 100,
      'page': 1,
      'page_size': 10,
      'list': [
        {'id': 1, 'name': '设备管理', 'identification': 'dms', 'default_official_domain_name': 'dms.gome.inc', 'default_test_domain_name': 'beta.dms.gome.inc', 'create_time': '1543546515', 'update_time': '1543546515', 'contacts': 'contacts'},
        {'id': 2, 'name': '设备管理', 'identification': 'dms', 'default_official_domain_name': 'dms.gome.inc', 'default_test_domain_name': 'beta.dms.gome.inc', 'create_time': '1543546515', 'update_time': '1543546515'},
        {'id': 3, 'name': '设备管理', 'identification': 'dms', 'default_official_domain_name': 'dms.gome.inc', 'default_test_domain_name': 'beta.dms.gome.inc', 'create_time': '1543546515', 'update_time': '1543546515'}

      ]
    }
  }
}
// 保存资源
export const saveResource = req => {
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}
// 删除资源
export const deleteResource = req => {
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}
// 资源详情
export const getResourceDetail = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'id': 1,
      'name': '设备管理',
      'identification': 'dms',
      'default_official_domain_name': 'dms.gome.inc',
      'default_test_domain_name': 'beta.dms.gome.inc',
      'create_time': '1543546515',
      'update_time': '1543546515',
      'contacts': 'eee'
    }
  }
}

// 域名列表
export const getDomainList = req => {
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
          'domain_group': 'http://xxxx.gome.com.cn,http://xxxx.gome.inc',
          'update_time': 1545188037,
          'update_user': '王兴攀'
        },
        {
          'id': 1,
          'name': 'G85_CN_商用组',
          'domain_group': '',
          'update_time': 1545188037,
          'update_user': '王兴攀'
        }
      ]
    }
  }
}

// 新建域名
export const createDomain = req => {
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}

// 更新域名
export const updateDomain = req => {
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}

// 域名详情
export const getDomainDetail = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'device_gp_id': 2,
      'list': [
        {
          'resource_id': 1,
          'name': 'xx组',
          'identification': 'http://xxxx.gome.com.cn',
          'url': 'http://xxxx.gome.com.cn'
        },
        {
          'resource_id': 2,
          'name': 'xx商用组',
          'identification': 'xx',
          'url': ''
        }
      ]
    }
  }
}

// 获取域名下设备分组
export const getDeviceGroup = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'list': [
        {
          'id': 9,
          'name': 123
        },
        {
          'id': 10,
          'name': 1233
        },
        {
          'id': 2,
          'name': 'G222'
        }
      ]
    }
  }
}
