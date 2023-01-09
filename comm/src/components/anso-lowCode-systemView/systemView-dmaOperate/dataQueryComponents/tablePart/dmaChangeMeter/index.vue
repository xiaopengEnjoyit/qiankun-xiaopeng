<template>
  <div class="anso-table-tab">
    <div class="aside">
      <el-radio-group v-model="currentLabel" @change="getClickCaliber">
        <el-radio :label="1">考核表</el-radio>
        <el-radio :label="2">大用户</el-radio>
        <el-radio :label="3">栋楼表</el-radio>
      </el-radio-group>
    </div>
    <anso-table class="meter-table" :columns="columns" :tableData="tableData"> </anso-table>
  </div>
</template>

<script>
import { areaDmaMeterChange, buildMeterChange } from 'comm/src/services'
import { assessColumns, largeColumns, buildColumns } from './tableColumns'
export default {
  name: 'dmaChangeMeter',
  components: {},
  props: { orgInfo: Object },
  data() {
    return {
      columns: assessColumns,
      tableData: [],
      currentLabel: 1
    }
  },
  created() {},
  mounted() {
    this.getClickCaliber(1)
  },
  methods: {
    // 获取分户表大小口径统计
    getClickCaliber(val) {
      this.currentLabel = val
      switch (val) {
        case 1:
          this.columns = assessColumns
          this.getAssessMeter()
          break
        case 2:
          this.columns = largeColumns
          this.getLargeMeter()
          break
        case 3:
          this.columns = buildColumns
          this.getBuildMeter()
          break
      }
    },
    // 考核表
    async getAssessMeter() {
      this.tableData = []
      let params = {
        objId: this.orgInfo.objId,
        objType: 3,
        meterType: 1
      }
      let { code, data, message } = await areaDmaMeterChange(params)
      if (code === 200) {
        this.tableData = data
      }
    },
    // 大用户
    async getLargeMeter() {
      this.tableData = []
      let params = {
        objId: this.orgInfo.objId,
        objType: 3,
        meterType: 3
      }
      let { code, data, message } = await areaDmaMeterChange(params)
      if (code === 200) {
        this.tableData = data
      }
    },
    // 栋楼表
    async getBuildMeter() {
      this.tableData = []
      let params = {
        objId: this.orgInfo.objId,
        objType: 3,
        meterType: 2
      }
      let { code, data, message } = await buildMeterChange(params)
      if (code === 200) {
        this.tableData = data
      }
    }
  },
  watch: {
    orgInfo: {
      immediate: false,
      handler(val) {
        if (!val) return
        this.getClickCaliber(this.currentLabel)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.anso-table-tab {
  .aside {
    border-right: 1px solid #e5e5e5;
    margin-bottom: 16px;
  }
  .meter-table {
    width: 100%;
    height: calc(100% - 32px);
  }
}
</style>
