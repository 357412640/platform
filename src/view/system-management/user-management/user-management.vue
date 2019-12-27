<template>
  <div class="user-management">
    <div class="title-box">
      <span class="left">用户管理</span>
    </div>
    <div>
      <Form ref="formCustom" :model="formCustom" :label-width="60">
        <Row>
          <Col span="4">
            <FormItem label="用户名:">
              <Input type="text" v-model="formCustom.username"></Input>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="Email:">
              <Input type="text" v-model="formCustom.email"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="是否启用" style="margin-left: 10px">
              <RadioGroup v-model="formCustom.status">
                <Radio label="1">启用</Radio>
                <Radio label="2">禁用</Radio>
                <Radio label="0">所有</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="2">
            <FormItem :label-width="0">
              <Button type="primary" @click="handleSubmit('formCustom')">查询</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div>
      <Table stripe :loading=loading :columns="user_columns" :data="user_data" :show-header=false style="margin-top: 10px"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.current" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <Modal
      title=""
      v-model="popModal.popShow"
      :mask-closable="false"
      width="600px"
      @on-ok="saveUser"
      :loading="popModal.popLoading">
      <p slot="header">
        <span>{{ userData.name }}-关联角色</span>
      </p>
      <div>
        <span class="pop-username">用户名:{{ userData.name }}</span>
        <span>Email:{{ userData.email }}</span>
      </div>
      <div>
        <span>是否启用:</span>
        <RadioGroup v-model="userData.status">
          <Radio label="0">启用</Radio>
          <Radio label="1">禁用</Radio>
        </RadioGroup>
      </div>
      <div class="select-box">
        <div class="left-box">
          <Table height="200" :columns="popAllRoleColumns" :data="popAllRoleData" @on-selection-change="getSelectList"></Table>
        </div>
        <div class="right-box">
          <Table height="200" :columns="popSelectRoleColumns" :data="popSelectRoleData"></Table>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import './index.less'
import { forEach } from '@/libs/tools'
import { deepClone, isClass } from '@/libs/util'
import { getUserList, getUserDetail, getRoleList, saveUser } from '@/api/system-data'

export default {
  name: 'user-management',
  data () {
    return {
      formCustom: {
        username: '',
        email: '',
        status: ''
      },
      pageInfo: {
      },
      loading: true,
      user_columns: [
        {
          title: '角色名称',
          key: 'username'
        },
        {
          title: '操作',
          key: 'operate',
          align: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.getUserDetail(params.row.id)
                  }
                }
              }, '关联角色')
            ])
          }
        }
      ],
      user_data: [],
      userData: {},
      popModal: {
        popShow: false,
        popLoading: true
      },
      popAllRoleColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '所有角色',
          key: 'name'
        }
      ],
      popAllRoleData: [
      ],
      popSelectRoleColumns: [
        {
          title: '已选角色',
          key: 'name',
          align: 'center'
        }
      ],
      popSelectRoleData: [
      ]
    }
  },
  created () {
    this.changePage()
    this.getAllRoleList()
  },
  methods: {
    handleSubmit () {
      this.changePage(1)
    },
    changePage (page) {
      this.loading = true
      this.pageInfo.current = page
      let username = this.formCustom.username.trim()
      let email = this.formCustom.email.trim()
      let status = this.formCustom.status
      let newPage = page || 1
      let page_size = this.pageInfo.page_size || 20
      getUserList({ username, email, status, newPage, page_size }).then(res => {
        const data = res.data
        this.loading = false
        if (data.errno === 10000) {
          this.user_data = data.data.list
          this.pageInfo.current = data.data.page
          this.pageInfo.page_size = data.data.page_size
          this.pageInfo.total = data.data.total
        } else {
          this.$Modal.warning({
            title: '获取失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    // 获取当前用户信息
    getUserDetail (id) {
      getUserDetail(id).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          let allData = deepClone(this.popAllRoleData)
          let role = data.data.role
          let selectArr = []
          this.userData.id = data.data.id
          this.userData.status = data.data.is_inactivity.toString()
          this.userData.name = data.data.username
          this.userData.email = data.data.email
          for (let i = 0; i < allData.length; i++) {
            let role = allData[i]
            this.$set(role, '_checked', false)
          }
          // 回显角色全量列表勾选
          forEach(role, (item, i) => {
            for (let i = 0; i < allData.length; i++) {
              let role = allData[i]
              if (role.id === item) {
                this.$set(role, '_checked', true)
                selectArr.push(role)
              }
            }
          })
          this.popAllRoleData = allData
          this.popSelectRoleData = selectArr
          this.$forceUpdate()
          this.popModal.popShow = true
        } else {
          this.$Modal.warning({
            title: '获取用户信息失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    // 获取全部角色列表
    getAllRoleList () {
      let page_size = 1000
      getRoleList({ page_size }).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          this.popAllRoleData = data.data.list
        } else {
          console.warn(`获取角色列表失败，原因：${data.errmsg}`)
        }
      })
    },
    // 获取当前被选中的角色列表
    getSelectList (selection) {
      this.popSelectRoleData = selection
    },
    // 保存用户权限 id is_inactivity role_ids
    saveUser () {
      let idArr = []
      let id = this.userData.id
      let is_inactivity = this.userData.status
      forEach(this.popSelectRoleData, item => {
        idArr.push(item.id)
      })
      let role_ids = idArr.join(',')

      saveUser({ id, is_inactivity, role_ids }).then(res => {
        this.popModal.popShow = false
        const data = res.data
        if (data.errno === 10000) {
          this.$Message.success('保存成功！')
        } else {
          this.$Modal.warning({
            title: '保存失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    }
  }
}
</script>
