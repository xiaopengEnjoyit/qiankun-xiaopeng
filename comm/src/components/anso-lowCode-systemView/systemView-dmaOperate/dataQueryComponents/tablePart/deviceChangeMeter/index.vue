<template>
  <div class="anso-table-tab">
    <anso-table :columns="columns" :tableData="tableData"> </anso-table>
  </div>
</template>

<script>
import { deviceMeterRecoed } from 'comm/src/services'

export default {
  name: 'deviceChangeMeter',
  components: {},
  props: { orgInfo: Object },
  data() {
    return {
      columns: [
        { prop: 'deviceId', label: '仪表编号' },
        { prop: 'factoryCode', label: '出厂编号' },
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
        { prop: 'installAddress', label: '安装地址' },
        {
          prop: 'measureParamName',
          label: '测量参数'
        },
        {
          prop: 'communModelName',
          label: '通讯方式'
        },
        { prop: 'modifyUserName', label: '变更人' },
        {
          prop: 'modifyTime',
          label: '变更时间',
          format: 'YYYY-MM-DD HH:mm:ss',
          minWidth: '120px'
        },
        { prop: 'modifyReason', label: '换表原因' }
      ],
      tableData: []
    }
  },
  created() {},
  mounted() {
    this.siteDataBtn()
  },
  methods: {
    async siteDataBtn() {
      if (!this.orgInfo.objId) return
      let { code, data } = await deviceMeterRecoed({
        objId: this.orgInfo.objId
      })
      if (code === 200) {
        this.tableData = data
      }
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

<style lang="scss" scoped></style>
