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
import { getMDHMDate, getNearlyWeekDate, getEndOfOneDate } from 'comm/src/utils/date.js'
import { areaDmaRealTimeData, areaDmaRealTimeDataExport } from 'comm/src/services'

export default {
  name: 'areaDmaRealTimeData',
  components: { ansoAntvG2 },
  props: { orgInfo: Object, orgTypeId: String },
  data() {
    return {
      loading: false,
      title: this.orgInfo.treeName,
      chartId: 'areaDmaRealTimeData',
      axisUnit: 'm³/h',
      axisUnitName: '流量',
      totalType: '瞬时流量',
      form: {
        tag: 'rate',
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
          field: 'tag',
          placeholder: '请选择',
          type: 'select',
          model: 'rate',
          clearable: false,
          width: '120px',
          options: [
            { label: '瞬时流量', value: 'rate' },
            { label: '正累计', value: 'plus' },
            { label: '反累计', value: 'leak' },
            { label: '净累计', value: 'diff' },
            { label: '压力', value: 'pressure' }
          ],
          change: val => {
            if (val.length) {
              this.form.tag = val
              switch (val) {
                case 'rate':
                  this.axisUnit = 'm³/h'
                  this.axisUnitName = '流量'
                  break
                case 'plus':
                  this.axisUnit = 'm³'
                  this.axisUnitName = '水量'
                  break
                case 'leak':
                  this.axisUnit = 'm³'
                  this.axisUnitName = '水量'
                  break
                case 'diff':
                  this.axisUnit = 'm³'
                  this.axisUnitName = '水量'
                  break
                case 'pressure':
                  this.axisUnit = 'MPa'
                  this.axisUnitName = '压力'
                  break
              }
            }
            this.siteDataBtn()
          }
        },
        {
          name: '',
          field: 'dateArr',
          type: 'date',
          dateType: 'daterange',
          clearable: false,
          format: 'yyyy-MM-dd',
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
        legend: {
          offsetY: 6
        },
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
              offsetX: -30
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
        option: {
          key: 'slider',
          value: {
            start: 0.5,
            end: 1,
            trendCfg: {
              isArea: false
            }
          }
        },
        chartType: [
          {
            position: 'dateTime*value',
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
      const parames = {
        tag: this.form.tag,
        objType: this.orgInfo.objType === 3 ? 'dma' : 'area',
        isInterpolate: this.form.isInterpolate,
        queryStartTime: this.form.dateArr[0],
        queryEndTime: getEndOfOneDate(this.form.dateArr[1]),
        objId: this.orgInfo.objId,
        orgTypeId: this.orgTypeId
      }
      this.loading = true
      let { code, data } = await areaDmaRealTimeData(parames)
      if (code === 200) {
        this.loading = false
        // head表头处理
        let head = []
        let body = []
        if (data.head === null || data.body === null) {
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
        if (this.form.tag === 'rate') {
          head.unshift(
            {
              prop: 'dateTime',
              label: '日期',
              format: 'YYYY-MM-DD HH:mm',
              'min-width': '120px'
            },
            {
              prop: 'total',
              label: '瞬时流量',
              align: 'right',
              'min-width': '100px'
            }
          )
        } else {
          head.unshift({
            prop: 'dateTime',
            label: '日期',
            format: 'YYYY-MM-DD HH:mm'
          })
        }
        //图表时间根据类型处理格式
        const echartData = sortKeyOrder(JSON.parse(JSON.stringify(body)), 'dateTime')
        echartData.forEach(element => {
          element.dateTime = getMDHMDate(Number(element.dateTime))
        })
        this.echartInit(echartData, head)
        head.map((j, index) => {
          if (head.length - 1 === index) {
            j.operate = 'operate'
            j.render = (row, prop) => {
              if (row[prop] !== null) {
                return <span style="padding-right:37px">{row[prop]}</span>
              } else {
                return <span style="padding-right:37px;color:#bfbfbf">--</span>
              }
            }
          } else {
            j.operate = ''
          }
        })
        this.$nextTick(() => {
          this.$set(this.tableDataColumns, 'columns', head)
          console.log(head)
          // this.tableDataColumns.columns = head
          this.tableDataColumns.tableData = body
          this.tableDataColumns.exportUrlParames = {
            url: areaDmaRealTimeDataExport,
            parames: parames
          }
          this.$emit('getDataTable', this.tableDataColumns)
        })
      } else {
        this.loading = false
      }
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
      this.chartConfig.Annotation.textList[0].content = this.axisUnit
      this.chartConfig.data = dv.rows
    },
    // 筛选keys
    getDataKeys(data) {
      const keys = []
      data.forEach(j => {
        keys.push(j.prop)
      })
      return keys.slice(1)
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
