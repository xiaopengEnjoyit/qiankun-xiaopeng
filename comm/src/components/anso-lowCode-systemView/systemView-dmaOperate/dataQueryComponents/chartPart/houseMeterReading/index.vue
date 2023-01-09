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
import { getYMDDate, getNearlyMonthDate, getEndOfOneDate } from 'comm/src/utils/date.js'
import { houseMeterReading, houseMeterReadingExport } from 'comm/src/services'

export default {
  name: 'houseMeterReading',
  components: { ansoAntvG2 },
  props: { orgInfo: Object, orgTypeId: String },
  data() {
    return {
      loading: false,
      chartId: 'houseMeterReading',
      form: { dateArr: getNearlyMonthDate() },
      formList: [
        {
          name: '',
          field: 'dateArr',
          type: 'date',
          dateType: 'daterange',
          clearable: false,
          model: getNearlyMonthDate(),
          format: 'yyyy-MM-dd',
          'value-format': 'timestamp'
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
              symbol: name === '物理漏失率' ? 'hyphen' : 'square',
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
        columns: [],
        tableData: [],
        exportUrlParames: {}
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    async siteDataBtn() {
      if (this.orgInfo.isTransfer) {
        this.tableDataColumns.columns = [
          { prop: 'date', label: '日期', format: 'YYYY-MM-DD' },
          {
            prop: 'meterReading',
            label: '抄表读数(m³)',
            align: 'right',
            operate: 'operate'
          }
        ]
      } else {
        this.tableDataColumns.columns = [
          { prop: 'date', label: '日期', format: 'YYYY-MM-DD' },
          { prop: 'meterReading', label: '抄表读数(m³)', align: 'right' },
          { prop: 'collectInterval', label: '周期天数', align: 'right' },
          { prop: 'collectUseWater', label: '周期水量(m³)', align: 'right' },
          {
            prop: 'averageUseWater',
            label: '日均水量(m³)',
            align: 'right',
            operate: 'operate'
          }
        ]
      }
      const parames = {
        isTransfer: this.orgInfo.isTransfer,
        queryStartTime: this.form.dateArr[0],
        queryEndTime: getEndOfOneDate(this.form.dateArr[1]),
        objId: this.orgInfo.objId,
        orgTypeId: this.orgTypeId
      }
      this.loading = true
      let { code, data } = await houseMeterReading(parames)
      if (code === 200) {
        this.loading = false
        const echartData = JSON.parse(JSON.stringify(data))
        echartData.forEach(element => {
          element.date = getYMDDate(Number(element.date))
        })
        this.echartInit(echartData)
        this.tableDataColumns.tableData = data
        this.tableDataColumns.exportUrlParames = {
          url: houseMeterReadingExport,
          parames: parames
        }
        this.$emit('getDataTable', this.tableDataColumns)
      } else {
        this.loading = false
      }
    },
    // 加载图表
    echartInit(data) {
      let ds = new this.$dv()
      let dv = ds.createView().source(data)
      dv.transform({
        type: 'fold',
        fields: ['meterReading'],
        key: 'type',
        value: 'value'
      })
      dv.rows.map(res => {
        if (res.type === 'meterReading') {
          res.type = '抄表读数'
        } else if (res.type === 'collectInterval') {
          res.type = '周期天数'
        } else if (res.type === 'collectUseWater') {
          res.type = '周期水量'
        } else if (res.type === 'averageUseWater') {
          res.type = '日均水量'
        }
      })
      this.chartConfig.data = dv.rows
    },
    filterColumns() {
      if (this.orgInfo.isTransfer) {
        return ['meterReading']
      } else {
        return ['meterReading', 'collectInterval', 'collectUseWater', 'averageUseWater']
      }
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
