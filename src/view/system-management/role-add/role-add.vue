<template>
  <div class="role-add">
    <div class="title-box">
      <span class="left">{{ pageTitle }}</span>
      <Button type="primary" @click="backToRoleManagement" style="float: right;">返回</Button>
    </div>

    <div class="content-box">
      <div>
        <span>角色名称</span>
        <Input v-model="roleName" placeholder="" style="width: 300px; margin-left: 5px"/>
      </div>
      <div class="user-provisioning">
        <span style="float:left;margin-top: 8px">权限分配</span>
        <Tree :data="menu_data" show-checkbox style="float:left; margin-left: 5px"
              @on-check-change="checkChange" ref="checkTree"></Tree>
      </div>
      <div>
        <Button type="primary" @click="saveUser">保存</Button>
        <Button @click="backToRoleManagement" style="margin-left: 20px">取消</Button>
      </div>
    </div>
  </div>
</template>

<script>
import './index.less'
import {forEach} from '@/libs/tools'
import {showTitle, sessionRead} from '@/libs/util'
import { mapGetters, mapMutations } from 'vuex'
import { createRole, updataRole, getRoleDetail } from '@/api/system-data'

export default {
  name: 'role-add',
  data () {
    return {
      pageTitle: '新增角色',
      menu_data: [],
      roleName: '',
      checkMenu: [],
      editRoleData: {}
    }
  },
  methods: {
    ...mapGetters([
      'editRole'
    ]),
    ...mapMutations([
      'setEditRole'
    ]),
    backToRoleManagement () {
      this.$router.push('/view/system_management/role_management')
    },
    saveUser () {
      let name = this.roleName.trim()
      let menu = []
      let id = ''
      if (name === '') {
        this.$Modal.warning({
          title: '错误',
          content: '姓名不能为空'
        })
        return
      }
      this.checkMenu = this.$refs.checkTree.getCheckedNodes()
      forEach(this.checkMenu, function (item, i) {
        if (!(item.children && item.children.length)) {
          menu.push(item.meta.key)
        }
      })
      menu = menu.join(',')
      if (~location.pathname.indexOf('role_edit')) {
        id = this.editRoleData.id
        updataRole({name, menu, id}).then(res => {
          const data = res.data
          if (data.errno === 10000) {
            this.$Message.success('修改成功!')
            this.backToRoleManagement()
          } else {
            this.$Modal.warning({
              title: '失败',
              content: data.errmsg
            })
          }
        })
      } else {
        createRole({name, menu}).then(res => {
          const data = res.data
          if (data.errno === 10000) {
            this.$Message.success('创建成功!')
            this.backToRoleManagement()
          } else {
            this.$Modal.warning({
              title: '失败',
              content: data.errmsg
            })
          }
        })
      }
    },
    // 根据router结构 构建勾选菜单
    getMenuList (menuList, vm) {
      let res = []
      let resChildren = []
      forEach(menuList, function (item, i) {
        if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
          item.title = showTitle(item, vm) || item.name
          item.expand = true
          if (item.children && item.children.length) {
            resChildren = vm.getMenuList(item.children, vm)
          }
          if (item.meta.addMenu === 'not') {
            res = res.concat(resChildren)
          } else {
            res.push(item)
          }
        }
      })
      return res
    },
    checkChange (checkList) {
      // 保存当前勾选的节点
      this.checkMenu = checkList
    },
    setCheckList (keyList, menuData, vm) {
      let newData = this.deepClone(menuData)
      if (keyList.length) {
        forEach(keyList, function (key, i) {
          for (let i = 0; i < newData.length; i++) {
            newData[i].checked = false
            vm.$nextTick(() => {
              if (newData[i].children && newData[i].children.length) {
                newData[i].children = vm.setCheckList(keyList, newData[i].children, vm)
              } else if (newData[i].meta.key === key) {
                newData[i].checked = true
              }
            })
          }
        })
      } else {
        for (let i = 0; i < newData.length; i++) {
          newData[i].checked = false
        }
      }
      return newData
    },
    deepClone (obj) {
      let result
      let oClass = this.isClass(obj)
      // 确定result的类型
      if (oClass === 'Object') {
        result = {}
      } else if (oClass === 'Array') {
        result = []
      } else {
        return obj
      }
      for (let key in obj) {
        let copy = obj[key]
        if (this.isClass(copy) === 'Object') {
          result[key] = this.deepClone(copy)// 递归调用
        } else if (this.isClass(copy) === 'Array') {
          result[key] = this.deepClone(copy)
        } else {
          result[key] = obj[key]
        }
      }
      return result
    },
    isClass (o) {
      if (o === null) return 'Null'
      if (o === undefined) return 'Undefined'
      return Object.prototype.toString.call(o).slice(8, -1)
    }
  },
  created () {
    this.roleName = ''
    const menuList = this.$store.getters.menuList
    // console.log(this.getMenuList(menuList, this))
    this.menu_data = this.getMenuList(menuList, this)
    if (~location.pathname.indexOf('role_edit')) {
      this.editRoleData = JSON.parse(sessionRead('editRole'))
    }
    if (this.editRoleData && this.editRoleData.id) {
      this.pageTitle = '修改'
      getRoleDetail(this.editRoleData.id).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          let detailData = data.data
          this.roleName = detailData.name
          this.menu_data = this.setCheckList(data.data.menu, this.menu_data, this)
        } else {
          this.$Modal.warning({
            title: '获取失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    } else {
      this.menu_data = this.setCheckList([], this.menu_data, this)
    }
  }
}
</script>
