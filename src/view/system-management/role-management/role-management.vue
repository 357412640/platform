<template>
  <div class="role-management">
    <div class="title-box">
      <span class="left">角色管理</span>
      <Button type="primary" @click="toRoleAddPage('/view/system_management/role_add')" style="float: right;">创建角色</Button>
    </div>
    <div class="search-box">
      <span class="role-title">角色名称</span>
      <div class="role-search-input">
        <Input placeholder="" @on-enter="searchList" v-model="role_name" style="height: 33px;">
          <Icon type="ios-search" slot="suffix" @click="searchList" style="cursor: pointer" />
        </Input>
      </div>
    </div>
    <div>
      <Table stripe :loading="loading" :columns="role_columns" :data="role_data" style="margin-top: 10px"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.current" @on-change="changePage"></Page>
        </div>
      </div>
    </div>

    <Modal
      v-model="delete_modal.flag"
      :title=delete_modal.title
      @on-ok="deleteRole"
      :loading="delete_modal.loading">
      <p>角色名称：{{ delete_modal.name }}</p>
    </Modal>

    <!-- 角色权限弹窗 -->
    <Modal
      v-model="role_detail_modal.flag"
      :title=role_detail_modal.title>
      <p>角色名称：{{ role_detail_modal.name }}</p>
      <Tree :data="role_detail_modal.data"></Tree>
    </Modal>

    <!-- 关联用户弹窗 -->
    <Modal
      v-model="user_detail_modal.flag"
      :title=user_detail_modal.title>
      <p>角色名称：{{ user_detail_modal.name }}</p>
      <Table stripe :columns="user_detail_modal.columns" :data="user_detail_modal.data" style="margin-top: 10px"></Table>
    </Modal>
  </div>
</template>

<script>
import './index.less'
import { mapMutations } from 'vuex'
import {forEach} from '@/libs/tools'
import { sessionSave } from '@/libs/util'
import { getRoleDetail, deleteRole, getRoleList } from '@/api/system-data'
export default {
  name: 'role-management',
  data () {
    return {
      loading: true,
      role_name: '',
      role_columns: [
        {
          title: '角色名称',
          key: 'name'
        },
        {
          title: '操作',
          key: 'operate',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.getRoleDetail(params.row.id)
                  }
                }
              }, '查看权限'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.getAboutUser(params.row.id)
                  }
                }
              }, '关联用户'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.toRoleAddPage('/view/system_management/role_edit', JSON.stringify(params.row), 'role_edit')
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteAlert(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      role_data: [],
      pageInfo: {},
      deleteRoleData: {},
      delete_modal: {
        title: '是否删除该角色？',
        flag: false,
        name: '',
        loading: true
      },
      role_detail_modal: {
        title: '角色权限',
        flag: false,
        data: []
      },
      user_detail_modal: {
        title: '关联用户',
        flag: false,
        columns: [
          {
            title: '角色名称',
            key: 'username'
          },
          {
            title: '邮箱',
            key: 'email'
          }
        ],
        data: []
      }
    }
  },
  created () {
    this.changePage()
  },
  methods: {
    ...mapMutations([
      'setEditRole'
    ]),
    searchList () {
      this.changePage(1)
    },
    // 获取角色权限
    getRoleDetail (id) {
      const menuList = this.$store.getters.menuList
      getRoleDetail(id).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          let detailData = data.data
          this.role_detail_modal.name = detailData.name
          const keyList = data.data.menu
          this.role_detail_modal.data = this.getDetailMenu(keyList, menuList)
          this.role_detail_modal.flag = true
        } else {
          this.$Modal.warning({
            title: '获取失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    // 获取关联用户
    getAboutUser (id) {
      getRoleDetail(id).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          let detailData = data.data
          this.user_detail_modal.name = detailData.name
          this.user_detail_modal.data = detailData.user
          this.user_detail_modal.flag = true
        } else {
          this.$Modal.warning({
            title: '获取失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    deleteAlert (index) {
      this.deleteRoleData = this.role_data[index]
      this.deleteRoleData.index = index
      this.delete_modal.flag = true
      this.delete_modal.name = this.deleteRoleData.name
    },
    deleteRole () {
      let id = this.deleteRoleData.id
      deleteRole(id).then(res => {
        this.delete_modal.flag = false
        const data = res.data
        if (data.errno === 10000) {
          this.role_data.splice(this.deleteRoleData.index, 1)
          this.$Message.info('删除成功！')
        } else {
          this.$Modal.warning({
            title: '删除失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    toRoleAddPage (path, editRole, toEdit) {
      this.$router.push(path)
      this.setEditRole(editRole)
      if (toEdit === 'role_edit') {
        sessionSave('editRole', editRole)
      }
    },
    changePage (page) {
      this.loading = true
      this.pageInfo.current = page
      let name = this.role_name.trim()
      let data = {
        name,
        page: page || 1,
        page_size: this.pageInfo.page_size || 20
      }
      getRoleList(data).then(res => {
        const data = res.data
        this.loading = false
        if (data.errno === 10000) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.page
          this.pageInfo.page_size = data.data.page_size
          this.role_data = data.data.list
        } else {
          this.$Modal.warning({
            title: '获取失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    getDetailMenu (keyList, menuList) {
      let newData = []
      forEach(menuList, (item, i) => {
        let childObj = {
          title: '',
          expand: ''
        }
        // 1如果有children， 先把对象克隆， 递归 children
        // 如果 children.length 为 0 ，则对象不存入obj
        if (item.children && item.children.length) {
          childObj.title = item.meta.title
          childObj.expand = true
          let childArr = this.getDetailMenu(keyList, item.children)
          if (childArr.length) {
            childObj.children = childArr
            newData.push(childObj)
          }
        } else {
          for (let i = 0; i < keyList.length; i++) {
            let obj = {
              title: ''
            }
            if (keyList[i] === item.meta.key) {
              obj.title = item.meta.title
              newData.push(obj)
            }
          }
        }
      })
      return newData
    }
  }
}
</script>
