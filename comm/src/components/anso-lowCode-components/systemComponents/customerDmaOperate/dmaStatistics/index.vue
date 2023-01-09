<template>
  <div class="lowCodeComponents">
    <div class="dmaStatistics-con">
      <div v-for="(item, index) in dmaStatistics" :key="index">
        <div>{{ item.name }}</div>
        <div class="dmaStatistics-number">
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commStore from 'comm/src/store'
import { statistics } from 'comm/src/services/systemComponents/dmaOperate'
import { GET_USER_INFOS_KEY } from 'comm/src/config'
import { notDefinedDeal } from 'comm/src/utils/utils'

export default {
  name: 'dmaStatistics',
  components: {},
  data() {
    return {
      comConfig: {
        wd: 700,
        ht: 100,
        title: '统计指标'
      },
      isAdmin: commStore.getters[`${GET_USER_INFOS_KEY}/isAdmin`],
      dmaStatistics: [
        {
          name: 'DMA数量(个)',
          value: '--'
        },
        {
          name: '考核表数量(个)',
          value: '--'
        },
        {
          name: '覆盖户数(户)',
          value: '--'
        },
        {
          name: '监控水量(万m³)',
          value: '--'
        },
        {
          name: '水量占比(%)',
          value: '--'
        }
      ]
    }
  },
  mounted() {
    this.getStatistics()
  },
  methods: {
    async getStatistics() {
      const params = {
        roleType: this.isAdmin ? 1 : 0,
        trim: true,
        isJoint: true
      }
      let { code, data } = await statistics(params)
      if (code === 200) {
        if (data.monitorWaterNumber > 10000) {
          this.dmaStatistics[3].name = '监控水量(万m³)'
          this.dmaStatistics[3].value = notDefinedDeal((data.monitorWaterNumber / 10000).toFixed(2))
        } else {
          this.dmaStatistics[3].name = '监控水量(m³)'
          this.dmaStatistics[3].value = notDefinedDeal(data.monitorWaterNumber)
        }
        this.dmaStatistics[0].value = notDefinedDeal(data.dmaNumber)
        this.dmaStatistics[1].value = notDefinedDeal(data.monitorMeterNumber)
        this.dmaStatistics[2].value = notDefinedDeal(data.coverHouseholdNumber)
        this.dmaStatistics[4].value = notDefinedDeal(data.waterRate)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dmaStatistics-con {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  color: #8c8c8c;
  font-size: 12px;
  line-height: 30px;

  .dmaStatistics-number {
    font-size: 24px;
    font-weight: 700;
    color: #262626;
  }
}
</style>
