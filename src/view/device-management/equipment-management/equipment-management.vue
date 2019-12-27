<template>
  <div class="equipment-management">
    <div class="title-box">
      <span class="left">设备管理</span>
      <Button type="primary" style="float: right;" @click="toPage('/view/device_management/equipment_add')">导入</Button>
    </div>
    <Form :model="formCustom" :label-width="60">
      <Row>
        <Col span="4">
          <FormItem label="MAC" :label-width="40">
            <Input type="text" v-model="formCustom.mac"></Input>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="SN">
            <Input type="text" v-model="formCustom.sn"></Input>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="型号">
            <Select v-model="formCustom.model_id" @on-change="getGroupInModel">
              <Option v-for="item in modelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="分组">
            <Select v-model="formCustom.group_id">
              <Option v-for="item in groupList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="2">
          <FormItem :label-width="10">
            <Button type="primary" @click="handleSubmit">搜索</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <p style="padding-left: 20px">共有{{ pageInfo.total }}条记录。</p>
    <div>
      <Table stripe border :loading="loading" :columns="equip_columns" :data="equip_data" style="margin-top: 10px"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.current" @on-change="changePage"></Page>
        </div>
      </div>
    </div>

    <Modal class="mb-10"
      v-model="update_modal.flag"
      title="编辑"
      @on-ok="updateEquip"
      :loading="update_modal.loading"
      width="400">
      <p><span>MAC：</span>{{ update_modal.mac }}</p>
      <p><span>型号：</span>{{ update_modal.model_name }}</p>
      <p><span>终端类型：</span>{{ update_modal.terminal_type }}</p>
      <Form :model="formCustom" :label-width="80" label-position="left">
        <Row>
          <Col span="16">
            <FormItem label="设备分组：">
              <Select v-model="update_modal.group_id">
                <Option v-for="item in createGroupList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal class-name="mb-10"
      v-model="detail_modal.flag"
      title="设备详情"
      width="400px">
      <p><span>MAC：</span>{{ detail_modal.mac }}</p>
      <p><span>型号：</span>{{ detail_modal.model_name }}</p>
      <p><span>终端类型：</span>{{ detail_modal.terminal_type }}</p>
      <p><span>激活时间：</span>{{ detail_modal.activate_time }}</p>
      <p><span>设备分组：</span>{{ detail_modal.group_name }}</p>
    </Modal>
  </div>
</template>

<script>
import './index.less'
import {
  getEquipList,
  getGroupTypeList,
  getModelTypeList,
  getEquipDetail,
  updateEquip } from '@/api/device-data'
import { resetTime } from '@/libs/util'
export default {
  name: 'equipment-management',
  data () {
    return {
      formCustom: {
        mac: '',
        sn: '',
        model_id: '',
        group_id: ''
      },
      loading: false,
      equip_columns: [
        {
          title: 'MAC',
          key: 'mac',
          align: 'center',
          tooltip: true,
          minWidth: 150
        },
        {
          title: 'SN',
          key: 'sn',
          align: 'center',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '型号',
          key: 'model_name',
          align: 'center',
          tooltip: true,
          width: 130
        },
        {
          title: '终端类型',
          key: 'device_type',
          align: 'center',
          tooltip: true,
          width: 90
        },
        {
          title: '设备分组',
          key: 'group_name',
          align: 'center',
          tooltip: true,
          minWidth: 200
        },
        {
          title: '更新时间',
          key: 'update_time',
          align: 'center',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '操作人',
          key: 'user_name',
          align: 'center',
          tooltip: true,
          width: 100
        },
        {
          title: '操作',
          key: 'operate',
          align: 'center',
          minWidth: 80,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.updatePopShow(params.row)
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
                    this.DetailPopShow(params.row.id)
                  }
                }
              }, '详情')

            ])
          }
        }
      ],
      equip_data: [],
      pageInfo: {},
      popModal: {
        popTitle: '',
        popShow: false,
        popLoading: true,
        popErr: ''
      },
      groupCustom: {
        id: '',
        equip_name: '',
        model_type: '',
        type: '',
        remark: ''
      },
      modelList: [],
      groupList: [],
      createGroupList: [],
      update_modal: {
        id: '',
        flag: false,
        loading: true,
        mac: '',
        model_name: '',
        terminal_type: '',
        group_name: '',
        group_id: ''
      },
      detail_modal: {
        flag: false,
        mac: '',
        model_name: '',
        terminal_type: '',
        area: '',
        activate_time: '',
        group_name: ''
      }
    }
  },
  methods: {
    // 搜索按钮
    handleSubmit () {
      this.changePage()
    },
    changePage (page) {
      let groupId = this.formCustom.group_id
      let modelId = this.formCustom.model_id
      let mac = this.formCustom.mac.trim()
      let sn = this.formCustom.sn.trim()
      this.loading = true
      this.pageInfo.current = page
      if (groupId === '-1') {
        groupId = ''
      }
      if (modelId === '-1') {
        modelId = ''
      }
      let data = {
        mac,
        sn,
        group_id: groupId,
        model_id: modelId,
        page: page || 1,
        page_size: this.pageInfo.page_size || 20
      }
      getEquipList(data).then(res => {
        const data = res.data
        this.loading = false
        if (data.errno === 10000) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.page
          this.pageInfo.page_size = data.data.page_size
          this.equip_data = this.resetCreateTime(data.data.list)
        } else {
          this.$Modal.warning({
            title: '获取失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    updatePopShow (row) {
      let id = row.id
      let param = {
        t: 'create',
        model_id: row.model_id,
        type: 'device_group_update'
      }
      this.getGroupTypeList(param)
      this.initUpdateModal()
      getEquipDetail(id).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          let updateData = data.data[0]
          this.update_modal.id = id
          this.update_modal.mac = updateData.mac
          this.update_modal.model_name = updateData.model_name
          this.update_modal.terminal_type = updateData.terminal_type
          this.update_modal.activate_time = resetTime(updateData.activate_time)
          this.update_modal.group_name = updateData.group_name
          this.update_modal.group_id = updateData.group_id
          for (let i = 0; i < this.groupList.length; i++) {
            let group = this.groupList[i]
            if (updateData.group_name === group.name) {
              this.update_modal.group_id = group.id
            }
          }
          this.update_modal.flag = true
        }
      }).catch(err => {
        console.log(err)
      })
    },
    updateEquip () {
      let id = this.update_modal.id
      let group_id = this.update_modal.group_id
      updateEquip({id, group_id}).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          this.$Message.success('编辑成功！')
          this.changePage()
          this.getGroupTypeList()
          this.getModelTypeList()
        } else {
          this.$Modal.warning({
            title: '编辑失败',
            content: `原因：${data.errmsg}`
          })
        }
        this.update_modal.flag = false
      }).catch(err => {
        console.error(err)
      })
    },
    DetailPopShow (id) {
      getEquipDetail(id).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          let detailData = data.data[0]
          this.detail_modal.flag = true
          this.detail_modal.mac = detailData.mac
          this.detail_modal.model_name = detailData.model_name
          this.detail_modal.terminal_type = detailData.terminal_type
          this.detail_modal.activate_time = resetTime(detailData.activate_time)
          this.detail_modal.group_name = detailData.group_name
        }
      }).catch(err => {
        console.log(err)
      })
    },
    toPage (path) {
      this.$router.push(path)
    },
    // 后台返回操作时间的时间戳，重构数据
    resetCreateTime (list) {
      let data = list
      for (let i = 0; i < list.length; i++) {
        list[i].update_time = resetTime(list[i].update_time)
      }
      return data
    },
    getGroupTypeList (param) {
      let t
      let model_id
      let type
      if (param) {
        t = param.t
        model_id = param.model_id
        type = param.type
      }
      getGroupTypeList({ model_id, type }).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          let groupList = data.data.list
          if (t === 'create') {
            this.createGroupList = groupList
          } else {
            let type_all = {
              id: '-1',
              name: '全部'}
            groupList.unshift(type_all)
            this.groupList = groupList
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取型号列表
    getModelTypeList () {
      getModelTypeList().then(res => {
        let data = res.data
        if (data.errno === 10000) {
          let modelList = data.data.list
          let type_all = {
            id: '-1',
            name: '全部'}
          modelList.unshift(type_all)
          this.modelList = modelList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getGroupInModel (modelId) {
      let model_id
      let type
      if (modelId === '-1') {
        model_id = ''
      } else {
        model_id = modelId
        type = 'device_group_update'
      }
      getGroupTypeList({ model_id, type }).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          let groupList = data.data.list
          let type_all = {
            id: '-1',
            name: '全部'}
          groupList.unshift(type_all)
          this.groupList = groupList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    initUpdateModal () {
      this.update_modal.id = ''
      this.update_modal.mac = ''
      this.update_modal.model_name = ''
      this.update_modal.terminal_type = ''
      this.update_modal.activate_time = ''
      this.update_modal.group_name = ''
      this.update_modal.group_id = ''
    }
  },
  created () {
    this.changePage()
    this.getGroupTypeList()
    this.getModelTypeList()
  }
}
</script>
