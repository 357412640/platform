<template>
  <div class="equip-display">
    <header class="common-header">
      <h2>设备激活数据</h2>
    </header>
    <div class="tab-wrapper">
      <h4 style="padding-top: 10px;">设备信息</h4>
      <div>
        <div class="input-base-style">
          <label>型号：</label>
          <Select v-model="queryParams.model" style="width:300px" @on-change="judgeRequest">
            <Option value="all">全部</Option>
            <Option :value="item.id" v-for="(item, index) in moduleTypeList" :key="index">{{item.name}}</Option>
          </Select>
        </div>
        <div class="input-base-style">
          <label>设备分组：</label>
          <Select v-model="queryParams.group" style="width:300px">
            <Option value="all">全部</Option>
            <Option :value="item.id" v-for="(item, index) in groupList" :key="index">{{item.name}}</Option>
          </Select>
        </div>
        <div class="input-base-style">
          <label>分组类型：</label>
          <Select v-model="queryParams.grouptype" style="width:300px">
            <Option value="all">全部</Option>
            <Option :value="1">正式</Option>
            <Option :value="0">测试</Option>
          </Select>
        </div>
      </div>
      <div>
        <div class="input-base-style">
          <label>按：</label>
          <Select v-model="queryParams.timetype" style="width:282px" @on-change="changeTimeType">
            <Option value="day">天</Option>
            <Option value="month">月</Option>
            <Option value="year">年</Option>
          </Select>
          &nbsp;显示
        </div>
        <div class="input-base-style">
          <label>时间段：</label>
          <div class="input-base-style" v-show="queryParams.timetype === 'year'">
            <DatePicker type="year" placeholder="请选择" style="width: 220px" v-model="startime" @on-change="changeStartime"></DatePicker>
            -
            <DatePicker type="year" placeholder="请选择" style="width: 220px" v-model="endtime" @on-change="changeEndtime"></DatePicker>
          </div>
          <div class="input-base-style" v-show="queryParams.timetype === 'month'">
            <DatePicker type="month" placeholder="请选择" style="width: 220px" v-model="startime" @on-change="changeStartime"></DatePicker>
            -
            <DatePicker type="month" placeholder="请选择" style="width: 220px" v-model="endtime" @on-change="changeEndtime"></DatePicker>
          </div>
          <div class="input-base-style" v-show="queryParams.timetype === 'day'">
            <DatePicker type="date" placeholder="请选择" style="width: 220px" v-model="startime" @on-change="changeStartime"></DatePicker>
            -
            <DatePicker type="date" placeholder="请选择" style="width: 220px" v-model="endtime" @on-change="changeEndtime"></DatePicker>
          </div>
        </div>
        <div class="input-base-style">
          <Button type="primary" @click="obtainActiveList">查询</Button>
        </div>
        <div class="input-base-style">
          <Button type="primary" @click="showChart">{{btnValue}}</Button>
        </div>
      </div>
    </div>
    <div class="display">
      <Card shadow v-if="tableShow"  style="margin-top: 30px;background: #e3e8ee;padding:16px;" class="demo-tabs-style1">
        <Tabs type="card">
          <TabPane label="累积量">
            <lineChart style="height: 300px" :equipTotal="equipTotal" :activeTotal="activeTotal" :timePeriod="timePeriod"></lineChart>
          </TabPane>
          <TabPane label="增量">
            <lineChartIncre style="height: 300px" :equipIncrease="equipIncrease" :activeIncrease="activeIncrease" :timePeriod="timePeriod"></lineChartIncre>
          </TabPane>
        </Tabs>
      </Card>
      <Card shadow style="margin-top: 30px;background: #e3e8ee;padding:16px;" class="demo-tabs-style1" v-else>
        <Tabs type="card">
          <TabPane label="累积量">
            <Table border stripe :columns="totalColumns" :data="tableData" :loading="totalIsLoading"></Table>
          </TabPane>
          <TabPane label="增量">
            <Table border stripe :columns="increaseColumns" :data="tableData" :loading="increIsLoading"></Table>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  </div>
</template>

<script>
import { getModelTypeList, getActiveList, getModelGroup } from '@/api/device-data'
import lineChart from './line-chart.vue'
import lineChartIncre from './line-chart-incre.vue'
import {delayDay, delayMonth, delayYear} from '../../../libs/date'

const increaseColumns = [
  { title: '时间',
    key: 'time'
  },
  { title: '设备增量',
    key: 'total_add_count'
  },
  { title: '激活增量',
    key: 'active_add_count'
  }
]
const totalColumns = [
  { title: '时间',
    key: 'time'
  },
  { title: '累计设备量',
    key: 'total_count'
  },
  { title: '累计激活量',
    key: 'active_count'
  }
]
export default {
  name: 'equipment-display',
  data () {
    return {
      queryParams: {
        model: '',
        group: '',
        grouptype: '',
        timetype: 'month',
        startime: '',
        endtime: ''
      },
      startime: '',
      endtime: '',
      increaseColumns,
      totalColumns,
      tableData: [],
      totalIsLoading: false,
      increIsLoading: false,
      btnValue: '查看列表',
      tableShow: true,
      groupList: [],
      moduleTypeList: [],
      equipTotal: [],
      equipIncrease: [],
      timePeriod: [],
      activeIncrease: [],
      activeTotal: []
    }
  },
  components: {lineChart, lineChartIncre},
  mounted () {
    this.obtainModuleList()
    this.obtainActiveList()
  },
  methods: {
    showChart () {
      this.tableShow = !this.tableShow
      this.btnValue = this.tableShow ? '查看列表' : '查看图表'
    },
    changeTimeType () {
      this.startime = this.endtime = ''
    },
    changeStartime () {
      if (this.endtime && this.startime) {
        if (this.endtime <= this.startime) {
          this.$Message.error('开始时间不能大于结束时间哦~')
          this.startime = ''
          return
        }
        let diff = 0
        switch (this.queryParams.timetype) {
          case 'month':
            diff = (this.endtime - this.startime) / (1000 * 3600 * 24 * 30)
            console.log('差', diff)
            if (diff > 12) {
              console.log('差', diff)
              this.$Message.error('按月显示最多能显示12个月哦~')
              this.startime = ''
              break
            }
            break
          case 'day':
            diff = (this.endtime - this.startime) / (1000 * 3600 * 24)
            if (diff > 30) {
              console.log('差', diff)
              this.$Message.error('按天显示最多能显示30天哦~')
              this.startime = ''
              break
            }
        }
      }
    },
    changeEndtime () {
      if (this.endtime && this.startime) {
        if (this.endtime <= this.startime) {
          this.$Message.error('结束时间不能小于开始时间哦~')
          this.endtime = ''
          return
        }
        let diff = 0
        switch (this.queryParams.timetype) {
          case 'month':
            diff = (this.endtime - this.startime) / (1000 * 3600 * 24 * 30)
            if (diff > 12) {
              console.log('差', diff)
              this.$Message.error('按月显示最多能显示12个月哦~')
              this.endtime = ''
            }
            break
          case 'day':
            diff = (this.endtime - this.startime) / (1000 * 3600 * 24)
            if (diff > 30) {
              console.log('差', diff)
              this.$Message.error('按天显示最多能显示30天哦~')
              // this.startime = this.endtime.getTime() - 30 * (1000 * 3600 * 24)
              this.endtime = ''
            }
            break
        }
      }
    },
    async obtainModuleList () {
      try {
        const res = await getModelTypeList()
        if (res.status === 200 && res.data.errno === 10000) {
          this.moduleTypeList = res.data.data.list
        } else {
          throw res.data.errmsg
        }
      } catch (e) {
        this.$Message.error(e || '获取型号列表失败！')
        console.log(e)
      }
    },
    async obtainActiveList () {
      if ((this.startime && !this.endtime) || (!this.startime && this.endtime)) {
        this.$Message.error('请将时间段填写完整哦~')
        return
      }
      // 将时间转换为时间戳
      if (this.startime) this.queryParams.startime = Math.floor(this.startime.valueOf() / 1000)
      else this.queryParams.startime = ''
      if (this.endtime) {
        this.queryParams.endtime = this.endtime.valueOf()
        // 根据年月日处理时间戳
        if (this.queryParams.timetype === 'day') {
          this.queryParams.endtime = delayDay(this.queryParams.endtime)
        } else if (this.queryParams.timetype === 'month') {
          this.queryParams.endtime = delayMonth(this.queryParams.endtime)
        } else {
          this.queryParams.endtime = delayYear(this.queryParams.endtime)
        }
        // this.queryParams.endtime = Math.floor(this.endtime.valueOf() / 1000)
      } else {
        this.queryParams.endtime = ''
      }
      const {model, group, grouptype, timetype, startime, endtime} = this.queryParams
      const params = {model, group, grouptype, timetype, startime, endtime}
      if (this.queryParams.model === 'all') delete params.model
      if (this.queryParams.group === 'all') delete params.group
      if (this.queryParams.grouptype === 'all') delete params.grouptype
      try {
        const res = await getActiveList(params)
        if (res.errno === 10000) {
          this.tableData = res.data.list
          this.equipTotal = []
          this.equipIncrease = []
          this.timePeriod = []
          this.activeIncrease = []
          this.activeTotal = []
          this.tableData.forEach(val => {
            this.equipTotal.push(val.total_count)
            this.timePeriod.push(val.time)
            this.activeTotal.push(val.active_count)
            this.equipIncrease.push(val.total_add_count)
            this.activeIncrease.push(val.active_add_count)
          })
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e || '获取列表失败！')
        console.log(e)
      }
    },
    judgeRequest () {
      if (this.queryParams.model !== 'all') this.obtainModelGroup()
      else this.groupList = []
    },
    async obtainModelGroup () {
      try {
        const res = await getModelGroup({id: this.queryParams.model})
        if (res.errno === 10000) {
          this.groupList = res.data.list
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e || '获取设备分组列表失败！')
        console.log(e)
      }
    }
  }
}
</script>

<style lang="less">
  .equip-display{
    .demo-tabs-style1  .ivu-tabs-card > .ivu-tabs-content {
      margin-top: -16px;
    }

    .demo-tabs-style1  .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
      background: #fff;
      padding: 16px;
    }

    .demo-tabs-style1  .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
      border-color: transparent;
    }
  }
</style>
