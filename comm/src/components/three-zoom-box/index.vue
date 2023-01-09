<template>
  <div class="sub-cont-wrap">
    <div ref="mainCont" class="zoom-main-cont" :style="{ height: mainContHeight }">
      <div class="zoom-cont-box">
        <!-- 左边盒子[[ -->
        <div class="zoom-cont-box-left" :class="{ 'show-tool': leftZoomBoxHide }" ref="leftZoomBox">
          <div class="zoom-cont-box-left-cont">
            <div class="zoom-cont-box-left-tool" @click="leftZoomBoxBack">
              <i class="el-icon-arrow-right"></i>
            </div>
            <div class="zoom-content">
              <!-- 左上角盒子[[ -->
              <anso-zoom-box
                ref="leftTopZoomBox"
                class="zoom-content-box"
                :defaultWidth="leftTopHeight"
                :class="{ 'show-left-top-tool': leftTopZoomBoxHide }"
                @zoomBox="zoomBox"
                @mouseUp="mouseUp"
              >
                <div class="zoom-content-box-content">
                  <slot name="leftTop"></slot>
                </div>
                <div class="left-top-zoom-tool" @click="leftTopZoomBoxBack">
                  <i class="el-icon-arrow-down"></i>
                </div>
              </anso-zoom-box>
              <!-- 左上角盒子]] -->
              <!-- 左下角盒子[[ -->
              <div
                ref="leftBottomBox"
                :class="{ 'show-left-bottom-tool': leftBottomBoxHide }"
                class="zoom-content-other"
              >
                <slot name="leftBottom"></slot>
                <div class="left-bottom-tool" @click="leftBottomBoxBack">
                  <i class="el-icon-arrow-up"></i>
                </div>
              </div>
              <!-- 左下角盒子]] -->
            </div>
          </div>
        </div>
        <!-- 左边盒子]] -->
        <!-- 右边盒子[[ -->
        <anso-zoom-box
          class="zoom-cont-box-right"
          :class="{ 'show-right-tool': rightBoxHide }"
          :defaultWidth="rightWidth"
          ref="rightZoomBox"
          zoomToolPosition="left"
          @mouseUp="mouseUp"
          @zoomBox="zoomBox"
          @mouseDown="rightMouseDown"
        >
          <div class="zoom-cont-box-right-cont">
            <slot name="right"></slot>
          </div>
          <div class="zoom-cont-box-right-tool" @click="rightBoxBack">
            <i class="el-icon-arrow-left"></i>
          </div>
        </anso-zoom-box>
        <!-- <div
          ref="rightBox"
          :class="{ 'show-right-tool': rightBoxHide }"
          class="zoom-cont-box-right"
        >
          <div class="zoom-cont-box-right-cont">
            <slot name="right"></slot>
          </div>
          <div class="zoom-cont-box-right-tool" @click="rightBoxBack"></div>
        </div> -->
        <!-- 右边盒子]] -->
      </div>
      <!--  此处只放弹出框类的 -->
      <slot name="other"></slot>
    </div>
  </div>
</template>
<script>
/**
 * 使用
 * <three-zoom-box rightWidth="300px">
    <div slot="leftTop">左上角盒子</div>
    <div slot="leftBottom">
      左下角盒子
    </div>
    <div slot="right">
      右边盒子
    </div>
  </three-zoom-box>
 *
 *
 *
*/
import { commonMixins } from 'comm/src/mixins'
import ansoZoomBox from '../anso-zoom-box'
export default {
  name: 'test',
  props: {
    // leftWidth: {
    //   type: String,
    //   default: '80%' // 也可以使用px
    // },
    leftTopHeight: {
      type: String,
      default: '50%' // 也可以使用px
    },
    rightWidth: {
      type: String,
      default: '300px'
    }
  },
  components: {
    ansoZoomBox
  },
  mixins: [commonMixins],
  data() {
    return {
      number: 100,
      leftZoomBoxWidth: -1, // 左边盒子的宽度
      leftTopZoomBoxHeight: -1, // 左上角盒子的高度
      leftBottomBoxHeight: -1, // 左下角盒子的高度
      rightBoxWidth: -1, // 右边盒子的宽度
      leftZoomBoxHide: false,
      leftTopZoomBoxHide: false,
      leftBottomBoxHide: false,
      rightBoxHide: false,
      leftOldWidth: 'auto',
      //
      leftBottomDefault: 0
    }
  },
  directives: {},
  created() {
    if (this.leftTopHeight.includes('%')) {
      this.leftBottomDefault = `${100 - Number(this.leftTopHeight.split('%')[0])}%`
    }
  },
  mounted() {},
  methods: {
    zoomBox() {
      // const leftZoomBox = this.$refs.leftZoomBox
      this.leftZoomBoxWidth = this.$refs.leftZoomBox.clientWidth
      this.leftTopZoomBoxHeight = this.$refs.leftTopZoomBox.$el.clientHeight
      this.leftBottomBoxHeight = this.$refs.leftBottomBox.clientHeight
      this.rightBoxWidth = this.$refs.rightZoomBox.$el.clientWidth
      this.$emit('zoomBox', {
        leftZoomBoxWidth: this.leftZoomBoxWidth,
        leftTopZoomBoxHeight: this.leftTopZoomBoxHeight,
        leftBottomBoxHeight: this.leftBottomBoxHeight,
        rightBoxWidth: this.rightBoxWidth
      })
    },
    mouseUp() {
      if (this.leftZoomBoxWidth >= 0 && this.leftZoomBoxWidth < 200) {
        this.$refs.leftZoomBox.style.flex = 'initial'
        this.leftZoomBoxHide = true
      }
      if (this.leftTopZoomBoxHeight >= 0 && this.leftTopZoomBoxHeight < 200) {
        this.leftTopZoomBoxHide = true
      }
      if (this.leftBottomBoxHeight >= 0 && this.leftBottomBoxHeight < 200) {
        // 这里右上角的盒子设计高度为0的时候，左上角盒子要根据可用空间自动撑起来
        this.$refs.leftTopZoomBox.$el.style.flex = '1'
        this.leftBottomBoxHide = true
      }
      if (this.rightBoxWidth >= 0 && this.rightBoxWidth < 200) {
        this.$refs.leftZoomBox.style.flex = '1'
        this.rightBoxHide = true
      }
      const boxInfo = {}
      boxInfo.leftZoomBoxWidth = !this.leftZoomBoxHide ? this.leftZoomBoxWidth : 0
      boxInfo.leftTopZoomBoxHeight = !this.leftTopZoomBoxHide ? this.leftTopZoomBoxHeight : 0
      boxInfo.leftBottomBoxHeight = !this.leftBottomBoxHide ? this.leftBottomBoxHeight : 0
      boxInfo.rightBoxWidth = !this.rightBoxHide ? this.rightBoxWidth : 0
      this.$emit('mouseUp', boxInfo)
    },
    leftZoomBoxBack() {
      this.leftZoomBoxHide = false
      this.$refs.leftZoomBox.style.flex = '1'
      this.$refs.rightZoomBox.$el.style.flex = 'initial'
      this.$refs.rightZoomBox.$el.style.width = this.rightWidth
      this.leftZoomBoxWidth = this.leftWidth
      this.$emit('leftBoxBack')
    },
    leftTopZoomBoxBack() {
      this.leftTopZoomBoxHide = false
      this.$refs.leftTopZoomBox.$el.style.height = this.leftTopHeight
      this.leftTopZoomBoxHeight = this.leftTopHeight
      this.$emit('leftTopBoxBack')
    },
    leftBottomBoxBack() {
      this.leftBottomBoxHide = false
      // 这里左上角的盒子要设置回不根据内容自动撑
      this.$refs.leftTopZoomBox.$el.style.flex = 'initial'
      this.$refs.leftTopZoomBox.$el.style.height = this.leftTopHeight
      this.leftBottomBoxHeight = this.leftBottomDefault
      this.$emit('leftBottomBoxBack')
    },
    rightBoxBack() {
      this.rightBoxHide = false
      this.$refs.rightZoomBox.$el.style.flex = 'initial'
      this.$refs.rightZoomBox.$el.style.width = this.rightWidth
      this.rightBoxWidth = this.rightWidth
      this.$emit('rightBoxBack')
    },
    rightMouseDown(info) {
      this.$refs.rightZoomBox.$el.style.flex = 'initial'
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
