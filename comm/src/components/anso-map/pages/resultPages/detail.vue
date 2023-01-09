<template>
  <div class="detail">
    <header class="header">
      <div class="back" @click="goBack"><i class="el-icon-arrow-left"></i><el-button type="text">返回</el-button></div>
    </header>
    <div class="search dashed-line">
      <span class="title"
        >{{ itemDatas.name }}-查询结果:
        <span style="color: #8c8c8c">共{{ total }}条</span>
      </span>
    </div>
    <!-- v-if="tableData.length > 0" -->
    <section class="list">
      <table-page
        :operates="operates"
        :toolsConfig="toolsConfig"
        :form-list="formList"
        :columns="columns"
        :tableData="tableData"
        :pageIndex.sync="currentPage"
        :pageSize.sync="pageSize"
        :total="total"
        :pager-count="5"
        class="man-page"
        layout="prev, pager, next"
        small
        @pagination="handleQuery"
        @query="handleQuery"
        @refresh="handleQuery"
      >
        <template>
          <div slot="header">
            <div class="pick">
              <el-date-picker
                size="mini"
                v-model="timeRage"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="datePick"
              >
              </el-date-picker>
            </div>
          </div>
        </template>
      </table-page>
    </section>
    <!-- <p class="no-datas" v-else>暂无数据...</p> -->
  </div>
</template>
<script>
import { tablePage } from 'comm/src/components'
import https from '../../api'

import { willStampToDate } from 'comm/src/utils/date'

export default {
  name: 'detail',
  components: { tablePage },
  props: {
    itemDatas: Object
  },
  data() {
    return {
      timeRage: '',
      showDialog: false,
      willStampToDate,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      tableData: [],
      headerConfig: {
        title: '',
        buttons: [
          {
            name: '新增',
            type: 'primary',
            methods: this.addFunction
          }
        ]
      },
      operates: {
        width: '65px',
        data: [
          {
            label: '详情', //'编辑',
            type: 'text',
            method: (index, row) => {
              this.handleDetail(index, row)
            }
          }
        ]
      },
      toolsConfig: ['setting'],
      formList: [
        // {
        //   name: '字典名称',
        //   field: 'name',
        //   placeholder: '请输入字典名称',
        //   prefixIcon: 'el-icon-search',
        //   enter: val => {
        //     this.form.nameAndCode = val
        //     this.getList(this.form)
        //   },
        //   validate: true,
        //   clearable: true
        // }
      ],
      columns: [],
      layerIcon: null
    }
  },
  mounted() {
    this.handleQuery()
  },
  methods: {
    datePick(val) {
      console.log('date', val)
      if (!val) {
        this.timeRage = []
      }
      this.handleQuery()
    },
    sliceNumber(num) {
      if (typeof num === 'number') {
        return num.toFixed(10)
      } else {
        return num
      }
    },
    initDatas() {
      console.log('初始化')
    },
    // 获取关联图层字段列表
    async handleQuery() {
      this.startLoading('.list')
      // 判断是通过搜索框结果页面还是框选结果页面进入的详情页面
      if (Object.prototype.toString.call(this.itemDatas.keyword) === '[object String]') {
        await this.getInputList()
      } else {
        await this.getBarList()
      }
      this.closeLoading()
    },
    async getInputList() {
      const index = this.itemDatas.index
      const params = {
        keyword: this.itemDatas.keyword,
        size: this.pageSize,
        current: this.currentPage,
        startDt: this.timeRage[0],
        endDt: this.timeRage[1]
      }
      const list = await https.searchIndex(index, params)
      if (list.code === 200) {
        console.log('列表数据', list)
        this.tableData = list.data.records
        this.total = list.data.total
        if (this.columns.length === 0) {
          this.columns = list.data.layer.fieldAliases
        }
        this.layerIcon = list.data.layer.layerIcon
      }
      return list
    },
    async getBarList() {
      let list
      const index = this.itemDatas.index
      const params = {
        ...this.itemDatas.keyword,
        size: this.pageSize,
        current: this.currentPage,
        startDt: this.timeRage[0],
        endDt: this.timeRage[1]
      }
      // 判断是否单点搜索
      if (this.itemDatas.keyword.resolution) {
        list = await https.searchPointIndex(index, params)
      } else {
        list = await https.searchIntersectsIndex(index, params)
      }
      if (list.code === 200) {
        console.log('列表数据', list)
        this.tableData = list.data.records
        this.total = list.data.total
        this.columns = list.data.layer.fieldAliases
        this.layerIcon = list.data.layer.layerIcon
      }
      return list
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.handleQuery()
    },
    handleDetail(index, row) {
      // console.log(index, row)
      const item = {
        itemDatas: row,
        columns: this.columns
      }
      this.$emit('showFeature', item)
      // this.showDialog = true
    },
    goBack() {
      this.$emit('toList')
    }
  }
}
</script>
<style lang="scss" scoped>
@import './detail.scss';
.form-bt {
  padding: 0;
}
::v-deep .table-page-main {
  padding: 0;
}
::v-deep .el-range-editor--mini {
  width: 295px;
}
::v-deep .v-pager {
  margin: 8px 0 0 0;
}
.no-datas {
  text-align: center;
  padding: 50px;
}
</style>
