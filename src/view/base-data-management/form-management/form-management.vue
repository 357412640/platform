<template>
  <div class="form-management">
    <header class="common-header">
      <h2>表单管理</h2>
      <Button type="primary" @click="$router.push({ path: 'form_add' })">新建表单</Button>
    </header>
    <div class="input-base-style">
      <label>表单名称：</label>
      <Input v-model.trim="params.tablename" placeholder="请输入表单名称" style="width: 300px"/>
    </div>
    <div class="input-base-style">
      <label>表单标识：</label>
      <Input v-model.trim="params.tablecode" placeholder="请输入表单代码" style="width: 300px"/>
    </div>
    <div class="input-base-style">
      <Button type="primary" @click="getListData(true)">搜索</Button>
    </div>
    <Table border stripe :columns="columns" :data="tableData" class="table-common-top" :loading="isLoading">
      <template slot-scope="{ row, index }" slot="action">
        <router-link :to="{path: 'data_add_main', query: {tableid: row.id}}"><p>维护数据</p></router-link>
        <router-link :to="{name: 'form_add', params: {update: true, formId: row.id}}"><p>修改表单</p></router-link>
        <a @click="deleteForm(row.id)"><p>删除表单</p></a>
        <p v-if="Boolean(row.issetrange)">设备范围</p>
        <!--<router-link :to="{name: 'form_add', params: {update: true}}"><p v-if="Boolean(row.issetrange)">设备范围{{Boolean(row.issetrange)}}</p></router-link>-->
      </template>
    </Table>
    <Page :total="total" prev-text="上一页" next-text="下一页" @on-change="changePage" class="page-common-right" :page-size="20"/>

    <!--模态框-->
    <Modal
      v-model="deleteList"
      title="删除失败"
      cancel-text=""
      @on-ok="deleteList=false">
      <p>{{errcontent}}</p>
    </Modal>
  </div>
</template>

<script>
import { getList, deleteTable } from '@/api/basedataManagement'
import { formatDate } from '@/libs/date'
const column = [
  {
    type: 'index',
    title: '序号',
    width: 80,
    key: 'name'
  },
  {
    title: '表单名称',
    key: 'tablename',
    minWidth: 100
  },
  {
    title: '表单标识',
    key: 'tablecode',
    minWidth: 100
  },
  {
    title: '表单结构',
    key: 'columns',
    minWidth: 120
  },
  {
    title: '操作时间',
    key: 'update_time',
    minWidth: 100
  },
  {
    title: '操作人',
    key: 'operator',
    minWidth: 80
  },
  {
    title: '操作',
    key: 'address',
    width: 100,
    slot: 'action'
  }
]
export default {
  name: 'form-management',
  data () {
    return {
      params: {
        tablecode: '',
        tablename: '',
        page: 1,
        page_num: 20
      },
      columns: column,
      tableData: [],
      total: 0,
      deleteList: false,
      errcontent: '',
      isLoading: false
    }
  },
  created () {
    this.getListData()
  },
  methods: {
    async getListData (init) {
      this.isLoading = true
      if (init) this.params.page = 1
      try {
        const res = await getList(this.params)
        this.isLoading = false
        if (res.errno === 10000) {
          res.data.list.forEach(item => {
            let newColumns = ''
            item.columns.forEach(cur => {
              newColumns += cur.columnname + '(' + cur.columncode + ')' + '、'
            })
            item.update_time = formatDate(item.update_time, true)
            item.columns = newColumns.replace(/、$/, '')
          })
          this.total = res.data.total
          this.tableData = res.data.list
        } else {
          throw (res.errmsg)
        }
      } catch (err) {
        this.isLoading = false
        this.$Notice.error({ desc: err })
      }
    },
    deleteForm (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除该表单？',
        onOk: async () => {
          try {
            const res = await deleteTable({ id })
            if (res.errno === 10000) {
              this.$Message.info('表单删除成功！')
              this.getListData()
            } else {
              this.deleteList = true
              this.errcontent = res.errmsg
            }
          } catch (err) {
            this.$Notice.error({ desc: err })
          }
        }
      })
    },
    changePage (page) {
      this.params.page = page
      this.getListData()
    }
  }
}
</script>

<style scoped lang="less">

  /*.page-common-right{*/
  /*padding-top: 10px;*/
  /*text-align: right;*/
  /*}*/
  /*.input-base-style{*/
  /*padding: 20px 20px 30px 0;*/
  /*display: inline-block;*/
  /*}*/
  /*.common-header{*/
  /*display: flex;*/
  /*justify-content: space-between;*/
  /*line-height: 32px;*/
  /*padding-bottom: 10px;*/
  /*border-bottom: 1px solid #eee;*/
  /*}*/
</style>
