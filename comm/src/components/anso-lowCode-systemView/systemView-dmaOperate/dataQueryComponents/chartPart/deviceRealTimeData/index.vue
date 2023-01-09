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
import { getYMDHMDate, getNearlyWeekDate, getEndOfOneDate } from 'comm/src/utils/date.js'
import { deviceRealTimeData, deviceRealTimeDataExport } from 'comm/src/services'

export default {
  name: 'deviceRealTimeData',
  components: { ansoAntvG2 },
  props: { orgInfo: Object, orgTypeId: String },
  data() {
    return {
      loading: false,
      title: this.orgInfo.treeName,
      chartId: 'deviceRealTimeData',
      axisUnit: 'm³/h',
      axisUnitName: '流量',
      form: {
        chartType: 'instantFlow',
        isInterpolate: 0,
        dateArr: getNearlyWeekDate()
      },
      formList: [
        {
          name: '',
          field: 'isInterpolate',
          placeholder: '请选择',
          type: 'select',
          width: '120px',
          model: 0,
          clearable: false,
          options: [
            { label: '原始数据', value: 0 },
            { label: '治理数据', value: 1 }
          ]
        },
        {
          name: '',
          field: 'chartType',
          placeholder: '请选择',
          type: 'select',
          clearable: false,
          model: 'instantFlow',
          width: '120px',
          options: [
            { label: '瞬时流量', value: 'instantFlow' },
            { label: '正累计', value: 'opinionTotal' },
            { label: '反累计', value: 'reverseTotal' },
            { label: '净累计', value: 'netTotal' },
            { label: '压力', value: 'pressure' }
          ],
          change: val => {
            if (val.length) {
              this.form.chartType = val
              switch (val) {
                case 'instantFlow':
                  this.axisUnit = 'm³/h'
                  this.axisUnitName = '流量'
                  break
                case 'opinionTotal':
                case 'reverseTotal':
                case 'netTotal':
                  this.axisUnit = 'm³'
                  this.axisUnitName = '水量'
                  break
                case 'pressure':
                  this.axisUnit = 'MPa'
                  this.axisUnitName = '压力'
                  break
              }
              this.echartInit()
            }
          }
        },
        {
          name: '',
          field: 'dateArr',
          type: 'date',
          dateType: 'daterange',
          format: 'yyyy-MM-dd',
          clearable: false,
          model: getNearlyWeekDate(),
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
        Annotation: {
          textList: [
            {
              position: ['start', 'end'],
              content: '',
              style: {
                fill: '#8c8c8c',
                fontWeight: 300,
                fontSize: 13
              },
              offsetY: -20,
              offsetX: -10
            }
          ]
        },
        scale: {
          value: {
            nice: true,
            formatter: val => {
              return val ? val.toFixed(2) : val
            }
          }
        },
        chartType: [
          {
            position: 'date*value',
            type: 'line',
            color: 'type'
          }
        ]
      },
      tableDataColumns: {
        columns: [
          { prop: 'date', label: '日期', format: 'YYYY-MM-DD HH:mm' },
          { prop: 'instantFlow', label: '瞬时流量(m³/h)', align: 'right' },
          { prop: 'opinionTotal', label: '正累计(m³)', align: 'right' },
          { prop: 'reverseTotal', label: '反累计(m³)', align: 'right' },
          { prop: 'netTotal', label: '净累计(m³)', align: 'right' },
          {
            prop: 'pressure',
            label: '压力(MPa)',
            align: 'right',
            operate: 'operate',
            render: (row, prop) => {
              if (row[prop] !== null) {
                return <span style="padding-right:37px">{row[prop]}</span>
              } else {
                return <span style="padding-right:37px;color:#bfbfbf">--</span>
              }
            }
          }
        ],
        tableData: [],
        exportUrlParames: {}
      },
      echartData: []
    }
  },
  created() {},
  mounted() {},
  methods: {
    async siteDataBtn() {
      this.title = this.orgInfo.treeName
      const parames = {
        isInterpolate: this.form.isInterpolate,
        queryStartTime: this.form.dateArr[0],
        queryEndTime: getEndOfOneDate(this.form.dateArr[1]),
        objId: this.orgInfo.objId,
        orgTypeId: this.orgTypeId
      }
      this.loading = true
      let { code, data } = await deviceRealTimeData(parames)
      if (code === 200) {
        this.loading = false
        const echartData = sortKeyOrder(JSON.parse(JSON.stringify(data)), 'date')
        echartData.forEach(element => {
          element.date = getYMDHMDate(Number(element.date))
        })
        this.echartData = echartData
        this.tableDataColumns.tableData = data
        this.tableDataColumns.exportUrlParames = {
          url: deviceRealTimeDataExport,
          parames: parames
        }
        this.$emit('getDataTable', this.tableDataColumns)
        this.echartInit()
      } else {
        this.loading = false
      }
    },
    // 加载图表
    echartInit() {
      let ds = new this.$dv()
      let dv = ds.createView().source(this.echartData)
      dv.transform({
        type: 'fold',
        fields: [this.form.chartType],
        key: 'type',
        value: 'value'
      })
      dv.rows.map(res => {
        if (res.type === 'instantFlow') {
          res.type = '瞬时流量'
        } else if (res.type === 'opinionTotal') {
          res.type = '正累计'
        } else if (res.type === 'reverseTotal') {
          res.type = '反累计'
        } else if (res.type === 'netTotal') {
          res.type = '净累计'
        } else if (res.type === 'pressure') {
          res.type = '压力'
        }
      })
      this.chartConfig.Annotation.textList[0].content = this.axisUnit
      this.chartConfig.data = dv.rows
    },
    handleQuery(form) {
      this.form = form
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
