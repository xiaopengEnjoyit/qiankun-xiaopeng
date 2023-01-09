<template>
  <div class="result" v-show="visible">
    <list v-if="comp === 'list'" :tableData="tableData" @oprate="oprate" @close="close" />
    <detail ref="detail" v-if="comp === 'detail'" :itemDatas="itemDatas" @toList="toList" @showFeature="signFeature" />
  </div>
</template>
<script>
import detail from './detail'
import list from './list'
import { setIcon, setLineStyle, showOverlay, removeOverlay, removeFeature } from '../../js/common'
import https from '../../api'

export default {
  name: 'result',
  components: { detail, list },
  props: ['showDialog', 'tableData', 'overlay', 'content'],
  inject: ['addFeatures', 'transformCoordinate', 'fitFeature'],
  data() {
    return {
      visible: false,
      comp: 'list',
      item: {},
      itemDatas: {},
      keyword: '',
      pointFeature: null,
      lineFeature: null,
      fireHydrant: require('../../img/fire-hydrant.png')
    }
  },
  methods: {
    async oprate(val, item) {
      console.log(this.keyword, 'index')
      this.itemDatas = item.itemDatas
      this.itemDatas.keyword = this.keyword
      this.comp = val
    },
    signFeature({ itemDatas, columns }) {
      console.log(itemDatas, columns)
      if (itemDatas.geometry.type === 'Point') {
        this.showPoint(itemDatas, columns)
      } else {
        this.showLine(itemDatas, columns)
      }
    },
    showPoint(itemDatas, columns) {
      const nowZoom = this.$parent.map.getView().getZoom()
      const layerIcon = this.$refs.detail.layerIcon
      console.log(itemDatas, columns, layerIcon)
      if (this.pointFeature) removeFeature(this.$parent.layer, this.pointFeature)
      const point = itemDatas.geometry.coordinates
      const pointFeature = this.addFeatures('Point', point)
      this.pointFeature = pointFeature
      setIcon(
        {
          anchor: [0.5, 32],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: `/api/file/view?fileId=${layerIcon}`
        },
        pointFeature
      )
      const lnglat = this.transformCoordinate('Point', point, ['EPSG:4326', 'EPSG:3857'])

      this.content.innerHTML = columns.reduce((pre, item) => {
        let label = item.label
        let value = itemDatas[item.prop]
        let itemHtml = `<p><span>${label}</span>  <b>${value || '--'}</b></p>`
        return pre + itemHtml
      }, '<h1>设备详情</h1>')
      showOverlay(this.overlay, lnglat)
      this.overlay.setOffset([0, -35])
      this.fitFeature(pointFeature, nowZoom)

      this.$parent.map.on('singleclick', evt => {
        const features = this.$parent.map.forEachFeatureAtPixel(evt.pixel, feature => {
          return feature
        })
        if (features === pointFeature) {
          showOverlay(this.overlay, lnglat)
        }
      })
    },
    showLine(itemDatas, columns) {
      const nowZoom = this.$parent.map.getView().getZoom()
      if (this.lineFeature) removeFeature(this.$parent.layer, this.lineFeature)
      const line = itemDatas.geometry.coordinates
      const lineFeature = this.addFeatures('LineString', line)
      this.lineFeature = lineFeature
      const lnglat = this.transformCoordinate('Point', line[0], ['EPSG:4326', 'EPSG:3857'])
      console.log(this.lineFeature.getStyle(), 898989)
      setLineStyle(
        {
          color: 'red',
          width: 3
        },
        this.lineFeature
      )
      this.content.innerHTML = columns.reduce((pre, item) => {
        let itemHtml = `<p><span>${item.label}</span>  <b>${itemDatas[item.prop] || '--'}</b></p>`
        return pre + itemHtml
      }, '<h1>管段详情</h1>')

      showOverlay(this.overlay, lnglat)
      this.overlay.setOffset([0, 0])
      this.fitFeature(lineFeature, nowZoom)

      this.$parent.map.on('singleclick', evt => {
        const features = this.$parent.map.forEachFeatureAtPixel(evt.pixel, feature => {
          return feature
        })
        if (features === lineFeature) {
          showOverlay(this.overlay, lnglat)
        }
      })
    },
    toList() {
      this.comp = 'list'
      this.clearShow()
    },
    clearShow() {
      this.overlay.setPosition(undefined)
      // 清除当前绘制图形
      removeFeature(this.$parent.layer, this.pointFeature)
      removeFeature(this.$parent.layer, this.lineFeature)
    },
    close() {
      this.visible = false
      this.$emit('update:showDialog', false)
    }
  },
  watch: {
    showDialog(newVal, oldVal) {
      this.visible = newVal
    }
  }
}
</script>
<style lang="scss" scoped></style>
