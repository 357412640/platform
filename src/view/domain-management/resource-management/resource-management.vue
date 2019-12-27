<!-- 资源管理 -->
<template>
  <div class="resource-management">
    <div class="title-box">
      <span class="left">资源管理</span>
      <Button type="primary" style="float: right;" @click="createPopShow">新建</Button>
    </div>
    <div class="search-box">
      <Form :model="formCustom" :label-width="60">
        <Row>
          <Col span="6">
            <FormItem label="资源名称">
              <Input type="text" v-model="formCustom.resource_name"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="资源标识" :label-width="80">
              <Input type="text" v-model="formCustom.resource_ide"></Input>
            </FormItem>
          </Col>
          <Col span="2">
            <FormItem :label-width="10">
              <Button type="primary" @click="handleSubmit">搜索</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div>
      <Table stripe border :loading="loading" :columns="resource_columns" :data="resource_data" style="margin-top: 10px"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.current" @on-change="changePage"></Page>
        </div>
      </div>
    </div>

    <Modal
      v-model="popShow.flag"
      :title="popShow.title"
      @on-ok="saveResource('formCustom')"
      @on-cancel="handleReset('formCustom')"
      :loading="popShow.popLoading">
      <Form ref="formCustom" :model="resourceCustom" :label-width="100" style="width: 400px" :rules="ruleValidate">
        <FormItem label="资源名称" prop="name">
          <Input type="text" v-model="resourceCustom.name"></Input>
        </FormItem>
        <FormItem label="资源标识" prop="identification">
          <Input type="text" v-model="resourceCustom.identification"></Input>
        </FormItem>
        <FormItem label="默认正式域名" prop="default_official_domain_name">
          <Input type="text" v-model="resourceCustom.default_official_domain_name"></Input>
        </FormItem>
        <FormItem label="默认测试域名" prop="default_test_domain_name">
          <Input type="text" v-model="resourceCustom.default_test_domain_name"></Input>
        </FormItem>
        <FormItem label="联系人" prop="contacts">
          <Input type="text" v-model="resourceCustom.contacts"></Input>
        </FormItem>
      </Form>
    </Modal>

    <Modal
      title="删除资源"
      v-model="deletePop.flag"
      :mask-closable="false"
      width="400px"
      @on-ok="deleteResource"
      :loading="deletePop.popLoading">
      <p>
        确认要删除资源：{{ deletePop.resource_name }}吗？
      </p>
    </Modal>
  </div>
</template>
<script>
import './index.less'
import { getResourceList, saveResource, deleteResource, getResourceDetail } from '@/api/domain-data'
import { setSerialNum } from '@/libs/util'
export default {
  name: 'resource-management',
  data () {
    return {
      loading: false,
      formCustom: {
        resource_name: '',
        resource_ide: ''
      },
      pageInfo: {},
      resource_columns: [
        {
          title: '序号',
          key: 'number',
          align: 'center',
          tooltip: true,
          width: 60
        },
        {
          title: '资源名称',
          key: 'name',
          align: 'center',
          tooltip: true,
          width: 150
        },
        {
          title: '资源标识',
          key: 'identification',
          align: 'center',
          tooltip: true,
          width: 120
        },
        {
          title: '默认正式域名',
          key: 'default_official_domain_name',
          align: 'center',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '默认测试域名',
          key: 'default_test_domain_name',
          align: 'center',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '联系人',
          key: 'contacts',
          align: 'center',
          tooltip: true,
          width: 120
        },
        {
          title: '操作',
          key: 'operate',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.editPopShow(params.row.id)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deletePopShow(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      resource_data: [],
      popShow: {
        title: '新建',
        flag: false,
        popLoading: true
      },
      resourceCustom: {
        id: '',
        name: '',
        identification: '',
        default_official_domain_name: '',
        default_test_domain_name: '',
        contacts: '',
        act: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '资源名称不能为空', trigger: 'blur' }
        ],
        identification: [
          { required: true, message: '资源标识不能为空', trigger: 'blur' },
          {
            type: 'string',
            message: '资源标识只能由数字、字母和下划线组成',
            required: true,
            pattern: /^[a-zA-Z0-9_]+$/,
            trigger: 'blur'
          }
        ],
        default_official_domain_name: [
          { required: true, message: '默认正式域名不能为空', trigger: 'blur' }
        ],
        default_test_domain_name: [
          { required: true, message: '默认测试域名不能为空', trigger: 'blur' }
        ],
        contacts: [
          { required: true, message: '资源名称不能为空', trigger: 'blur' }
        ]
      },
      deletePop: {
        flag: false,
        popLoading: true,
        id: '',
        resource_name: ''
      }
    }
  },
  methods: {
    changePage (page) {
      this.loading = true
      this.pageInfo.current = page
      let params = {
        name: this.formCustom.resource_name.trim(),
        identification: this.formCustom.resource_ide.trim(),
        page_size: this.pageInfo.page_size || 20,
        page: page || 1
      }
      getResourceList(params).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.page
          this.pageInfo.page_size = data.data.page_size
          this.resource_data = setSerialNum(data.data.list, this.pageInfo)
        } else {
          this.$Modal.warning({
            title: '资源列表获取失败',
            content: `原因:${data.errmsg}`
          })
        }
        this.loading = false
      }).catch(err => {
        console.error(err)
      })
    },
    handleSubmit () {
      this.changePage()
    },
    createPopShow () {
      // 新建
      this.initCreateData()
      this.resourceCustom.act = 'insert'
      this.popShow.title = '新建'
      this.popShow.flag = true
    },
    editPopShow (id) {
      // 编辑
      this.popShow.title = '编辑'
      // 请求获取资源数据
      getResourceDetail(id).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          this.resourceCustom = data.data
          this.resourceCustom.act = 'update'
          this.resourceCustom.id = id
          this.popShow.flag = true
        } else {
          this.$Modal.warning({
            title: '资源信息获取失败',
            content: `原因:${data.errmsg}`
          })
        }
      })
    },
    deletePopShow (row) {
      this.deletePop.id = row.id
      this.deletePop.resource_name = row.name
      this.deletePop.flag = true
    },
    saveResource (name) {
      let data = this.resourceCustom
      this.$refs[name].validate((valid) => {
        if (valid) {
          saveResource(data).then(res => {
            const data = res.data
            if (data.errno === 10000) {
              this.$Message.success('保存成功')
              this.changePage()
              this.popShow.flag = false
            } else {
              this.popShow.popLoading = false
              this.$nextTick(() => {
                this.popShow.popLoading = true
              })
              this.$Modal.warning({
                title: '保存失败',
                content: `原因:${data.errmsg}`
              })
            }
          }).catch(err => {
            console.error(err)
          })
        } else {
          this.popShow.popLoading = false
          this.$nextTick(() => {
            this.popShow.popLoading = true
          })
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    deleteResource () {
      deleteResource(this.deletePop.id).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          this.$Message.info('删除成功')
        } else {
          this.deletePop.popLoading = false
          this.$nextTick(() => {
            this.deletePop.popLoading = true
          })
          this.$Modal.warning({
            title: '删除失败',
            content: `原因:${data.errmsg}`
          })
        }
        this.changePage(this.pageInfo.current)
        this.deletePop.flag = false
      }).catch(err => {
        console.error(err)
      })
    },
    initCreateData () {
      this.resourceCustom.id = ''
      this.resourceCustom.name = ''
      this.resourceCustom.identification = ''
      this.resourceCustom.default_official_domain_name = ''
      this.resourceCustom.default_test_domain_name = ''
      this.resourceCustom.contacts = ''
    },
    initSearchData () {
      this.formCustom.resource_name = ''
      this.formCustom.resource_ide = ''
    }
  },
  created () {
    this.changePage()
  }
}
</script>
