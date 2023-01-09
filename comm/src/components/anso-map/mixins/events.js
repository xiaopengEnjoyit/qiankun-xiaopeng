export default {
  data() {
    return {
      pointFeature: null,
      drawStatus: null,
      source: null,
      layer: null,
      pointPng: require('../img/point.png')
    }
  },
  mounted() {},
  methods: {
    mixinstool() {
      const mapExtent = this.map.getView().calculateExtent(this.map.getSize())
      const map_center = this.Extent.getCenter(mapExtent)
      const lnglat = this.fromLonLat(map_center, 'EPSG:4326', 'EPSG:3857')
      // console.log(map_center, lnglat)
      this.getPan(false)
    },
    /**
     * @auther your name
     * @time 2021-10-20
     * @description:
     * @param {true表示可以拖动底图， false表示不可以拖动底图}
     * @return {*}
     * @example
     */
    getPan(val) {
      let pan = null
      this.map.getInteractions().forEach(element => {
        if (element instanceof this.DragPan) {
          pan = element
        }
      })
      pan.setActive(val)
    },

    /**
     * @auther your name
     * @time 2021-10-20
     * @description:
     * @param {
     *  singleclick:左键单击事件
     *  dblclick:鼠标左键双击事件
     *  click:鼠标点击事件
     *  pointermove:鼠标移动事件
     *  pointerdrag:标拖拽事件
     *  moveend:移动事件
     * }
     * @return {*}
     * @example
     */

    // 创建点feature
    createPoint(point) {
      const markerPoint = new this.Feature({
        geometry: new this.Point(point),
        name: 'Null Island',
        population: 4000,
        rainfall: 500
      })
      const iconStyle = new this.Style({
        image: new this.Icon({
          anchor: [0.5, 1],
          scale: 0.15,
          src: this.pointPng
        })
      })
      markerPoint.setStyle(iconStyle)
      return markerPoint
    },
    // 图层上添加点feature
    drawPoint(pointlnglat) {
      this.clearPoint()
      this.pointFeature = this.createPoint(pointlnglat)
      this.layer.getSource().addFeature(this.pointFeature)
    },
    // 清除绘制点
    clearPoint() {
      this.layer.getSource().removeFeature(this.pointFeature)
      this.pointFeature = null
    },
    // 地图点击事件
    mapClick(evt) {
      const pointlnglat = evt.coordinate
      if (this.drawStatus === 'drawPoint') {
        this.drawPoint(pointlnglat)
        this.$emit('getPointLngLat', pointlnglat)
      }
    },
    // 地图拖拽事件
    mapPointerdrag(evt) {
      console.log('mapPointerdrag')
    }
  }
}
