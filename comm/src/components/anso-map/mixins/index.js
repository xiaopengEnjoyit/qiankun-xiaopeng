import Vue from 'vue'
import 'ol/ol.css'
import { Map, View } from 'ol'
import * as Extent from 'ol/extent'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import Overlay from 'ol/Overlay'

import { defaults as Defaults } from 'ol/control'
import { ScaleLine } from 'ol/control'
import { Point, Polygon, LineString, Circle } from 'ol/geom'
import { debounce } from 'lodash'
import ResizeSensor from 'css-element-queries/src/ResizeSensor'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as SourceLayer } from 'ol/source'
import Feature from 'ol/Feature'
import { Icon, Style, Fill, Stroke, Text, Circle as styleCircle } from 'ol/style'
import DragPan from 'ol/interaction/DragPan'
import { Draw, Modify, Select, Snap } from 'ol/interaction'
import { createBox } from 'ol/interaction/Draw'
import WKT from 'terraformer-wkt-parser'
import { WKT as olWKT } from 'ol/format'
import { transform, fromLonLat } from 'ol/proj'
import * as turf from '@turf/turf'
import { getArea } from 'ol/sphere'
import Collection from 'ol/Collection'

import { getLayerBase, getMapLayer } from '../js/baseLayer'
import { initMapDatas, getPipe2Map } from '../js/common'
export default {
  data() {
    return {
      Extent,
      Overlay,
      fromLonLat,
      transform,
      Point,
      Polygon,
      LineString,
      VectorLayer,
      SourceLayer,
      Feature,
      Style,
      Fill,
      Stroke,
      Text,
      Circle,
      styleCircle,
      Icon,
      DragPan,
      Draw,
      Modify,
      Select,
      Snap,
      turf,
      getArea,
      Collection,
      createBox,
      index: 1,
      layer: null,
      eventBus: new Vue(),
      mapTypeArr: null,
      layerList: [],
      mapLayers: null,
      zoom: 6,
      center: [],
      scaleControl: null // 比例尺
    }
  },
  async mounted() {
    await this.init()
    // 客户端才加载官网
    if (this.origin === 'Client') {
      await this.initMapLayers()
    }
    this.addMapLayer()
    this.autoUpdateMap()
  },
  methods: {
    // 监听自动调整地图
    autoUpdateMap() {
      this.map.updateSize()
      /* eslint-disable no-new */
      new ResizeSensor(
        this.$refs.map,
        debounce(() => {
          if (!this.map) return
          this.map.updateSize()
        }, 100)
      )
    },
    //初始化地图
    async init() {
      const { layers, viewOptions } = await initMapDatas()
      // console.log(layers, viewOptions, 7777)
      this.mapTypeArr = layers
      this.toggleMapType(0)
      this.map = new Map({
        // layers: [
        //   new TileLayer({
        //     source: new XYZ({
        //       url: 'https://t1.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=9b782e043fe4308c10fd69d97b10ae43',
        //       crossOrigin: ''
        //     })
        //   }),
        //   new TileLayer({
        //     source: new XYZ({
        //       url: 'https://t1.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=d629ab984327ce85ae0311f4b7a35786',
        //       crossOrigin: ''
        //     })
        //   })
        // ],
        layers: layers,
        target: this.mapId,
        controls: new Defaults({
          zoom: false,
          rotate: false
        }),
        // view: new View({
        //   projection: 'EPSG:3857',
        //   center: [11668690.448153649, 3627837.7278662794],
        //   zoom: 5
        // })
        view: new View(viewOptions)
      })
      // 添加比例尺(默认显示比例尺，创建实例方便外部操作隐藏)
      this.scaleControl = new ScaleLine({ units: 'metric' })
      this.map.addControl(this.scaleControl)
      this.center = this.centerConfig.center || viewOptions.center
      this.zoom = this.centerConfig.zoom || viewOptions.zoom
      this.fitFeature(this.center, this.zoom)
      // this.getResolution()
    },
    getResolution() {
      // 监听分辨率变化，通过dpi和像素关系（比例尺=dpi/0.0254*分辨率）输出比例尺
      this.map.getView().on('change:resolution', () => {
        // console.log('getResolution', this.map.getView().getResolution())
      })
    },

    async initMapLayers() {
      this.mapLayers = await getPipe2Map(this.map)
      this.layerList = this.mapLayers.map(layer => {
        layer.values_.visible = false // 默认不显示
        return { text: layer.values_.layerName, value: layer.values_.layerId }
      })
      // console.log(this.layerList, this.mapLayers, 55555)
    },
    // 切换卫星图切换
    toggleMapType(index) {
      this.mapTypeArr.forEach((item, i) => {
        if (index === i) {
          item.setVisible(true)
        } else {
          item.setVisible(false)
        }
      })
    },
    //初始化基础图层
    addMapLayer() {
      const source = new this.SourceLayer()
      this.layer = new this.VectorLayer({
        source: source,
        style: new this.Style({
          fill: new this.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new this.Stroke({
            color: '#3171f2',
            width: 2
          }),
          image: new this.styleCircle({
            radius: 7,
            fill: new this.Fill({
              color: '#3171f2'
            })
          })
        })
      })
      this.map.addLayer(this.layer)
      this.$emit('mapSuccess', this.map)
    },
    // 数据库存储格式转数组坐标格式
    WKTgeomString(geom, type) {
      if (!geom) return []
      if (type === 'normal') {
        return WKT.parse(geom).coordinates
      } else {
        return WKT.parse(geom.substring(10)).coordinates
      }
    },
    // 数组坐标格式转数据库存储格式
    olWKTgeomToString(type, geom) {
      const feature = new this.Feature({
        geometry: new this[type](geom)
      })
      const geomString = new olWKT().writeFeature(feature)
      return `SRID=4326;${geomString}`
    }
  }
}
