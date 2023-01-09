<template>
  <div class="lowCodeComponents">
    <div class="main-title">
      <div class="main-title-left">
        <div class="main-title__item">漏控评价</div>
      </div>
      <div class="main-title-right">
        <span class="el-icon-arrow-right" @click="goToRouter"></span>
      </div>
    </div>
    <div class="main-chart">
      <anso-table :columns="columns" :tableData="tableData">
        <template v-slot:custom="{ row, prop }">
          <div :style="'color: ' + bgColor(row[prop], row[prop + 'WarnLevel'])">
            {{ row[prop] === null ? '--' : row[prop] }}
          </div>
        </template>
      </anso-table>
    </div>
    <anso-drawer
      ref="ansoDrawer"
      :size="'large'"
      :title="objInfo.dmaName"
      :customClass="'leakageEvaluation'"
      :isShowFooter="false"
      @cancel="cancelDrawer"
    >
      <leakQueryDetail v-if="ansoDrawer" :objInfo="objInfo" :orgTypeId="orgTypeId"> </leakQueryDetail>
    </anso-drawer>
  </div>
</template>

<script>
import ansoDrawer from 'comm/src/components/anso-drawer'
import leakQueryDetail from 'comm/src/components/anso-lowCode-systemView/systemView-dmaOperate/dialogCommView/leakQueryDetail'
import commStore from 'comm/src/store'
import { leakEvaluation } from 'comm/src/services/systemComponents/dmaOperate'
import { GET_USER_INFOS_KEY } from 'comm/src/config'
export default {
  name: 'leakageEvaluation',
  components: { ansoDrawer, leakQueryDetail },
  data() {
    return {
      comConfig: {
        wd: 700,
        ht: 245,
        title: '漏控评价'
      },
      isAdmin: commStore.getters[`${GET_USER_INFOS_KEY}/isAdmin`],
      columns: [
        {
          prop: 'dmaName',
          label: 'DMA名称',
          render: fullData => {
            return (
              <el-link
                type="primary"
                onClick={() => {
                  this.dmaDetail(fullData)
                }}
              >
                {fullData.dmaName}
              </el-link>
            )
          }
        },
        {
          prop: 'minInstantFlowRate',
          label: '最小流量(m³/h)',
          minWidth: '130px',
          sortable: true,
          custom: true
        },
        {
          prop: 'netCumulativeSupplyWater',
          label: '供水量(m³)',
          minWidth: '100px'
        },
        {
          prop: 'lossWater',
          label: '漏失水量(m³)',
          minWidth: '120px',
          sortable: true,
          custom: true
        },
        {
          prop: 'avgUserWater',
          label: 'MF/日均(%)',
          minWidth: '120px',
          sortable: true,
          custom: true
        },
        // {
        //   prop: 'netCumulativeTotalDifference',
        //   label: '总分差水量(m³)',
        //   minWidth: '120px'
        // },
        {
          prop: 'netCumulativeTotalDifferenceRate',
          label: '总分差率(%)',
          minWidth: '120px',
          sortable: true,
          custom: true
        }
      ],
      tableData: [],
      objInfo: {},
      orgTypeId: '',
      ansoDrawer: false
    }
  },
  mounted() {
    this.getleakageEvaluationList()
  },
  methods: {
    async getleakageEvaluationList() {
      const params = {
        roleType: this.isAdmin ? 1 : 0,
        pageIndex: 1,
        pageSize: 30
      }
      let { code, data } = await leakEvaluation(params)
      if (code === 200) {
        this.tableData = data.records
        // this.tableData = [
        //   {
        //     dmaName: '测试-20220407-2',
        //     objectId: '1511895890492321793',
        //     orgTypeId: '1554756705121951747',
        //     minInstantFlowRate: 12,
        //     minInstantFlowRateWarnLevel: 1,
        //     netCumulativeSupplyWater: 22,
        //     netCumulativeSupplyWaterWarnLevel: 2,
        //     lossWater: 23,
        //     lossWateWarnLevelr: 2,
        //     avgUserWater: 67,
        //     avgUserWaterWarnLevel: 2,
        //     netCumulativeTotalDifferenceRate: 124,
        //     netCumulativeTotalDifferenceRateWarnLevel: 3
        //   }
        // ]
      }
    },
    // 颜色处理
    bgColor(cellValue, WarnLevel) {
      switch (WarnLevel) {
        case 1:
          return '#FF4D4F '
        case 2:
          return '#FAAD14'
        case 3:
          return '#3171F2'
        case 4:
          return '#52C41A'
        default:
          return '#262626'
      }
    },
    // dma详情
    dmaDetail(val) {
      this.orgTypeId = val.orgTypeId
      val.objId = val.objectId
      val.objName = val.dmaName
      val.objType = 3
      this.objInfo = val
      this.ansoDrawer = true
      this.$refs.ansoDrawer.open()
    },
    // 抽屉关闭
    cancelDrawer() {
      this.ansoDrawer = false
    },
    goToRouter() {
      this.$router.push({
        path: '/dmaEvaluate'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-icon-arrow-right {
  font-size: 15px;
  cursor: pointer;
  color: #626262;
}
.lowCodeComponents {
  background: transparent;
  .main-chart {
    padding: 0px;
    /deep/.el-table {
      .el-table__empty-text {
        line-height: 0;
      }
      // background: transparent;
      // tr {
      //   background: transparent;
      // }
      // .el-table__header-wrapper thead tr {
      //   background-color: transparent !important;
      // }
      // .el-table__header-wrapper thead tr th {
      //   background-color: transparent !important;
      // }
    }
  }
}
</style>
