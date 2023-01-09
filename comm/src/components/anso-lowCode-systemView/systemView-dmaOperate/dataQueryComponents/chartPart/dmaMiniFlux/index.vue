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
import { dmaMinimumFlow, dmaMinimumFlowExport } from 'comm/src/services'
export default {
  name: 'dmaMiniFlux',
  components: { ansoAntvG2 },
  props: { orgInfo: Object, orgTypeId: String },
  data() {
    return {
      loading: false,
      title: this.orgInfo.treeName,
      chartId: 'dmaMiniFlux',
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
        axis: [
          {
            key: 'lineValue'
          }
        ],
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
              content: 'm³/h',
              style: {
                fill: '#8c8c8c',
                fontWeight: 300,
                fontSize: 13
              },
              offsetY: -20,
              offsetX: -30
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
              offsetX: 10
            }
          ]
        },
        scale: {
          value: {
            nice: true,
            formatter: val => {
              return val ? val.toFixed(2) : val
            }
          },
          lineValue: {
            nice: true,
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
            position: 'date*lineValue',
            type: 'line',
            color: 'type'
          }
        ]
      },
      tableDataColumns: {
        columns: [
          { prop: 'date', label: '日期', format: 'YYYY-MM-DD' },
          { prop: 'minimumFlow', label: '最小流量(m³/h)', align: 'right' },
          { prop: 'rationalUseWater', label: '合理用水(m³/h)', align: 'right' },
          { prop: 'leakDropSpace', label: '降漏空间(m³/h)', align: 'right' },
          { prop: 'leakRate', label: '物理漏失率(%)', align: 'right' },
          {
            prop: 'eventTypes',
            label: '报警状态',
            operate: 'operate',
            custom: true
          }
        ],
        tableData: [],
        exportUrlParames: {}
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    async siteDataBtn() {
      this.title = this.orgInfo.treeName
      const parames = {
        queryStartTime: this.form.dateArr[0],
        queryEndTime: getEndOfOneDate(this.form.dateArr[1]),
        objId: this.orgInfo.objId,
        orgTypeId: this.orgTypeId
      }
      this.loading = true
      let { code, data } = await dmaMinimumFlow(parames)
      if (code === 200) {
        this.loading = false
        const echartData = JSON.parse(JSON.stringify(data))
        echartData.forEach(element => {
          element.date = getYMDDate(Number(element.date))
        })
        this.echartInit(echartData)
        this.tableDataColumns.tableData = data
        this.tableDataColumns.exportUrlParames = {
          url: dmaMinimumFlowExport,
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
        fields: ['minimumFlow', 'rationalUseWater', 'leakDropSpace', 'leakRate'],
        key: 'type',
        value: 'value'
      })
      dv.rows.map(res => {
        if (res.type === 'leakRate') {
          res.type = '物理漏失率'
          res.lineValue = res.value
          res.value = null
        } else if (res.type === 'rationalUseWater') {
          res.type = '合理用水'
        } else if (res.type === 'leakDropSpace') {
          res.type = '降漏空间'
        } else if (res.type === 'minimumFlow') {
          res.type = '最小流量'
        }
      })
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
