<template>
  <div class="map" :style="{ height: isFullScreen ? '100vh' : '100%' }">
    <div class="mapId" :id="mapId" ref="map" />
    <search-input
      ref="searchInput"
      v-if="toolsConfig.showInput"
      :search="mapConfig.searchInput.search"
      :showResult="show"
    />
    <search-bar
      ref="searchBar"
      :showResult="show"
      v-if="toolsConfig.showBar"
      :search="mapConfig.searchBar.search"
      :barList="mapConfig.searchBar.barList"
      :opterateBarList="mapConfig.opterateBarList.list"
      :tuliList="mapConfig.opterateBarList.tuliList"
      :layerList="layerList"
      :eventBus="eventBus"
      :isFullScreen.sync="isFullScreen"
      @toggleMapLayers="toggleMapLayers"
      @showSinglePoint="showSinglePoint"
    />
    <div class="queryList">
      <result-pages
        ref="queryList"
        v-if="toolsConfig.showResult"
        :showDialog.sync="showDialog"
        :tableData="tableData"
        :overlay="overlay"
        :content="content"
      ></result-pages>
    </div>
    <locate />
    <zoom-tool />
    <map-layers-card v-if="toolsConfig.showLayerCards" @changeMapType="changeMapType" />
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer">
        <i class="el-icon-close"></i>
      </a>
      <div id="popup-content"></div>
    </div>
  </div>
</template>
<script>
import mixIndex from './mixins/index'
import mixTool from './mixins/tool'
import mixEvents from './mixins/events'
import utils from './mixins/utils'

import searchBar from './pages/searchBar/index.vue'
import searchInput from './pages/searchInput.vue'
import resultPages from './pages/resultPages'
import mapLayersCard from './pages/mapLayersCard'
import locate from './pages/locate'
import zoomTool from './pages/zoomTool'

import { createPopup } from './js/common'
export default {
  name: 'olMap',
  mixins: [mixIndex, mixTool, mixEvents, utils],
  components: { searchBar, searchInput, resultPages, mapLayersCard, locate, zoomTool },
  provide() {
    return {
      initDraw: this.initDraw,
      removeInteraction: this.removeInteraction,
      removeAllFeatures: this.removeAllFeatures,
      olWKTgeomToString: this.olWKTgeomToString,
      addFeatures: this.addFeatures,
      transformCoordinate: this.transformCoordinate,
      fitFeature: this.fitFeature,
      removeBeforeFeature: this.removeBeforeFeature,
      zoom: this.zoom
    }
  },
  props: {
    // 系统来源：管理端没有租户， 不显示官网
    origin: {
      type: String,
      default: 'Client'
    },
    mapId: {
      type: String,
      default: 'olMap'
    },
    centerConfig: {
      type: Object,
      default() {
        return {
          center: null, // [12134330.712953318, 4062016.038651179]
          zoom: null
        }
      }
    },
    toolsConfig: {
      type: Object,
      default() {
        return {
          showInput: false, //是否展示输入查询框
          showBar: false, //是否展示工具栏
          showResult: false, //是否展示搜索结果弹窗
          showPopup: false, // 是否展示定位详情弹窗
          showLayerCards: false //是否展示图层类型切换
        }
      }
    },
    mapConfig: {
      type: Object,
      default() {
        return {
          searchInput: {
            search: val => {
              console.log(val, 8888)
            }
          },
          searchBar: {
            barList: [],
            search: val => {
              console.log(val, 9999)
            }
          }
        }
      }
    }
  },
  data() {
    return {
      map: 'map',
      showDialog: false,
      isFullScreen: false,
      tableData: [],
      overlay: null,
      content: null
    }
  },
  mounted() {},
  methods: {
    initOverlay() {
      if (!this.toolsConfig.showPopup) return
      if (this.overlay) this.removeOverlay()
      const { overlay, content } = createPopup(this.map)
      this.overlay = overlay
      this.content = content
    },
    getData() {
      console.log(this.index, this.tool, this.map)
    },
    show(val, keyword) {
      this.tableData = val
      this.$refs.queryList.comp = 'list'
      this.$refs.queryList.keyword = keyword
      this.showDialog = true
    },
    // 切换展示图层
    toggleMapLayers(params) {
      this.mapLayers.forEach(tileLayer => {
        if (params.includes(tileLayer.values_.layerId)) {
          tileLayer.setVisible(true)
        } else {
          tileLayer.setVisible(false)
        }
      })
    },
    // 单独展示单选管网信息
    showSinglePoint(data) {
      console.log(data, 99999)
      if (!data) {
        if (this.$refs.queryList) {
          this.$refs.queryList.clearShow()
        }
        return
      }
      const item = {
        itemDatas: data.t_pipe.records[0],
        columns: data.t_pipe.layer.fieldAliases
      }
      this.$refs.queryList.signFeature(item)
    },
    changeMapType(value, index) {
      this.toggleMapType(index)
    }
  },
  watch: {
    map: {
      handler() {
        this.initOverlay()
      }
    },
    isFullScreen: {
      handler(n, o) {
        console.log(n, 555)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
.ol-popup {
  opacity: 0;
  position: absolute;
  background-color: white;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  bottom: 12px;
  left: -128px;
  width: 256px;
  box-sizing: border-box;
  padding-bottom: 4px;
  h1 {
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    font-weight: 500;
    margin: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    padding-left: 16px;
  }
  p {
    display: flex;
    margin: 0;
    padding: 4px;
    span {
      width: 80px;
      text-align: right;
      font-size: 12px;
      color: #8c8c8c;
    }
    b {
      padding-left: 16px;
      font-size: 12px;
      color: #262626;
      font-weight: 400;
      width: calc(100% - 80px);
      word-break: break-word;
    }
  }
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 5px;
  left: 128px;
  margin-left: -5px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 5px;
  left: 128px;
  margin-left: -5px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 6px;
  right: 10px;
  font-size: 12px;
}
.ol-popup-closer:active {
  color: #3171f2;
}
</style>
