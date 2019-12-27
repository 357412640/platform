<template>
  <div class="update-data-box">
    <header class="common-header">
      <h2>数据升级：{{ title }}_{{ versionname }}</h2>
      <Button type="primary" @click="$router.go(-1)">返回</Button>
    </header>
    <div class="content-box">
      <Form class="search-box1" :modal="formCustom">
        <Row style="margin-bottom: 20px;border-bottom: 1px solid #ddd">
          <Col span="4" style="min-width: 200px">
            <FormItem>
              <DatePicker :value="dateValue" format="yyyy-MM-dd" type="daterange" split-panels
                          placement="bottom-start" class="date-picker" @on-change="changeDate"></DatePicker>
            </FormItem>
          </Col>
          <Col span="5" style="min-width: 180px">
            <FormItem label="筛选" :label-width="60">
              <Select v-model="formCustom.query_type" @on-change="changeSearch">
                <Option v-for="item in searchingList" :value="item.value" :key="item.value">{{ item.title }}</Option>
              </Select>

            </FormItem>
          </Col>
          <Col span="5" v-if="searchFlag" style="min-width: 180px">
            <FormItem :label-width="20">
              <Select v-model="formCustom.query_type_string" filterable multiple @on-change="subChange">
                <Option v-for="item in subSearchingList" :value="item.name" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="2">
            <Button type="primary" style="margin-left: 20px" @click="getUpdate">查询</Button>
          </Col>
        </Row>
        <Row>
          <Col span="5">
            <FormItem label="按" :label-width="30">
              <Select v-model="formCustom.group" @on-change="changeGroup">
                <Option v-for="item in dateList" :value="item.value" :key="item.value">{{ item.title }}</Option>
              </Select>
            </FormItem>

          </Col>
          <Col span="5">
            <FormItem label="查看" :label-width="60">
              <Select v-model="formCustom.view_type" @on-change="changeViewtype">
                <Option v-for="item in viewtypeList" :value="item.value" :key="item.value">{{ item.title }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div ref="echartsBox" class="echarts-box">
      </div>
      <div class="table-box">
        <div style="overflow:hidden;margin: 20px 0;height: 30px">
          <span style="display:inline-block;font-size: 18px;font-weight: 700;padding-left: 10px;color: #000;line-height: 30px">数据详情</span>
          <Tooltip content="导出表格" placement="top">
            <Icon type="ios-download-outline" @click="exportExcel" style="font-size: 24px;cursor: pointer;margin-bottom: 4px;margin-left: 10px;" />
          </Tooltip>
        </div>
        <Table border :columns="tableColumns" :data="tableData"></Table>
      </div>
    </div>
  </div>
</template>

<script>
  import echart from 'echarts'
  import excel from '@/libs/excel'
  import { dataList, dataCnt } from "../../api/app_updateself";
  import './update-data.less'
  export default {
    name: "update-data",
    data() {
      return {
        title: '',
        packagename: '',
        versionname: '',
        formCustom: {
          query_type: 'null',
          query_type_string: '',
          group: 'day',
          view_type: 'times'
        },
        dateValue: [],
        nearWeek: [],
        defaultSearchOpt: 'model,group,district',
        defaultSearchData: {},
        searchFlag: false,
        searchingList: [
          {
            title: '全部',
            value: 'null'
          },
          {
            title: '型号',
            value: 'model'
          },
          {
            title: '分组',
            value: 'group'
          },
          {
            title: '地域',
            value: 'district'
          }
        ],
        subSearchingList: [],
        dateList: [
          {
            title: '天',
            value: 'day'
          },
          {
            title: '周',
            value: 'week'
          },
          {
            title: '月',
            value: 'month'
          }
        ],
        viewtypeList: [
          {
            title: '次数',
            value: 'times'
          },
          {
            title: '累计次数',
            value: 'total_times'
          },
          {
            title: '设备数',
            value: 'device'
          },
          {
            title: '累计设备数',
            value: 'total_device'
          }
        ],
        chartLineList: {
          download_successful: '下载成功',
          download_failed: '下载失败',
          install_successful: '安装成功',
          install_failed: '安装失败'
        },
        viewtypeName: '次数',
        tableColumns: [
          {
            title: '日期',
            key: 'date'
          },
          {
            title: '下载成功',
            key: 'download_successful'
          },
          {
            title: '下载失败',
            key: 'download_failed'
          },
          {
            title: '安装成功',
            key: 'install_successful'
          },
          {
            title: '安装失败',
            key: 'install_failed'
          }
        ],
        tableData: [],
        chartOption: {},
        exportLoading: false,
        defaultData: {

        },
        chart: ''
      }
    },
    methods: {
      changeSearch (value) {
        if (value != 'null') {
          this.searchFlag = true
          this.subSearchingList = this.defaultSearchData[value]
        } else {
          this.searchFlag = false
        }
        this.formCustom.query_type_string = []
      },
      changeDate (date) {
        this.dateValue = date
      },
      changeGroup() {
        this.getUpdate()
      },
      changeViewtype() {
        this.getUpdate()
      },
      subChange (value) {
        if (value.indexOf('全部') > 0) {
          this.formCustom.query_type_string = ['全部']
        } else if (value.includes('全部') && value.length > 1) {
          value = value.splice(value.indexOf('全部') , 1)
        }
        // console.log(value)
      },
      coverData(data) {
        let xAxisKey = Object.keys(data)
        let legendKey = xAxisKey.length > 0 ? Object.keys(data[xAxisKey[0]]) : []
        let legendArr = legendKey.reduce((legend, type) => legend.concat(this.chartLineList[type]), [])
        let title = {
          text: ''
        }
        let tooltip = {
          trigger: 'axis'
        }
        let legend = {
          data: legendArr
        }
        let grid = {
          left: '3%',
          right: '5%',
          containLabel: true
        }
        let xAxis = {
          name: '日期',
          type: 'category',
          boundaryGap: false,
          data: xAxisKey
        }
        let yAxis = {
          type: 'value',
          name: this.viewtypeName
        }
        let series = []
        legendKey.forEach(type => {
          let itemData = {}
          itemData.name = this.chartLineList[type]
          itemData.type = 'line'
          itemData.data = []
          xAxisKey.forEach(val => {
            let item = data[val]
            itemData.data.push(item[type])
          })
          series.push(itemData)
        })
        this.chartOption = {
          title,
          tooltip,
          legend,
          grid,
          xAxis,
          yAxis,
          series
        }

        let tableData = []
        for (let key in data) {
          let item = data[key]
          item.date = key
          tableData.push(item)
        }
        this.tableData = tableData
      },
      exportExcel () {
        if (this.tableData.length) {
          this.exportLoading = true
          let title = ["日期", "下载成功", "下载失败", "安装成功", "安装失败"]
          let key = ["date", "download_successful", "download_failed", "install_successful", "install_failed"]
          // console.log(title)

          const params = {
            title,
            key,
            data: this.tableData,
            autoWidth: true,
            filename: '升级数据'
          }
          excel.export_array_to_excel(params)
          this.exportLoading = false
        } else {
          this.$Message.info('表格数据不能为空！')
        }
      },
      getUpdate() {
        let packagename = this.packagename
        let versionname = this.versionname
        if (this.dateValue[0] === '' || this.dateValue[1] === '') {
          this.dateValue = this.nearWeek
        }
        let start_date = this.dateValue[0].split('-').join('')
        let end_date = this.dateValue[1].split('-').join('')
        let query_type= this.formCustom.query_type == 'null' ? '' : this.formCustom.query_type
        let query_type_string = this.formCustom.query_type_string.includes('全部') ? '' : (this.formCustom.query_type_string && this.formCustom.query_type_string.join(','))
        let group = this.formCustom.group
        let view_type = this.formCustom.view_type
        let params = {
          packagename,
          versionname,
          start_date,
          end_date,
          query_type,
          query_type_string,
          group,
          view_type
        }
        // console.log(this.dateValue)
        // console.log(params)
        dataCnt(params).then(res => {
          let data = res.data
          if (data.errno === 10000) {
            this.defaultData = data.data
            this.coverData(this.defaultData)
            this.chart.setOption(this.chartOption);
          } else {
            this.$Modal.warning({
              title: '数据获取失败',
              content: `原因：${data.errmsg}`
            })
          }
        })
      },
      resetSearchData (data) {
        for (let item in data) {
          data[item].unshift({
            name: '全部',
            id: 'null'
          })
        }
        return data
      }
    },
    created() {
      // 计算默认一周日期
      const getDays = (day = 1) => {
        return day * 24 * 60 * 60 * 1000
      }
      const dateFormat = 'YYYY-MM-DD'
      const date = new Date().getTime()
      const endTime = new Date(date - getDays())
// console.log(endTime)
      let endYear = endTime.getFullYear()
      let endMonth = endTime.getMonth() + 1
      let endDay = endTime.getDate()
      if (endMonth >= 1 && endMonth < 10) {
        endMonth = '0' + endMonth
      }
      if (endDay >= 1 && endDay < 10) {
        endDay = '0' + endDay
      }

      const startTime = new Date(date - getDays(7))
      let startYear = startTime.getFullYear()
      let startMonth = startTime.getMonth() + 1
      let startDay = startTime.getDate()
      if (startMonth >= 1 && startMonth < 10) {
        startMonth = '0' + startMonth
      }
      if (startDay >= 1 && startDay < 10) {
        startDay = '0' + startDay
      }
      const startDate = startYear + '-' + startMonth + '-' + startDay
      const endDate = endYear + '-' + endMonth + '-' + endDay
      this.dateValue = [startDate, endDate]
      this.nearWeek = [startDate, endDate]
    },
    mounted() {
      this.coverData(this.defaultData)
      this.title = this.$route.query.name
      this.versionname = this.$route.query.version_name
      this.packagename = this.$route.query.package_name
      // console.log(this.coverData(this.defaultData))
      let params = {
        type: this.defaultSearchOpt
      }
      this.$nextTick(() => {
        this.chart = echart.init(this.$refs.echartsBox)
      })
      dataList(params).then(res => {
        let searchRes = res.data
        if (searchRes.errno === 10000) {
          this.defaultSearchData = this.resetSearchData(searchRes.data)
          this.getUpdate()
        } else {
          this.$Modal.warning({
            title: '删选条件获取失败',
            content: `原因：${searchRes.errmsg}`
          })
        }
      })
    }
  }
</script>

<style scoped>

</style>
