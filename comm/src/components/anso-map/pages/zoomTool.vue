<template>
  <div class="zoom">
    <i class="el-icon-plus icon" title="放大" @click="zoomOut"></i>
    <i class="el-icon-minus icon" title="缩小" @click="zoomIn"></i>
  </div>
</template>
<script>
export default {
  name: 'zoom',
  data() {
    return {}
  },
  methods: {
    zoomOut() {
      let view = this.$parent.map.getView() // 获取当前视图
      let zoom = view.getZoom() // 获取当前缩放级别
      view.setZoom(zoom + 1) // 设置缩放级别
    },
    zoomIn() {
      let view = this.$parent.map.getView() // 获取当前视图
      let zoom = view.getZoom() // 获取当前缩放级别
      view.setZoom(zoom - 1) // 设置缩放级别
    }
  }
}
</script>

<style lang="scss" scoped>
.zoom {
  position: absolute;
  bottom: 130px;
  right: 20px;
  width: 32px;
  height: 68px;
  box-sizing: border-box;
  padding: 0 5px;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15);
}
.el-icon-plus {
  border-bottom: 1px dashed #e5e5e5;
  box-sizing: border-box;
}
.icon {
  float: left;
  width: 100%;
  height: 34px;
  line-height: 34px;
  text-align: center;
  color: #888888;
  font-size: 18px;
}
.icon:active {
  color: #3171f2;
}
</style>
