<template>
  <div class="lowCodeComponents">
    <div class="main-title">
      <div class="main-title-left">
        <div class="main-title__item">工单统计</div>
      </div>
      <div class="main-title-right">
        <div class="content-tab-title">
          <div
            v-for="(item, index) in tabList"
            :key="index"
            class="content-tab-title__item"
            @click="isActive(item.value)"
            :class="{ 'is-active': current === item.value }"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="main-chart">
      <div id="g2-container-pie">
        <anso-antv-g2 :chartId="chartId" :chartConfig="chartConfig"></anso-antv-g2>
      </div>
    </div>
  </div>
</template>

<script>
import ansoAntvG2 from 'comm/src/components/anso-antv-g2'
import { workOrder } from 'comm/src/services/systemComponents/dmaOperate'

export default {
  name: 'workStatistics',
  components: { ansoAntvG2 },
  data() {
    return {
      comConfig: {
        wd: 340,
        ht: 245,
        title: '工单统计'
      },
      chartId: 'workStatistics' + new Date().getTime(),
      tabList: [
        { name: '状态', value: 1 },
        { name: '类型', value: 2 }
      ],
      current: 1,
      chartData: [],
      chartConfig: {
        data: [],
        legend: false,
        tooltip: {
          showMarkers: false
        },
        axis: false,
        scale: {
          value: {
            nice: true
          }
        },
        coordinate: {
          key: 'theta',
          value: {
            radius: 0.65
          }
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
                    fontSize: 12,
                    lineHeight: 16,
                    fontWeight: 700,
                    fill: '#262626'
                  },
                  layout: [{ type: 'pie-spider' }, { type: 'hide-overlap' }],
                  offset: 20,
                  content: data => {
                    return `${data.name}\n ${data.value}个 | ${data.rate}%`
                  }
                }
              }
            },
            color: 'name'
          }
        ]
      }
    }
  },
  mounted() {
    this.getWorkStatisticsList()
  },
  methods: {
    async getWorkStatisticsList() {
      const params = {}
      let { code, data } = await workOrder(params)
      if (code === 200) {
        if (this.current === 1) {
          data.workOrderState?.forEach(j => {
            j.value = Number(j.value)
          })
          this.chartData = data.workOrderState
        } else {
          data.workOrderType?.forEach(j => {
            j.value = Number(j.value)
          })
          this.chartData = data.workOrderType
        }
        this.echartInit(this.chartData)
      }
    },
    // 加载图表
    echartInit(data) {
      this.chartConfig.data = data
    },
    isActive(value) {
      this.current = value
      this.getWorkStatisticsList()
    }
  }
}
</script>
<style lang="scss" scoped>
.main-chart {
  display: flex;
  #g2-container-pie {
    width: 100%;
    height: 100%;
  }

  #g2-customize-legend {
    width: 30%;
    margin-left: 8px;
    width: 160px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .legend-item {
      width: 100%;
      line-height: 25px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      color: #000;
      opacity: 0.8;
      font-size: 12px;
      & > span {
        margin-left: 8px;
      }
      .legend-item-marker {
        width: 8px;
        height: 8px;
        display: inline-block;
      }
    }
  }
}
</style>
