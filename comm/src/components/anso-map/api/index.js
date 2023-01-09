import { http } from 'comm/src/utils'
export default {
  search: params => http.get('/api/pipecenter/search', params), //模糊查询全部图层接口
  searchIndex: (index, params) => http.get(`/api/pipecenter/search/${index}`, params), //模糊查询单个图层接口
  searchIntersects: params => http.get('/api/pipecenter/search/intersects', params), //空间点，拉框（长方形），多边形查询全部图层接口
  searchPoint: params => http.get('/api/pipecenter/search/identify', params), //空间点，拉框（长方形），多边形查询全部图层接口
  searchPointIndex: (index, params) => http.get(`/api/pipecenter/search/identify/${index}`, params), //空间点，拉框（长方形），多边形查询全部图层接口
  searchIntersectsIndex: (index, params) => http.get(`/api/pipecenter/search/intersects/${index}`, params), //空间点，拉框（长方形），多边形单个图层接口
  layerBase: params => http.get('/api/pipecenter/map/layer/base', params), //获取基础底图
  mapLayer: params => http.get('/api/pipecenter/map/layer', params), // 获取图层
  fileIcon: params => http.get('/api/pipecenter/file/icon', params) // 图标处理接口
}
