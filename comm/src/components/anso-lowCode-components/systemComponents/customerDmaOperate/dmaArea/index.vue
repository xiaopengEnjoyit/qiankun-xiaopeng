<template>
  <div class="lowCodeComponents">
    <div class="main-title">
      <div class="main-title-left">
        <div class="main-title__item">DMA分区</div>
      </div>
      <div class="main-title-right">
        <div class="content-tab-title">
          <div
            v-for="(item, index) in tabList"
            :key="index"
            class="content-tab-title__item"
            @click="isActive(item.value, item.name)"
            :class="{ 'is-active': current === item.value }"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
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
import { dmaPartition } from 'comm/src/services'
import { GET_USER_INFOS_KEY } from 'comm/src/config'
export default {
  name: 'dmaArea',
  components: { ansoAntvG2 },
  data() {
    return {
      comConfig: {
        wd: 340,
        ht: 245,
        title: 'DMA分区'
      },
      isAdmin: commStore.getters[`${GET_USER_INFOS_KEY}/isAdmin`],
      chartId: 'dmaArea' + new Date().getTime(),
      current: 1,
      tabList: [
        { name: '状态', value: 1 },
        { name: '类型', value: 2 },
        { name: '入口', value: 3 },
        { name: '规模', value: 4 }
      ],
      echartData: [],
      chartConfig: {
        data: [],
        legend: false,
        tooltip: {
          showMarkers: true,
          shared: true
        },
        Annotation: {
          textList: [
            {
              position: ['start', 'end'],
              content: '个',
              style: {
                fill: '#8c8c8c',
                fontWeight: 300,
                fontSize: 13
              },
              offsetY: -20,
              offsetX: -10
            }
          ]
        },
        scale: {
          value: {
            nice: true
          }
        },
        chartType: [
          {
            position: 'name*value',
            type: 'interval',
            color: 'type'
          }
        ]
      }
    }
  },
  mounted() {
    this.getDmaAreaList()
    console.log(1111111111)
  },
  methods: {
    async getDmaAreaList() {
      const params = {
        roleType: this.isAdmin ? 1 : 0,
        trim: true,
        isJoint: true
      }
      let { code, data } = await dmaPartition(params)
      if (code === 200) {
        this.echartData = data
        this.echartInit()
      }
    },
    // 加载图表
    echartInit() {
      const echartData = this.echartData.filter(j => {
        return j.type === this.current
      })
      let ds = new this.$dv()
      let dv = ds.createView().source(echartData)
      dv.transform({
        type: 'fold',
        fields: ['value'],
        key: 'type',
        value: 'value'
      })
      dv.rows.map(res => {
        res.type = res.name
        res.value = res.value ? res.value : 0
      })
      this.chartConfig.data = dv.rows
    },
    isActive(value, name) {
      Bus.$emit('getListInfo', name)
      this.current = value
      this.echartInit()
    }
  }
}
</script>
<style lang="scss" scoped>
.main-charts {
  height: calc(100%);
}
</style>
