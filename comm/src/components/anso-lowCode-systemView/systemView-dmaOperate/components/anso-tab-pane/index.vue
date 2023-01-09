<!--
 * @Date: 2022-01-12 13:40:50
 * @LastEditors: liukui
 * @LastEditTime: 2022-03-25 18:03:12
 * @FilePath: \chinawater-base\chinawater-dma\src\components\pageTab\index.vue
-->
<!-- 头部条件tab切换组件 -->
<template>
  <el-tabs class="tab-list-wrap" v-model="activeIndex" @tab-click="handleClick">
    <el-tab-pane
      class="tab-btn"
      v-for="(tag, index) in tagList"
      :key="index"
      :label="tag.name"
      :name="tag.value"
    ></el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'ansoTabPane',
  props: {
    // tagList格式：[{ name: '远传水表', value: 'REMOTE_METER' }, { name: '压力监测', value: 'REMOTE_METER' }]
    tagList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeIndex: ''
    }
  },
  methods: {
    // 根据不同组织初始化tab选中
    labelDefult(value) {
      this.activeIndex = value
    },
    //切换tab页签
    handleClick(tab, event) {
      this.activeIndex = tab.name
      this.$emit('handleClick', this.activeIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
// tab切换头部
.tab-list-wrap {
  padding-right: 16px;
  margin-bottom: 8px;
  line-height: 48px;
  color: rgba(0, 0, 0, 0.65);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  // stylelint-disable-next-line
  ::v-deep {
    .el-tabs__item {
      height: 48px;
      padding: 13px 20px;
      font-size: 14px !important;
      line-height: 22px;
    }

    .el-tabs__header {
      margin-bottom: 0;
    }

    .el-tabs__nav-wrap::after {
      display: none;
    }
  }
}
</style>
