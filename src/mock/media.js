// 媒资库
// 频道列表
export const getChannelList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': [
      {
        'id': 1,
        'name': '电影'
      },
      {
        'id': 2,
        'name': '电视剧'
      }
    ]
  }
}

// 内容类型列表
export const getContentList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'list': [
        {
          'id': 1,
          'name': '正片'
        },
        {
          'id': 2,
          'name': '预告片'
        }
      ]
    }
  }
}

// 来源列表
export const getSourceList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': [
      {
        'source': 'iqiyi',
        'name': '爱奇艺'
      },
      {
        'source': 'vqq',
        'name': '腾讯视频'
      },
      {
        'source': 'bilibili',
        'name': '哔哩哔哩'
      }
    ]
  }
}

// 专辑列表搜索
export const getEpgList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 100,
      'page': 1,
      'page_size': 20,
      'list': [
        {
          '_id': '5bd9475f7a042be8950041a7',
          'name': '舞出我人生',
          'pic_url': 'http: //pic7.iqiyipic.com/image/20180211/a8/4c/v_50000230_m_601_m6.jpg',
          'excl': 0,
          'is_vip': 0,
          'cname': '电影',
          'source_chn_id': 90023000,
          'time': '20060811',
          'total': 1,
          'copyright': '',
          'is_done': 1,
          'strategy': '每周一更新',
          'tag_names': '普通话,剧情,青春,爱情,美国',
          'score': 8.7,
          'desc': '泰勒是来自巴尔的摩的底层社会的反叛青年，诺拉是就读与贵族艺校的优秀的芭蕾舞学生。诺拉要参加的高级舞蹈比赛，需要一个舞技超群的舞伴，而泰勒刚好因为被罚在艺术学校社区服务而闯入诺拉的视野。泰勒随意自如的街头舞蹈吸引了诺拉，舞台上的一次次合作，让这两个同样执着于艺术的孩子擦出律动的火花。',
          'source': 'iqiyi',
          'source_name': '爱奇艺'
        }
      ]
    }
  }
}

// 视频列表搜索
export const getVideoList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 100,
      'page': 1,
      'page_size': 20,
      'list': [
        {
          '_id': '5bd9475f7a042be8950041a7',
          'name': '舞出我人生',
          'pic_url': 'http: //pic7.iqiyipic.com/image/20180211/a8/4c/v_50000230_m_601_m6.jpg',
          'excl': 0,
          'is_vip': 0,
          'is_tvod': 1,
          'cname': '电影',
          'source_chn_id': 90023000,
          'source_ep_id': 999999,
          'time': '20060811',
          'total': 1,
          'content_type': 1,
          'director': '斯皮尔伯格',
          'main_actor': '汤姆汉克斯,汤姆克鲁斯',
          'tag_names': '普通话,剧情,青春,爱情,美国',
          'score': 8.7,
          'desc': '泰勒是来自巴尔的摩的底层社会的反叛青年，诺拉是就读与贵族艺校的优秀的芭蕾舞学生。诺拉要参加的高级舞蹈比赛，需要一个舞技超群的舞伴，而泰勒刚好因为被罚在艺术学校社区服务而闯入诺拉的视野。泰勒随意自如的街头舞蹈吸引了诺拉，舞台上的一次次合作，让这两个同样执着于艺术的孩子擦出律动的火花。',
          'upper_lower_shelves': 1,
          'effective': 1,
          'source': 'iqiyi',
          'source_name': '爱奇艺'
        }
      ]
    }
  }
}

// 视频详情
export const getVideoDetail = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'epName': '视频名称',
      'media_status': {
        '_id': '5bd9475f7a042be8950041a7',
        'source': 'vqq',
        'upper_lower_shelves': 1
      },
      'basic_info': {
        'name': '舞出我人生',
        'source_ep_id': 999999,
        'source_chn_id': 90023000,
        'eq_len': 6186,
        'time': '20060811',
        'content_type': 1,
        'total': 12,
        'init_issue_time': '2010-04-22 00: 00: 00',
        'main_actor': '查宁·塔图姆,珍娜·迪万',
        'director': '安妮·弗莱彻',
        'country': '',
        'langue': ''
      },
      'operation_info': {
        'effective': 1,
        'excl': 1,
        'tag_names': '普通话,剧情,青春,爱情,美国',
        'score': 8.8,
        'is_vip': 1,
        'is_coupon': 0,
        'hot': 397,
        'desc': '泰勒是来自巴尔的摩的底层社会的反叛青年，诺拉是就读与贵族艺校的优秀的芭蕾舞学生。诺拉要参加的高级舞蹈比赛，需要一个舞技超群的舞伴',
        'is_pkg': 0
      },
      'cover': [
        {
          'ratio': '3: 2',
          'size': '116x88',
          'pic_url': 'http: //pic8.qiyipic.com/im-age/20140526/e7/7d/13/v_106364759_m_601_116_88.jpg'
        },
        {
          'ratio': '3: 2',
          'size': '116x88',
          'pic_url': 'http: //pic8.qiyipic.com/im-age/20140526/e7/7d/13/v_106364759_m_601_116_88.jpg'
        }
      ],
      'poster': [
        {
          'ratio': '3: 2',
          'size': '116x88',
          'poster_url': 'http: //pic8.qiyipic.com/im-age/20140526/e7/7d/13/v_106364759_m_601_116_88.jpg'
        },
        {
          'ratio': '3: 2',
          'size': '116x88',
          'poster_url': 'http: //pic8.qiyipic.com/im-age/20140526/e7/7d/13/v_106364759_m_601_116_88.jpg'
        }
      ]
    }
  }
}

// 上下架
export const setVideosManage = req => {
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}

// 运营结果列表搜索
export const getOperatingResultList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 100,
      'page': 3,
      'page_size': 20,
      'list': [
        {
          'name': '你和我的倾城时光',
          'source_ep_id': 234011601,
          'source_chn_id': 1,
          'cname': '电视剧',
          'tv_img_570_570': 'http: //pic2.iqiyipic.com/common/lego/20181204/d5573578655f4083a9d878871db16977.jpg',
          'tv_img_950_470': 'http: //pic3.iqiyipic.com/common/lego/20181204/68093340b2d54205aed20c9de4d186c0.jpg'
        }
      ]
    }
  }
}

// 云视听频道列表
export const getYSTChannelList = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": [
      {
        "channel_id": "zhuanqu_3",
        "chi_name": "倾城时光"
      },
      {
        "channel_id": "zhuanqu_2",
        "chi_name": "我不是药神"
      },
      {
        "channel_id": "tv",
        "chi_name": "电视剧"
      }
    ]
  }
}

// 云视听运营结果列表搜索
export const getYSTResultList = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "page": 1,
      "page_size": 10,
      "total": 98,
      "list": [
        {
          "title": "老中医",
          "item_id": "i5l7gpa23lmk5jn",
          "item_type_name": "专辑",
          "chnId": "chosen",
          "chnName": "精选",
          "pay_status": 6,
          "pay_status_name": "会员免费",
          "pic_1920x1080": "http://puui.qpic.cn/tv/0/60994990_19201080/0"
        },
        {
          "title": "创造营2019录制路透",
          "item_id": "r0030zc39f9",
          "item_type_name": "单视频",
          "chnId": "chosen",
          "chnName": "精选",
          "pay_status": 0,
          "pay_status_name": "未知",
          "pic_1920x1080": "http://puui.qpic.cn/tv/0/61090813_19201080/0"
        },
        {
          "title": "摘金奇缘",
          "item_id": "5crb4lhjxu5irm0",
          "item_type_name": "专辑",
          "chnId": "chosen",
          "chnName": "精选",
          "pay_status": 4,
          "pay_status_name": "会员用券",
          "pic_1920x1080": "http://puui.qpic.cn/tv/0/60517113_19201080/0"
        },
        {
          "title": "大冰小将·更新",
          "item_id": "vmdmsjbwc61h15a",
          "item_type_name": "专辑",
          "chnId": "chosen",
          "chnName": "精选",
          "pay_status": 6,
          "pay_status_name": "会员免费",
          "pic_1920x1080": "http://puui.qpic.cn/tv/0/60930034_19201080/0"
        },
        {
          "title": "《那年花开》之后看什么？",
          "item_id": "f055910fqjy",
          "item_type_name": "单视频",
          "chnId": "zhuanqu_4",
          "chnName": "王朝",
          "pay_status": 0,
          "pay_status_name": "未知",
          "pic_1920x1080": "http://puui.qpic.cn/tv/0/3353505_19201080/0"
        },
        {
          "title": "那年花开月正圆",
          "item_id": "jzhtr2cgy35ejz0",
          "item_type_name": "专辑",
          "chnId": "zhuanqu_4",
          "chnName": "王朝",
          "pay_status": 6,
          "pay_status_name": "会员免费",
          "pic_1920x1080": "http://puui.qpic.cn/tv/0/42866044_19201080/0"
        },
        {
          "title": "维和步兵营",
          "item_id": "9yn69reyvwf0ugh",
          "item_type_name": "专辑",
          "chnId": "zhuanqu_4",
          "chnName": "王朝",
          "pay_status": 6,
          "pay_status_name": "会员免费",
          "pic_1920x1080": "http://puui.qpic.cn/tv/0/33074729_19201080/0"
        },
        {
          "title": "孙俪何润东特辑",
          "item_id": "xk8ti2m1q2w7alb",
          "item_type_name": "专辑",
          "chnId": "zhuanqu_4",
          "chnName": "王朝",
          "pay_status": 8,
          "pay_status_name": "免费",
          "pic_1920x1080": "http://puui.qpic.cn/tv/0/15567918_19201080/0"
        },
        {
          "title": "跑男来了 第5季 第12期",
          "item_id": "g6wzkw3itcoxd0e",
          "item_type_name": "专辑",
          "chnId": "zhuanqu_3",
          "chnName": "倾城时光",
          "pay_status": 8,
          "pay_status_name": "免费",
          "pic_1920x1080": "http://puui.qpic.cn/tv/0/11214290_19201080/0"
        },
        {
          "title": "奔跑吧·奇葩游戏合辑",
          "item_id": "n8v4ehx1ysbdu1p",
          "item_type_name": "专辑",
          "chnId": "zhuanqu_3",
          "chnName": "倾城时光",
          "pay_status": 8,
          "pay_status_name": "免费",
          "pic_1920x1080": "http://puui.qpic.cn/tv/0/11209925_19201080/0"
        }
      ]
    }
  }
}

// 风行频道
export const getFXChannelList = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "list": [
        {
          "type": "movie",
          "name": "电影"
        },
        {
          "type": "tv",
          "name": "电视剧"
        },
        {
          "type": "cartoon",
          "name": "动漫"
        },
        {
          "type": "Documentary",
          "name": "纪录片"
        }
      ]
    }
  }
}
// 风行付费类型
export const getFXPayList = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "list": [
        {
          "vip_type": "vipfree",
          "name": "会员付费"
        },
        {
          "vip_type": "vod",
          "name": "单点付费"
        },
        {
          "vip_type": "other",
          "name": "免费"
        }
      ]
    }
  }
}

// 风行搜索结果
export const getFXResultList = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "page": 1,
      "page_size": 3,
      "total": 28,
      "list": [
        {
          "name": "脚下的世界",
          "media_id": 328933,
          "still": "http://img.funtv.bestv.com.cn/sdw?oid=37248d7e1df2dceaf55a2c04a06d45d9&w=0&h=0",
          "poster": "http://img.funtv.bestv.com.cn/sdw?oid=3714422c15b64cda627eda0378c0186f&w=0&h=0",
          "update_to": "全2集",
          "is_end": true,
          "mtype": "Documentary",
          "release_year": 2016,
          "vip_type": "vipfree",
          "score": "6.7",
          "updateTime": 1555970341,
          "id": "5cbe392571d1fe93648b456a",
          "typeName": "纪录片",
          "payName": "会员付费"
        },
        {
          "name": "野性都市",
          "media_id": 328931,
          "still": "http://img.funtv.bestv.com.cn/sdw?oid=6b7426f4a2fee015ffae554f70733f28&w=0&h=0",
          "poster": "http://img.funtv.bestv.com.cn/sdw?oid=9c567ce1cfa6314d1481146b8b2fc23a&w=0&h=0",
          "update_to": "全3集",
          "is_end": true,
          "mtype": "Documentary",
          "release_year": 2018,
          "vip_type": "vipfree",
          "score": "7.0",
          "updateTime": 1555970341,
          "id": "5cbe392571d1fe93648b456b",
          "typeName": "纪录片",
          "payName": "会员付费"
        },
        {
          "name": "美国总统终极宝典",
          "media_id": 328905,
          "still": "http://img.funtv.bestv.com.cn/sdw?oid=330f0015291ed1824cb45aa40029103b&w=0&h=0",
          "poster": "http://img.funtv.bestv.com.cn/sdw?oid=9e57680b2862d639417d6b4459592b5b&w=0&h=0",
          "update_to": "全2集",
          "is_end": true,
          "mtype": "Documentary",
          "release_year": 2013,
          "vip_type": "vipfree",
          "score": "7.1",
          "updateTime": 1555970341,
          "id": "5cbe392571d1fe93648b4572",
          "typeName": "纪录片",
          "payName": "会员付费"
        }
      ]
    }
  }
}

// 酷喵频道
export const getKMChannelList = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "list": [
        {
          "show_type": 1,
          "name": "电影"
        },
        {
          "show_type": 3,
          "name": "电视剧"
        },
        {
          "show_type": 4,
          "name": "综艺"
        }
      ]
    }
  }
}
// 酷喵标签类型
export const getKMLabelList = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "list": [
        {
          "label_type": 2,
          "label_name": "预告"
        },
        {
          "label_type": 3,
          "label_name": "全网独播"
        },
        {
          "label_type": 5,
          "label_name": "会员免费"
        }
      ]
    }
  }
}

// 酷喵搜索结果
export const getKMResultList = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "page": 1,
      "page_size": 2,
      "total": 739,
      "list": [
        {
          "id": "5cf647c7bffebcfa158b4849",
          "label_name": "",
          "label_type": "0",
          "pic_url": "http://cn-vmc-images.alicdn.com/vmac/1000000005344000592FB15CADBA1FF75E0133F9",
          "pic_url_horizontal": "http://cn-vmc-images.alicdn.com/vmac/1000000005350000592FB148ADBA1FF85706648A",
          "show_type": "4",
          "title": "中国式相亲 第一季",
          "media_id": "160485",
          "show_type_name": "综艺"
        },
        {
          "id": "5cf647c7bffebcfa158b4848",
          "label_name": "",
          "label_type": "0",
          "pic_url": "http://cn-vmc-images.alicdn.com/vmac/10000000053440005C1067A9AD881A04C3001D7C",
          "pic_url_horizontal": "http://cn-vmc-images.alicdn.com/vmac/10000000053500005C1067A58B777406CD084A30",
          "show_type": "4",
          "title": "非常完美 贵州卫视 2019",
          "media_id": "196358",
          "show_type_name": "综艺"
        }
      ]
    }
  }
}

// 爱奇艺移动端搜索列表
export const getIQYMOList = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "page": 1,
      "page_size": 10,
      "total": 1,
      "list": [
        {
          "title": "我和我的祖国：陈铭童年照曝光",
          "subtitle": "畅聊团丝巾时尚五连拍",
          "tvId": "7060210800",
          "image": "http://m.iqiyipic.com/common/lego/20190914/844f78afe4ea4c1889389b6211f179c9.jpg",
          "playUrl": "iqiyi://mobile/player?aid=7060210800&tvid=7060210800&fType=27&subType=342",
          "updateTime": 1568461508,
          "aid": "7060210800",
          "createTime": 1568842201,
          "id": "5d82a1d971d1fed7158b456b"
        }
      ]
    }
  }
}

// 豆果美食搜索列表
export const getDGMSList = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "page": 1,
      "page_size": 1,
      "total": 15,
      "list": [
        {
          "cook_id": "2343496",
          "image": "https://cp1.douguo.com/upload/caiku/4/1/9/960_4100dbd638cb0e57e6964d60a1c28f79.jpg",
          "title": "竹荪山药菌菇鸡汤#秋天怎么吃#",
          "updateTime": 1568872922,
          "id": "5d8319da36f8cae3d0f578dd"
        }
      ]
    }
  }
}

