import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由(当前项目后台返回key数组展示子路由)
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 *
 *  addMenu (true) 设置为 not 后页面菜单本级不添加到权限分配的可勾选菜单列表中
 *  key (-) 权限分配时 后台保存被勾选节点的对应值
 * }
 */

export default [
  {
    path: '/view/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true,
      addMenu: 'not'
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/view/system_management',
    name: 'system_management',
    component: Main,
    meta: {
      title: '系统管理'
    },
    children: [
      {
        path: 'role_management',
        name: 'role_management',
        meta: {
          title: '角色管理',
          // notCache: true,
          key: 'role_management'
        },
        component: () => import('@/view/system-management/role-management/role-management.vue')
      },
      {
        path: 'role_add',
        name: 'role_management',
        meta: {
          title: '角色添加',
          hideInMenu: true
        },
        component: () => import('@/view/system-management/role-add/role-add')
      },
      {
        path: 'role_edit',
        name: 'role_management',
        meta: {
          title: '角色修改',
          hideInMenu: true
        },
        component: () => import('@/view/system-management/role-add/role-add')
      },
      {
        path: 'user_management',
        name: 'user_management',
        meta: {
          title: '用户管理',
          key: 'user_management'
        },
        component: () => import('@/view/system-management/user-management/user-management.vue')
      }
    ]
  },
  {
    path: '/view/device_management',
    name: 'device_management',
    component: Main,
    meta: {
      title: '设备管理'
    },
    children: [
      {
        path: 'model_management',
        name: 'model_management',
        meta: {
          title: '型号管理',
          key: 'model_management'
        },
        component: () => import('@/view/device-management/model-management/model-management.vue')
      },
      {
        path: 'group_management',
        name: 'group_management',
        meta: {
          title: '分组管理',
          key: 'group_management'
        },
        component: () => import('@/view/device-management/group-management/group-management.vue')
      },
      {
        path: 'equipment_management',
        name: 'equipment_management',
        meta: {
          title: '设备管理',
          key: 'equipment_management'
        },
        component: () => import('@/view/device-management/equipment-management/equipment-management.vue')
      },
      {
        path: 'equipment_add',
        name: 'equipment_management',
        meta: {
          title: '设备导入',
          hideInMenu: true
        },
        component: () => import('@/view/device-management/equipment-add/equipment-add.vue')
      },
      {
        path: 'equipment_display',
        name: 'equipment_display',
        meta: {
          title: '数据概览',
          key: 'equipment_display'
        },
        component: () => import('@/view/device-management/equipment-display/equipment-display.vue')
      }
    ]
  },
  {
    path: '/view/domain-management',
    name: 'domain_management',
    meta: {
      title: '域名管理'
    },
    component: Main,
    children: [
      {
        path: 'resource_management',
        name: 'resource_management',
        meta: {
          title: '资源管理',
          key: 'resource_management'
        },
        component: () => import('@/view/domain-management/resource-management/resource-management.vue')
      },
      {
        path: 'packet_domain',
        name: 'packet_domain',
        meta: {
          title: '分组域名',
          key: 'packet_domain'
        },
        component: () => import('@/view/domain-management/packet-domain/packet-domain.vue')
      },
      {
        path: 'packet_add',
        name: 'packet_domain',
        meta: {
          title: '分组添加',
          hideInMenu: true
        },
        component: () => import('@/view/domain-management/packet-add/packet-add.vue')
      },
      {
        path: 'packet_edit',
        name: 'packet_domain',
        meta: {
          title: '分组编辑',
          hideInMenu: true
        },
        component: () => import('@/view/domain-management/packet-add/packet-add.vue')
      }
    ]
  },
  // 基础数据管理
  {
    path: '/view/base-data-management',
    name: 'basic_data_management',
    meta: {
      showAlways: true,
      title: '基础数据管理'
    },
    component: Main,
    children: [
      {
        path: 'form_management',
        name: 'form_management',
        meta: {
          title: '表单管理',
          key: 'form_management'
        },
        component: () => import('@/view/base-data-management/form-management/form-management')
      },
      {
        path: 'form_add',
        name: 'form_add',
        meta: {
          hideInMenu: true,
          hideTab: true,
          title: '表单维护',
          name: 'form_management'
        },
        component: () => import('@/view/base-data-management/form-management/form-add.vue')
      },
      {
        path: 'data_add_main',
        name: 'data_add_main',
        redirect: 'data_add_main/data_management',
        meta: {
          hideInMenu: true,
          hideTab: true,
          name: 'form_management',
          title: '数据'
        },
        component: () => import('@/view/base-data-management/data-management/index.vue'),
        children: [
          {
            path: 'data_add',
            name: 'data_add',
            meta: {
              hideInMenu: true,
              hideTab: true,
              name: 'form_management',
              title: '数据维护'
            },
            component: () => import('@/view/base-data-management/data-management/data-add.vue')
          },
          {
            path: 'data_management',
            name: 'data_management',
            meta: {
              hideInMenu: true,
              hideTab: true,
              name: 'form_management',
              title: '数据管理'
            },
            component: () => import('@/view/base-data-management/data-management/data-management.vue')
          },
          {
            path: 'import_page',
            name: 'import-page',
            meta: {
              hideInMenu: true,
              hideTab: true,
              name: 'form_management',
              title: '导入'
            },
            component: () => import('@/view/base-data-management/data-management/import-page.vue')
          }
        ]
      }

    ]},
  // launcher
  {
    path: '/view/launcher-management',
    name: 'launcher_management',
    meta: {
      showAlways: true,
      title: '桌面管理'
    },
    component: Main,
    children: [
      // {
      //   path: 'try-management',
      //   name: 'try_management',
      //   meta: {
      //     title: 'try管理',
      //     key: 'content_management'
      //   },
      //   component: () => import('@/view/launcher-management/content-M/index-try.vue.cp')
      // },
      {
        path: 'content-management',
        name: 'content_management',
        meta: {
          title: '内容管理',
          key: 'content_management'
        },
        component: () => import('@/view/launcher-management/content-M/index.vue')
      },
      {
        path: 'channel-add',
        name: 'channel-add',
        meta: {
          title: '新建/修改页面',
          hideInMenu: true
        },
        component: () => import('@/view/launcher-management/content-M/add.vue')
      },
      {
        path: 'img-content-edit',
        name: 'img-content-edit',
        meta: {
          title: '新建/修改页面',
          hideInMenu: true
        },
        component: () => import('@/view/launcher-management/content-M/img-edit.vue')
      },
      {
        path: 'recommended_rules',
        name: 'recommended_rules',
        meta: {
          title: '推荐规则管理',
          key: 'recommended_rules'
        },
        component: () => import('@/view/launcher-management/recommended-rules/recommended-rules.vue')
      },
      {
        path: 'recommended_add',
        name: 'recommended_rules',
        meta: {
          title: '新建规则',
          hideInMenu: true
        },
        component: () => import('@/view/launcher-management/recommended-rules/recommended-add.vue')
      },
      {
        path: 'recommended_copy',
        name: 'recommended_rules',
        meta: {
          title: '复制规则',
          hideInMenu: true
        },
        component: () => import('@/view/launcher-management/recommended-rules/recommended-add.vue')
      },
      {
        path: 'recommended_view',
        name: 'recommended_rules',
        meta: {
          title: '查看规则',
          hideInMenu: true
        },
        component: () => import('@/view/launcher-management/recommended-rules/recommended-add.vue')
      },
      {
        path: 'directional_promotion',
        name: 'directional_promotion',
        meta: {
          title: '定向推广管理',
          key: 'directional_promotion'
        },
        component: () => import('@/view/launcher-management/direction/directional-promotion/directional-promotion.vue')
      },
      {
        path: 'directional_add',
        name: 'directional_promotion',
        meta: {
          title: '新建推广',
          hideInMenu: true
        },
        component: () => import('@/view/launcher-management/direction/directional-add/directional-add.vue')
      },
      {
        path: 'directional_edit',
        name: 'directional_promotion',
        meta: {
          title: '编辑推广',
          hideInMenu: true
        },
        component: () => import('@/view/launcher-management/direction/directional-add/directional-add.vue')
      },
      {
        path: 'project_management',
        name: 'project_management',
        meta: {
          title: '专题管理',
          key: 'project_management'
        },
        component: () => import('@/view/launcher-management/project-management/project-management/project-management.vue')
      },
      {
        path: 'project_add',
        name: 'project_management',
        meta: {
          title: '新建专题',
          hideInMenu: true
        },
        component: () => import('@/view/launcher-management/project-management/project-add/project-add.vue')
      },
      {
        path: 'project_edit',
        name: 'project_management',
        meta: {
          title: '编辑专题',
          hideInMenu: true
        },
        component: () => import('@/view/launcher-management/project-management/project-add/project-add.vue')
      }
    ]
  },
  {
    path: '/view/media_assets',
    name: 'media_assets',
    meta: {
      title: '媒资库'
    },
    component: Main,
    children: [
      {
        path: 'album_list',
        name: 'album_list',
        meta: {
          title: '专辑列表',
          key: 'album_list'
        },
        component: () => import('@/view/media-assets/album-list/album-list')
      },
      {
        path: 'video_list',
        name: 'video_list',
        meta: {
          title: '视频列表',
          key: 'video_list'
        },
        component: () => import('@/view/media-assets/video-list/video-list')
      },
      {
        path: 'video_detail',
        name: 'video_list',
        meta: {
          title: '视频详情',
          hideInMenu: true
        },
        component: () => import('@/view/media-assets/video-detail/video-detail')
      },
      {
        path: 'IQY_operating_results',
        name: 'IQY_operating_results',
        meta: {
          title: '爱奇艺运营结果',
          key: 'IQY_operating_results'
        },
        component: () => import('@/view/media-assets/IQY-operating-results/IQY-operating-results')
      },
      {
        path: 'YST_operating_results',
        name: 'YST_operating_results',
        meta: {
          title: '云视听运营结果',
          key: 'YST_operating_results'
        },
        component: () => import('@/view/media-assets/YST-operating-results/YST-operating-results')
      },
      {
        path: 'FX_operating_results',
        name: 'FX_operating_results',
        meta: {
          title: '风行运营结果',
          key: 'FX_operating_results'
        },
        component: () => import('@/view/media-assets/FX-operating-results/FX-operating-results')
      },
      {
        path: 'KM_operating_results',
        name: 'KM_operating_results',
        meta: {
          title: '酷喵运营结果',
          key: 'KM_operating_results'
        },
        component: () => import('@/view/media-assets/KM-operating-results/KM-operating-results')
      },
      {
        path: 'IQY_mo_choice',
        name: 'IQY_mo_choice',
        meta: {
          title: 'IQY移动精选',
          key: 'IQY_mo_choice'
        },
        component: () => import('@/view/media-assets/IQY-mo-choice/IQY-mo-choice')
      },
      {
        path: 'DGMS_choice',
        name: 'DGMS_choice',
        meta: {
          title: '豆果美食精选',
          key: 'DGMS_choice'
        },
        component: () => import('@/view/media-assets/DGMS-choice/DGMS-choice')
      }
    ]
  },
  // application self-upgrade
  {
    path: '/view/app_self_update',
    name: 'app_self_update',
    meta: {
      title: '应用自升级',
      showAlways: true
    },
    component: Main,
    children: [
      {
        path: 'app_list',
        name: 'app_list',
        meta: {
          title: 'app升级列表',
          key: 'app_self_update'
        },
        component: () => import('@/view/app-self-update/index.vue')
      },
      {
        path: 'tactic_list',
        name: 'tactic_list',
        meta: {
          title: '策略列表',
          name: 'app_list',
          hideInMenu: true,
          hideTab: true
        },
        component: () => import('@/view/app-self-update/tactic_list.vue')
      },
      {
        path: 'app_add',
        name: 'app_add',
        meta: {
          title: 'app新建编辑',
          hideInMenu: true,
          name: 'app_list',
          hideTab: true
        },
        component: () => import('@/view/app-self-update/applist-add.vue')
      },
      {
        path: 'update_data',
        name: 'update_data',
        meta: {
          title: '升级数据',
          hideInMenu: true,
          name: 'app_list',
          hideTab: true
        },
        component: () => import('@/view/app-self-update/update-data')
      }
    ]
  },
  {
    path: '/view/log',
    name: 'log',
    meta: {
      title: '日志管理',
      showAlways: true
    },
    component: Main,
    children: [
      {
        path: 'TV-log',
        name: 'TV-log',
        meta: {
          title: 'TV日志',
          key: 'TV-log'
        },
        component: () => import('@/view/log/TV-log.vue')
      }
    ]
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  },
  {
    path: '/view/forbid',
    name: 'forbid',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/forbid/forbid.vue')
  }
]
