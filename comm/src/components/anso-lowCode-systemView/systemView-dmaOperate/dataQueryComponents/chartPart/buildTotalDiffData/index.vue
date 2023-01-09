<template>
  <div class="container-fluid" v-loading="loading">
    <div class="container-echarts">
      <anso-title-form :form="form" :formList="formList" @handleQuery="handleQuery"></anso-title-form>
      <div class="echarts-container">
        <anso-antv-g2 :chartId="chartId" :chartConfig="chartConfig"></anso-antv-g2>
      </div>
    </div>
  </div>
</template>

<script>
import ansoAntvG2 from 'comm/src/components/anso-antv-g2'
import { sortKeyOrder } from 'comm/src/utils/utils.js'
import { buildTotalDifference, buildTotalDifferenceExport } from 'comm/src/services'
import {
  getTimestampType,
  getQuarterDate,
  formatTime,
  getNearlyMonthDate,
  getStartOfOneMonth,
  getEndOfOneDate,
  getStartOfOneReason,
  getEndOfOneReason
} from 'comm/src/utils/date'
export default {
  name: 'buildTotalDiffData',
  components: { ansoAntvG2 },
  props: { orgInfo: Object, orgTypeId: String },
  data() {
    return {
      loading: false,
      title: this.orgInfo.treeName,
      chartId: 'buildTotalDiffData',
      form: { queryType: '1', dateArr: getNearlyMonthDate() },
      xDateType: 'YYYY-MM-DD',
      formList: [
        {
          name: '',
          field: 'queryType',
          placeholder: '请选择',
          type: 'custom',
          model: '1',
          custom: () => {
            return (
              <el-radio-group v-model={this.form.queryType} size="mini">
                <el-radio-button label="1">日</el-radio-button>
                <el-radio-button label="2">月</el-radio-button>
                <el-radio-button label="3">季</el-radio-button>
                <el-radio-button label="4">年</el-radio-button>
              </el-radio-group>
            )
          }
        },
        {
          name: '',
          field: 'dateArr',
          type: 'date',
          model: getNearlyMonthDate(),
          dateType: 'daterange',
          format: 'yyyy-MM-dd',
          clearable: false,
          'value-format': 'timestamp',
          change: val => {
            this.form.dateArr = val
          }
        }
      ],
      chartConfig: {
        data: [],
        tooltip: {
          showMarkers: false,
          shared: true
        },
        legend: {
          marker: (name, index, item) => {
            return {
              symbol: name === '总分差率' ? 'hyphen' : 'square',
              style: {
                lineWidth: 1
              }
            }
          }
        },
        Annotation: {
          textList: [
            {
              position: ['start', 'end'],
              content: 'm³',
              style: {
                fill: '#8c8c8c',
                fontWeight: 300,
                fontSize: 13
              },
              offsetY: -20,
              offsetX: -10
            },
            {
              position: ['end', 'end'],
              content: '%',
              style: {
                fill: '#8c8c8c',
                fontWeight: 300,
                fontSize: 13
              },
              offsetY: -20,
              offsetX: 0
            }
          ]
        },
        scale: {
          value: {
            nice: true,
            alias: '水量(m³)',
            formatter: val => {
              return val ? val.toFixed(2) : val
            }
          },
          totalDifferenceRate: {
            nice: true,
            alias: '百分比(%)',
            formatter: val => {
              return val ? val.toFixed(2) : val
            }
          }
        },
        chartType: [
          {
            position: 'date*value',
            type: 'interval',
            color: 'type',
            adjust: [
              {
                type: 'dodge',
                marginRatio: 0
              }
            ]
          },
          {
            position: 'date*totalDifferenceRate',
            type: 'line',
            color: 'type'
          }
        ]
      },
      tableDataColumns: {
        columns: [],
        tableData: [],
        exportUrlParames: {}
      },
      queryStartTime: '',
      queryEndTime: ''
    }
  },
  created() {},
  mounted() {},
  methods: {
    async siteDataBtn() {
      this.title = this.orgInfo.treeName
      const parames = {
        queryType: this.form.queryType,
        dateArr: null,
        queryStartTime: this.form.queryType === '3' ? this.queryStartTime : this.form.dateArr[0],
        queryEndTime:
          this.form.queryType === '3'
            ? this.queryEndTime
            : this.form.queryType !== '4'
            ? getEndOfOneDate(this.form.dateArr[1])
            : '',
        objId: this.orgInfo.objId,
        orgTypeId: this.orgTypeId
      }
      if (parames.queryStartTime > parames.queryEndTime) {
        return this.$message.warning('开始时间不能大于结束时间！')
      }
      this.loading = true
      let { code, data } = await buildTotalDifference(parames)
      if (code === 200) {
        this.loading = false
        // const echartData = JSON.parse(JSON.stringify(data))
        const echartData = sortKeyOrder(JSON.parse(JSON.stringify(data)), 'date')
        echartData.forEach(element => {
          if (this.form.queryType === '3') {
            element.date = getQuarterDate(Number(element.date))
          } else {
            element.date = formatTime(Number(element.date), this.xDateType)
          }
        })
        let head = null
        if (this.form.queryType === '1') {
          head = [
            { prop: 'date', label: '日期', format: this.xDateType },
            { prop: 'supplyingWater', label: '供水量(m³)', align: 'right' },
            { prop: 'useWater', label: '用水量(m³)', align: 'right' },
            { prop: 'totalDifference', label: '总分差水量(m³)', align: 'right' },
            { prop: 'totalDifferenceRate', label: '总分差率(%)', align: 'right' },
            {
              prop: 'minimumFlow',
              label: '最小流量(m³/h)',
              operate: 'operate',
              align: 'right',
              render: (row, prop) => {
                if (row[prop] !== null) {
                  return <span style="padding-right:37px">{row[prop]}</span>
                } else {
                  return <span style="padding-right:37px;color:#bfbfbf">--</span>
                }
              }
            }
          ]
        } else {
          head = [
            { prop: 'date', label: '日期', format: this.xDateType },
            { prop: 'supplyingWater', label: '供水量(m³)', align: 'right' },
            { prop: 'useWater', label: '用水量(m³)', align: 'right' },
            { prop: 'totalDifference', label: '总分差水量(m³)', align: 'right' },
            {
              prop: 'totalDifferenceRate',
              label: '总分差率(%)',
              align: 'right',
              operate: 'operate',
              render: (row, prop) => {
                if (row[prop]) {
                  return <span style="padding-right:37px">{row[prop]}</span>
                } else {
                  return <span style="padding-right:37px;color:#bfbfbf">--</span>
                }
              }
            }
          ]
        }
        this.echartInit(echartData)
        this.tableDataColumns.columns = head
        this.tableDataColumns.tableData = data
        this.tableDataColumns.exportUrlParames = {
          url: buildTotalDifferenceExport,
          parames: parames
        }
        this.$emit('getDataTable', this.tableDataColumns)
      } else {
        this.loading = false
      }
    },
    switchDateType() {
      let currMonth = null
      let currQuarter = null
      let currYear = null
      switch (this.form.queryType) {
        case '1':
          this.formList[1] = {
            field: 'dateArr',
            type: 'custom',
            custom: () => {
              return (
                <el-date-picker
                  v-model={this.form.dateArr}
                  type="daterange"
                  range-separator="-"
                  clearable={false}
                  value-format="timestamp"
                  format="yyyy-MM-dd "
                ></el-date-picker>
              )
            }
          }
          this.form.dateArr = getNearlyMonthDate()
          this.xDateType = 'YYYY-MM-DD'
          this.tableDataColumns.columns[0].format = this.xDateType
          break
        case '2':
          this.formList[1] = {
            name: '',
            field: 'dateArr',
            type: 'custom',
            custom: () => {
              return (
                <el-date-picker
                  v-model={this.form.dateArr}
                  type="monthrange"
                  clearable={false}
                  range-separator="-"
                  value-format="timestamp"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                ></el-date-picker>
              )
            }
          }
          this.form.dateArr = [
            getStartOfOneMonth(getTimestampType(1, 'year', 'start', 'before')),
            getEndOfOneDate(new Date().getTime())
          ]
          this.xDateType = 'YYYY-MM'
          this.tableDataColumns.columns[0].format = this.xDateType
          break
        case '3':
          this.formList[1] = {
            name: '',
            field: 'dateArr',
            type: 'custom',
            custom: () => {
              return (
                <div>
                  <anso-quarter v-model={this.queryStartTime} reasonType="start"></anso-quarter>
                  <span>-</span>
                  <anso-quarter v-model={this.queryEndTime} reasonType="end"></anso-quarter>
                </div>
              )
            }
          }
          currYear = new Date().getFullYear()
          currMonth = new Date().getMonth() + 1
          currQuarter = Math.floor(currMonth % 3 == 0 ? currMonth / 3 : currMonth / 3 + 1)
          this.queryStartTime = getStartOfOneReason((currYear - 1).toString(), currQuarter)
          this.queryEndTime = getEndOfOneReason(currYear.toString(), currQuarter)
          this.xDateType = 'Q'
          this.tableDataColumns.columns[0].format = this.xDateType
          break
        case '4':
          this.formList.pop()
          this.form.dateArr = ['', '']
          this.xDateType = 'YYYY'
          this.tableDataColumns.columns[0].format = this.xDateType
      }
      this.siteDataBtn()
    },
    // 加载图表
    echartInit(data) {
      let ds = new this.$dv()
      let dv = ds.createView().source(data)
      dv.transform({
        type: 'fold',
        fields:
          this.form.queryType === '1'
            ? ['supplyingWater', 'useWater', 'totalDifferenceRate']
            : ['supplyingWater', 'useWater'],
        key: 'type',
        value: 'value'
      })
      dv.rows.map(res => {
        if (res.type === 'supplyingWater') {
          res.type = '供水量'
        } else if (res.type === 'useWater') {
          res.type = '用水量'
        } else if (res.type === 'totalDifferenceRate') {
          res.type = '总分差率'
          res.totalDifferenceRate = res.value
          res.value = null
        }
      })
      // this.chartConfig.data = dv.rows
      console.log(dv.rows)
      this.$set(this.chartConfig, 'data', dv.rows)
    },
    handleQuery() {
      this.siteDataBtn()
    }
  },
  watch: {
    orgInfo: {
      immediate: true,
      handler(val) {
        if (!val) return
        this.siteDataBtn()
      }
    },
    'form.queryType': {
      immediate: false,
      handler(val) {
        if (!val) return
        this.form.queryType = val
        this.switchDateType()
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
