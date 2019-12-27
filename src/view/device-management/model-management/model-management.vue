<template>
<div class="model-management">
  <div class="title-box">
    <span class="left">型号管理</span>
    <Button type="primary" style="float: right;" @click="createModel" >新建</Button>
  </div>
  <div class="search-box">
    <Form ref="formCustom" :model="formCustom" :label-width="40" @submit.native.prevent>
      <Row>
        <Col span="6">
          <FormItem label="型号">
            <Input type="text" v-model="formCustom.model_name"></Input>
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
    <Table stripe border :loading="loading" :columns="model_columns" :data="model_data" style="margin-top: 10px"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.current" @on-change="changePage"></Page>
      </div>
    </div>
  </div>

  <Modal
    title="新建型号"
    v-model="popModal.popShow"
    :mask-closable="false"
    width="400px"
    @on-ok="saveModel"
    :loading="popModal.popLoading">
    <Form :model="modelCustom" :label-width="80" style="font-size: 14px">
      <FormItem label="型号:" style="margin-right: 20px">
        <Input type="text" v-model="modelCustom.model"></Input>
      </FormItem>
      <FormItem label="外部型号:" style="margin-right: 20px">
        <Input type="text" v-model="modelCustom.external_type"></Input>
      </FormItem>
      <FormItem label="设备类型:" style="margin-right: 20px">
        <Select v-model="modelCustom.device_type" size="large">
          <Option v-for="item in deviceTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <p class="modal-err" style="color: red;padding: 0 20px;text-align: center;min-height: 25px">{{ popModal.popErr }}</p>
    </Form>
  </Modal>

  <Modal
    title="删除型号"
    v-model="deletePop.popShow"
    :mask-closable="false"
    width="400px"
    @on-ok="deleteModel"
    :loading="deletePop.popLoading">
    <p>
      确认要删除型号：{{ deletePop.model_name }}吗？
    </p>
  </Modal>
</div>
</template>

<script>
import './index.less'
import { getModelList, saveModel, deleteModel, getDeviceList } from '@/api/device-data'
import { resetTime, setSerialNum } from '@/libs/util'
export default {
  name: 'model-management',
  data () {
    return {
      formCustom: {
        model_name: ''
      },
      loading: true,
      model_columns: [
        {
          title: '序号',
          key: 'number',
          align: 'center',
          tooltip: true,
          width: 80
        },
        {
          title: '型号',
          key: 'name',
          align: 'center',
          tooltip: true,
          minWidth: 140
        },
        {
          title: '外部型号',
          key: 'external_name',
          align: 'center',
          tooltip: true,
          minWidth: 140
        },
        {
          title: '终端类型',
          key: 'device_type',
          align: 'center',
          tooltip: true,
          width: 140
        },
        {
          title: '操作时间',
          key: 'create_time',
          align: 'center',
          tooltip: true,
          width: 150
        },
        {
          title: '操作',
          key: 'operate',
          align: 'center',
          width: 80,
          render: (h, params) => {
            return h('div', [
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
      model_data: [],
      pageInfo: {
      },
      popModal: {
        popShow: false,
        popLoading: true,
        popErr: ''
      },
      deletePop: {
        popShow: false,
        popLoading: true,
        model_name: ''
      },
      deleteModelData: {},
      modelCustom: {
        model: '',
        external_type: '',
        device_type: ''
      },
      deviceTypeList: []
    }
  },
  methods: {
    // 搜索按钮
    handleSubmit () {
      this.changePage(1)
    },
    // 翻页
    changePage (page) {
      this.loading = true
      this.pageInfo.current = page
      let data = {
        name: this.formCustom.model_name.trim(),
        page: page || 1,
        page_size: this.pageInfo.page_size || 20
      }
      getModelList(data).then(res => {
        const data = res.data
        this.loading = false
        if (data.errno === 10000) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.page
          this.pageInfo.page_size = data.data.page_size
          this.model_data = setSerialNum(this.resetCreateTime(data.data.list), this.pageInfo)
        } else {
          this.$Modal.warning({
            title: '获取失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    // 新建型号
    createModel () {
      this.initModelCustom()
      this.getDeviceList()
      this.popModal.popShow = true
    },
    // 保存型号
    saveModel () {
      // 保存失败后取消loading状态
      let data = {
        name: this.modelCustom.model.trim(),
        external_name: this.modelCustom.external_type.trim(),
        device_type: this.modelCustom.device_type
      }
      let flag = false
      if (data.name === '') {
        this.popModal.popErr = '型号不能为空'
        flag = true
      } else if (data.external_name === '') {
        this.popModal.popErr = '外部型号不能为空'
        flag = true
      } else if (data.id === '') {
        this.popModal.popErr = '请选择设备类型'
        flag = true
      }
      if (flag) {
        this.popModal.popLoading = false
        this.$nextTick(() => {
          this.popModal.popLoading = true
        })
        return
      }
      saveModel(data).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          this.popModal.popShow = false
          this.$Message.success('创建成功！')
          this.initModelCustom()
          this.changePage()
        } else {
          this.popModal.popErr = data.errmsg
          this.popModal.popLoading = false
          this.$nextTick(() => {
            this.popModal.popLoading = true
          })
        }
      })
    },
    deletePopShow (row) {
      this.deleteModelData = row
      this.deletePop.model_name = row.name
      this.deletePop.popShow = true
    },
    // 删除型号
    deleteModel () {
      let id = this.deleteModelData.id
      deleteModel(id).then(res => {
        let data = res.data
        this.deletePop.popShow = false
        if (data.errno === 10000) {
          this.$Message.info('删除成功！')
          this.changePage(this.pageInfo.current)
        } else {
          this.$Modal.warning({
            title: '删除型号',
            content: data.errmsg
          })
        }
      })
    },
    initModelCustom () {
      this.modelCustom.model = ''
      this.modelCustom.external_type = ''
      this.modelCustom.device_type = ''
      this.popModal.popErr = ''
    },
    // 后台返回操作时间的时间戳，重构数据
    resetCreateTime (list) {
      let data = list
      for (let i = 0; i < list.length; i++) {
        list[i].create_time = resetTime(list[i].create_time)
      }
      return data
    },
    // 获取设备类型
    getDeviceList () {
      getDeviceList().then(res => {
        let data = res.data
        if (data.errno === 10000) {
          this.deviceTypeList = data.data.list
        }
      })
    }
  },
  created () {
    // 请求列表数据
    this.changePage()
  }

}
</script>
