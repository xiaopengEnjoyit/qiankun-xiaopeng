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
import { areaDmaSupplyUserWater, areaDmaSupplyUserWaterExport } from 'comm/src/services'

import {
  getTimestampType,
  getQuarterDate,
  formatTime,
  getNearlyMonthDate,
  getEndOfOneDate,
  getStartOfOneReason,
  getEndOfOneReason
} from 'comm/src/utils/date'

export default {
  name: 'areaDmaSupplyWater',
  components: { ansoAntvG2 },
  props: { orgInfo: Object, orgTypeId: String },
  data() {
    return {
      loading: false,
      title: this.orgInfo.treeName,
      chartId: 'areaDmaSupplyWater',
      form: { queryType: '1', dateArr: getNearlyMonthDate() },
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
          clearable: false,
          model: getNearlyMonthDate(),
          dateType: 'daterange',
          format: 'yyyy-MM-dd',
          'value-format': 'timestamp',
          change: val => {
            this.form.dateArr = val
          }
        }
      ],
      chartConfig: {
        data: [],
        tooltip: {
          showMarkers: true,
          shared: true
        },
        legend: true,
        scale: {
          value: {
            nice: true,
            formatter: val => {
              return val ? val.toFixed(2) : val
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
              offsetX: -20
            }
          ]
        },
        chartType: [
          {
            position: 'dateTime*value',
            type: 'line',
            color: 'type'
          },
          {
            position: 'dateTime*value',
            type: 'point',
            color: 'type'
          }
        ]
      },
      tableDataColumns: {
        columns: [],
        tableData: [],
        exportUrlParames: {}
      },
      xDateType: 'YYYY-MM-DD',
      queryStartTime: '',
      queryEndTime: ''
    }
  },
  created() {},
  mounted() {
    this.$emit('showTable', true)
  },
  methods: {
    async siteDataBtn() {
      this.title = this.orgInfo.treeName
      const parames = {
        tag: 'supply',
        objType: this.orgInfo.objType === 3 ? 'dma' : 'area',
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
      let { code, data } = await areaDmaSupplyUserWater(parames)
      if (code === 200) {
        this.loading = false
        if (this.form.queryType === '1') {
          this.xDateType = 'YYYY-MM-DD'
        } else if (this.form.queryType === '2') {
          this.xDateType = 'YYYY-MM'
        } else if (this.form.queryType === '3') {
          this.xDateType = 'Q'
        } else if (this.form.queryType === '4') {
          this.xDateType = 'YYYY'
        }
        let head = []
        let body = []
        // head表头处理
        if (data.head === null) {
          head = []
          body = []
        } else {
          head = data.head.map(j => {
            return {
              prop: j.id,
              label: `${j.name === null ? '--' : j.name}(${j.isIntoMeter ? '入口表' : '出口表'})`,
              align: 'right',
              'min-width': '180px'
            }
          })
          body = data.body
        }
        head.unshift(
          {
            prop: 'dateTime',
            label: '日期',
            format: this.xDateType,
            'min-width': '100px'
          },
          {
            prop: 'total',
            label: '供水量(m³)',
            align: 'right',
            'min-width': '100px'
          }
        )
        head[head.length - 1]['operate'] = 'operate'
        head[head.length - 1]['render'] = (row, prop) => {
          if (row[prop] !== null) {
            return <span style="padding-right:37px">{row[prop]}</span>
          } else {
            return <span style="padding-right:37px;color:#bfbfbf">--</span>
          }
        }
        //图表时间根据类型处理格式
        // const echartData = JSON.parse(JSON.stringify(body))
        const echartData = sortKeyOrder(JSON.parse(JSON.stringify(body)), 'dateTime')
        echartData.forEach(element => {
          if (this.form.queryType === '3') {
            element.dateTime = getQuarterDate(Number(element.dateTime))
          } else {
            element.dateTime = formatTime(Number(element.dateTime), this.xDateType)
          }
        })
        this.echartInit(echartData, head)
        this.tableDataColumns.columns = head
        this.tableDataColumns.tableData = body
        this.tableDataColumns.exportUrlParames = {
          url: areaDmaSupplyUserWaterExport,
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
          this.form.dateArr = [getTimestampType(1, 'year', 'start', 'before'), getEndOfOneDate(new Date().getTime())]
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
          currMonth = new Date().getMonth() + 1
          currQuarter = Math.floor(currMonth % 3 == 0 ? currMonth / 3 : currMonth / 3 + 1)
          currYear = new Date().getFullYear()
          this.queryStartTime = getStartOfOneReason((currYear - 1).toString(), currQuarter)
          this.queryEndTime = getEndOfOneReason(currYear.toString(), currQuarter)
          break
        case '4':
          this.formList.pop()
          this.form.dateArr = ['', '']
      }
      this.siteDataBtn()
    },
    // 加载图表
    echartInit(data, head) {
      let ds = new this.$dv()
      let dv = ds.createView().source(data)
      dv.transform({
        type: 'fold',
        fields: this.getDataKeys(head),
        key: 'type',
        value: 'value'
      })
      // 图例需要展示的字段中文名
      dv.rows.map(res => {
        const type = head.find(j => {
          return j.prop === res.type
        })
        res.type = type.label
      })
      console.log(dv.rows)
      this.chartConfig.data = dv.rows
    },
    // 动态筛选处理的keys
    getDataKeys(data) {
      const keys = []
      data.forEach(j => {
        keys.push(j.prop)
      })
      return keys.slice(1)
    },
    handleQuery(form) {
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
