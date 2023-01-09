<template>
  <div class="anso-tree-map">
    <!-- <el-radio-group v-model="isCollapse" class="isCollapseGroup" size="small">
      <el-radio-button :label="true">组织</el-radio-button>
      <el-radio-button :label="false">地图</el-radio-button>
    </el-radio-group> -->
    <anso-tab-pane ref="tab-header" :tagList="tabHeaderList" @handleClick="tabHeaderClick"> </anso-tab-pane>
    <div class="anso-tree-con" v-show="isCollapse">
      <anso-tree
        v-if="selectConfig.options.length"
        ref="mytree"
        treeWidth="100%"
        :treeConfig="treeConfig"
        :defaultExpandedKeys="defaultExpandedKeys"
        :selectConfig="selectConfig"
        :treeEvent="treeEvent"
        placeholder="输入对象名称"
        @select="nodeClick"
        @selectChange="selectChange"
      >
        <div class="menu_tree_type">
          <div class="tree_type_title">分类</div>
          <div
            v-for="(item, index) in treeConfig.treeTypeList"
            :key="index"
            :style="{ background: item.backgroundColor }"
          >
            {{ item.name }}
          </div>
        </div>
      </anso-tree>
    </div>
    <div class="anso-map-con" v-if="!isCollapse">
      <anso-map ref="olMap" :toolsConfig="toolsConfig" @mapSuccess="mapSuccess"></anso-map>
    </div>
  </div>
</template>

<script>
import { ansoTree } from 'comm/src/components'
import commStore from 'comm/src/store'
import { GET_USER_INFOS_KEY } from 'comm/src/config'
import ansoMap from 'comm/src/components/anso-map'
import water_green from 'comm/src/assets/images/water_green.png'
import { addPolygonFeature, addPolygonFeatureNames } from 'comm/src/utils/map.js'
import { showOverlay } from 'comm/src/components/anso-map/js/common'
import { notDefinedDeal, fontSizeColor, jsonToTree } from 'comm/src/utils/utils.js'
import { getYMDHMSDate } from 'comm/src/utils/date.js'
import ansoTabPane from 'comm/src/components/anso-lowCode-systemView/systemView-dmaOperate/components/anso-tab-pane'
import { orgTypeList, orgAuthListTree, deviceInfo, buildInfo, pipeMapDetail } from 'comm/src/services'

export default {
  name: 'anso-tree-map',
  components: {
    ansoTree,
    ansoMap,
    ansoTabPane
  },
  props: {
    // 水平衡只需要dma分区
    routerPath: {
      type: String,
      default: 'dataQuery'
    }
  },
  data() {
    return {
      isAdmin: commStore.getters[`${GET_USER_INFOS_KEY}/isAdmin`],
      isCollapse: true,
      selectConfig: {
        showSelect: true,
        placeholder: '请选择业务域',
        defaultValue: '',
        defaultProps: {
          value: 'id',
          name: 'typeName'
        },
        options: []
      },
      defaultExpandedKeys: [],
      // 组织树
      treeConfig: {
        'expand-on-click-node': false,
        title: '',
        prefixField: 'type',
        hiddenAllNode: true,
        props: {
          label: 'treeName',
          children: 'children'
        },
        data: [],
        treeTypeList: [
          {
            name: '设备',
            objType: 1,
            backgroundColor: '#E0EAFD'
          },
          {
            name: '栋楼表',
            objType: 2,
            backgroundColor: '#FFE5E5'
          },
          {
            name: 'DMA',
            objType: 3,
            backgroundColor: '#E5F6DD'
          },
          {
            name: '分区',
            objType: 4,
            backgroundColor: '#AFE5E5'
          }
        ]
      },
      treeEvent: {
        'node-click': (data, node) => {
          this.nodeClick(data, node)
        }
      },
      treeData: [],
      currentTreeData: {}, // 当前选中组织树信息
      departments: '',
      tabHeaderList: [
        { name: '组织', value: 'orgType' },
        { name: '地图', value: 'mapType' }
      ],
      toolsConfig: { showPopup: true },
      Overlays: []
    }
  },
  created() {},
  mounted() {
    this.getBussinessList()
    if (this.routerPath === 'waterBalance') {
      this.treeConfig.treeTypeList = [
        {
          name: 'DMA',
          objType: 3,
          backgroundColor: '#E5F6DD'
        },
        {
          name: '分区',
          objType: 4,
          backgroundColor: '#AFE5E5'
        }
      ]
    }
    this.$refs['tab-header'].labelDefult('orgType')
  },
  methods: {
    // 获取业务域列表
    async getBussinessList() {
      let { code, data } = await orgTypeList({ pageAble: false })
      if (code === 200) {
        if (data?.records.length) {
          this.$set(this.selectConfig, 'options', data.records)
          // 筛选默认业务域，存在就选中默认业务域
          const filterDefault = data.records.filter(j => {
            return j.isDefault
          })
          if (filterDefault.length) {
            this.selectConfig.defaultValue = filterDefault[0].id
          } else {
            this.selectConfig.defaultValue = data.records[0].id
          }
          this.getTree()
        }
      }
    },
    // 组织树数据
    async getTree() {
      let params = {
        orgTypeId: this.selectConfig.defaultValue,
        trim: true,
        roleType: this.isAdmin ? 1 : 0
      }
      let { code, data, message } = await orgAuthListTree(params)
      if (code === 200) {
        if (message !== '成功') {
          return this.$message({ type: 'warning', message })
        }
        let result = []
        if (this.routerPath === 'dataQuery') {
          result = data
        } else {
          result = data.filter(res => {
            return res.objType === 3 || res.objType === 4 || res.objType === null
          })
        }
        result.forEach(j => {
          j.disabled = j.objId && j.checked ? false : true
          j.treeName = (j.objId ? (j.objName ? j.objName : '--') : j.orgName) + '(' + this.treeType(j.objType) + ')'
          const option = this.treeConfig.treeTypeList.find(O => {
            return j.objType === O.objType
          })
          if (option) j.backgroundColor = option.backgroundColor
        })
        this.treeData = result
        this.treeConfig.data = jsonToTree(result, 'id', 'parentId')
        if (result.length) {
          if (JSON.stringify(this.currentTreeData) === '{}') {
            const filterData = result.filter(j => {
              return j.objType && j.checked
            })
            this.currentTreeData = filterData[0]
          }
          this.$nextTick(() => {
            this.$refs.mytree.handleSelect(this.currentTreeData)
          })
        }
      }
    },
    // 类型处理
    treeType(type) {
      switch (type) {
        case 1:
          return '设备'
        case 2:
          return '栋楼'
        case 3:
          return 'DMA'
        case 4:
          return '分区'
        default:
          return '组织'
      }
    },
    // 筛选业务域组织
    selectChange(val) {
      this.selectConfig.defaultValue = val
      this.currentTreeData = {}
      this.getTree()
    },
    // 树节点点击
    nodeClick(data) {
      this.currentTreeData = data
      // alert('树节点被点击了')
      this.$emit('nodeClick', data, this.selectConfig.defaultValue)
    },
    // 初始化地图
    mapSuccess() {
      switch (this.currentTreeData.objType) {
        case 1:
          this.getDeviceInfo()
          break
        case 2:
          this.getBuildInfo()
          break
        case 3:
          this.getDmaInfo()
          break
        case 4:
          this.getAreaInfo()
          break
      }
      this.initMapEvent()
    },
    // 设备
    async getDeviceInfo() {
      let { code, data } = await deviceInfo({
        objId: this.currentTreeData.objId
      })
      if (code === 200) {
        this.mapPoint(data, 1)
      }
    },
    // 栋楼表
    async getBuildInfo() {
      let { code, data } = await buildInfo({
        objId: this.currentTreeData.objId
      })
      if (code === 200) {
        data.forEach(j => {
          j.waterPointCoord = j.coordinate
        })
        this.mapPoint(data, 2)
      }
    },
    //DMA
    async getDmaInfo() {
      const params = {
        objId: this.currentTreeData.objId,
        objType: this.currentTreeData.objType,
        orgTypeId: this.selectConfig.defaultValue
      }
      let { code, data } = await pipeMapDetail(params)
      if (code === 200) {
        this.mapPolygon(data)
      }
    },
    // 分区
    async getAreaInfo() {
      const params = {
        objId: this.currentTreeData.objId,
        objType: this.currentTreeData.objType,
        orgTypeId: this.selectConfig.defaultValue
      }
      let { code, data } = await pipeMapDetail(params)
      if (code === 200) {
        this.mapPolygon(data)
      }
    },
    // 点击事件
    initMapEvent() {
      const ref = this.$refs.olMap
      ref.map.on('click', e => {
        showOverlay(ref.overlay, undefined)
        ref.map.forEachFeatureAtPixel(e.pixel, async feature => {
          const geoExt = feature.getGeometry().extent_
          const coordinate = [(geoExt[0] + geoExt[2]) / 2, (geoExt[1] + geoExt[3]) / 2]
          const featureType = feature.get('featureType')
          if (featureType === 'point') {
            this.setPointContent(coordinate, feature)
          } else {
            this.setPolygonContent(coordinate, feature)
          }
        })
      })
    },
    // 区域DMA渲染
    mapPolygon(data) {
      if (data.geom) {
        const ref = this.$refs.olMap
        addPolygonFeature(ref, data)
        addPolygonFeatureNames(ref, [data])
      }
    },
    // 区域弹窗详情
    async setPolygonContent(coordinate, feature) {
      const ref = this.$refs.olMap
      this.feature = feature
      let data = feature.get('data')
      console.log(data)
      let info = []
      switch (data.objType) {
        case 3:
        case 4:
          info.push('<div class="infoWindow-title">')
          info.push(`<div class="title-name">${data.objName}</div>`)
          info.push('</div>')
          info.push('<div class="infoWindow-info">')
          info.push('<div class="info-item">')
          info.push('<span>最小流量(m³/h)</span>')
          info.push(`<span style="
                  color: ${fontSizeColor(data.minimumFlowWarnLevel)};font-size:16px
                ">${notDefinedDeal(data.minimumFlow)}</span>`)
          info.push('</div>')

          info.push('<div class="info-item">')
          info.push('<span>供水量(m³)</span>')
          info.push(`<span>${notDefinedDeal(data.supplyingWater)}</span>`)
          info.push('</div>')

          info.push('<div class="info-item">')
          info.push('<span>用水量(m³)</span>')
          info.push(`<span>${notDefinedDeal(data.userWater)}</span>`)
          info.push('</div>')

          info.push('<div class="info-item">')
          info.push('<span>总分差水量(m³)</span>')
          info.push(`<span>${notDefinedDeal(data.totalDifference)}</span>`)
          info.push('</div>')

          info.push('<div class="info-item">')
          info.push('<span>总分差率(%)</span>')
          info.push(`<span>${notDefinedDeal(data.totalDifferenceRate)}</span>`)
          info.push('</div>')

          info.push('<div class="info-item">')
          info.push('<span>数据时间</span>')
          info.push(`<span>${data.readTime ? getYMDHMSDate(data.readTime) : '--'}</span>`)
          info.push('</div>')

          info.push('</div>')
          break
      }
      ref.content.innerHTML = '<div class="infoWindow">' + info.join('') + '</div>'
      showOverlay(ref.overlay, coordinate)
    },
    // 点渲染
    mapPoint(pointData, type) {
      const ref = this.$refs.olMap
      let points = []
      if (pointData.geom) {
        points = ref.WKTgeomString(pointData.geom)
      }
      let feature = new ref.Feature({
        geometry: new ref.Point(ref.transform(points, 'EPSG:4326', 'EPSG:3857')), // 纬度 经度
        data: pointData,
        type: type,
        featureType: 'point'
      })
      feature.setStyle(
        new ref.Style({
          image: new ref.Icon({
            anchor: [0.5, 1],
            src: water_green,
            scale: 0.16
          })
        })
      )
      ref.layer.getSource().addFeature(feature)
      ref.map.getView().setCenter(ref.transform(points, 'EPSG:4326', 'EPSG:3857'))
    },
    // 点弹窗详情
    setPointContent(coordinate, feature) {
      this.feature = feature
      let data = feature.get('data')
      let type = feature.get('type')
      const ref = this.$refs.olMap
      let info = []
      switch (type) {
        case 1:
          info.push('<div class="infoWindow-title">')
          info.push(`<div class="title-name">${data.waterUserName}</div>`)
          info.push('</div>')
          info.push('<div class="infoWindow-info">')

          info.push('<div class="info-item">')
          info.push('<span>最新采集数据时间</span>')
          info.push('<span>--</span>')
          info.push('</div>')

          info.push('<div class="info-item">')
          info.push('<span>最新瞬时流量(m³/h)</span>')
          info.push('<span>--</span>')
          info.push('</div>')

          info.push('<div class="info-item">')
          info.push('<span>最新正累计(m³)</span>')
          info.push('<span>--</span>')
          info.push('</div>')

          info.push('<div class="info-item">')
          info.push('<span>口径</span>')
          info.push(`<span>${this.dictObjKey('caliber', data.caliber)}</span>`)
          info.push('</div>')

          info.push('<div class="info-item">')
          info.push('<span>表用途</span>')
          info.push(`<span>${this.dictObjKey('purpose', data.purpose)}</span>`)
          info.push('</div>')

          info.push('<div class="info-item">')
          info.push('<span>用水性质</span>')
          info.push(`<span>${this.dictObjKey('customerType', data.categories)}</span>`)
          info.push('</div>')
          info.push('</div>')
          info.push('<div class="infoWindow-btns" id="infoWindowObj">')
          if (data.isRelation === 1) {
            if (type === 1) {
              info.push(
                `<div class="infoWindow-btn" id="assessCancelRelation" dataId="${data.relationId}">取消关联</div>`
              )
            } else if (type === 2) {
              info.push(`<div class="infoWindow-btn" id="larCancelRelation" dataId="${data.relationId}">取消关联</div>`)
            } else if (type === 4) {
              info.push(
                `<div class="infoWindow-btn" id="areaCancelRelation" dataId="${data.relationId}">取消关联</div>`
              )
            }
          } else {
            if (type === 1) {
              info.push(`<div class="infoWindow-btn" id="addLinkInDma" dataId="${data.pointId}">设置入口表</div>`)
              info.push(`<div class="infoWindow-btn" id="addLinkOutDma" dataId="${data.pointId}">设置出口表</div>`)
            } else if (type === 2) {
              info.push(`<div class="infoWindow-btn" id="addLinklar" dataId="${data.pointId}">关联大用户</div>`)
            } else if (type === 4) {
              info.push(`<div class="infoWindow-btn" id="addLinkInArea" dataId="${data.pointId}">设置入口表</div>`)
              info.push(`<div class="infoWindow-btn" id="addLinkOutArea" dataId="${data.pointId}">设置出口表</div>`)
            }
          }
          info.push('</div>')
          break
        case 2:
          info.push('<div class="infoWindow-title">')
          info.push(`<div class="title-name">${data.waterUserName}</div>`)
          info.push('</div>')
          info.push('<div class="infoWindow-info">')

          info.push('<div class="info-item">')
          info.push('<span>栋楼表ID</span>')
          info.push(`<span>${notDefinedDeal(data.id)}</span>`)
          info.push('</div>')

          info.push('<div class="info-item">')
          info.push('<span>栋楼表地址</span>')
          info.push(`<span>${notDefinedDeal(data.installAddress)}</span>`)
          info.push('</div>')

          info.push('<div class="info-item">')
          info.push('<span>是否虚拟表</span>')
          info.push(`<span>${this.isRealCell(data.isReal)}</span>`)
          info.push('</div>')

          info.push('<div class="info-item">')
          info.push('<span>关联户表数</span>')
          info.push(`<span>${notDefinedDeal(data.relDeviceCount)}</span>`)
          info.push('</div>')

          info.push('</div>')
          info.push('<div class="infoWindow-btns">')
          if (data.isRelation === 1) {
            info.push(`<div class="infoWindow-btn" id="buildCancelRelation" dataId="${data.relationId}">取消关联</div>`)
          } else {
            info.push(`<div class="infoWindow-btn" id="addLinkBuild"  dataId="${data.pointId}">新增关联</div>`)
          }
          info.push('</div>')
          break
      }
      ref.content.innerHTML = '<div class="infoWindow">' + info.join('') + '</div>'
      showOverlay(ref.overlay, coordinate)
      this.initMapDomEvent() // 悬浮框DOM事件
    },
    // 切换模式
    tabHeaderClick(val) {
      if (val === 'orgType') {
        this.isCollapse = true
      } else {
        this.isCollapse = false
      }
    },
    isRealCell(val) {
      switch (val) {
        case 0:
          return '否'
        case 1:
          return '是'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index';
/deep/.polygontIitle {
  color: #262626;
  font-size: 12px;
  font-weight: 600;
  background: #ffffff;
  padding: 3px 8px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  position: relative;
  &:before {
    bottom: -10px;
    border: solid transparent;
    content: ' ';
    height: 0px;
    width: 0px;
    position: absolute;
    pointer-events: none;
    left: 50%;
    border-top-color: #fff;
    border-width: 5px;
    left: 50%;
    margin-left: -5px;
  }
}
</style>
