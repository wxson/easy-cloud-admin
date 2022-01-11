<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ onlineData, earningsData, totalmembersData, totalGoodssData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: ['12-20', '12-21', '12-22', '12-23', '12-24', '12-25', '12-26'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['在线人数', '平台收益', '注册人数', '商品登记']
        },
        series: [{
          name: '在线人数', itemStyle: {
            normal: {
              color: '#00CC66',
              lineStyle: {
                color: '#00CC66',
                width: 2
              },
              areaStyle: {
                color: '#00CC66'
              }
            }
          },
          smooth: true,
          type: 'line',
          data: onlineData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '平台收益',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#FF0033',
              lineStyle: {
                color: '#FF0033',
                width: 2
              },
              areaStyle: {
                color: '#FF0033'
              }
            }
          },
          data: earningsData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '注册人数',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#003399',
              lineStyle: {
                color: '#003399',
                width: 2
              },
              areaStyle: {
                color: '#003399'
              }
            }
          },
          data: totalmembersData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '商品登记',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: totalGoodssData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
