<template>
  <div class="import-page">
    <Table border stripe :columns="columns" :data="tableData" class="table-common-top">
      <template slot-scope="{ row }" slot="filename">
        <!--<a :href="row.fileurl" :download="row.filename">{{ row.filename }}</a>-->
        <a :href="`http://beta.omp.scloud.gome.inc/basedata/data/exportFile?fileurl=${row.fileurl}&filename=${row.filename}`" :download="row.filename">{{ row.filename }}</a>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <a :href="row.resultfileurl" :download="'失败原因：' + row.filename" v-if="row.status==='导入失败'" :loading="isLoading">失败原因</a>
      </template>
    </Table>
    <Page :total="total" prev-text="上一页" next-text="下一页" @on-change="changePage()" class="page-common-right" :page-size="20"/>
  </div>
</template>

<script>
import { getImportList } from '@/api/basedataManagement'
import dict from '@/libs/dict'
import { formatDate } from '@/libs/date'

const columns = [
  {
    type: 'index',
    title: '序号',
    width: 80
  },
  {
    minWidth: 100,
    title: '文件名',
    slot: 'filename'
  },
  {
    minWidth: 100,
    title: '导入类型',
    key: 'type'
  },
  {
    minWidth: 100,
    title: '数据量',
    key: 'datacount'
  },
  {
    minWidth: 100,
    title: '导入状态',
    key: 'status'
  },
  {
    minWidth: 100,
    title: '上传时间',
    key: 'update_time'
  },
  {
    title: '操作',
    width: 100,
    slot: 'action'
  }
]
export default {
  name: 'import',
  data () {
    return {
      tableData: [],
      columns,
      total: 0,
      params: {
        tableid: this.$route.query.tableid,
        page: 1,
        page_size: 20
      },
      isLoading: false
    }
  },
  watch: {
    '$store.state.app.filesIndex': function () {
      this.getList()
    }
  },
  created () {
    this.getList()
  },
  methods: {
    changePage (page) {
      this.params.page = page
      this.getList()
    },
    async getList (init) {
      this.isLoading = true
      if (init) this.params.page = 1
      try {
        const res = await getImportList(this.params)
        this.isLoading = false
        if (res.errno === 10000) {
          res.data.list.forEach(s => {
            s.status = dict.database.status[s.status]
            s.type = dict.database.type[s.type]
            s.update_time = formatDate(s.update_time, true)
          })
          this.tableData = res.data.list
          console.log(this.tableData)
          this.total = res.data.total
        } else {
          throw (res.errmsg)
        }
      } catch (e) {
        this.isLoading = false
        this.$Message.error(e)
      }
    }
  }
}
</script>
