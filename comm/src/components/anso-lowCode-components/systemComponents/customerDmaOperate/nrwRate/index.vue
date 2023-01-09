<template>
  <div class="lowCodeComponents">
    <div class="main-title">
      <div class="main-title-left">
        <div class="main-title__item">产销差率</div>
      </div>
      <div class="main-title-right"></div>
    </div>
    <div class="main-chart">
      <anso-antv-g2 :chartId="chartId" :chartConfig="chartConfig"></anso-antv-g2>
    </div>
  </div>
</template>

<script>
import ansoAntvG2 from 'comm/src/components/anso-antv-g2'
import commStore from 'comm/src/store'
import { productDifferentRate } from 'comm/src/services/systemComponents/dmaOperate'
import { GET_USER_INFOS_KEY } from 'comm/src/config'
export default {
  name: 'nrwRate',
  components: { ansoAntvG2 },
  data() {
    return {
      comConfig: {
        wd: 340,
        ht: 245,
        title: '产销差率'
      },
      isAdmin: commStore.getters[`${GET_USER_INFOS_KEY}/isAdmin`],
      chartId: 'nrwRate' + new Date().getTime(),
      chartConfig: {
        data: [],
        tooltip: {
          showTitle: false,
          showMarkers: false
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
              content: '200',
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
            position: 'value',
            type: 'interval',
            adjust: 'stack',
            label: {
              key: 'value',
              value: () => {
                return {
                  style: {
                    fill: '#262626',
                    fontSize: 12,
                    lineHeight: 16,
                    fontWeight: 700
                    // shadowBlur: 2,
                    // shadowColor: 'rgba(0, 0, 0, .45)'
                  },
                  layout: [
                    { type: 'pie-spider' },
                    { type: 'limit-in-plot', cfg: { action: 'ellipsis' /** 或 translate */ } }
                  ],
                  labelHeight: 100,
                  offset: 20,
                  content: data => {
                    return `${data.type}\n${data.value}个`
                  }
                }
              }
            },
            shape: 'slice-shape',
            color: 'type'
          }
        ]
      }
    }
  },
  mounted() {
    this.getNrwRateList()
  },
  methods: {
    async getNrwRateList() {
      const params = {
        roleType: this.isAdmin ? 1 : 0,
        trim: true,
        isJoint: true
      }
      let { code, data } = await productDifferentRate(params)
      if (code === 200) {
        //   const data = [
        //   { type: '红色报警', value: 20 },
        //   { type: '黄色预警', value: 18 },
        //   { type: '蓝色关注', value: 32 }
        // ]
        this.echartInit(data)
      }
    },
    // 加载图表
    echartInit(data) {
      const chartData = [
        { type: '30%以上', value: data.thirtyRateNumber },
        { type: '20%-30%', value: data.twentyToThirtyRateNumber },
        { type: '异常DMA', value: data.errorDmaNumber },
        { type: '10%-20%', value: data.tenToTwentyRateNumber }
      ]
      // const chartData = [
      //   { type: '30%以上', value: 10 },
      //   { type: '20%-30%', value: 20 },
      //   { type: '10%-20%', value: 30 },
      //   { type: '10%以下', value: 40 },
      //   { type: '异常DMA', value: 40 },
      // ]
      this.chartConfig.Annotation.textList[1].content = data.dmaNumber ? data.dmaNumber : 0
      this.chartConfig.data = chartData
    }
  }
}
</script>
<style lang="scss" scoped></style>
