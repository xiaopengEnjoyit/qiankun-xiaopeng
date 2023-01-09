<template>
  <el-row>
    <el-col :span="24">
      <el-select
        v-model="selectVal"
        filterable
        clearable
        placeholder="请选择"
        :filter-method="filterMethod"
        @change="changeValue"
        @visible-change="handleFocus"
        :style="'width:100%'"
      >
        <el-option
          v-for="item in dataList"
          :key="item.code"
          :label="item[params.props.label]"
          :value="item[params.props.value]"
        >
        </el-option>
        <el-col :span="24">
          <div class="bottomPage">
            <el-pagination
              small
              @current-change="handleCurrentChange"
              :current-page="this.tbParams.pageIndex"
              :page-size="this.tbParams.pageSize"
              layout="total, prev, pager, next"
              :total="this.total"
            >
            </el-pagination>
          </div>
        </el-col>
      </el-select>
    </el-col>
  </el-row>
</template>
<script>
import { getPageSelectData } from '../../services'
export default {
  name: 'SelectPage',
  //接收参数
  props: {
    //请求地址
    params: {
      type: Object
    }
  },
  data() {
    return {
      selectVal: '',
      dataList: [],
      total: 0,
      loading: false,
      tbParams: {}
    }
  },
  mounted() {
    this.tbParams = this.params.params
    // this.getList()
  },
  methods: {
    // 列表
    async getList() {
      const { code, data } = await getPageSelectData(this.tbParams, this.params.url)
      if (code === 200) {
        this.dataList = data.records
        this.total = data.total
      }
    },
    //翻页
    handleCurrentChange(val) {
      //val获取点击页数，赋值刷新接口数据
      this.tbParams.pageIndex = val
      this.getList()
    },
    changeValue(e) {
      this.selectVal = e
      //e获取选择code 给父页面
      this.$emit('change', e)
    },
    filterMethod(val) {
      this.tbParams.pageIndex = 1
      this.tbParams.pageSize = 20
      this.tbParams.eventSearchStr = val
      this.getList()
    },
    handleFocus(val) {
      if (val) {
        this.tbParams.eventSearchStr = ''
        this.tbParams.pageIndex = 1
        this.tbParams.pageSize = 20
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.bottomPage {
  display: flex;
  margin-bottom: 10px;
  padding-left: 15px;
}
</style>
