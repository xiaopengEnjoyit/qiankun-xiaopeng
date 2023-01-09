<template>
  <div class="searchInput">
    <div class="demo-input-size">
      <el-input
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        v-model="value"
        @keyup.enter.native="searchClick"
        clearable
      >
      </el-input>
    </div>
  </div>
</template>

<script>
import https from '../api'
export default {
  name: 'searchInput',
  props: {
    search: Function,
    showResult: Function
  },
  data() {
    return {
      value: ''
    }
  },
  methods: {
    async searchClick() {
      console.log(https)
      if (!this.value) {
        return
      }
      this.$parent.$refs.searchBar.active = ''
      this.$parent.$refs.searchBar.resetDraw()
      this.startLoading('.map')
      const { code, data } = await https.search({ keyword: this.value })
      console.log(code, data)
      this.showResult(data, this.value)
      this.search(data)
      this.closeLoading()
    }
  }
}
</script>

<style lang="scss" scoped>
.searchInput {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
}
::v-deep .el-input-group__append {
  background: $mainColor;
  color: #fff;
  cursor: pointer;
}
::v-deep .el-input-group__append:hover {
  background: $hoverColor;
}
::v-deep .el-input__inner {
  width: 360px;
  height: 42px !important;
  background: #ffffff;
  border-radius: 4px;
  border: none;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.15);
}
::v-deep .el-input__prefix {
  font-size: 14px;
  color: #8c8c8c;
  line-height: 44px;
}
</style>
