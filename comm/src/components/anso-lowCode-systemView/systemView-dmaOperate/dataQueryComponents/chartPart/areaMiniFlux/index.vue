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
import { getYMDDate, getNearlyMonthDate } from 'comm/src/utils/date.js'
import { areaMinimumFlow, areaMinimumFlowExport } from 'comm/src/services'
export default {
  name: 'areaMiniFlux',
  components: { ansoAntvG2 },
  props: { orgInfo: Object, orgTypeId: String },
  data() {
    return {
      loading: false,
      title: this.orgInfo.treeName,
      chartId: 'areaMiniFlux',
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
            key: 'value'
          }
        ],
        legend: {
          marker: (name, index, item) => {
            return {
              symbol: name === '供水量' ? 'square' : 'hyphen',
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
              offsetX: -20
            },
            {
              position: ['end', 'end'],
              content: 'm³/h',
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
          intervalValue: {
            nice: true,
            // alias: '水量(m³)',
            formatter: val => {
              return val ? val.toFixed(2) : val
            }
          },
          value: {
            nice: true,
            // alias: '最小流量(m³/h)',
            formatter: val => {
              return val ? val.toFixed(2) : val
            }
          }
        },
        chartType: [
          {
            position: 'date*intervalValue',
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
            position: 'date*value',
            type: 'line',
            color: 'type'
          }
        ]
      },
      tableDataColumns: {
        columns: [
          { prop: 'date', label: '日期', format: 'YYYY-MM-DD' },
          { prop: 'supplyingWater', label: '供水量(m³)', align: 'right' },
          {
            prop: 'regionalMinimumFlow',
            label: '区域最小流量(m³/h)',
            align: 'right'
          },
          {
            prop: 'lowerTotalMinimumFlow',
            label: '下级总最小流量(m³/h)',
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
        queryStartTime: this.form.dateArr[0],
        queryEndTime: this.form.dateArr[1],
        objId: this.orgInfo.objId,
        orgTypeId: this.orgTypeId
      }
      this.loading = true
      let { code, data } = await areaMinimumFlow(parames)
      if (code === 200) {
        this.loading = false
        const echartData = JSON.parse(JSON.stringify(data))
        echartData.forEach(element => {
          element.date = getYMDDate(Number(element.date))
        })
        this.echartInit(echartData)
        this.tableDataColumns.tableData = data
        this.tableDataColumns.exportUrlParames = {
          url: areaMinimumFlowExport,
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
        fields: ['supplyingWater', 'regionalMinimumFlow', 'lowerTotalMinimumFlow'],
        key: 'type',
        value: 'value'
      })
      dv.rows.map(res => {
        if (res.type === 'supplyingWater') {
          res.type = '供水量'
          res.intervalValue = res.value
          res.value = null
        } else if (res.type === 'regionalMinimumFlow') {
          res.type = '区域最小流量'
        } else if (res.type === 'lowerTotalMinimumFlow') {
          res.type = '下级总最小流量'
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
