<template>
  <div>
    <header class="common-header">
      <h2>{{showList ? '策略列表': '新建/编辑 策略'}}</h2>
      <div>
        <Button type="primary" @click="showList=false" v-show="showList">新建</Button>
        <Button type="primary" class="common-margin-left-10" @click="$router.go(-1)" v-show="showList">返回</Button>
        <Button type="primary" class="common-margin-left-10" @click="gotolist" v-show="!showList">返回</Button>
      </div>
    </header>
    <div>
      <h4 class="input-base-style">APP名称：{{listData.name}}</h4>
      <h4 class="input-base-style">包名：{{listData.package_name}}</h4>
      <h4 class="input-base-style">版本名称：{{listData.version_name}}</h4>
      <h4 class="input-base-style">设备类型：{{dict[listData.device_type] || listData.device_type}}</h4>
    </div>
    <list v-if="showList" @edit="closeList" :tableData="listData.list" @refresh="getList" :isLoading="isLoading"></list>
    <add v-else @list="openList" :editId="editId" :device_type="listData.device_type" @refreshList="getList" @cleareditId="cleareditId"></add>
  </div>
</template>

<script>
import {requestStrategyList} from '@/api/app_updateself'
import {formatDate} from '@/libs/date'
import list from './component/tactic_list.vue'
import add from './component/tactic_add.vue'
import dict from '@/libs/dict'
export default {
  name: 'static_list',
  data () {
    return {
      showList: true,
      listData: {},
      editId: '',
      isLoading: false,
      dict: {Fridge: '冰箱' }
    }
  },
  components: {list, add},
  mounted () {
    this.getList()
  },
  methods: {
    closeList (id) {
      this.showList = false
      this.editId = id
    },
    openList () {
      this.showList = true
    },
    async getList () {
      this.isLoading = true
      try {
        const res = await requestStrategyList({id: this.$route.query.tableid})
        if (res.errno === 10000) {
          this.listData = res.data
          // 处理时间 && 生效状态翻译
          this.listData.list.forEach(item => {
            item.effect_time = formatDate(item.effect_startime, true).toString() + (item.effect_endtime ? (' ~ ' + formatDate(item.effect_endtime, true).toString()) : '')
            item.update_time = formatDate(item.update_time, true)
            item.effect_status = item.effect_status === 1 ? '生效' : '失效'
            item.download_type = item.download_type === 1 ? '静默下载' : '非静默下载'
            item.strategy_type = dict.appUpdate.upgrade_type[item.strategy_type] || ''
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
    cleareditId () {
      this.editId = ''
    },
    gotolist () {
      this.showList = true
      this.cleareditId()
    }
  }
}
</script>
