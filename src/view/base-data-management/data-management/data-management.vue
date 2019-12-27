<template>
  <div class="data-add">
    <div class="clearfix">
      <div class="input-base-style" v-for="(item, index) in newCondition" :key="index">
        <label>{{item.columnname+ '(' + item.columncode + ')'}}：</label>
        <Input v-model.trim="params[item.columncode]" style="width: 300px"/>
      </div>
      <div class="input-base-style" v-if="hasMore">
        <a @click="hasMore = false">展开更多搜索条件》</a>
      </div>
      <div class="input-base-style search-style">
        <Button type="primary" @click="getSearchData(true)">搜索</Button>
      </div>
    </div>
    <Table border stripe :columns="columns" :data="tableData" class="table-common-top" :loading="isLoading">
      <template slot-scope="{ row, index }" slot="action">
        <router-link :to="{name: 'data_add', query: {update: true, dataId: row.id, tableid: $route.query.tableid}}"><p>
          编辑</p></router-link>
        <a @click="deleteForm(row.id)"><p>删除</p></a>
      </template>
    </Table>
    <Page :total="total" prev-text="上一页" next-text="下一页" @on-change="changePage" class="page-common-right" :page-size="20"/>
  </div>
</template>

<script>
import { getDataList, deleteData } from '@/api/basedataManagement'
import { formatDate } from '@/libs/date'
const columns = [
  {
    type: 'index',
    title: '序号',
    width: 80
  },
  {
    minWidth: 150,
    title: '操作时间',
    key: 'update_time'
  },
  {
    minWidth: 150,
    title: '操作人',
    key: 'operator'
  },
  {
    title: '操作',
    key: 'address',
    minWidth: 100,
    slot: 'action'
    // fixed: 'right'
  }
]
export default {
  name: 'data-management',
  data () {
    return {
      params: {
        page: 1,
        tableid: this.$route.query.tableid,
        page_size: 20
      },
      columns: JSON.parse(JSON.stringify(columns)), // 深拷贝column，避免数据叠加
      total: 0,
      tableData: [],
      hasMore: false,
      isLoading: false
    }
  },
  props: {
    formTitleDetail: {},
    searchCondition: {
      type: Array,
      default: function () {
        return []
      }
    },
    tableid: ''
  },
  watch: {
    searchCondition: function () {
      this.hasMore = this.searchCondition.length > 3
      this.params.tableid = this.formTitleDetail.id
      this.initTableTitle()
      this.getSearchData()
    }
  },
  computed: {
    newCondition: function () {
      if (this.hasMore) {
        return this.searchCondition.slice(0, 3)
      } else {
        return this.searchCondition
      }
    }
  },
  created () {
    if (this.searchCondition.length) {
      this.hasMore = this.searchCondition.length > 3
      this.params.tableid = this.formTitleDetail.id
      this.initTableTitle()
      this.getSearchData()
    }
  },
  methods: {
    async getSearchData (init) {
      this.isLoading = true
      if (init) this.params.page = 1
      try {
        const res = await getDataList(this.params)
        this.isLoading = false
        if (res.errno === 10000) {
          this.tableData = res.data.list
          this.tableData.forEach(cur => {
            cur.update_time = formatDate(cur.update_time, true)
          })
          this.total = res.data.total
        } else {
          throw (res.errmsg)
        }
      } catch (e) {
        this.isLoading = false
        this.$Message.error(e)
      }
    },
    changePage (page) {
      this.params.page = page
      this.getSearchData()
    },
    deleteForm (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除该记录？',
        onOk: async () => {
          try {
            const res = await deleteData({ dataid: id, tableid: this.$route.query.tableid })
            if (res.errno === 10000) {
              this.$Message.info('删除成功！')
              this.getSearchData()
            } else {
              throw (res.errmsg)
            }
          } catch (err) {
            this.$Notice.error({ desc: err })
          }
        }
      })
    },
    initTableTitle () {
      this.formTitleDetail.columns.forEach(s => {
        let title = { title: s.columnname, key: s.columncode, minWidth: 150 }
        this.columns.splice(-3, 0, title)
      })
    }
  }
}
</script>

<style scoped lang="less">
  .data-add {
    .search-style {
      float: right;
    }
  }
</style>
