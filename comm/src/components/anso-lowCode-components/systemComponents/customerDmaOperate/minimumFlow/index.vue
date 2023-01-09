<template>
  <div class="lowCodeComponents">
    <div class="main-title">
      <div class="main-title-left">
        <div class="main-title__item">最小流量</div>
      </div>
      <div class="main-title-right"></div>
    </div>
    <div class="main-chart">
      <anso-antv-g2
        ref="ansoAntv"
        :chartId="chartId"
        :chartConfig="chartConfig"
        @tooltipShow="tooltipShow"
      ></anso-antv-g2>
    </div>
  </div>
</template>

<script>
import ansoAntvG2 from 'comm/src/components/anso-antv-g2'
import { getMDDate, getNearlyWeekDate } from 'comm/src/utils/date.js'
import commStore from 'comm/src/store'
import { minFlow } from 'comm/src/services/systemComponents/dmaOperate'
import { GET_USER_INFOS_KEY } from 'comm/src/config'
export default {
  name: 'minimumFlow',
  components: { ansoAntvG2 },
  data() {
    return {
      comConfig: {
        wd: 340,
        ht: 245,
        title: '最小流量'
      },
      isAdmin: commStore.getters[`${GET_USER_INFOS_KEY}/isAdmin`],
      chartId: 'minimumFlow' + new Date().getTime(),
      currentTime: '',
      chartConfig: {
        data: [],
        tooltip: {
          showMarkers: true,
          shared: true,
          containerTpl: ` <div class="g2-tooltip" >
            <p class="g2-tooltip-title"></p>
            <ul class="g2-tooltip-list"></ul>
            <div style="font-size:12px;display:flex;justify-content: space-between;width:100%;margin-bottom:5px">
              <div style="padding-left:16px;width:50%">DMA数量:</div>
              <div style="text-align:right;width:50%" id="dataTitle"></div>
            <div>
          </div>
          `
        },
        axis: [
          {
            key: 'value'
          }
        ],
        legend: {
          position: 'top-left',
          itemSpacing: 5
        },
        Annotation: {
          textList: [
            {
              position: ['start', 'end'],
              content: 'm³/h',
              style: {
                fill: '#8c8c8c',
                fontWeight: 300,
                fontSize: 13
              },
              offsetY: -20,
              offsetX: -35
            },
            {
              position: ['end', 'end'],
              content: '%',
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
            // colors: ['#5ED7A6', '#F6BD16']
          },
          {
            position: 'readTime*value',
            type: 'line',
            color: 'type'
            // colors: ['#65789B', '#78D3F8']
          }
        ]
      }
    }
  },
  mounted() {
    this.getDmaMinFlowList()
  },
  methods: {
    async getDmaMinFlowList() {
      const params = {
        startTime: getNearlyWeekDate()[0],
        endTime: getNearlyWeekDate()[1] - 1 * 24 * 60 * 60 * 1000,
        roleType: this.isAdmin ? 1 : 0,
        trim: true,
        isJoint: true
      }
      let { code, data } = await minFlow(params)
      if (code === 200) {
        // data = [
        //   {
        //     minInstantFlowRate: 10,
        //     lossWaterRate: 22,
        //     leakWater: 24,
        //     avgUserWater: 14,
        //     dmaNumber: 13,
        //     readTime: 1669737600000
        //   },
        //   {
        //     minInstantFlowRate: 20,
        //     lossWaterRate: 42,
        //     leakWater: 35,
        //     avgUserWater: 24,
        //     dmaNumber: 23,
        //     readTime: 1669824000000
        //   },
        //   {
        //     minInstantFlowRate: 30,
        //     lossWaterRate: 52,
        //     leakWater: 45,
        //     avgUserWater: 34,
        //     dmaNumber: 53,
        //     readTime: 1669910400000
        //   },
        //   {
        //     minInstantFlowRate: 10,
        //     lossWaterRate: 82,
        //     leakWater: 75,
        //     avgUserWater: 44,
        //     dmaNumber: 63,
        //     readTime: 1669996800000
        //   },
        //   {
        //     minInstantFlowRate: 5,
        //     lossWaterRate: 82,
        //     leakWater: 85,
        //     avgUserWater: 74,
        //     dmaNumber: 73,
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
        fields: [
          'minInstantFlowRate',
          'lossWaterRate',
          'leakWater',
          'avgUserWater'
          // 'dmaNumber'
        ],
        key: 'type',
        value: 'value'
      })
      dv.rows.map(res => {
        if (res.type === 'minInstantFlowRate') {
          res.type = '总最小流量'
          res.intervalValue = res.value
          res.value = null
        } else if (res.type === 'lossWaterRate') {
          res.type = '物理漏失率'
        } else if (res.type === 'leakWater') {
          res.type = '降漏空间'
          res.intervalValue = res.value
          res.value = null
        } else if (res.type === 'avgUserWater') {
          res.type = 'MF/日均'
        }
        // else if (res.type === 'dmaNumber') {
        //   res.type = 'DMA数量'
        // }
      })
      this.chartConfig.data = dv.rows
    },
    tooltipShow(data) {
      this.$nextTick(() => {
        // this.chartConfig.tooltip.containerTpl = ` <div class="g2-tooltip" >
        //     <p class="g2-tooltip-title"></p>
        //     <ul class="g2-tooltip-list"></ul>
        //     <div style="font-size:12px;display:flex;justify-content: space-between;width:100%;margin-bottom:5px">
        //       <div style="padding-left:16px;width:50%">DMA数量:</div>
        //       <div style="text-align:right;width:50%" id="dataTitle"></div>
        //     <div>
        //   </div>
        //   `
        document.getElementById('dataTitle').innerHTML = this.selectDmaNumber(data.title)
      })
    },
    selectDmaNumber(readTime) {
      const row = this.chartConfig.data.find(j => {
        return j.readTime === readTime
      })
      if (row) {
        return row.dmaNumber
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
