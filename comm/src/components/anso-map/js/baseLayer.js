import https from '../api/index'
/**
 * 获取底图
 * @param {} params
 */
export const getLayerBase = params => {
  return https.layerBase(params)
}

/**
 * 获取图层数据
 * @param {} params
 */
export const getMapLayer = params => {
  return https.mapLayer(params)
}
