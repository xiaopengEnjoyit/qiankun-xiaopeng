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
import { houseMeterUser, houseMeterUserExport } from 'comm/src/services'
export default {
  name: 'houseMeterUser',
  components: { ansoAntvG2 },
  props: { orgInfo: Object, orgTypeId: String },
  data() {
    return {
      loading: false,
      chartId: 'houseMeterUser',
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
        legend: true,
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
        columns: [
          { prop: 'date', label: '日期', format: 'YYYY-MM-DD' },
          {
            prop: 'useWater',
            label: '用水量(m³)',
            align: 'right',
            operate: 'operate'
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
      const parames = {
        isTransfer: this.orgInfo.isTransfer,
        queryStartTime: this.form.dateArr[0],
        queryEndTime: getEndOfOneDate(this.form.dateArr[1]),
        objId: this.orgInfo.objId,
        orgTypeId: this.orgTypeId
      }
      this.loading = true
      let { code, data } = await houseMeterUser(parames)
      if (code === 200) {
        this.loading = false
        const echartData = JSON.parse(JSON.stringify(data))
        echartData.forEach(element => {
          element.date = getYMDDate(Number(element.date))
        })
        this.echartInit(echartData)
        this.tableDataColumns.tableData = data
        this.tableDataColumns.exportUrlParames = {
          url: houseMeterUserExport,
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
        fields: ['useWater'],
        key: 'type',
        value: 'value'
      })
      dv.rows.map(res => {
        if (res.type === 'useWater') {
          res.type = '用水量'
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
