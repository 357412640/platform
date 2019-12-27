<template>
  <div ref="chart"></div>
</template>

<script>
import { on, off } from '@/libs/tools'
export default {
  name: 'line-chart',
  data () {
    return {
      dom: null
    }
  },
  // 解决视图不更新问题
  computed: {
    dataChange () {
      const {equipTotal, activeTotal, timePeriod} = this
      return {
        equipTotal, activeTotal, timePeriod
      }
    }
  },
  watch: {
    dataChange: {
      handler: function (val) {
        this.drawLine()
      },
      deep: true
    }
  },
  props: {
    equipTotal: {
      type: Array,
      default: function () {
        return []
      }
    },
    activeTotal: {
      type: Array,
      default: function () {
        return []
      }
    },
    timePeriod: {
      type: Array,
      default: function () {
        return ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    drawLine () {
      const option = {
        title: {
          text: '设备数据概览'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        color: ['#4608A6', '#10A6FF'],
        legend: {
          data: ['累计设备总量', '累计激活量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.timePeriod
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '累计设备总量',
            type: 'line',
            smooth: true,
            data: this.equipTotal
          },
          {
            name: '累计激活量',
            type: 'line',
            smooth: true,
            data: this.activeTotal
          }
        ]
      }
      this.$nextTick(() => {
        this.dom = this.$echarts.init(this.$refs.chart)
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>

<style scoped>

</style>
