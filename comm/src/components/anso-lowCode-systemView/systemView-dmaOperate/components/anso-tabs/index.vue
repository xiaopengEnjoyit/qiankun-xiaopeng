<template>
  <div class="theme4">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" ref="tabs">
      <el-tab-pane :label="item.name" :name="item.value" v-for="(item, index) in panes" :key="index"> </el-tab-pane>
    </el-tabs>
    <slot></slot>
  </div>
</template>

<script>
import './elementui.scss'
export default {
  name: 'ansoTabs',
  data() {
    return {
      activeName: '',
      loading: false
    }
  },
  props: {
    panes: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: 300
    }
  },
  methods: {
    // 根据不同组织初始化tab选中
    labelDefult(value) {
      this.activeName = value
    },
    handleClick(item) {
      this.$emit('handleClick', item.name)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './elementui.scss';
</style>
<style lang="scss">
.theme4 {
  height: 100%;
  padding: 10px 0;
  box-sizing: border-box;
}
</style>
