<template>
  <div class="antv-g2" style="display: flex">
    <div :id="chartId" :style="{ height: height, width: width }"></div>
  </div>
</template>

<script>
import { Chart, registerShape } from '@antv/g2'
import { debounce } from 'lodash'
import ResizeSensor from 'css-element-queries/src/ResizeSensor'
export default {
  props: {
    chartId: {
      type: String,
      default: 'chart' + new Date().getTime()
    },
    // 容器宽高
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    chartConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    appendPadding: {
      type: Array,
      default: () => {
        return [25, 0, 0, 0]
      }
    },
    resizeId: {
      type: String,
      default: '.echarts-container'
    }
  },
  data() {
    return {
      chart: null,
      oldSelected: null
    }
  },
  mounted() {
    // this.initChart()
    let dom = document.getElementById(this.chartId)
    new ResizeSensor(
      dom,
      debounce(() => {
        if (!dom) return
        // 自动根据容器大小 resize 画布}
        if (this.chart) {
          this.chart.forceFit()
        }
      }, 100)
    )
  },
  methods: {
    initChart() {
      //加载图表
      if (!this.chartId) return
      this.chart = new Chart({
        container: this.chartId,
        autoFit: true,
        // padding: [20, 'auto', 40, 'auto'] // 上，右，下，左
        appendPadding: this.appendPadding // 上，右，下，左
      })
      this.chart.on('tooltip:show', e => {
        this.$emit('tooltipShow', e.data)
      })
      this.chart.animate(this.chartConfig.data.length ? true : false)
      // 图表配置
      const chartConfig = Object.assign({}, this.chartConfig)
      // 标注配置===annotation  无数据的时候显示暂无数据 清除横纵坐标度量
      if (!chartConfig.data.length) {
        this.chart.scale(false)
        this.chart.annotation().text({
          position: ['50%', '50%', '50%', '50%'],
          content: '暂无数据',
          style: {
            fontSize: 16,
            fill: '#7f7f7f',
            textAlign: 'center'
          }
        })
      } else {
        if (chartConfig.Annotation?.textList.length) {
          chartConfig.Annotation.textList.map(_m => {
            this.chart.annotation().text(_m)
          })
        }
        this.chart.scale(chartConfig.scale)
      }
      this.chart.data(chartConfig.data)
      // 坐标系配置===coordinate （饼图设置样式用得到）
      this.chart.coordinate(chartConfig.coordinate?.key, chartConfig.coordinate?.value)
      // 提示配置===tooltip
      this.chart.tooltip(chartConfig.tooltip)
      if (chartConfig.option) this.chart.option(chartConfig.option.key, chartConfig.option.value)
      // 图例配置===legend
      this.chart.legend('type', {
        selected: chartConfig.legendSelected
      })
      const legendConf = {
        offsetY: 2,
        itemHeight: 15,
        pageNavigator: {
          marker: {
            style: {
              // 非激活，不可点击态时的填充色设置
              inactiveFill: '#E5E5E5',
              // 默认填充色设置
              fill: '#8C8C8C',
              size: 8
            }
          }
        }
      }
      if (chartConfig.legend) {
        this.chart.legend(Object.assign(legendConf, chartConfig.legend))
      } else {
        this.chart.legend(false)
      }
      // 坐标轴配置===axis
      if (chartConfig.axis?.length) {
        chartConfig.axis.map(m => {
          this.chart.axis(
            m.key,
            Object.assign(
              {
                grid: null
              },
              m.value
            )
          )
        })
      } else {
        this.chart.axis(chartConfig.axis)
      }
      // 几何图形渲染 ==== Geometry
      if (chartConfig.chartType.length) {
        chartConfig.chartType.map(m => {
          if (this.chartConfig.coordinate?.key === 'theta') {
            this.chart[m.type]()
              .position(m.position)
              .adjust(m.adjust)
              .color(m.color, m.colors)
              .label(m.label?.key, m.label?.value)
              .tooltip(m.tooltip?.key, m.tooltip?.value)
              .shape('slice-shape')
          } else {
            this.chart[m.type]().position(m.position).adjust(m.adjust).color(m.color, m.colors)
          }
        })
      }
      this.chart.interaction('active-region')
      // 复写 图例筛选 交互。1、点击图例名称 进行 unchecked 状态的切换 2、点击图例 marker，进行 checked 状态的切换（进行聚焦）3、双击 重置状态
      this.chart.interaction('legend-filter', {
        start: [
          {
            trigger: 'legend-item-name:click',
            action: ['list-unchecked:toggle', 'data-filter:filter']
          },
          {
            trigger: 'legend-item-marker:click',
            action: ['list-checked:checked', 'data-filter:filter']
          }
        ],
        end: [
          {
            trigger: 'legend-item-marker:dblclick',
            action: ['list-checked:reset', 'data-filter:filter']
          }
        ]
      })

      // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值
      if (this.chartConfig.coordinate?.key === 'theta') {
        this.chart.interaction('element-active')
        const sliceNumber = 0.005
        registerShape('interval', 'slice-shape', {
          draw(cfg, container) {
            const points = cfg.points
            let path = []
            path.push(['M', points[0].x, points[0].y])
            path.push(['L', points[1].x, points[1].y - sliceNumber])
            path.push(['L', points[2].x, points[2].y - sliceNumber])
            path.push(['L', points[3].x, points[3].y])
            path.push('Z')
            path = this.parsePath(path)
            return container.addShape('path', {
              attrs: {
                fill: cfg.color,
                path
              }
            })
          }
        })
      }
      if (this.chartConfig.slider) {
        this.chart.option('slider', this.chartConfig.slider)
      } else {
        this.chart.option('slider', false)
      }
      this.chart.render()
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.destroy()
  },
  watch: {
    'chartConfig.data': {
      deep: true,
      handler(val) {
        if (this.chart) {
          this.chart.destroy()
        }
        this.initChart()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.antv-g2 {
  height: 100%;
  /deep/.g2-label-spec {
    top: 10px;
    left: 10px;
    position: absolute;
    font-size: 20px;
    width: 100px;
    height: 100px;
  }
}
</style>
