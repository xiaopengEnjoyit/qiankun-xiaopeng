<template>
  <div class="searchBar">
    <el-button-group class="opterate-bar">
      <el-button
        :class="[optActive === item.value ? 'active' : '', 'bt']"
        type="text"
        v-for="(item, index) in opterateBarList"
        :key="index"
        @click="optBarClick(item.value)"
      >
        <i
          :class="[
            optActive === item.value && item.activeIcon ? item.activeIcon : item.icon,
            'el-icon--left',
            'icon',
            'iconfont',
            'my-icon-lf'
          ]"
        ></i>
        <span class="bt-text">{{ optActive === item.value && item.backText ? item.backText : item.text }}</span>
        <i
          v-if="item.rtIcon"
          style="font-size: 12px"
          :class="[
            optActive === item.value && item.rtActiveIcon ? item.rtActiveIcon : item.rtIcon,
            'el-icon--left',
            'icon',
            'iconfont',
            'my-icon-rt'
          ]"
        ></i>
      </el-button>
    </el-button-group>

    <el-button-group class="dropdown-menu" v-show="optActive === 'serch'">
      <el-button
        :class="[active === item.value ? 'active' : '', 'dropdown-bt']"
        type="text"
        v-for="(item, index) in barList"
        :key="index"
        @click="barClick(item.value)"
      >
        <i :class="[item.icon, 'el-icon--left', 'icon', 'iconfont']"></i>
        {{ item.text }}
      </el-button>
    </el-button-group>

    <div class="layers-menu" v-show="optActive === 'tuceng'">
      <h1>管网图层</h1>
      <div class="layers-list">
        <div class="layers-item" v-for="(item, index) in layerList" :key="index">
          <span :style="{ color: item.value === layersValue[index] ? '' : '#8C8C8C' }">{{ item.text }}</span>
          <el-switch
            @change="switchChange"
            size="small"
            v-model="layersValue[index]"
            :active-value="item.value"
            inactive-value="0"
          >
          </el-switch>
        </div>
      </div>
    </div>

    <div class="example-menu" v-show="optActive === 'example'">
      <h1>地图图例</h1>
      <p class="example-title">图例</p>
      <div class="example-list">
        <div class="item" v-for="(item, index) in tuliList" :key="index">
          <b class="color-bar" :style="{ background: item.bgColor }"></b>
          <span class="text">{{ item.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import https from '../../api'
import { pointData } from '../../api/data'
export default {
  name: 'searchBar',
  inject: [
    'initDraw',
    'removeInteraction',
    'removeAllFeatures',
    'olWKTgeomToString',
    'addFeatures',
    'transformCoordinate',
    'removeBeforeFeature'
  ],
  props: {
    opterateBarList: {
      type: Array,
      default() {
        return [
          {
            text: '图层',
            icon: 'icon-tuceng',
            value: 'tuceng'
          },
          {
            text: '区域搜索',
            icon: 'icon-quyusousuo',
            activeIcon: 'icon-unfold',
            rtIcon: 'icon-down',
            value: 'serch'
          },
          // {
          //   text: '图例',
          //   icon: 'icon-tuli',
          //   value: 'example'
          // },
          {
            text: '全屏',
            backText: '退出',
            icon: 'icon-quanping',
            activeIcon: 'icon-quxiaoquanping',
            value: 'full'
          }
        ]
      }
    },
    tuliList: {
      type: Array,
      default() {
        return [
          { bgColor: 'red', text: '新增/编辑点线' },
          { bgColor: 'blue', text: '采集前点线' },
          { bgColor: 'green', text: '待巡点点线' },
          { bgColor: 'yellow', text: '待巡点设备' },
          { bgColor: 'pink', text: '待巡点设备' },
          { bgColor: 'orange', text: '异常点线' }
        ]
      }
    },
    layerList: {
      type: Array,
      default() {
        return [
          {
            text: '阀门',
            value: 'famen'
          },
          {
            text: '消防栓',
            value: 'xiaofangshuan'
          },
          {
            text: '水表',
            value: 'shuibiao'
          },
          {
            text: '用水设备连接管道',
            value: 'lianjieguan'
          },
          {
            text: '配件',
            value: 'peijian'
          },
          {
            text: '构筑物',
            value: 'gouzhuwu'
          }
        ]
      }
    },
    barList: {
      type: Array,
      default() {
        return [
          {
            text: '单点搜索',
            icon: 'el-icon-edit',
            value: 'pointSelect'
          },
          {
            text: '矩形区域',
            icon: 'el-icon-edit',
            value: 'boxSelect'
          },
          {
            text: '圆形区域',
            icon: 'el-icon-edit',
            value: 'circleSelect'
          },
          {
            text: '多边形区域',
            icon: 'el-icon-edit',
            value: 'polygonSelect'
          }
        ]
      }
    },
    search: Function,
    eventBus: Object,
    showResult: Function
  },
  data() {
    return {
      name: '',
      active: '',
      optActive: '',
      fullscreen: false,
      drawFeature: null,
      layersValue: []
    }
  },
  mounted() {},
  methods: {
    switchChange() {
      console.log(this.layersValue, 'switchChange')
      this.$emit('toggleMapLayers', this.layersValue)
    },
    initLayersValue() {
      this.layersValue = this.layerList.map(i => {
        if (i.value === 'develop:pipe') {
          return i.value
        }
      })
      this.$emit('toggleMapLayers', this.layersValue)
    },
    optBarClick(val) {
      if (val === 'full') {
        this.handleFullScreen()
      } else if (val === 'mark') {
        this.handleMark()
      }
      if (this.optActive === val) {
        this.optActive = ''
      } else {
        this.optActive = val
      }
      // 工具栏切换到非搜索项时取消操作激活状态
      if (val !== 'serch') {
        this.active = ''
        this.resetDraw()
      }
    },
    barClick(val) {
      this.eventBus.$off('drawEnd')
      this.$parent.$refs.searchInput.value = ''
      this.resetDraw()
      // this.removeAllFeatures()
      if (this.active === val) {
        this.active = ''
      } else {
        this.active = val
        this.activeEvents(val)
        if (val === 'pointSelect') {
          this.initMapClick('on')
        } else {
          this.initMapClick('un')
        }
      }
    },
    //重置区域绘制搜素以及点击搜索
    resetDraw() {
      this.cancelEvent()
      this.initMapClick('un')
    },
    // 初始化和关闭点击监听事件
    initMapClick(type) {
      if (type === 'on') {
        this.$parent.$refs.map.style.cssText = 'cursor:help;'
        this.$parent.map.on('singleclick', this.singleClick)
      } else {
        this.showSinglePoint()
        this.$parent.$refs.map.style.cssText = 'cursor:inherit;'
        this.$parent.map.un('singleclick', this.singleClick)
      }
    },
    async singleClick(evt) {
      let params = {}
      const formatTrans = this.transformCoordinate('Point', evt.coordinate, ['EPSG:3857', 'EPSG:4326'])
      const transGeom = this.olWKTgeomToString('Point', formatTrans)
      params.geom = transGeom
      params.resolution = evt.map.getView().getResolution()
      console.log(params)
      this.startLoading('.map')
      const { code, data } = await https.searchPoint(params)
      // if(code === 200 ){
      //   if(JSON.stringify(data)=== '{}'){
      //    this.$message({ type: 'warning', message: '未查询到数据' })
      //   }else{
      //     this.showSinglePoint(data)
      //   }
      // }
      this.showResult(data, params)
      this.search(data)
      this.closeLoading()
    },
    showSinglePoint(data) {
      this.$emit('showSinglePoint', data)
    },
    activeEvents(val) {
      let type = ''
      // 单点搜索单独抽出来
      if (val === 'pointSelect') {
        type = 'Point'
        this.removeInteraction(['draw'])
        console.log('点击事件')
      } else {
        if (val === 'boxSelect') {
          type = 'Polygon'
          this.initDraw('Box', 'drawEnd')
        }
        //  else if (val === 'pointSelect') {
        //   type = 'Point'
        //   this.initDraw('Point', 'drawEnd')
        // }
        else if (val === 'circleSelect') {
          type = 'Circle'
          this.initDraw('Circle', 'drawEnd')
        } else if (val === 'polygonSelect') {
          type = 'Polygon'
          this.initDraw('Polygon', 'drawEnd')
        }
        this.eventBus.$on('drawEnd', (geom, feature) => {
          let params = {}
          console.log(geom, this.transformCoordinate('Point', geom, ['EPSG:4326', 'EPSG:3857']), 999)
          if (type === 'Circle') {
            const transGeom = this.olWKTgeomToString('Point', geom.center)
            params.geom = transGeom
            params.isCircle = true
            params.radius = geom.radius
          } else {
            const transGeom = this.olWKTgeomToString(type, geom)
            params.geom = transGeom
          }
          console.log(params)
          this.drawFeature = feature
          this.queryPointBox(params)
        })
      }
    },
    async queryPointBox(params) {
      console.log(params)
      this.startLoading('.map')
      const { code, data } = await https.searchIntersects(params)
      console.log(code, data)
      this.showResult(data, params)
      this.search(data)
      this.closeLoading()
    },
    // 关闭绘制激活状态，清除绘制图形
    cancelEvent(val) {
      // this.removeAllFeatures()
      this.removeBeforeFeature(this.drawFeature)
      this.removeInteraction(['draw'])
    },
    // 全屏方法
    handleFullScreen() {
      let element = document.getElementById('app')
      if (this.fullscreen) {
        this.$emit('update:isFullScreen', false)
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        this.$emit('update:isFullScreen', true)
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    // 标记方法
    handleMark() {}
  },
  watch: {
    layerList: {
      handler() {
        this.initLayersValue()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
