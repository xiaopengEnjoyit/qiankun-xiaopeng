export default {
  data() {
    return {
      featuresDraw: null,
      select: null,
      modify: null,
      activeCoordinate: null, //公共变量存新增或者修改对象坐标
      drawendFeature: null,
      polygonSphere: null
    }
  },
  mounted() {
    // this.initLayers()
  },
  methods: {
    /**
     * @auther your name
     * @time 2021-10-20
     * @description:
     * @param {
     *  Point:点
     *  LineString:线
     *  Polygon:面
     *  Circle：园
     * }
     * @return {*}
     * @example
     */
    initDraw(type, actionName, endDraw) {
      this.removeInteraction(['draw', 'select', 'snap'])
      this.eventBus.$off(actionName)
      this.activeCoordinate = null

      if (['Box'].includes(type)) {
        // console.log('BoxBoxBox')
        this.featuresDraw = new this.Draw({
          source: this.layer.getSource(),
          type: 'Circle',
          geometryFunction: this.createBox()
        })
      } else {
        this.featuresDraw = new this.Draw({
          source: this.layer.getSource(),
          type: type
        })
      }

      this.map.addInteraction(this.featuresDraw)
      this.featuresDraw.on('drawstart', evt => {
        this.removeBeforeFeature(this.drawendFeature)
      })
      this.featuresDraw.on('drawend', evt => {
        // console.log('drawend', evt)
        this.drawendFeature = evt.feature
        const coordinate = evt.feature.getGeometry().getCoordinates()
        let transCoordinate
        if (type === 'Point') {
          transCoordinate = this.transform(coordinate, 'EPSG:3857', 'EPSG:4326')
        } else if (type === 'Circle') {
          let center = evt.feature.getGeometry().getCenter()
          let transCenter = this.transform(center, 'EPSG:3857', 'EPSG:4326')
          let radius = evt.feature.getGeometry().getRadius()
          transCoordinate = {
            center: transCenter,
            radius
          }
          //  const flatCoordinates = evt.feature.getGeometry().flatCoordinates
          //   transCoordinate = this.transform(flatCoordinates, 'EPSG:3857', 'EPSG:4326')
          //   console.log(evt.feature.getGeometry().getCenter(),evt.feature.getGeometry().getRadius())
        } else {
          const arr = coordinate[0]
          transCoordinate = [[]]
          arr.forEach(item => {
            transCoordinate[0].push(this.transform(item, 'EPSG:3857', 'EPSG:4326'))
          })
        }
        this.activeCoordinate = transCoordinate
        if (actionName) {
          this.eventBus.$emit(actionName, this.activeCoordinate, this.drawendFeature)
        }
        if (!endDraw) this.removeInteraction(['draw', 'select', 'snap'])
      })

      // this.featuresSnap = new this.Snap({ source: source })
      // this.map.addInteraction(this.featuresSnap)
    },
    // 编辑(编辑区域)
    editDraw() {
      if (!this.drawendFeature) {
        this.initDraw('Polygon', 'drawEnd')
        return false
      }
      this.drawendFeature.setStyle(
        new this.Style({
          stroke: new this.Stroke({
            color: 'red',
            width: 3
          }),
          fill: new this.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
          })
        })
      )
      this.modifyDraw = new this.Modify({
        features: new this.Collection([this.drawendFeature]),
        insertVertexCondition: () => {
          return true
        }
      })
      this.map.addInteraction(this.modifyDraw)
    },
    // 保存（返回框选区域的坐标集合和区域面积）
    saveBounds() {
      if (this.drawendFeature) {
        const coordinate = this.drawendFeature.getGeometry().getCoordinates()
        let transCoordinate = [[]]
        coordinate[0].forEach(item => {
          transCoordinate[0].push(this.transform(item, 'EPSG:3857', 'EPSG:4326'))
        })
        const polygonSphere = this.areaCalculation(this.drawendFeature.getGeometry(), { projection: 'EPSG:4326' }) // 区域面积
        return {
          transCoordinate: transCoordinate,
          polygonSphere: polygonSphere
        }
      } else {
        return {
          transCoordinate: '',
          polygonSphere: ''
        }
      }
    },
    // 删除(删除区域)
    removeDraw() {
      this.layer.getSource().removeFeature(this.drawendFeature)
      this.drawendFeature = null
    },
    // 清除前面绘制的feature类
    removeFeatureType(type) {
      const features = this.layer.getSource().getFeatures()
      if (type === 'Box') type = 'Polygon'
      features.forEach(fea => {
        const featureType = fea.getGeometry().getType()
        if (type === featureType) {
          this.layer.getSource().removeFeature(fea)
        }
      })
    },

    // 激活关闭绘制事件
    setDrawActive(active) {
      this.featuresDraw.setActive(active)
    },
    // 初始化选择修改实例
    initSelect(type) {
      this.removeInteraction(['draw', 'select', 'snap'])
      this.activeCoordinate = null
      this.select = new this.Select()
      this.map.addInteraction(this.select)

      // 添加选择监听事件判断选择对象的类型
      this.select.on('select', evt => {
        const selectedFeature = evt.selected[0]
        // console.log('select', evt)
        if (evt.selected[0]) {
          if (type !== selectedFeature.getGeometry().getType()) {
            evt.target.setActive(false)
            setTimeout(() => {
              evt.target.setActive(true)
            }, 100)
          }
        }
      })

      this.modify = new this.Modify({
        features: this.select.getFeatures()
      })
      this.map.addInteraction(this.modify)
      this.setSelectEvents()
      // 监听修改完成回调事件
      this.modify.on('modifyend', evt => {
        const coordinate = evt.features
          .getArray()[0]
          .getGeometry()
          .getCoordinates()

        this.activeCoordinate = this.transformCoordinate(type, coordinate, ['EPSG:3857', 'EPSG:4326'])
      })
    },
    // 初始化修改事件
    initModify(selectedFeatures, callBack) {
      this.modify = new this.Modify({
        features: selectedFeatures
      })
      this.map.addInteraction(this.modify)
      // 监听修改完成回调事件
      this.modify.on('modifyend', evt => {
        const coordinate = evt.features
          .getArray()[0]
          .getGeometry()
          .getCoordinates()

        const activeCoordinate = this.transformCoordinate('Polygon', coordinate, ['EPSG:3857', 'EPSG:4326'])
        callBack(activeCoordinate)
      })
    },
    // 选择图层数据
    selectFeature(callBack, config) {
      this.removeInteraction(['draw', 'select', 'snap'])
      this.select = new this.Select({
        style: new this.Style({
          fill: new this.Fill({
            color: 'rgba(49,113,242,0.40)'
          }),
          stroke: new this.Stroke({
            color: '#3171f2',
            width: 2
          }),
          image: new this.styleCircle({
            radius: 7,
            scale: 1.05,
            fill: new this.Fill({
              color: 'red'
            })
            // stroke: new this.Stroke({
            //   color: 'white',
            //   width: 2
            // })
          })
        })
      })
      this.map.addInteraction(this.select)
      this.select.on('select', evt => {
        // console.log('select', evt.target)
        const selectedFeature = evt.selected[0]
        callBack(selectedFeature)
      })
      return this.select
    },
    /**
     * @auther your name
     * @time 2021-10-20
     * @description:4326坐标和3857坐标相互转换
     * @param {
     *  type：类型（Point,Polygon等）
     *  coordinate：被转坐标
     *  ruleArr：转换规则['EPSG:3857','EPSG:4326']第一种坐标转成第二种
     * }
     * @return {*}
     * @example
     */
    transformCoordinate(type, coordinate, ruleArr) {
      let transCoordinate
      if (type === 'Point') {
        transCoordinate = this.transform(coordinate, ruleArr[0], ruleArr[1])
      } else if (type === 'Polygon') {
        const arr = coordinate[0]
        transCoordinate = [[]]
        arr.forEach(item => {
          transCoordinate[0].push(this.transform(item, ruleArr[0], ruleArr[1]))
        })
      } else {
        const arr = coordinate
        transCoordinate = []
        arr.forEach(item => {
          transCoordinate.push(this.transform(item, ruleArr[0], ruleArr[1]))
        })
      }
      return transCoordinate
    },
    //添加选择事件
    setSelectEvents() {
      const selectedFeatures = this.select.getFeatures()
      this.select.on('change:active', () => {
        selectedFeatures.forEach(function(each) {
          selectedFeatures.remove(each)
        })
      })
    },
    // 激活关闭选择事件
    setSelectActive(active) {
      this.select.setActive(active)
      this.modify.setActive(active)
    },
    // 添加features,
    addFeatures(type, coordinates, fitFeature, r) {
      // this.removeFeatureType(type)
      if (type !== 'Circle') {
        const transCoo = this.transformCoordinate(type, coordinates, ['EPSG:4326', 'EPSG:3857'])
        const feature = new this.Feature({
          geometry: new this[type](transCoo)
        })
        this.layer.getSource().addFeature(feature)
        this.drawendFeature = feature
        // 是否铺满整个可视屏幕
        if (fitFeature) {
          this.fitFeature(feature)
        }
        return feature
      } else {
        // console.log(type)
        const coor = this.transformCoordinate('Point', coordinates, ['EPSG:4326', 'EPSG:3857'])
        // console.log(coor)
        const circleFeature = new this.Feature({
          geometry: new this[type](coor, r)
        })
        // console.log(circleFeature)
        this.layer.getSource().addFeature(circleFeature)
        return circleFeature
      }
    },
    removeBeforeFeature(feature) {
      if (!feature) {
        return
      }
      this.layer.getSource().removeFeature(feature)
    },
    // 清除图层绘制所有的feature
    removeAllFeatures() {
      const features = this.layer.getSource().getFeatures()
      features.forEach(fea => {
        this.layer.getSource().removeFeature(fea)
      })
    },
    initSnap() {
      this.featuresSnap = new this.Snap({
        source: this.layer.getSource()
      })
      this.map.addInteraction(this.featuresSnap)
    },
    /**
     * @auther your name
     * @time 2021-10-20
     * @description:移除事件类实例
     * @param {
     * 移除实例类型
     * draw：移除绘制实例
     * select：移除选择修改事件
     * snap： 移除snap事件
     * }
     * @return {*}
     * @example ['draw','select','snap']
     */
    removeInteraction(list) {
      if (list.includes('draw')) {
        if (this.featuresDraw) {
          this.map.removeInteraction(this.featuresDraw)
          this.featuresDraw = null
        }
      }
      if (list.includes('select')) {
        if (this.select) {
          this.map.removeInteraction(this.select)
          this.select = null
        }
        if (this.modify) {
          this.map.removeInteraction(this.modify)
          this.modify = null
        }
      }
      if (list.includes('snap')) {
        if (this.featuresSnap) {
          this.map.removeInteraction(this.featuresSnap)
          this.featuresSnap = null
        }
      }
    },
    // 元素定位
    fitFeature(feature, zoom) {
      let $feature = feature
      // 判断传入的是不是坐标
      if (feature.constructor === Array) {
        $feature = new this.Feature({
          geometry: new this.Point(feature)
        })
      }
      const geometry = $feature.getGeometry()
      const view = this.map.getView()
      const tempSize = this.map.getSize()
      view.fit(geometry, {
        size: [tempSize[0], tempSize[1]]
      })
      if (zoom) {
        view.setZoom(zoom)
      }
    },
    // 区域面积
    areaCalculation(polygon, projection) {
      const area = this.getArea(polygon, projection)
      let output = Math.round(area) / 100000000
      // console.log(output)
      return output
    },
    // 获取区域中心点坐标
    getPolygonCenter(coordinates) {
      const extent = this.Extent.boundingExtent(coordinates[0])
      return this.Extent.getCenter(extent)
    }
  }
}
