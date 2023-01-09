/* eslint-disable */
import { Map, View } from 'ol'
import * as Extent from 'ol/extent'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { defaults as Defaults } from 'ol/control'
import { Point, Polygon } from 'ol/geom'
import { debounce } from 'lodash'
import ResizeSensor from 'css-element-queries/src/ResizeSensor'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as SourceLayer } from 'ol/source'
import Feature from 'ol/Feature'
import { Icon, Style, Fill, Stroke, Circle } from 'ol/style'
import DragPan from 'ol/interaction/DragPan'
import { Draw, Modify, Select, Snap } from 'ol/interaction'
import { createBox } from 'ol/interaction/Draw'
import WKT from 'terraformer-wkt-parser'
import { WKT as olWKT } from 'ol/format'
import { transform, fromLonLat, toLonLat } from 'ol/proj'
import Overlay from 'ol/Overlay'
import { toStringHDMS } from 'ol/coordinate'
import $ from 'jquery'
import TileWMS from 'ol/source/TileWMS'
import TileArcGISRest from 'ol/source/TileArcGISRest'
import { get as getProjection } from 'ol/proj'
import { getTopLeft, getWidth } from 'ol/extent'
import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'

import { Message } from 'element-ui'
import { getLayerBase, getMapLayer } from '../js/baseLayer'
import { mapData, pipeData } from '../api/data'

/**
 * 设置点图标
 * @param {
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'data/icon.png',
        }config
 * @param {*} feature
 */
export const setIcon = (config, feature) => {
  const iconStyle = new Style({
    image: new Icon(config)
  })
  feature.setStyle(iconStyle)
}

/**
 * 设置线样式
 * @param {
            color: 'red',
            width: 3
          }config
 * @param {*} feature
 */
export const setLineStyle = (config, feature) => {
  const lineStyle = new Style({
    stroke: new Stroke(config)
  })
  feature.setStyle(lineStyle)
}

/**
 * 设置区域样式
 * @param config
 * {
    line:{color: 'red', width: 3},
    fill:{color: 'rgba(0, 0, 255, 0.1)'}
    }
 * @param {*} feature
 */
export const setPolygonStyle = (config, feature) => {
  feature.setStyle(
    new Style({
      stroke: new Stroke(config.line),
      fill: new Fill(config.fill)
    })
  )
}


export const createPopup = (map, lnglat) => {
  /**
   * 组成弹出窗口的元素。
   */
  const container = document.getElementById('popup')
  container.style.opacity = 1
  const content = document.getElementById('popup-content')
  const closer = document.getElementById('popup-closer')
  /**
   * 创建一个覆盖来锚定弹出到地图。
   */
  const overlay = new Overlay({
    element: container,
    autoPan: true,
    offset: [0, -45],
    autoPanAnimation: {
      duration: 250
    }
  })
  map.addOverlay(overlay)
  /**
   * 添加一个单击处理程序来隐藏弹出窗口。
   * @return {boolean} 不要跟随href
   */
  closer.onclick = function() {
    overlay.setPosition(undefined)
    closer.blur()
    return false
  }

  /**
   * 向地图添加一个单击处理程序以呈现弹出窗口。
   */
  // map.on('singleclick', clickEvent)

  // function clickEvent(evt) {
  //   const coordinate = evt.coordinate
  //   console.log('coordinate', coordinate)
  //   showOverlay(overlay, content, coordinate)
  // }

  return {
    overlay,
    content
  }
}

/**
 * 根据坐标展示overlay
 * @param {*} overlay
 * @param {*} content
 * @param {*} lnglat
 */
export const showOverlay = (overlay, lnglat) => {
  overlay.setPosition(lnglat)
}

/**
 * 移除添加的overlay
 * @param {} map
 * @param {*} overlay
 */
export const removeOverlay = (map, overlay) => {
  map.removeOverlay(overlay)
}

/**
 * 移除指定feature
 * @param {} map
 * @param {*} overlay
 */
export const removeFeature = (layer, fea) => {
  layer.getSource().removeFeature(fea)
}

// 拼接底图方法
export const initMapDatas = async () => {
  // 获取当前项目底图数据
  let mapInfo, message
  const baseDatas = await getLayerBase()
  if (baseDatas.code === 200) {
    mapInfo = baseDatas.data
    message = baseDatas.message
    // console.log(baseDatas.code, mapInfo, message, 66666)
  } else {
    // alert('获取服务端基础图层数据配置失败，使用本地静态数据')
    mapInfo = mapData
  }

  let layer
  let remark
  let center
  let projection
  const layers = []
  let lastlayer = null
  for (const item of mapInfo) {
    item.remark = JSON.parse(item.configJson)
    remark = item.remark
    // 拼接地图url
    const urls = []
    // const url = remark.url.header[0] + remark.url.url
    for (let i in remark.urls) {
      let itemUrl = remark.urls[i]
      urls.push(itemUrl)
    }

    // console.log(urls, remark.source, item.code)

    if (remark.source === 'XYZ') {
      layer = new XYZ({
        maxZoom: remark.maxNativeZoom,
        configType: item.configType,
        urls
      })

      if (item.code === 'TianDiTu_Streets') {
        lastlayer = new TileLayer({
          source: layer,
          configType: item.configType,
          code: item.code
        })
      } else {
        layers.push(
          new TileLayer({
            source: layer,
            configType: item.configType,
            code: item.code
          })
        )
      }
    }
  }
  lastlayer && layers.push(lastlayer)
  const latlag = [Math.round(remark.center[0]*1000000)/1000000]
  // console.log(remark.center,latlag, 89898)
  // 转换中心点坐标
  if (remark.projection === 'EPSG:4326') {
    const latlag = [Math.round(remark.center[0]*1000000)/1000000,Math.round(remark.center[1]*1000000)/1000000]
    center = transform(latlag, 'EPSG:4326', 'EPSG:3857') //清远
    projection = 'EPSG:3857'
  } else {
    center = remark.center
    projection = 'EPSG:3857'
  }

  // 配置地图参数
  const viewOptions = {
    projection: projection,
    center: center,
    zoom: remark.zoom,
    minZoom: remark.minZoom,
    maxZoom: remark.maxZoom
  }
  return {
    layers,
    viewOptions
  }
}

// 添加图层方法
export const getPipe2Map = async _map => {
  let layerArr, message
  const pipeDatas = await getMapLayer()
  if (pipeDatas.code === 200 && pipeDatas.data.length !== 0) {
    layerArr = pipeDatas.data
    message = pipeDatas.message
    // console.log('getPipe2Map', pipeDatas.code, layerArr, message)
  } else {
    // alert('获取服务端管网图层数据配置失败，使用本地静态数据')
    layerArr = pipeData
  }
  let myurl
  //声明一个图层
  let tileLayer
  let tileLayerArr = []
  for (let i of layerArr) {
    i.remark = JSON.parse(i.configJson)
    let remark = i.remark
    myurl = remark.url
    // TileWMS  TileArcGISRest
    if (i.configType === 'GsLayer') {
      tileLayer = new TileLayer({
        layerId: remark.layer, //图层ID，非必须
        layerName: remark.layerName, //图层ID，非必须
        visible: true, //图层是否可见，默认为可见
        opacity: remark.opacity, //图层透明度，默认为1
        // extent: [-180, -90, 180, 90],//图层显示的范围，可省略
        source: new TileWMS({
          //声明一个数据源，OpenLayers使用TileWMS接口来加载WMS服务
          url: myurl, //地图服务地址:'http://localhost:8080/geoserver/gwc/service/wms'
          params: {
            LAYERS: [remark.layer],
            TILED: true,
            // LAYERS: remark.layer, //图层名称如：'tasmania'
            VERSION: remark.version //版本如：'1.1.1'
          }
        })
      })
    } else if (i.configType === 'wmts') {
      const projection = getProjection(remark.projection)
      const projectionExtent = projection.getExtent()
      const size = getWidth(projectionExtent) / remark.tileSize
      const resolutions = new Array(remark.matrixSize)
      const matrixIds = new Array(remark.matrixSize)
      for (let z = 0; z < remark.matrixSize; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        resolutions[z] = size / Math.pow(2, z)
        matrixIds[z] = z
      }
      tileLayer = new TileLayer({
        layerId: remark.layer, //图层ID，非必须
        layerName: remark.layerName, //图层ID，非必须
        visible: true, //图层是否可见，默认为可见
        opacity: remark.opacity, //图层透明度，默认为1
        source: new WMTS({
          url: myurl,
          layer: remark.layer,
          matrixSet: remark.matrixSet,
          format: remark.format,
          projection: projection,
          tileGrid: new WMTSTileGrid({
            origin: Extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
          }),
          style: 'default',
          wrapX: true
        })
      })
      let obj = {
        layerId: remark.layer, //图层ID，非必须
        layerName: remark.layerName, //图层ID，非必须
        visible: true, //图层是否可见，默认为可见
        opacity: remark.opacity, //图层透明度，默认为1
        source: {
          url: myurl,
          layer: remark.layer,
          matrixSet: remark.matrixSet,
          format: remark.format,
          projection: projection,
          tileGrid: {
            origin: Extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
          },
          style: 'default',
          wrapX: true
        }
      }
    } else if (remark.source === 'TileArcGISRest') {
      tileLayer = new TileLayer({
        visible: true, //图层是否可见，默认为可见
        opacity: remark.opacity, //图层透明度，默认为1
        source: new TileArcGISRest({
          url: myurl
        })
      })
    } else if (remark.source === 'XYZ') {
      tileLayer = new TileLayer({
        visible: true, //图层是否可见，默认为可见
        code: i.code,
        opacity: remark.opacity, //图层透明度，默认为1
        source: new XYZ({
          url: myurl
        })
      })
    }

    _map.addLayer(tileLayer) //将图层加入到地图容器中
    // if(i.code !== 'label'){
    tileLayerArr.push(tileLayer)
    // }
  }
  return tileLayerArr
}
