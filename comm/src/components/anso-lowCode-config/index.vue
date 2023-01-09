<template>
  <div class="height-parent">
    <div class="flex between">
      <div>
        <i @click="backRouter" class="ml20 iconfont icon-return1"></i>
        <span class="title">
          总览/大屏标题
        </span>
      </div>
      <!-- <a href="javascript:;" class="crumb-back" @click="backRouter"><i class="iconfont icon-return"></i></a> -->
      <!-- <el-button type="primary" @click="bigScreen">大屏</el-button> -->
      <div>
        <!-- <el-dropdown @command="setCol">
          <el-button type="primary">颜色切换</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="red">红色</el-dropdown-item>
            <el-dropdown-item command="yellow">黄色</el-dropdown-item>
            <el-dropdown-item command="blue">蓝色</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" @click="setBg">背景切换</el-button> -->
        <!-- <el-button type="primary" @click="setStyle">保存宽高</el-button> -->
        <template v-if="$route.query.type === 'largeScreen'">
          <span class="fz12">画布尺寸：</span>
          <el-input @keydown.enter.native="setStyle" v-model="bg.bgWidth" size="mini" placeholder="请输入宽度">
            <span slot="append">px</span>
          </el-input>
          <i class="iconfont icon-duankailianjie ml3"></i>
          <el-input
            @keydown.enter.native="setStyle"
            class="ml3"
            v-model="bg.bgHeight"
            size="mini"
            placeholder="请输入高度"
          >
            <span slot="append">px</span></el-input
          >
        </template>
        <!-- <span class="fz12 ml16">深色模式：</span>
        <el-switch @change="changeBgColor" v-model="isDark"></el-switch> -->
        <el-button @click="cancel" class="ml33">取消</el-button>
        <el-button @click="bigScreenView">
          <i class="iconfont icon-fuwuguanli"></i>
          预览</el-button
        >
        <el-button class="mr24" type="primary" @click="save"> <i class="iconfont icon-fabu"></i> 发布</el-button>
      </div>
    </div>
    <div class="content-drag">
      <div class="left">
        <el-tabs tab-position="left">
          <el-tab-pane label="组件">
            <div class="left-menu mt5" slot="label">
              <div class="iconfont icon-a-12_huaban1fuben8"></div>
              <div>组件</div>
            </div>
            <el-tabs v-model="activeName">
              <el-tab-pane label="业务组件" name="first">
                <el-select v-model="system" @change="changeSystem" placeholder="请选择">
                  <el-option v-for="item in configLayout" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <div
                  v-for="(o, i) in configLayout.find(o => o.value === system).layout"
                  @drag="drag(o)"
                  @dragend="dragend(o)"
                  class="droppable-element"
                  draggable="true"
                  unselectable="on"
                  :key="i"
                >
                  <img title="拖拽至画布" :src="o.imgPath" width="100%" />
                  <!-- <slot name="png" :imgPath="o.imgPath"></slot> -->
                  <div class="text-left">{{ o.title || o.comName }}</div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="基础组件" name="second">
                <div
                  v-for="(o, i) in baseLayout"
                  @drag="drag(o)"
                  @dragend="dragend(o)"
                  class="droppable-element"
                  draggable="true"
                  unselectable="on"
                  :key="i"
                >
                  <img title="拖拽至画布" :src="o.imgPath" width="100%" />
                  <!-- <slot name="png" :imgPath="o.imgPath"></slot> -->
                  <div class="text-left">{{ o.title || o.comName }}</div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="背景">
            <div class="left-menu" slot="label">
              <div class="iconfont mt28 icon-a-12_huaban1fuben7"></div>
              <div>背景</div>
            </div>
            <el-tabs v-model="activeBgName">
              <el-tab-pane label="内置" name="bgFirst">
                <img @click="setBg(o, true)" class="bg-style" v-for="(o, i) in baseImgs" :key="i" :src="o.imgPath" />
              </el-tab-pane>
              <el-tab-pane label="我的" name="bgSecond">
                <el-upload
                  :headers="headers"
                  :action="fileUploadUrl"
                  :show-file-list="false"
                  :on-success="uploadSuccess"
                >
                  <div class="upload-content">
                    <i class="iconfont icon-Increase2"></i>
                    <span>点击上传</span>
                  </div>
                </el-upload>
                <img
                  @click="setBg(o, false)"
                  class="bg-style"
                  v-for="o in bgImgList"
                  :key="o"
                  :src="`${imgViewUrl}?fileId=${o}`"
                />
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="content-parent">
        <div id="content">
          <div v-if="layout.length === 0" class="empty">
            <img width="108px" src="../../assets/lowCodeImg/empty.png" />
            <div>拖拽组件到这里</div>
          </div>
          <grid-layout
            ref="gridlayout"
            :layout.sync="layout"
            :col-num="id ? configWidth : colNum"
            :row-height="1"
            :margin="[10, 10]"
            :is-draggable="!isfullscreen"
            :is-resizable="true"
            :vertical-compact="true"
            :prevent-collision="false"
            :use-css-transforms="true"
          >
            <grid-item
              v-for="(item, i) in layout"
              :key="`${item.comName}${i}`"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
            >
              <component :is="item.comName" :config="item"></component>
              <!-- <slot name="grid" :config="item"></slot> -->
              <template v-if="!isfullscreen">
                <span class="remove iconfont icon-closure" @click="removeItem(item.i)"></span
                ><span class="vue-resizable-handle iconfont icon-ketuozhuai"></span>
              </template>
            </grid-item>
          </grid-layout>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { throttle } from 'lodash'
import { GridLayout, GridItem } from 'vue-grid-layout'
import api from '../../api/common'
import { layoutAdd, layoutDelete, layoutInfo, layoutUplate } from '../../services'
let mouseXY = { x: null, y: null }
let DragPos = { x: null, y: null, w: 1, h: 1, i: null, comName: '' }
export default {
  name: 'ansoLowCodeConfig',
  components: {
    GridLayout,
    GridItem
  },
  props: {
    configLayout: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headers: {
        Authorization:
          JSON.parse(sessionStorage.getItem('token')).token_type +
          ' ' +
          JSON.parse(sessionStorage.getItem('token')).access_token
      },
      fileUploadUrl: api.fileUploadUrl,
      imgViewUrl: api.imgViewUrl,
      isfullscreenConfig: {},
      bgImgList: [],
      configHeight: 0,
      configWidth: 0,
      isfullscreen: false,
      baseImgs: [],
      system: 'customerDmaOperate',
      isDark: false,
      activeBgName: 'bgFirst',
      activeName: 'first',
      layout: [],
      colNum: 0,
      bg: {
        bgWidth: 1920,
        bgHeight: 1080
      },
      baseLayout: [
        {
          imgPath: require('comm/src/assets/lowCodeImg/tableCom111.png'),
          comName: 'tableCom',
          name: '我是表格',
          w: 600,
          h: 300,
          title: '表格'
        },
        {
          imgPath: require('comm/src/assets/lowCodeImg/inputPreview.png'),
          comName: 'inputPreview',
          name: '我是输入框',
          w: 200,
          h: 100,
          title: '请输入'
        }
      ]
    }
  },
  async mounted() {
    // this.layout = this.value
    let dom = document.getElementById('content')
    if (this.$route.query.type === 'largeScreen') {
      dom.style.width = '1920px'
      dom.style.height = '1080px'
    } else {
      dom.style.width = '100%'
      dom.style.height = '100%'
      this.configWidth = this.colNum = dom.getBoundingClientRect().width
      this.configHeight = dom.getBoundingClientRect().height
      this.selfHeight = dom.getBoundingClientRect().height
    }
    if (this.id) {
      const { data, code } = await layoutInfo(this.id)
      if (code === 200) {
        this.layout = JSON.parse(data.layoutJson).layout
        this.configWidth = JSON.parse(data.layoutJson).configWidth
        this.configHeight = JSON.parse(data.layoutJson).configHeight
        this.layout.forEach(e => {
          e.h = e.h * (this.selfHeight / this.configHeight)
          e.y = e.y * (this.selfHeight / this.configHeight)
        })
      }
    }
    dom.addEventListener(
      'dragover',
      function(e) {
        mouseXY.x = e.clientX
        mouseXY.y = e.clientY
      },
      false
    )
    const el = document.querySelector('.content-parent')
    el.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.layout.forEach(e => {
          e.h = e.h / (this.isfullscreenConfig.height / this.selfHeight)
          e.y = e.y / (this.isfullscreenConfig.height / this.selfHeight)
        })
        this.isfullscreen = false
      } else {
        this.isfullscreenConfig = document.getElementById('content').getBoundingClientRect()
        this.layout.forEach(e => {
          e.h = e.h * (this.isfullscreenConfig.height / this.selfHeight)
          e.y = e.y * (this.isfullscreenConfig.height / this.selfHeight)
        })
        this.isfullscreen = true
      }
    })
    this.getImgs()
  },
  beforeDestroy() {},
  methods: {
    getImgs() {
      const path = require('path')
      const requireImgs = require.context('comm/src/assets/lowCodeBgImg', true, /\.png$/)
      requireImgs.keys().forEach(o => {
        const name = path.basename(o, '.png')
        this.baseImgs.push({
          imgPath: require(`comm/src/assets/lowCodeBgImg/${name}.png`),
          imgBgName: name
        })
      })
    },
    changeBgColor(val) {
      const elParent = document.getElementById('content')
      elParent.style.backgroundColor = val ? '#06144E' : ''
      const elements = document.querySelectorAll('.vue-grid-item')
      elements.forEach((o, i) => {
        if (i < elements.length - 1) {
          o.style.backgroundColor = val ? '#06144E' : 'white'
        }
      })
    },
    getBgList() {},
    changeSystem(val) {
      this.$emit('changeSystem', val)
    },
    backRouter() {
      this.$router.go(-1)
    },
    cancel() {
      this.$router.go(-1)
    },
    uploadSuccess({ code, data }) {
      if (code === 200) {
        this.bgImgList.push(data.id)
      }
    },
    async save() {
      const request = {
        configHeight: this.selfHeight,
        configWidth: this.configWidth,
        layout: this.layout,
        isDark: this.isDark,
        imgBgName: this.imgBgName,
        isBuiltIn: this.isBuiltIn,
        bgImgList: this.bgImgList
      }
      const params = {
        layoutJson: JSON.stringify(request)
      }
      let data
      if (this.id) {
        data = await layoutUplate({
          id: this.id,
          ...params
        })
      } else {
        data = await layoutAdd(params)
      }
      this.$emit('getLayoutId', data.data)
    },
    bigScreen() {},
    bigScreenView(e) {
      const el = document.querySelector('.content-parent')
      el.requestFullscreen()
      // el.style.background = 'white'
    },
    setBg(o, bool) {
      let el = document.getElementById('content')
      this.imgBgName = o.imgBgName
      this.isBuiltIn = bool
      el.style.backgroundImage = `url(${o.imgPath})`
    },
    setCol(color) {
      this.$emit('setColor', color)

      // document.querySelectorAll('.vue-grid-item').forEach(o => {
      //   o.style.background = color
      // })
    },
    setStyle(e) {
      let dom = document.getElementById('content')
      dom.style.width = `${this.bg.bgWidth}px`
      dom.style.height = `${this.bg.bgHeight}px`
    },
    drag: throttle(function(o) {
      {
        let parentRect = document.getElementById('content').getBoundingClientRect()
        let mouseInGrid = false
        // let drawFlag = true
        if (
          mouseXY.x > parentRect.left &&
          mouseXY.x < parentRect.right &&
          mouseXY.y > parentRect.top &&
          mouseXY.y < parentRect.bottom
        ) {
          mouseInGrid = true
        }
        if (mouseInGrid === true && this.layout.findIndex(item => item.i === 'drop') === -1) {
          this.layout.push({
            x: (this.layout.length * 2) % (this.colNum || 48),
            y: this.layout.length + (this.colNum || 48), // puts it at the bottom
            w: o.w,
            h: o.h,
            i: 'drop'
          })
        }
        let index = this.layout.findIndex(item => item.i === 'drop')
        if (index !== -1) {
          try {
            // if (drawFlag) {
            this.$refs.gridlayout.$children[this.layout.length].$refs.item.style.display = 'none'
            // }
          } catch {
            console.log(88)
          }
          let el = this.$refs.gridlayout.$children[index]
          el.dragging = { top: mouseXY.y - parentRect.top, left: mouseXY.x - parentRect.left }
          let new_pos = el.calcXY(mouseXY.y - parentRect.top, mouseXY.x - parentRect.left)
          if (o.w > this.colNum - new_pos.x) {
            new_pos.x = 0
          }
          if (mouseInGrid === true) {
            // if (drawFlag) {
            this.$refs.gridlayout?.dragEvent('dragstart', 'drop', new_pos.x, new_pos.y, o.h, o.w)

            DragPos.i = String(Math.random())
            DragPos.x = this.layout[index].x
            DragPos.y = this.layout[index].y
            // }
          }
          if (mouseInGrid === false) {
            this.$refs.gridlayout?.dragEvent('dragend', 'drop', new_pos.x, new_pos.y, o.h, o.w)
            this.layout = this.layout.filter(obj => obj.i !== 'drop')
          }
        }
      }
    }, 100),
    dragend(o) {
      // 因为drag方法加了节流， 所以此处加延迟执行
      setTimeout(() => {
        let parentRect = document.getElementById('content').getBoundingClientRect()
        let mouseInGrid = false
        if (
          mouseXY.x > parentRect.left &&
          mouseXY.x < parentRect.right &&
          mouseXY.y > parentRect.top &&
          mouseXY.y < parentRect.bottom
        ) {
          mouseInGrid = true
        }
        if (mouseInGrid === true) {
          this.$refs.gridlayout?.dragEvent('dragend', 'drop', DragPos.x, DragPos.y, o.h, o.w)
          this.layout = this.layout.filter(obj => obj.i !== 'drop')
          this.layout.push({
            x: DragPos.x,
            y: DragPos.y,
            w: o.w,
            h: o.h,
            i: DragPos.i,
            comName: o.comName,
            title: o.title
          })
          this.$refs.gridLayout?.dragEvent('dragend', DragPos.i, DragPos.x, DragPos.y, o.h, o.w)
          try {
            this.$refs.gridLayout.$children[this.layout.length].$refs.item.style.display = 'block'
          } catch {
            console.log(8)
          }
          this.$emit('input', this.layout)
          this.$nextTick(() => {
            this.changeBgColor(this.isDark)
          })
        }
      }, 101)
    },
    removeItem: function(val) {
      const index = this.layout.map(item => item.i).indexOf(val)
      this.layout.splice(index, 1)
      this.$emit('input', this.layout)
    }
  }
}
</script>

<style scoped lang="scss">
@import './index';
</style>
