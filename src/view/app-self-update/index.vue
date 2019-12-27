<template>
<div>
  <header class="common-header">
    <h2>APP升级列表</h2>
    <Button type="primary" @click="$router.push({ path: 'app_add' })">新建</Button>
  </header>
  <div class="input-base-style">
    <label>设备类型：</label>
    <Select v-model="params.device_type" style="display: inline-block;width: 200px">
      <!--      <Option value="TV">TV</Option>-->
      <!--      <Option value="Fridge">Fridge</Option>-->
      <Option v-for="item in deviceTypeList" :value="item.name" :key="item.id">{{ item.name }}</Option>
    </Select>
  </div>
  <div class="input-base-style">
    <label>包名：</label>
    <Input v-model.trim="params.package_name" style="width: 200px"/>
  </div>
  <div class="input-base-style">
    <label>版本号：</label>
    <Input v-model.trim="params.version_code" style="width: 200px"/>
  </div>
  <div class="input-base-style">
    <Button type="primary" @click="submit()">搜索</Button>
  </div>
  <Table border stripe :columns="columns" :data="tableData" class="table-common-top" :loading="isLoading">
    <template slot-scope="{ row, index }" slot="action">
      <div style="float: left;width: 50%;text-align: center">
        <router-link :to="{path: 'app_add', query: {tableid: row.id}}"><p>编辑</p></router-link>
        <router-link :to="{path: 'update_data', query: {tableid: row.id, package_name: row.package_name, version_name: row.version_name, name: row.name}}"><p>数据</p></router-link>
      </div>
      <div style="float: left;width: 50%;text-align: center">
        <router-link :to="{path: 'tactic_list', query: {tableid: row.id}}"><p>策略</p></router-link>
        <a @click="confirmDelete(row.id)"><p>删除</p></a>
      </div>
    </template>
  </Table>
  <div style="margin: 10px;overflow: hidden">
    <div style="float: right;">
      <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.current"
            @on-change="changePage"></Page>
    </div>
  </div>
</div>
</template>

<script>
import {requestUpgradeList, requestUpgradeDelete} from '@/api/app_updateself'
import {getDeviceList} from '@/api/device-data'
import {formatDate} from '@/libs/date'
import { setSelectAll } from '@/libs/util'
const columns = [
  {
    type: 'index',
    title: '序号',
    width: 80,
    key: 'name',
    align: 'center'
  },
  {
    title: '设备类型',
    key: 'device_type',
    minWidth: 120,
    align: 'center'
  },
  {
    title: 'APP名称',
    key: 'name',
    minWidth: 100,
    align: 'center'
  },
  {
    title: 'APP包名',
    key: 'package_name',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '版本名称',
    key: 'version_name',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '版本号',
    key: 'version_code',
    minWidth: 100,
    align: 'center'
  },
  // {
  //   title: '操作时间',
  //   key: 'update_time',
  //   minWidth: 80,
  //   align: 'center'
  // },
  {
    title: '操作人',
    key: 'update_user',
    minWidth: 80,
    align: 'center'
  },
  {
    title: '操作',
    key: 'address',
    width: 160,
    slot: 'action',
    align: 'center'
  }
]
export default {
  name: 'index',
  data () {
    return {
      params: {
        package_name: '',
        version_code: '',
        device_type: ''
      },
      pageInfo: {},
      searchInfo: {},
      deviceTypeList: [],
      tableData: [
        {
          'id': 2,
          'tablename': '网络监控',
          'tablecode': 'Net_Montior',
          'issetrange': 0,
          'update_time': 1545288451,
          'operator': '李四'
        },
        {
          'id': 1,
          'tablename': '产品型号',
          'tablecode': 'MODEL_Defines',
          'issetrange': 0,
          'update_time': 1545288451,
          'operator': '张三'
        }],
      columns,
      isLoading: false
    }
  },
  created () {
    this.getListData()
  },
  mounted() {
    this.getDeviceList()
  },
  methods: {
    confirmDelete (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除表单？',
        onOk: () => {
          this.deleteForm(id)
        }
      })
    },
    async deleteForm (id) {
      try {
        const res = await requestUpgradeDelete({id})
        if (res.errno === 10000) {
          this.$Message.success('删除成功~')
          this.getListData()
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async getListData(page) {
      this.isLoading = true
      let params = {
        page: page || 1,
        page_size: this.pageInfo.page_size || 20,
        ...this.searchInfo
      }
      try {
        const res = await requestUpgradeList(params)
        if (res.errno === 10000) {
          this.tableData = res.data.list
          this.pageInfo.current = res.data.page
          this.pageInfo.total = res.data.total
          this.pageInfo.page_size = res.data.page_size
          // 时间戳转换
          this.tableData.forEach(item => {
            item.update_time = formatDate(item.update_time, true)
          })
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      } finally {
        this.isLoading = false
      }
    },
    // 获取设备类型
    getDeviceList() {
      getDeviceList().then(res => {
        let data = res.data
        if (data.errno === 10000) {
          let channelList = setSelectAll(data.data.list, {id: '-1', name: '全部'})
          this.deviceTypeList = channelList
        }
      })
    },
    submit() {
      this.searchInfo.device_type = this.params.device_type
      this.searchInfo.package_name = this.params.package_name
      this.searchInfo.version_code = this.params.version_code
      if (this.searchInfo.device_type === '全部') {
        this.searchInfo.device_type = ''
      }
      this.getListData()
    },
    changePage(p) {
      this.getListData(p)
    }
  }
}
</script>

<style scoped>

</style>
