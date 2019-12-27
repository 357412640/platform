<template>
  <div class="group-management">
    <div class="title-box">
      <span class="left">分组管理</span>
      <Button type="primary" style="float: right;" @click="createGroup">新建</Button>
    </div>
    <Form ref="formCustom" :model="formCustom" :label-width="60" @submit.native.prevent>
      <Row>
        <Col span="4">
          <FormItem label="分组" :label-width="40">
            <Input type="text" v-model="formCustom.group_name"></Input>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="型号">
            <Select v-model="formCustom.model_type">
              <Option v-for="item in modelTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="类型">
            <Select v-model="formCustom.type">
              <Option v-for="item in typeList" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="2">
          <FormItem :label-width="0" style="text-align: center;">
            <Button type="primary" @click="handleSubmit">搜索</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div>
      <Table stripe border :loading="loading" :columns="group_columns" :data="group_data" style="margin-top: 10px"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.current" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <Modal
      :title=popModal.popTitle
      v-model="popModal.popShow"
      :mask-closable="false"
      width="400px"
      @on-ok="saveModel"
      :ok-text="popModal.okText"
      :loading="popModal.popLoading">
      <Form :model="groupCustom" :label-width="80" style="font-size: 14px" @submit.native.prevent>
        <FormItem label="分组名称:" style="margin-right: 20px">
          <Input type="text" v-model="groupCustom.group_name"></Input>
        </FormItem>
        <FormItem label="型号:" style="margin-right: 20px">
          <Select v-model="groupCustom.model_id" size="large">
            <Option v-for="item in createModelTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="分组类型:" style="margin-right: 20px">
          <Select v-model="groupCustom.type" size="large">
            <Option v-for="item in createTypeList" :value="item.name" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注:" style="margin-right: 20px">
          <Input v-model="groupCustom.remark" type="textarea" :rows="2" placeholder="" />
        </FormItem>
        <p class="modal-err" style="color: red;padding: 0 20px;text-align: center;min-height: 25px">{{ popModal.popErr }}</p>
      </Form>
    </Modal>

    <Modal
      title="删除型号"
      v-model="deletePop.popShow"
      :mask-closable="false"
      width="400px"
      @on-ok="deleteGroup"
      :loading="deletePop.popLoading">
      <p>
        确认要删除型号：{{ deletePop.group_name }}吗？
      </p>
    </Modal>
  </div>
</template>

<script>
import './index.less'
import {
  getGroupList,
  getGroupDetail,
  saveOrUpdateGroup,
  deleteGroup,
  getModelTypeList,
  getTypeList,
  getGroupTypeList
} from '@/api/device-data'
export default {
  name: 'group-management',
  data () {
    return {
      formCustom: {
        group_name: '',
        model_type: '',
        type: ''
      },
      loading: true,
      group_columns: [
        {
          title: '分组名称',
          key: 'name',
          align: 'center',
          tooltip: true,
          minWidth: 300
        },
        {
          title: '型号',
          key: 'model_name',
          align: 'center',
          tooltip: true,
          width: 180
        },
        {
          title: '分组类型',
          key: 'type',
          align: 'center',
          tooltip: true,
          width: 180
        },
        {
          title: '备注',
          key: 'remark',
          align: 'center',
          tooltip: true,
          width: 180
        },
        {
          title: '操作',
          key: 'operate',
          align: 'center',
          width: 180,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.updateGroup(params.row.id)
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
      group_data: [],
      pageInfo: {},
      popModal: {
        popTitle: '新建分组',
        popShow: false,
        popLoading: true,
        popErr: '',
        okText: ''
      },
      deletePop: {
        popShow: false,
        popLoading: true,
        group_name: ''
      },
      deleteGroupData: {},
      groupCustom: {
        id: '',
        group_name: '',
        model_type: '',
        model_id: '',
        type: '',
        remark: ''
      },
      modelTypeList: [],
      createModelTypeList: [],
      typeList: [],
      createTypeList: []
    }
  },
  methods: {
    // 搜索按钮
    handleSubmit () {
      this.changePage()
    },
    // 翻页
    changePage (page) {
      this.loading = true
      this.pageInfo.current = page
      let data = {
        name: this.formCustom.group_name.trim(),
        model_id: this.formCustom.model_type,
        type: this.formCustom.type,
        page: page || 1,
        page_size: this.pageInfo.page_size || 20
      }
      if (data.type === '全部') {
        data.type = ''
      }
      getGroupList(data).then(res => {
        const data = res.data
        this.loading = false
        if (data.errno === 10000) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.page
          this.pageInfo.page_size = data.data.page_size
          this.group_data = data.data.list
        } else {
          this.$Modal.warning({
            title: '获取失败',
            content: `原因：${data.errmsg}`
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 保存分组
    saveModel () {
      let id = this.groupCustom.id
      let name = this.groupCustom.group_name.trim()
      let model_id = this.groupCustom.model_id
      let type = this.groupCustom.type.trim()
      let remark = this.groupCustom.remark
      let act = id ? 'update' : 'insert'
      let flag = false
      if (name === '') {
        this.popModal.popErr = '分组名称不能为空'
        flag = true
      } else if (model_id === '') {
        this.popModal.popErr = '请选择型号'
        flag = true
      } else if (type === '') {
        this.popModal.popErr = '请选择分组类型'
        flag = true
      }
      if (flag) {
        this.popModal.popLoading = false
        this.$nextTick(() => {
          this.popModal.popLoading = true
        })
        return
      }
      saveOrUpdateGroup({ id, name, model_id, type, remark, act }).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          this.$Message.success('保存成功！')
          this.popModal.popShow = false
          this.initGroupCustom()
          this.$nextTick(() => {
            this.changePage()
          })
        } else {
          this.popModal.popErr = data.errmsg
          this.popModal.popLoading = false
          this.$nextTick(() => {
            this.popModal.popLoading = true
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 新建分组
    createGroup () {
      this.popModal.popTitle = '新建分组'
      this.popModal.okText = '保存'
      this.groupCustom.id = ''
      this.initGroupCustom()
      this.getModelTypeList('create')
      this.getTypeList('create')
      this.popModal.popShow = true
    },
    // 编辑分组
    updateGroup (id) {
      this.popModal.popTitle = '编辑分组'
      this.popModal.okText = '修改'
      this.initGroupCustom()
      let vm = this
      Promise.all([getModelTypeList(), getTypeList(), getGroupDetail(id)]).then(function (results) {
        let modelTypeListData = results[0].data
        let typeListData = results[1].data
        let groupDetailData = results[2].data
        if (modelTypeListData.errno === 10000) {
          vm.createModelTypeList = modelTypeListData.data.list
        } else {
          vm.$Modal.warning({
            title: '编辑分组',
            content: modelTypeListData.errmsg
          })
        }
        if (typeListData.errno === 10000) {
          vm.createTypeList = typeListData.data.list
        } else {
          vm.$Modal.warning({
            title: '编辑分组',
            content: typeListData.errmsg
          })
        }
        if (groupDetailData.errno === 10000) {
          vm.groupCustom.id = id
          vm.groupCustom.group_name = groupDetailData.data.name
          vm.groupCustom.model_type = groupDetailData.data.model_name
          vm.groupCustom.type = groupDetailData.data.type
          vm.groupCustom.remark = groupDetailData.data.remark
          vm.popModal.popShow = true
          for (let i = 0; i < vm.createModelTypeList.length; i++) {
            let model = vm.createModelTypeList[i]
            if (groupDetailData.data.model_name === model.name) {
              vm.groupCustom.model_id = model.id
            }
          }
        } else {
          vm.$Modal.warning({
            title: '编辑分组',
            content: groupDetailData.errmsg
          })
        }
      })
    },
    deletePopShow (row) {
      this.deleteGroupData = row
      this.deletePop.group_name = row.name
      this.deletePop.popShow = true
    },
    // 删除分组
    deleteGroup () {
      let id = this.deleteGroupData.id
      deleteGroup(id).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          this.$Message.info('删除成功！')
          this.changePage(this.pageInfo.current)
        } else {
          this.$Modal.warning({
            title: '删除分组',
            content: data.errmsg
          })
        }
        this.deletePop.popShow = false
      }).catch(err => {
        console.log(err)
      })
    },
    initGroupCustom () {
      this.groupCustom.id = ''
      this.groupCustom.group_name = ''
      this.groupCustom.model_type = ''
      this.groupCustom.model_id = ''
      this.groupCustom.type = ''
      this.groupCustom.remark = ''
      this.popModal.popErr = ''
    },
    // 获取型号列表
    getModelTypeList (type) {
      getModelTypeList().then(res => {
        let data = res.data
        if (data.errno === 10000) {
          let modelTypeList = data.data.list
          if (type === 'create') {
            this.createModelTypeList = modelTypeList
          } else {
            let type_all = {
              id: '-1',
              name: '全部'}
            modelTypeList.unshift(type_all)
            this.modelTypeList = modelTypeList
          }
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 获取类型列表
    getTypeList (type) {
      getTypeList().then(res => {
        let data = res.data
        if (data.errno === 10000) {
          let typeList = data.data.list
          if (type === 'create') {
            this.createTypeList = typeList
          } else {
            let type_all = {
              id: '-1',
              name: '全部'}
            typeList.unshift(type_all)
            this.typeList = typeList
          }
        }
      }).catch(err => {
        console.error(err)
      })
    }
  },
  created () {
    this.changePage()
    this.getModelTypeList()
    this.getTypeList()
  }
}
</script>
