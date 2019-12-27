<template>
  <Table border stripe :columns="columns" :data="tableData" class="table-common-top" :loading="isLoading">
    <template slot-scope="{ row, index }" slot="action">
      <a @click="$emit('edit', row.id)"><p>编辑</p></a>
      <a @click="deleteForm(row.id)"><p>删除</p></a>
    </template>
  </Table>
</template>

<script>
import { requestStrategyDelete } from '@/api/app_updateself'
const columns = [
  {
    type: 'index',
    title: '序号',
    width: 80,
    key: 'name'
  },
  {
    title: '生效状态',
    key: 'effect_status',
    minWidth: 100
  },
  {
    title: '生效时间',
    key: 'effect_time',
    minWidth: 100
  },
  {
    title: '下载方式',
    key: 'download_type',
    minWidth: 100
  },
  {
    title: '生效范围',
    key: 'strategy_type',
    minWidth: 120
  },
  {
    title: '备注',
    key: 'remark',
    minWidth: 100
  },
  {
    title: '操作时间',
    key: 'update_time',
    minWidth: 80
  },
  {
    title: '操作人',
    key: 'update_user',
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
  name: 'list',
  data () {
    return {
      params: {},
      columns
    }
  },
  props: {
    tableData: {
      type: Array,
      default: function () {
        return [
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
          }]
      }
    },
    isLoading: false
  },
  methods: {
    deleteForm (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除表单？',
        onOk: () => { this.delete(id) }
      })
    },
    async delete (id) {
      try {
        const res = await requestStrategyDelete({id: id})
        if (res.errno === 10000) {
          this.$Message.success('表单删除成功')
          // 刷新列表
          this.$emit('refresh')
        } else {
          throw res.errmsg
        }
      } catch (e) {

      }
    }
  }
}
</script>

<style scoped>

</style>
