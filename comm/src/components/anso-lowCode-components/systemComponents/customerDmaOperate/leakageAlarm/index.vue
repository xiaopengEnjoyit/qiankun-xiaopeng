<template>
  <div class="lowCodeComponents">
    <div class="main-title">
      <div class="main-title-left">
        <div class="main-title__item">{{ text }}</div>
      </div>
      <div class="main-title-right"></div>
    </div>
    <div class="main-chart">
      <anso-antv-g2 :chartId="chartId" :chartConfig="chartConfig"></anso-antv-g2>
    </div>
  </div>
</template>

<script>
import Bus from 'comm/src/utils/eventBus.js'
// import Bus from '../eventBus.js'
import ansoAntvG2 from 'comm/src/components/anso-antv-g2'
import commStore from 'comm/src/store'
import { stockWarning } from 'comm/src/services/systemComponents/dmaOperate'
import { GET_USER_INFOS_KEY } from 'comm/src/config'
export default {
  name: 'leakageAlarm',
  components: { ansoAntvG2 },
  data() {
    return {
      comConfig: {
        wd: 340,
        ht: 245,
        title: '漏损报警(存量报警)'
      },
      isAdmin: commStore.getters[`${GET_USER_INFOS_KEY}/isAdmin`],
      chartId: 'leakageAlarm' + new Date().getTime(),
      chartConfig: {
        data: [],
        tooltip: {
          showTitle: false,
          showMarkers: false,
          itemTpl:
            '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {count} | {rate}%</li>'
        },
        legend: false,
        coordinate: {
          key: 'theta',
          value: {
            radius: 0.65,
            innerRadius: 0.6
          }
        },
        Annotation: {
          textList: [
            {
              position: ['50%', '50%'],
              content: '总数',
              style: {
                fontSize: 13,
                fill: '#8c8c8c',
                textAlign: 'center'
              },
              offsetY: -10
            },
            {
              position: ['50%', '50%'],
              content: '',
              style: {
                fontSize: 24,
                fill: '#262626',
                textAlign: 'center',
                fontWeight: 700
              },
              offsetY: 12
            },
            {
              position: ['50%', '50%'],
              content: '',
              style: {
                fontSize: 15,
                fill: '#8c8c8c',
                textAlign: 'center'
              },
              offsetY: 10,
              offsetX: 20
            }
          ]
        },
        chartType: [
          {
            position: 'count',
            type: 'interval',
            adjust: 'stack',
            label: {
              key: 'count',
              value: () => {
                return {
                  style: {
                    fill: '#262626',
                    fontSize: 12,
                    // shadowBlur: 2
                    lineHeight: 16,
                    fontWeight: 700
                    // shadowColor: 'rgba(0, 0, 0, .45)'
                  },
                  layout: [
                    { type: 'pie-spider' },
                    { type: 'limit-in-plot', cfg: { action: 'ellipsis' /** 或 translate */ } }
                  ],
                  offset: 20,
                  content: data => {
                    return `${data.type}\n${data.count} | ${data.rate}%`
                  }
                }
              }
            },
            tooltip: {
              key: 'type*count*rate',
              value: (type, count, rate) => {
                return {
                  name: type,
                  count: count,
                  rate: rate
                }
              }
            },
            shape: 'slice-shape',
            color: 'type',
            colors: ['#FF6769', '#FBB937', '#5086F4', '#BFBFBF']
          }
        ]
      },
      text: '漏损报警(存量报警)'
    }
  },
  mounted() {
    this.getLeakageAlarmList()
    //获取兄弟组件传来的值
    Bus.$on('getListInfo', data => {
      // this.text = data
      console.log(data)
    })
  },
  methods: {
    async getLeakageAlarmList() {
      const params = {
        roleType: this.isAdmin ? 1 : 0,
        trim: true,
        isJoint: true
      }
      let { code, data } = await stockWarning(params)
      if (code === 200) {
        const totalWarningCount =
          Number(data.redWarningCount) +
          Number(data.yellowWarningCount) +
          Number(data.blueWarningCount) +
          Number(data.offlineWarningCount)
        const chartData = [
          {
            type: '红色报警',
            count: data.redWarningCount,
            rate: ((data.redWarningCount / totalWarningCount) * 100).toFixed(2)
          },
          {
            type: '黄色预警',
            count: data.yellowWarningCount,
            rate: ((data.yellowWarningCount / totalWarningCount) * 100).toFixed(2)
          },
          {
            type: '蓝色关注',
            count: data.blueWarningCount,
            rate: ((data.blueWarningCount / totalWarningCount) * 100).toFixed(2)
          },
          {
            type: '离线报警',
            count: data.offlineWarningCount,
            rate: ((data.offlineWarningCount / totalWarningCount) * 100).toFixed(2)
          }
        ]
        this.chartConfig.Annotation.textList[1].content = totalWarningCount
        this.echartInit(chartData)
      }
    },
    // 加载图表
    echartInit(data) {
      this.chartConfig.data = data
    }
  }
}
</script>
<style lang="scss" scoped></style>
