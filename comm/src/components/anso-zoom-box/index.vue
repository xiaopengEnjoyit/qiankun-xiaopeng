<template>
  <div class="zoom-box" :style="zoomBoxStyle">
    <slot></slot>
    <p class="zoom-box-tools" :style="toolStyle" v-zoomBox="zoomBox"></p>
  </div>
</template>
<script>
/**
 * 使用
 * <anso-zoom-box
      class="zoom-cont-box-left"
      ref="leftZoomBox"
      zoomToolPosition="right"
      @mouseUp="mouseUp"
      @zoomBox="zoomBox"
  ></anso-zoom-box>
 *
 *
 *
*/
export default {
  name: 'ansoZoomBox',
  data() {
    return {
      boxSize: 'auto'
    }
  },
  props: {
    zoomToolPosition: {
      type: String,
      default: 'bottom' // 目前只支持bottom,right,left
    },
    defaultWidth: {}
  },
  created() {
    this.boxSize = this.defaultWidth
  },
  computed: {
    zoomBoxStyle() {
      let styleObj = null
      switch (this.zoomToolPosition) {
        // 上下放大，工具条在盒子的下面，控制父级节点的高
        case 'bottom':
          if (this.boxSize !== 'auto') {
            styleObj = { height: this.boxSizeChange(this.boxSize) }
            // styleObj = { height: `${this.boxSize}px` }
          }
          break
        // 左右放大，工具条在盒子的右边，控制父级节点的宽
        case 'right':
          if (this.boxSize !== 'auto') {
            styleObj = { width: this.boxSizeChange(this.boxSize) }
          }
          break
        case 'left':
          if (this.boxSize !== 'auto') {
            styleObj = { width: this.boxSizeChange(this.boxSize) }
          }
          break
        default:
          styleObj = { height: this.boxSizeChange(this.boxSize) }
      }
      return styleObj
    },
    toolStyle() {
      let styleObj = null
      switch (this.zoomToolPosition) {
        // 如果是上下放大，工具条的样式
        case 'bottom':
          styleObj = {
            height: '10px',
            width: '100%',
            bottom: '-5px',
            left: 0,
            cursor: 'row-resize'
          }
          break
        case 'left':
          styleObj = {
            height: '100%',
            width: '10px',
            left: '-5px',
            top: 0,
            cursor: 'col-resize'
          }
          break
        // 如果是左右放大，工具条的样式
        case 'right':
          styleObj = {
            height: '100%',
            width: '10px',
            right: '-8px',
            top: 0,
            cursor: 'col-resize'
          }
          break
        default:
          styleObj = { height: '10px', width: '100%', bottom: '-5px', left: 0 }
      }
      return styleObj
    }
  },
  directives: {
    zoomBox: {
      bind(el, binding, vnode) {
        const self = {}
        let canDrap = false
        let that = vnode.context
        let mouseDownInfo = { clientY: 0, clientX: 0 } // 当前点击点的信息，主要是坐标信息，记录起来
        let elParentNodeInfo = { clientHeight: 0, clientWidth: 0 } // 当前父级节点信息，主要是宽和高
        self.timer = null
        self.mouseDownHandler = e => {
          if (el.contains(e.target)) {
            // e.preventDefault()
            e.stopPropagation()
            mouseDownInfo.clientY = e.clientY
            mouseDownInfo.clientX = e.clientX
            // currentParentHeight = el.parentNode.clientHeight
            elParentNodeInfo.clientHeight = el.parentNode.clientHeight
            elParentNodeInfo.clientWidth = el.parentNode.clientWidth
            canDrap = true
            that.mouseDown({ mouseDownInfo, elParentNodeInfo })
          }
          if (binding.value) {
            return false
          }
          return true
        }
        self.drapHandler = e => {
          // e.preventDefault()
          if (!canDrap) return
          // self.timer && clearTimeout(self.timer)
          if (self.timer) return
          self.timer = setTimeout(() => {
            self.timer = null
            binding.value(e, mouseDownInfo, elParentNodeInfo)
          }, 100)
        }
        self.mouseUpHandler = e => {
          e.stopPropagation()
          // e.preventDefault()
          that.mouseUp()
          canDrap && (canDrap = false)
        }
        document.addEventListener('mousedown', self.mouseDownHandler)
        document.addEventListener('mousemove', self.drapHandler)
        document.addEventListener('mouseup', self.mouseUpHandler)
      },
      unbind(el) {
        // 解除事件监听
        document.removeEventListener('mousedown', self.mouseDownHandler)
        document.removeEventListener('mousemove', self.drapHandler)
        document.removeEventListener('mouseup', self.mouseUpHandler)
        delete self.mouseDownHandler
        delete self.drapHandler
        delete self.mouseUpHandler
      }
    }
  },
  methods: {
    boxSizeChange(bz) {
      if (!bz) return 'auto'
      if (bz === 'auto') return 'auto'
      if (typeof bz === 'number') {
        return `${bz}px`
      } else if (bz.includes('%')) {
        return bz
      } else if (bz.includes('px')) {
        return bz
      }
    },
    zoomBox(e, mouseDownInfo, elParentNodeInfo) {
      switch (this.zoomToolPosition) {
        case 'bottom':
          this.boxSize = elParentNodeInfo.clientHeight + e.clientY - mouseDownInfo.clientY
          break
        case 'right':
          this.boxSize = elParentNodeInfo.clientWidth + e.clientX - mouseDownInfo.clientX
          break
        case 'left':
          this.boxSize = elParentNodeInfo.clientWidth + (mouseDownInfo.clientX - e.clientX)
          break
        default:
          this.boxSize = elParentNodeInfo.clientHeight + e.clientY - mouseDownInfo.clientY
      }
      this.$emit('zoomBox', { e, mouseDownInfo, elParentNodeInfo })
    },
    mouseUp() {
      // this.$emit('mouseUp')
    },
    mouseDown(info) {
      this.$emit('mouseDown', info)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
