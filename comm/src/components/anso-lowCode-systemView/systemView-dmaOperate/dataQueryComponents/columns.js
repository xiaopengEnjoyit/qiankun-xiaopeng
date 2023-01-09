import Vue from 'vue'
let that = new Vue({})
// tab页图表切换
const houseMeterColumns = [
  { name: '用水量', value: 'houseMeterUser' },
  { name: '抄表数据', value: 'houseMeterReading' }
]
const areaColumns = [
  { name: '总分差', value: 'areaDmaTotalDiffData' },
  { name: '供水', value: 'areaDmaSupplyWater' },
  { name: '用水', value: 'areaDmaUserWater' },
  { name: '最小流量', value: 'areaMiniFlux' },
  { name: '实时数据', value: 'areaDmaRealTimeData' }
]
const dmaColumns = [
  { name: '最小流量', value: 'dmaMiniFlux' },
  { name: '总分差', value: 'areaDmaTotalDiffData' },
  { name: '供水', value: 'areaDmaSupplyWater' },
  { name: '用水', value: 'areaDmaUserWater' },
  { name: '实时数据', value: 'areaDmaRealTimeData' },
  { name: '评价指标', value: 'dmaEvalTarData' }
]
const buildingColumns = [
  { name: '总分差', value: 'buildTotalDiffData' },
  { name: '实时数据', value: 'deviceRealTimeData' }
]
const deviceColumns = [
  { name: '用水量', value: 'deviceSupplyWater' },
  { name: '实时数据', value: 'deviceRealTimeData' }
]
// tabs
const areaTabs = [
  { name: '基础信息', value: 'areaInfo' },
  { name: '关联总表信息', value: 'areaRelationMeter' },
  { name: '总表变更记录', value: 'areaChangeMeter' }
]
const dmaTabs = [
  { name: '基础信息', value: 'dmaInfo' },
  { name: '关联设备信息', value: 'dmaRelationMeter' },
  { name: '设备变更记录', value: 'dmaChangeMeter' }
]
const buildingTabs = [
  { name: '基础信息', value: 'buildInfo' },
  { name: '总表换表记录', value: 'buildChangeMeter' },
  { name: '户表数据', value: 'buildSubMeter' }
]
const deviceTabs = [
  { name: '基础信息', value: 'deviceInfo' },
  { name: '换表记录', value: 'deviceChangeMeter' }
]
const headerTabs = [
  { name: '动态信息', value: 'dynamicInfo' },
  { name: '静态信息', value: 'staticInfo' }
]
export {
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
}
