<template>
  <div class="DataQueryRef">
    <dataQueryComponents ref="DataQueryRef" :isTreeMap="false"></dataQueryComponents>
  </div>
</template>

<script>
import dataQueryComponents from 'comm/src/components/anso-lowCode-systemView/systemView-dmaOperate/dataQueryComponents'
export default {
  name: 'leakQueryDetail',
  props: {
    objInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    orgTypeId: {
      type: String,
      default: ''
    }
  },
  components: {
    dataQueryComponents
  },
  data() {
    return {}
  },
  created() {},
  mounted() {
    this.$refs.DataQueryRef.nodeClick(this.objInfo, this.orgTypeId)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
<style lang="scss">
.leakageEvaluation {
  &.el-drawer {
    .el-drawer__header {
      margin-bottom: 0px;
      padding: 0;
      position: absolute;
      right: 16px;
      top: 6px;
      z-index: 1;
      span {
        color: #262626;
        font-weight: 700;
        font-size: 16px;
        display: none;
      }
    }
    .drawer-main {
      height: 100%;
      padding: 0px 4px !important;
    }
  }
}
</style>
