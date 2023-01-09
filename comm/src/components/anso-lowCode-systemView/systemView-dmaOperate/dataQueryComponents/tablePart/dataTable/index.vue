<template>
  <div class="container-fluid">
    <anso-table :columns="columns" :tableData="tableData" v-if="isflage">
      <template v-slot:header="{ label }">
        <div class="header-rows">
          <p class="header-label" v-if="label.length > 15">
            <el-tooltip placement="top">
              <div slot="content">{{ label }}</div>
              <span>{{ label.slice(0, 10) + '...' }}</span>
            </el-tooltip>
          </p>
          <p class="header-label" v-else>{{ label }}</p>
          <el-tooltip effect="dark" content="导出" placement="top">
            <div class="header-icon" @click="exportTable()">
              <i class="icon iconfont icon-upload"></i>
            </div>
          </el-tooltip>
        </div>
      </template>
      <template v-slot:custom="{ row, prop }">
        <div>
          <div v-if="row[prop]" class="levelType">
            <span v-for="(item, index) in row[prop]" :key="index" :style="'color: ' + bgColor(item.level)">
              {{ eventTypelName(item.type) }}
            </span>
          </div>
          <div v-else>--</div>
        </div>
      </template>
    </anso-table>
  </div>
</template>

<script>
export default {
  name: 'dataTable',
  components: {},
  props: {
    orgInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tableDataColumns: {
      type: Object,
      default: () => {
        return {
          columns: [],
          tableData: [],
          exportUrlParames: {}
        }
      }
    }
  },
  data() {
    return {
      columns: [],
      tableData: [],
      isflage: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    siteDataBtn() {
      this.isflage = false
      this.$nextTick(() => {
        this.isflage = true
        this.columns = this.tableDataColumns.columns
        this.tableData = this.tableDataColumns.tableData
      })
    },
    // 事件名称转换
    eventTypelName(val) {
      switch (val) {
        case 1:
          return '存量报警'
        case 2:
          return '增量报警'
        case 3:
          return '总分差量报警'
        case 4:
          return '总分差率报警'
        case 5:
          return '数据异常'
      }
    },
    // 颜色处理
    bgColor(cellValue) {
      switch (cellValue) {
        case 1:
          return '#FF4D4F '
        case 2:
          return '#FAAD14'
        case 3:
          return '#3171F2'
        case 4:
          return '#52C41A'
        default:
          return '#262626'
      }
    },
    async exportTable() {
      const parames = this.tableDataColumns.exportUrlParames.parames
      await this.tableDataColumns.exportUrlParames?.url(parames)
    }
  },
  watch: {
    // orgInfo: {
    //   immediate: false,
    //   handler(val) {
    //     if (!val) return
    //     this.siteDataBtn()
    //   }
    // },
    tableDataColumns: {
      immediate: false,
      deep: true,
      handler(val) {
        if (!val) return
        this.siteDataBtn()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.levelType {
  padding-right: 37px;
  overflow: hidden; //溢出隐藏
  white-space: nowrap; //禁止换行
  text-overflow: ellipsis; //...
}
</style>
