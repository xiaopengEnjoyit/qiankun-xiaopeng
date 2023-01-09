<template>
  <three-zoom-box ref="threeZoomBox" rightWidth="20%" leftTopHeight="70%" class="sub-cont-wrap">
    <!-- 上 -->
    <div slot="leftTop" class="slot-left-top">
      <div class="top-title">
        <div class="top-title-objName">{{ orgInfo.objName || '--' }}</div>
        <div class="top-title-objType">{{ objType(orgInfo.objType) }}</div>
      </div>
      <anso-tab-pane ref="tab-header" :tagList="tabHeaderList" @handleClick="tabHeaderClick"> </anso-tab-pane>
      <div class="anso-tabs-con">
        <anso-tabs ref="tab-pane" :panes="tabChartList" @handleClick="tabHandleClick">
          <component :is="tabComponentId" :orgInfo="orgInfo" :orgTypeId="orgTypeId" @getDataTable="getDataTable" />
        </anso-tabs>
      </div>
    </div>
    <!-- 下 -->
    <div slot="leftBottom" class="slot-left-Bottom" v-if="tabHeaderId === 'dynamicInfo'">
      <dataTable :tableDataColumns="tableDataColumns" :orgInfo="orgInfo" />
    </div>
    <!-- 右 -->
    <div slot="right" class="slot-right" v-if="isTreeMap">
      <anso-tree-map :routerPath="'dataQuery'" ref="ansoTreeMap" @nodeClick="nodeClick"></anso-tree-map>
    </div>
  </three-zoom-box>
</template>

<script>
import {
  houseMeterColumns,
  areaColumns,
  dmaColumns,
  buildingColumns,
  deviceColumns,
  areaTabs,
  dmaTabs,
  buildingTabs,
  deviceTabs,
  headerTabs
} from './columns.js'
import ansoTabPane from './../components/anso-tab-pane'
import ansoTabs from './../components/anso-tabs'
import ansoTreeMap from './components/anso-tree-map'
import threeZoomBox from 'comm/src/components/three-zoom-box'
// 上面的内容
// 区域
import areaMiniFlux from './chartPart/areaMiniFlux/index.vue'
//dma
import dmaMiniFlux from './chartPart/dmaMiniFlux/index.vue'
import areaDmaTotalDiffData from './chartPart/areaDmaTotalDiffData/index.vue'
import areaDmaSupplyWater from './chartPart/areaDmaSupplyWater/index.vue'
import areaDmaUserWater from './chartPart/areaDmaUserWater/index.vue'
import areaDmaRealTimeData from './chartPart/areaDmaRealTimeData/index.vue'
import dmaEvalTarData from './chartPart/dmaEvalTarData/index.vue'
//栋楼表
import buildTotalDiffData from './chartPart/buildTotalDiffData/index.vue'
//设备
import deviceRealTimeData from './chartPart/deviceRealTimeData/index.vue'
import deviceSupplyWater from './chartPart/deviceSupplyWater/index.vue'
//户表
import houseMeterUser from './chartPart/houseMeterUser/index.vue'
import houseMeterReading from './chartPart/houseMeterReading/index.vue'
// 下面的内容
import dataTable from './tablePart/dataTable'
import areaInfo from './tablePart/areaInfo'
import areaRelationMeter from './tablePart/areaRelationMeter'
import areaChangeMeter from './tablePart/areaChangeMeter'
import dmaInfo from './tablePart/dmaInfo'
import dmaRelationMeter from './tablePart/dmaRelationMeter'
import dmaChangeMeter from './tablePart/dmaChangeMeter'
import buildInfo from './tablePart/buildInfo'
import buildChangeMeter from './tablePart/buildChangeMeter'
import buildSubMeter from './tablePart/buildSubMeter'
import deviceInfo from './tablePart/deviceInfo'
import deviceChangeMeter from './tablePart/deviceChangeMeter'
export default {
  name: 'dataQueryComponents',
  components: {
    ansoTabs,
    ansoTabPane,
    ansoTreeMap,
    threeZoomBox,
    //DMA
    dmaMiniFlux,
    areaDmaTotalDiffData,
    areaDmaSupplyWater,
    areaDmaUserWater,
    areaDmaRealTimeData,
    dmaEvalTarData,
    // 区域
    areaMiniFlux,
    // 栋楼表
    buildTotalDiffData,
    // 设备
    deviceRealTimeData,
    deviceSupplyWater,
    //户表
    houseMeterUser,
    houseMeterReading,
    // 下面的内容
    dataTable,
    areaInfo,
    areaRelationMeter,
    areaChangeMeter,
    dmaInfo,
    dmaRelationMeter,
    dmaChangeMeter,
    buildInfo,
    buildChangeMeter,
    buildSubMeter,
    deviceInfo,
    deviceChangeMeter
  },
  props: {
    // 是否显示右侧的组织树
    isTreeMap: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      orgInfo: {},
      orgTypeId: '',
      tabHeaderList: headerTabs,
      tabHeaderId: 'dynamicInfo',
      tabChartList: [],
      tabComponentId: '',
      tableDataColumns: {}
    }
  },
  created() {},
  mounted() {
    this.$refs['tab-header'].labelDefult('dynamicInfo')
  },
  methods: {
    // 组织树node点击
    nodeClick(data, orgTypeId) {
      if (this.orgInfo.objType !== data.objType) {
        this.tabHeaderClick(this.tabHeaderId, data)
      }
      this.orgInfo = data
      this.orgTypeId = orgTypeId
    },
    // 动态信息、静态信息切换事件
    tabHeaderClick(value, data) {
      const orgInfo = data ? data : this.orgInfo
      this.tabHeaderId = value
      switch (value) {
        case 'dynamicInfo':
          this.dynamicInfoTab(orgInfo)
          break
        case 'staticInfo':
          this.staticInfoTab(orgInfo)
          break
      }
      this.showTable(value)
    },
    // 动态数据Tab筛选
    dynamicInfoTab(data) {
      switch (data.objType) {
        case 5:
          this.tabChartList = houseMeterColumns
          this.$refs['tab-pane'].labelDefult('houseMeterUser')
          this.tabComponentId = 'houseMeterUser'
          break
        case 4:
          this.tabChartList = areaColumns
          this.$refs['tab-pane'].labelDefult('areaDmaTotalDiffData')
          this.tabComponentId = 'areaDmaTotalDiffData'
          break
        case 3:
          this.tabChartList = dmaColumns
          this.$refs['tab-pane'].labelDefult('dmaMiniFlux')
          this.tabComponentId = 'dmaMiniFlux'
          break
        case 2:
          this.tabChartList = buildingColumns
          this.$refs['tab-pane'].labelDefult('buildTotalDiffData')
          this.tabComponentId = 'buildTotalDiffData'
          break
        case 1:
          this.tabChartList = deviceColumns
          this.$refs['tab-pane'].labelDefult('deviceSupplyWater')
          this.tabComponentId = 'deviceSupplyWater'
          break
      }
    },
    // 静态数据Tab筛选
    staticInfoTab(data) {
      switch (data.objType) {
        case 5:
          this.tabChartList = deviceTabs
          this.$refs['tab-pane'].labelDefult('deviceInfo')
          this.tabComponentId = 'deviceInfo'
          break
        case 4:
          this.tabChartList = areaTabs
          this.$refs['tab-pane'].labelDefult('areaInfo')
          this.tabComponentId = 'areaInfo'
          break
        case 3:
          this.tabChartList = dmaTabs
          this.$refs['tab-pane'].labelDefult('dmaInfo')
          this.tabComponentId = 'dmaInfo'
          break
        case 2:
          this.tabChartList = buildingTabs
          this.$refs['tab-pane'].labelDefult('buildInfo')
          this.tabComponentId = 'buildInfo'
          break
        case 1:
          this.tabChartList = deviceTabs
          this.$refs['tab-pane'].labelDefult('deviceInfo')
          this.tabComponentId = 'deviceInfo'
          break
      }
    },
    // 获取数据列表数据
    getDataTable(data) {
      this.tableDataColumns = data
    },
    // 各二级指标切换
    tabHandleClick(value) {
      this.tabComponentId = value
    },
    // 处理下 是否需要下方的table区域  不需要就高度 0  因此 拖动
    showTable() {
      const topElement = this.$refs.threeZoomBox.$refs.leftTopZoomBox.$el
      const bottomElement = topElement.getElementsByClassName('zoom-box-tools')[0]
      if (this.tabHeaderId === 'dynamicInfo') {
        topElement.style.height = '70%'
        bottomElement.style.display = 'block'
      } else {
        topElement.style.height = '100%'
        bottomElement.style.display = 'none'
      }
    },
    // 类型处理
    objType(type) {
      switch (type) {
        case 1:
          return '设备'
        case 2:
          return '栋楼'
        case 3:
          return 'DMA'
        case 4:
          return '分区'
        case 5:
          return '户表'
        default:
          return '组织'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
