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
  props: {
    equipIncrease: {
      type: Array,
      default: function () {
        return []
      }
    },
    activeIncrease: {
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
  computed: {
    dataChange () {
      const {equipIncrease, activeIncrease, timePeriod} = this
      return {
        equipIncrease, activeIncrease, timePeriod
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
  methods: {
    drawLine () {
      const option = {
        tt: this.timePeriod,
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
          data: ['设备增量', '激活增量']
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
            name: '设备增量',
            type: 'line',
            smooth: true,
            data: this.equipIncrease
          },
          {
            name: '激活增量',
            type: 'line',
            smooth: true,
            data: this.activeIncrease
          }
        ]
      }
      this.$nextTick(() => {
        this.dom = this.$echarts.init(this.$refs.chart)
        this.dom.setOption(option)
        console.log('option', option)
        on(window, 'resize', this.resize)
      })
    },
    resize () {
      this.dom.resize()
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>

<style scoped>

</style>
