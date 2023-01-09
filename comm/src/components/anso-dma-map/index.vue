<template>
  <div class="realTime-monitoring" ref="realTimeOlMap">
    <anso-map
      ref="olMap"
      :mapId="mapId"
      :toolsConfig="toolsConfig"
      :mapConfig="mapConfig"
      @mapSuccess="mapSuccess"
    ></anso-map>
    <!-- 等级区域切换 -->
    <div class="levelList">
      <div
        v-for="(item, index) in LevelOfShaft"
        :key="index"
        class="levelList-item"
        :class="currentLevelName === item.name ? 'curMap' : ''"
        @click="checkLevelOfShaft(item, index)"
      >
        <div class="levelList-item-lable">{{ item.name }}</div>
      </div>
    </div>
    <div class="operation-list" :style="{ top: fullscreen ? '75px' : '10px' }">
      <ul>
        <li>
          <span class="el-icon-full-screen" @click="fullScreen()"></span>
        </li>
      </ul>
    </div>
    <anso-drawer
      ref="ansoDrawer"
      :title="objInfo.objName"
      :size="'large'"
      :customClass="'leakageEvaluation'"
      :isShowFooter="false"
      @cancel="cancelDrawer"
    >
      <leakQueryDetail v-if="ansoDrawer" :objInfo="objInfo" :orgTypeId="orgTypeId"> </leakQueryDetail>
    </anso-drawer>
  </div>
</template>

<script>
import ansoMap from 'comm/src/components/anso-map'
import leakQueryDetail from 'comm/src/components/anso-lowCode-systemView/systemView-dmaOperate/dialogCommView/leakQueryDetail'
import ansoDrawer from 'comm/src/components/anso-drawer'
import { addPolygonFeatures, addPolygonFeatureNames } from 'comm/src/utils/map.js'
import commStore from 'comm/src/store'
import { GET_USER_INFOS_KEY } from 'comm/src/config'
import { notDefinedDeal, fontSizeColor, guid } from 'comm/src/utils/utils.js'
import { getYMDHMSDate } from 'comm/src/utils/date.js'
import { pipeMapDetail, monitorPipeMap } from 'comm/src/services'
import { showOverlay } from 'comm/src/components/anso-map/js/common'

export default {
  name: 'ansoDmaMap',
  components: { ansoMap, ansoDrawer, leakQueryDetail },
  props: {
    mapId: {
      type: String,
      default: guid()
    }
  },
  data() {
    return {
      comConfig: {
        wd: 715,
        ht: 384,
        text: ''
      },
      isAdmin: commStore.getters[`${GET_USER_INFOS_KEY}/isAdmin`],
      toolsConfig: {
        showInput: false,
        showBar: false,
        showResult: false,
        showPopup: true,
        showLayerCards: true
      },
      mapConfig: {
        searchInput: {
          search: val => {
            console.log(val)
            this.getDatas(val)
          }
        },
        opterateBarList: {
          list: [
            {
              text: '图层',
              icon: 'icon-tuceng',
              value: 'tuceng'
            },
            {
              text: '区域搜索',
              icon: 'icon-quyusousuo',
              rtActiveIcon: 'icon-unfold',
              rtIcon: 'icon-put-away',
              value: 'serch'
            }
            // {
            //   text: '全屏',
            //   icon: 'icon-quanping',
            //   activeIcon: 'icon-quxiaoquanping',
            //   value: 'full'
            // }
          ]
        },
        searchBar: {
          barList: [
            {
              text: '单点搜索',
              icon: 'icon-dandianxuanze',
              value: 'pointSelect'
            },
            {
              text: '矩形区域',
              icon: 'icon-juxingquyu',
              value: 'boxSelect'
            },
            {
              text: '圆形区域',
              icon: 'icon-yuanxingquyu',
              value: 'circleSelect'
            },
            {
              text: '多边形区域',
              icon: 'icon-duobianxingquyu',
              value: 'polygonSelect'
            }
          ],
          search: val => {
            this.getDatas(val)
          }
        }
      },
      LevelOfShaft: [],
      currentLevelName: 'DMA',
      currentLevelIndex: null,
      currentLevelValue: [],
      fullscreen: false,
      objInfo: {},
      ansoDrawer: false,
      orgTypeId: '',
      Overlays: []
    }
  },
  created() {},
  mounted() {
    // this.getPipeMapData()
    let _vn = this
    document.addEventListener('fullscreenchange', function (event) {
      if (document.fullscreenElement) {
        console.log('进入全屏')
        _vn.fullscreen = true
      } else {
        console.log('退出全屏')
        _vn.fullscreen = false
      }
    })
  },
  methods: {
    // 加载地图成功
    mapSuccess() {
      // 获取官网等级信息集合
      const ref = this.$refs.olMap
      ref.map.removeControl(ref.scaleControl)
      this.initMapEvent()
      this.getPipeMapData()
    },
    getDatas(val) {
      console.log(val, 6666)
    },
    // 点击事件
    initMapEvent() {
      const ref = this.$refs.olMap
      ref.map.on('click', e => {
        showOverlay(ref.overlay, undefined)
        ref.map.forEachFeatureAtPixel(e.pixel, async feature => {
          const geoExt = feature.getGeometry().extent_
          const coordinate = [(geoExt[0] + geoExt[2]) / 2, (geoExt[1] + geoExt[3]) / 2]
          this.setPolygonContent(coordinate, feature)
        })
      })
      // ref.map.on('dblclick', e => {
      //   ref.map.forEachFeatureAtPixel(e.pixel, async feature => {
      //     this.dmaDetail(feature)
      //   })
      // })
    },
    // 区域弹窗详情
    async setPolygonContent(coordinate, feature) {
      this.feature = feature
      let featureData = feature.get('data')
      const ref = this.$refs.olMap
      let info = []
      this.orgTypeId = featureData.orgTypeId
      const params = {
        objId: featureData.objId,
        objType: featureData.objType,
        orgTypeId: this.orgTypeId
      }
      let { code, data } = await pipeMapDetail(params)
      if (code === 200) {
        switch (data.objType) {
          case 3:
          case 4:
            info.push('<div class="infoWindow-title">')
            info.push(`<div class="title-name">${data.objName}</div>`)
            info.push('<div class="el-icon-arrow-right" id="closeWiindow"></div>')
            info.push('</div>')
            info.push('<div class="infoWindow-info">')
            info.push('<div class="info-item">')
            info.push('<span>最小流量(m³/h)</span>')
            info.push(`<span style="
                  color: ${fontSizeColor(data.minimumFlowWarnLevel)};font-size:16px
                ">${notDefinedDeal(data.minimumFlow)}</span>`)
            info.push('</div>')

            info.push('<div class="info-item">')
            info.push('<span>供水量(m³)</span>')
            info.push(`<span>${notDefinedDeal(data.supplyingWater)}</span>`)
            info.push('</div>')

            info.push('<div class="info-item">')
            info.push('<span>用水量(m³)</span>')
            info.push(`<span>${notDefinedDeal(data.userWater)}</span>`)
            info.push('</div>')

            info.push('<div class="info-item">')
            info.push('<span>总分差水量(m³)</span>')
            info.push(`<span>${notDefinedDeal(data.totalDifference)}</span>`)
            info.push('</div>')

            info.push('<div class="info-item">')
            info.push('<span>总分差率(%)</span>')
            info.push(`<span>${notDefinedDeal(data.totalDifferenceRate)}</span>`)
            info.push('</div>')

            info.push('<div class="info-item">')
            info.push('<span>数据时间</span>')
            info.push(`<span>${data.readTime ? getYMDHMSDate(data.readTime) : '--'}</span>`)
            info.push('</div>')

            info.push('</div>')
            break
        }
        ref.content.innerHTML = '<div class="infoWindow">' + info.join('') + '</div>'
        showOverlay(ref.overlay, coordinate)
        this.initMapDomEvent(feature)
      }
    },
    // 动态html点击事件
    initMapDomEvent(feature) {
      const closeWiindow = document.getElementById('closeWiindow')
      if (closeWiindow) {
        closeWiindow.onclick = e => {
          this.dmaDetail(feature)
        }
      }
    },
    // dma详情
    async dmaDetail(feature) {
      let featureData = feature.get('data')
      this.objInfo = featureData
      this.ansoDrawer = true
      this.$refs.ansoDrawer.open()
    },
    // 抽屉关闭
    cancelDrawer() {
      this.ansoDrawer = false
    },
    // 获取官网等级信息集合
    async getPipeMapData() {
      const params = {
        roleType: this.isAdmin ? 1 : 0,
        trim: true
      }
      let { code, data } = await monitorPipeMap(params)
      if (code === 200) {
        if (Object.values(data).length) {
          const LevelOfShaft = []
          for (let i in data) {
            LevelOfShaft.push({
              // name: i !== 'DMA' ? String.fromCharCode(64 + parseInt(i)) : i,
              name: i !== 'DMA' ? i + '级' : i,
              data: data[i]
            })
          }
          this.LevelOfShaft = LevelOfShaft
          this.currentLevelIndex = LevelOfShaft.length - 1
          this.currentLevelValue = LevelOfShaft[this.currentLevelIndex].data // 默认选中DMA
          this.loadPolygonByAreaDma(this.currentLevelValue)
        }
      }
    },
    // 切换等级轴
    checkLevelOfShaft(val, index) {
      const ref = this.$refs.olMap
      if (this.currentLevelName !== val.name) {
        showOverlay(ref.overlay, undefined)
        this.currentLevelName = val.name
        this.currentLevelValue = val.data
        this.currentLevelIndex = index
        this.loadPolygonByAreaDma(val.data)
        // 清除漏损报警的选中状态
        this.$emit('clearLeakAlarmStatus')
      }
    },
    //.(报警选中事件后 改变等级轴选中状态)name：'DMA
    polygonByleakageAlarm(data, name) {
      if (name) {
        this.currentLevelName = name
      }
      this.loadPolygonByAreaDma(data, name)
    },
    // 地图渲染 name代表不是点击等级轴渲染的数据
    loadPolygonByAreaDma(data, name) {
      data.forEach(j => {
        j.uplevelType = false
      })
      const ref = this.$refs.olMap
      // 每次数据渲染的时候清除一下Overlays、fatture
      if (ref.layer?.getSource()) {
        ref.layer.getSource().clear()
      }
      this.Overlays.forEach(j => {
        ref.map.removeOverlay(j)
      })
      this.Overlays = addPolygonFeatureNames(ref, data)
      // 每次渲染的时候都要渲染一下上级的数据
      if (this.currentLevelIndex && !name) {
        const upLevelData = this.LevelOfShaft[this.currentLevelIndex - 1].data
        upLevelData.forEach(j => {
          j.uplevelType = true
        })
        data = upLevelData.concat(data)
      }
      addPolygonFeatures(ref, data)
    },
    //全屏
    fullScreen() {
      if (this.fullscreen) {
        this.exitFullscreen()
      } else {
        this.requestFullscreen()
      }
    },
    // 全屏
    requestFullscreen() {
      let element = this.$refs.realTimeOlMap
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    },
    // 取消全屏
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  },
  watch: {
    fullscreen: {
      immediate: false,
      handler(val) {
        if (val) {
          this.toolsConfig.showInput = true
          this.toolsConfig.showBar = true
          this.toolsConfig.showResult = true
        } else {
          this.toolsConfig.showInput = false
          this.toolsConfig.showBar = false
          this.toolsConfig.showResult = false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
/deep/.polygontIitle {
  color: #262626;
  font-size: 12px;
  font-weight: 600;
  background: #ffffff;
  padding: 3px 8px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  position: relative;
  &:before {
    bottom: -10px;
    border: solid transparent;
    content: ' ';
    height: 0px;
    width: 0px;
    position: absolute;
    pointer-events: none;
    left: 50%;
    border-top-color: #fff;
    border-width: 5px;
    left: 50%;
    margin-left: -5px;
  }
}
</style>
