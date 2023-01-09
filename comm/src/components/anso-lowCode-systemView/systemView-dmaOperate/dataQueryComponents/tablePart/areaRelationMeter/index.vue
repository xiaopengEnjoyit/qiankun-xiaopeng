<template>
  <div class="anso-table-tab">
    <anso-table :columns="columns" :tableData="tableData"> </anso-table>
  </div>
</template>

<script>
import { relatedAssess } from 'comm/src/services'

export default {
  name: 'areaRelationMeter',
  components: {},
  props: { orgInfo: Object },
  data() {
    return {
      columns: [
        {
          prop: 'waterUserName',
          label: '用户名称'
        },
        {
          prop: 'waterUserCode',
          label: '用户编号'
        },
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
        { prop: 'installAddress', label: '安装地址' },
        {
          prop: 'installTime',
          label: '安装日期',
          minWidth: '100px',
          format: 'YYYY-MM-DD'
        },
        {
          prop: 'pointTypeName',
          label: '仪表类型'
        }
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
      let params = {
        objId: this.orgInfo.objId,
        objType: 4,
        pageAble: false
      }
      let { code, data, message } = await relatedAssess(params)
      if (code === 200) {
        this.tableData = data.records
      } else {
        this.message({ type: 'error', message })
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
