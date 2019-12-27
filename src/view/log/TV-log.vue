<template>
  <div class="TV-log">
    <header class="common-header">
      <h2>TV日志</h2>
    </header>
    <div class="input-base-style">
      <label>MAC：</label>
      <Input v-model.trim="params.mac" placeholder="请输入" style="width: 300px"/>
    </div>
    <div class="input-base-style">
      <label>型号：</label>
      <Select v-model="params.model_id" style="width:200px">
        <Option value="">全部</Option>
        <Option v-for="item in modelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </div>
    <div class="input-base-style">
      <label>设备类型：</label>
      <Select v-model="params.type" style="width:200px">
        <Option v-for="item in deviceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </div>
    <div class="input-base-style">
      <label>系统版本：</label>
      <Select filterable v-model="params.system_version" style="width:200px">
        <Option value="">全部</Option>
        <Option v-for="item in sysList" :value="item.system_version" :key="item.system_version">{{ item.system_version }}</Option>
      </Select>
    </div>
    <div class="input-base-style">
      <label>状态：</label>
      <Select v-model="params.status" style="width:200px">
        <Option value="">全部</Option>
        <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </div>
    <div class="input-base-style">
      <Button type="primary" @click="getListData(true)">搜索</Button>
    </div>
    <Table border stripe :columns="columns" :data="tableData" class="table-common-top" :loading="isLoading">
      <template slot-scope="{ row, index }" slot="action">
        <Button @click="showStatusModel(row.id)" size="small">更新状态</Button>
        <Button @click="download(row.file_url)" size="small" class="common-margin-left-10">下载日志</Button>
      </template>
    </Table>
    <Page :total="total" prev-text="上一页" next-text="下一页" @on-change="changePage" class="page-common-right" :page-size="20"/>

    <!--模态框-->
    <Modal
      v-model="changeStatus"
      title="修改状态"
      :footer-hide="true">
      <div>
        <div class="common-nowrap common-padding-top-10">
          <label class="model-label">状态</label>
          <Select v-model="update.status" class="model-sel">
            <Option v-for="item in statusListDis" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </div>
        <div class="common-padding-top-20">
          <label class="model-label">备注</label>
          <Input v-model="update.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..." class="model-sel"/>
        </div>
        <div class="common-padding-top-20 common-text-align">
          <Button type="primary" @click="saveStatus">保存</Button>
          <Button type="primary" @click="changeStatus=false" class="common-margin-left-20">取消</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { formatDate } from '@/libs/date'
import {reqLoglist, reqModelList, reqVersionList, reqStatusSave, reqStatusEdit} from '@/api/TV-log'
import dict from '@/libs/dict'
const update = {
  status: '',
  remark: '',
  id: ''
}
const column = [
  {
    type: 'index',
    title: '序号',
    width: 80
  },
  {
    title: 'MAC',
    key: 'mac',
    minWidth: 100
  },
  {
    title: '型号',
    key: 'model_name',
    minWidth: 100
  },
  {
    title: '设备类型',
    key: 'type',
    minWidth: 120
  },
  {
    title: '系统版本',
    key: 'system_version',
    minWidth: 100
  },
  {
    title: '创建时间',
    key: 'create_time',
    minWidth: 100
  },
  {
    title: '当前状态',
    key: 'status',
    minWidth: 100
  },
  {
    title: '操作',
    key: 'address',
    width: 180,
    slot: 'action'
  }
]
const deviceList = [
  {id: '', name: '全部'},
  {id: '正式', name: '正式'},
  {id: '测试', name: '测试'}
]
const statusList = [
  {id: 1, name: '未处理'},
  {id: 2, name: '处理中'},
  {id: 3, name: '已处理'},
  {id: 4, name: '无效'},
  {id: 5, name: '关闭'}
]
const statusListDis = [
  {id: 2, name: '处理中'},
  {id: 3, name: '已处理'},
  {id: 4, name: '无效'},
  {id: 5, name: '关闭'}
]
export default {
  name: 'TV-log',
  data () {
    return {
      params: {
        page: '',
        page_size: 20,
        mac: '',
        model_id: '',
        type: '',
        system_version: '',
        status: ''
      },
      modelList: [],
      sysList: [],
      deviceList,
      statusList,
      statusListDis,
      columns: column,
      tableData: [],
      total: 0,
      changeStatus: false,
      isLoading: false,
      update: {}
    }
  },
  created () {
    this.getListData()
    this.getMacList()
    this.getSysList()
  },
  methods: {
    async getListData (init) {
      this.isLoading = true
      if (init) this.params.page = 1
      try {
        const res = await reqLoglist(this.params)
        this.isLoading = false
        if (res.errno === 10000) {
          this.total = res.data.total
          this.tableData = res.data.list
          this.tableData.forEach(val => {
            val.status = dict.log[val.status]
            val.create_time = formatDate(val.create_time, true)
          })
        } else {
          throw (res.errmsg)
        }
      } catch (err) {
        this.isLoading = false
        this.$Notice.error({ desc: err })
      }
    },
    async getMacList () {
      try {
        const res = await reqModelList()
        if (res.errno === 10000) {
          this.modelList = res.data.list
        } else {
          throw (res.errmsg)
        }
      } catch (err) {
        this.$Notice.error({ desc: err })
      }
    },
    async getSysList () {
      try {
        const res = await reqVersionList()
        if (res.errno === 10000) {
          this.sysList = res.data.list
        } else {
          throw (res.errmsg)
        }
      } catch (err) {
        this.$Notice.error({ desc: err })
      }
    },
    async saveStatus () {
      try {
        const res = await reqStatusSave(this.update)
        if (res.errno !== 10000) {
          throw (res.errmsg)
        } else {
          this.changeStatus = false
          this.$Message.success('保存成功！')
          this.getListData()
        }
      } catch (err) {
        this.$Notice.error({ desc: err })
      }
    },
    async getStatusDetail (id) {
      this.update = {...update}
      try {
        const res = await reqStatusEdit({id})
        if (res.errno === 10000) {
          this.update = res.data
          // 当前状态为未处理时，默认选中处理中
          if (!res.data.status || this.update.status === 1) this.update.status = 2
          this.update.id = id
        } else {
          throw (res.errmsg)
        }
      } catch (err) {
        this.$Notice.error({ desc: err })
      }
    },
    showStatusModel (id) {
      this.changeStatus = true
      this.getStatusDetail(id)
    },
    changePage (page) {
      this.params.page = page
      this.getListData()
    },
    download (url) {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = url
      document.body.appendChild(iframe)
    }
  }
}
</script>
<style type="text/css" lang="less" scoped>
  .TV-log{

  }
  .model-label{
    width: 40px;
    display: inline-block;
  }
  .model-sel{
    width: ~"calc(100% - 40px)";
  }
</style>
