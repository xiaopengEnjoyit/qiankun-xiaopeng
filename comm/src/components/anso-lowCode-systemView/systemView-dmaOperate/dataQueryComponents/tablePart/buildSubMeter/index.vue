<template>
  <div class="container-fluid" v-loading="loading">
    <div class="ansoForm">
      <anso-title-form
        :form="form"
        :formList="formList"
        :exportBtn="true"
        @handleQuery="handleQuery"
        @exportQuery="exportQuery"
      ></anso-title-form>
    </div>
    <anso-table :columns="columns" :tableData="tableData"> </anso-table>
    <anso-drawer
      ref="ansoDrawer"
      :size="'large'"
      :title="objInfo.objName"
      :customClass="'leakageEvaluation'"
      :isShowFooter="false"
      @cancel="cancelDrawer"
    >
      <leakQueryDetail v-if="ansoDrawer" :objInfo="objInfo"> </leakQueryDetail>
    </anso-drawer>
  </div>
</template>

<script>
import ansoDrawer from 'comm/src/components/anso-drawer'
import { buildSubMeterList, buildSubMeterListExport } from 'comm/src/services'

export default {
  name: 'buildSubMeter',
  components: {
    ansoDrawer,
    leakQueryDetail: () =>
      import('comm/src/components/anso-lowCode-systemView/systemView-dmaOperate/dialogCommView/leakQueryDetail')
  },
  props: { orgInfo: Object },
  data() {
    return {
      form: {},
      formList: [
        {
          name: '关键字',
          field: 'keyWord',
          placeholder: '请输入用户名称、用户编号、设备编号',
          width: '260px',
          clearable: true,
          enter: val => {
            this.form.keyWord = val
            this.handleQuery(this.form)
          }
        },
        {
          name: '异常类型',
          field: 'errorType',
          placeholder: '请选择',
          type: 'select',
          width: '120px',
          options: [
            { label: '正常', value: 1 },
            { label: '水量为零', value: 2 },
            { label: '水量为负', value: 3 },
            { label: '无数据', value: 4 },
            { label: '大水量(>5)', value: 5 }
          ]
        },
        {
          name: '日期',
          field: 'date',
          type: 'date',
          dateType: 'date',
          format: 'yyyy-MM-dd',
          clearable: false,
          'value-format': 'timestamp'
        }
      ],
      columns: [
        {
          prop: 'date',
          label: '日期',
          format: 'YYYY-MM-DD HH:mm:ss',
          width: '110px'
        },
        { prop: 'dailyWater', label: '日均用水量', width: '90px' },
        {
          prop: 'meterReadTime',
          label: '本次抄表时间',
          format: 'YYYY-MM-DD HH:mm:ss',
          width: '110px'
        },
        { prop: 'meterReading', label: '本次抄表读数', width: '110px' },
        {
          prop: 'firstMeterReadTime',
          label: '上次抄表时间',
          format: 'YYYY-MM-DD HH:mm:ss',
          width: '110px'
        },
        { prop: 'firstMeterReading', label: '上次抄表读数', width: '110px' },
        { prop: 'waterDeficit', label: '水量差值' },
        { prop: 'gapDays', label: '间隔天数' },
        {
          prop: 'waterUserName',
          label: '用户名称',
          render: fullData => {
            return (
              <el-link
                type="primary"
                onClick={() => {
                  this.deviceDetail(fullData)
                }}
              >
                {fullData.waterUserName}
              </el-link>
            )
          }
        },
        { prop: 'waterUserCode', label: '用户编号' },
        { prop: 'pointAddress', label: '接水点地址', width: '90px' },
        { prop: 'deviceCode', label: '设备编号' },
        {
          prop: 'purposeName',
          label: '表用途'
        },
        {
          prop: 'caliberName',
          label: '口径'
        },
        {
          prop: 'manufacturerName',
          label: '厂家'
        },
        { prop: 'isTransfer', label: '是否远传' },
        {
          prop: 'errorType',
          label: '异常类型',
          render: (row, prop) => {
            let htmlText = ''
            if (row[prop] === 1) {
              htmlText = '正常'
            } else if (row[prop] === 2) {
              htmlText = '水量为零'
            } else if (row[prop] === 3) {
              htmlText = '水量为负'
            } else if (row[prop] === 4) {
              htmlText = '无数据'
            } else if (row[prop] === 5) {
              htmlText = '大水量(>5)'
            }
            return <span>{htmlText}</span>
          }
        }
      ],
      tableData: [],
      objInfo: {},
      ansoDrawer: false,
      loading: false
    }
  },
  created() {},
  mounted() {
    this.siteDataBtn()
  },
  methods: {
    async siteDataBtn() {
      if (!this.orgInfo.objId) return
      this.loading = true
      let { code, data } = await buildSubMeterList({
        ...this.form,
        objId: this.orgInfo.objId,
        pageAble: false
      })
      if (code === 200) {
        this.loading = false
        this.tableData = data.records
      } else {
        this.loading = false
      }
    },
    // dma详情
    deviceDetail(val) {
      val.objId = val.pointId
      val.objName = val.waterUserName
      val.objType = 5
      this.objInfo = val
      this.ansoDrawer = true
      this.$refs.ansoDrawer.open()
    },
    // 抽屉关闭
    cancelDrawer() {
      this.ansoDrawer = false
    },
    handleQuery(form) {
      this.form = form
      this.siteDataBtn()
    },
    async exportQuery(form) {
      let parames = {
        ...this.form,
        objId: this.orgInfo.objId
      }
      await buildSubMeterListExport(parames)
    }
  },
  watch: {
    orgInfo: {
      immediate: false,
      handler(val) {
        if (!val) return
        this.siteDataBtn()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ansoForm {
  padding-bottom: 10px;
  /deep/.el-input__inner {
    font-size: 12px;
  }
  /deep/ .el-form-item__label {
    line-height: 32px !important;
    padding: 0 8px !important;
  }
}
/deep/.table-wrap {
  height: calc(100% - 58px);
}
</style>
