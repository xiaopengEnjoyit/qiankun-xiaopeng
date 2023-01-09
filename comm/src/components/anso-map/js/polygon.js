/* eslint-disable */
import { Map, View } from 'ol'
import * as Extent from 'ol/extent'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { defaults as Defaults } from 'ol/control'
import { Point, Polygon } from 'ol/geom'
import { debounce, map } from 'lodash'
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

/*
创建面图层
*/
export const addPolygonLayer = (map, mapLayer) => {
  // 实例化一个矢量图层作为绘制层
  // const A = new VectorLayer({
  //   source: new SourceLayer({
  //     features: [
  //       new Feature({
  //         geometry: new Polygon()
  //       })
  //     ]
  //   })
  // })
  if (!map) return
  for (let i in mapLayer) {
    let source = new SourceLayer({
      features: []
    })
    this[i] = new VectorLayer(source)
    map.addLayer(this[i])
    if (mapLayer[i].data) {
      switch (mapLayer[i].type) {
        case 'polygon':
          addPolygonFeatures(this[i].getSource(), mapLayer[i].data)
          break
      }
    }
  }
}
function addPolygonFeatures(gl, mapData) {
  if (!gl) return
  gl.clear()
  let polygons = []
  for (let i in mapData) {
    if (mapData[i].rings == null || mapData[i].rings === '') continue
    let points = mapData[i].rings
    let obj = {
      geometry: new Polygon([points])
    }
    polygons.push(new Feature(obj))
  }
  gl.addFeatures(polygons)
}
