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
import { dmaEvaluateTarget, dmaEvaluateTargetExport } from 'comm/src/services'
export default {
  name: 'dmaEvalTarData',
  components: { ansoAntvG2 },
  props: { orgInfo: Object, orgTypeId: String },
  data() {
    return {
      loading: false,
      title: this.orgInfo.treeName,
      chartId: 'dmaEvalTarData',
      form: { dateArr: getNearlyMonthDate() },
      formList: [
        {
          name: '',
          field: 'dateArr',
          type: 'date',
          dateType: 'daterange',
          format: 'yyyy-MM-dd',
          clearable: false,
          model: getNearlyMonthDate(),
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
        axis: [
          {
            key: 'fluxValue',
            value: {
              position: 'left',
              title: null,
              label: {
                offset: 50
              }
            }
          },
          {
            key: 'waterValue',
            value: {
              position: 'left',
              title: null,
              grid: {
                type: 'line'
              }
            }
          },
          {
            key: 'rateValue',
            value: {
              position: 'right',
              title: null
            }
          }
        ],
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
              offsetX: -70
            },
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
          fluxValue: {
            nice: true,
            formatter: val => {
              return val ? parseFloat(val).toFixed(2) : val
            }
          },
          waterValue: {
            nice: true,
            formatter: val => {
              return val ? parseFloat(val).toFixed(2) : val
            }
          },
          rateValue: {
            nice: true,
            formatter: val => {
              return val ? parseFloat(val).toFixed(2) : val
            }
          }
        },
        legendSelected: {
          供水量: true,
          用水量: true,
          总分差水量: true,
          最小流量: true,
          合理用水: true,
          降漏空间: true,
          漏失水量: false,
          物理漏失率: false,
          单位管长净最小流量: false,
          单位连接净最小流量: false,
          'MF/日均': false
        },
        chartType: [
          {
            position: 'date*waterValue',
            type: 'line',
            color: 'type'
          },
          {
            position: 'date*fluxValue',
            type: 'line',
            color: 'type'
          },
          {
            position: 'date*rateValue',
            type: 'line',
            color: 'type'
          }
        ]
      },
      tableDataColumns: {
        columns: [
          {
            prop: 'date',
            label: '日期',
            format: 'YYYY-MM-DD',
            minWidth: '90px'
          },
          {
            prop: 'supplyingWater',
            label: '供水量(m³)',
            minWidth: '90px',
            align: 'right'
          },
          {
            prop: 'useWater',
            label: '用水量(m³)',
            minWidth: '90px',
            align: 'right'
          },
          {
            prop: 'totalDifference',
            label: '总分差水量(m³)',
            minWidth: '120px',
            align: 'right'
          },
          {
            prop: 'minimumFlow',
            label: '最小流量(m³/h)',
            minWidth: '120px',
            align: 'right'
          },
          {
            prop: 'rationalUseWater',
            label: '合理用水(m³/h)',
            minWidth: '120px',
            align: 'right'
          },
          {
            prop: 'leakDropSpace',
            label: '降漏空间(m³/h)',
            minWidth: '120px',
            align: 'right'
          },
          {
            prop: 'leakWater',
            label: '漏失水量(m³)',
            minWidth: '100px',
            align: 'right'
          },
          {
            prop: 'leakRate',
            label: '物理漏失率(%)',
            minWidth: '110px',
            align: 'right'
          },
          {
            prop: 'pipeMinimumFlow',
            label: '单位管长净最小流量(m³/h)',
            minWidth: '180px',
            align: 'right'
          },
          {
            prop: 'linkMinimumFlow',
            label: '单位连接净最小流量(m³/h)',
            minWidth: '180px',
            align: 'right'
          },
          {
            prop: 'averageDaily',
            label: 'MF/日均(%)',
            minWidth: '140px',
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
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    async siteDataBtn() {
      this.title = this.orgInfo.treeName
      const parames = {
        objId: this.orgInfo.objId,
        orgTypeId: this.orgTypeId,
        queryStartTime: this.form.dateArr[0],
        queryEndTime: getEndOfOneDate(this.form.dateArr[1])
      }
      this.loading = true
      let { code, data } = await dmaEvaluateTarget(parames)
      if (code === 200) {
        this.loading = false
        const echartData = JSON.parse(JSON.stringify(data))
        echartData.forEach(element => {
          element.date = getYMDDate(Number(element.date))
        })
        this.echartInit(echartData)
        this.tableDataColumns.tableData = data
        this.tableDataColumns.exportUrlParames = {
          url: dmaEvaluateTargetExport,
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
        fields: [
          'supplyingWater',
          'useWater',
          'totalDifference',
          'minimumFlow',
          'rationalUseWater',
          'leakDropSpace',
          'leakWater',
          'leakRate',
          'pipeMinimumFlow',
          'linkMinimumFlow',
          'averageDaily'
        ],
        key: 'type',
        value: 'value'
      })
      dv.rows.map(res => {
        if (res.type === 'supplyingWater') {
          res.type = '供水量'
          res.waterValue = res.value
        } else if (res.type === 'useWater') {
          res.type = '用水量'
          res.waterValue = res.value
        } else if (res.type === 'totalDifference') {
          res.type = '总分差水量'
          res.waterValue = res.value
        } else if (res.type === 'minimumFlow') {
          res.type = '最小流量'
          res.fluxValue = res.value
        } else if (res.type === 'rationalUseWater') {
          res.type = '合理用水'
          res.fluxValue = res.value
        } else if (res.type === 'leakDropSpace') {
          res.type = '降漏空间'
          res.fluxValue = res.value
        } else if (res.type === 'leakWater') {
          res.type = '漏失水量'
          res.waterValue = res.value
        } else if (res.type === 'leakRate') {
          res.type = '物理漏失率'
          res.rateValue = res.value
        } else if (res.type === 'pipeMinimumFlow') {
          res.type = '单位管长净最小流量'
          res.fluxValue = res.value
        } else if (res.type === 'linkMinimumFlow') {
          res.type = '单位连接净最小流量'
          res.fluxValue = res.value
        } else if (res.type === 'averageDaily') {
          res.type = 'MF/日均'
          res.rateValue = res.value
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
