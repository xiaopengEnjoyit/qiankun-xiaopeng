<template>
  <div class="lowCodeComponents">
    <div class="main-title">
      <div class="main-title-left">
        <div class="main-title__item">DMA整体</div>
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
import { getMDDate, getNearlyWeekDate } from 'comm/src/utils/date.js'
import commStore from 'comm/src/store'
import { dmaOverall } from 'comm/src/services/systemComponents/dmaOperate'
import { GET_USER_INFOS_KEY } from 'comm/src/config'
export default {
  name: 'dmaEntirety',
  components: { ansoAntvG2 },
  data() {
    return {
      comConfig: {
        wd: 340,
        ht: 245,
        title: 'DMA整体'
      },
      isAdmin: commStore.getters[`${GET_USER_INFOS_KEY}/isAdmin`],
      chartId: 'dmaEntirety' + new Date().getTime(),
      chartConfig: {
        data: [],
        tooltip: {
          showMarkers: true,
          shared: true
        },
        legend: {
          position: 'top-left'
          // offsetY: 10
        },
        axis: [
          {
            key: 'value'
          }
        ],
        Annotation: {
          textList: [
            {
              position: ['start', 'end'],
              content: 'm³',
              style: {
                fill: '#8c8c8c',
                fontWeight: 300,
                fontSize: 13
              },
              offsetY: -20,
              offsetX: -20
            },
            {
              position: ['end', 'end'],
              content: 'm³/h',
              style: {
                fill: '#8c8c8c',
                fontWeight: 300,
                fontSize: 13
              },
              offsetY: -20,
              offsetX: 10
            }
          ]
        },
        scale: {
          intervalValue: {
            nice: true
          },
          value: {
            nice: true
          }
        },
        chartType: [
          {
            position: 'readTime*intervalValue',
            type: 'line',
            color: 'type'
            // colors: ['#61DDAA', '#F6BD16', '#5B8FF9']
          },
          {
            position: 'readTime*value',
            type: 'line',
            color: 'type'
          }
        ]
      }
    }
  },
  mounted() {
    this.getDmaEntiretyList()
  },
  methods: {
    async getDmaEntiretyList() {
      const params = {
        startTime: getNearlyWeekDate()[0],
        endTime: getNearlyWeekDate()[1] - 1 * 24 * 60 * 60 * 1000,
        roleType: this.isAdmin ? 1 : 0,
        trim: true,
        isJoint: true
      }
      let { code, data } = await dmaOverall(params)
      if (code === 200) {
        // data = [
        //   {
        //     netCumulativeSupplyWater: 100,
        //     minInstantFlowRate: 12000,
        //     leakWater: 1240,
        //     readTime: 1669737600000
        //   },
        //   {
        //     netCumulativeSupplyWater: 2000,
        //     minInstantFlowRate: 3200,
        //     leakWater: 1340,
        //     readTime: 1669824000000
        //   },
        //   {
        //     netCumulativeSupplyWater: 3000,
        //     minInstantFlowRate: 4200,
        //     leakWater: 1640,
        //     readTime: 1669910400000
        //   },
        //   {
        //     netCumulativeSupplyWater: 4000,
        //     minInstantFlowRate: 520,
        //     leakWater: 1840,
        //     readTime: 1669996800000
        //   },
        //   {
        //     netCumulativeSupplyWater: 4000,
        //     minInstantFlowRate: 520,
        //     leakWater: 2840,
        //     readTime: 1670083200000
        //   }
        // ]
        data.forEach(j => {
          j.readTime = getMDDate(Number(j.readTime))
        })
        this.echartInit(data)
      }
    },
    // 加载图表
    echartInit(data) {
      let ds = new this.$dv()
      let dv = ds.createView().source(data)
      dv.transform({
        type: 'fold',
        fields: ['netCumulativeSupplyWater', 'minInstantFlowRate', 'leakWater'],
        key: 'type',
        value: 'value'
      })
      dv.rows.map(res => {
        if (res.type === 'netCumulativeSupplyWater') {
          res.type = '总供水量'
          res.intervalValue = res.value ? res.value : 0
          res.value = null
        } else if (res.type === 'minInstantFlowRate') {
          res.type = '总最小流量'
          res.value = res.value ? res.value : 0
        } else if (res.type === 'leakWater') {
          res.type = '降漏空间'
          res.value = res.value ? res.value : 0
        }
      })
      this.chartConfig.data = dv.rows
    }
  }
}
</script>
<style lang="scss" scoped></style>
