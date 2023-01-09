<template>
  <div class="anso-table-tab">
    <anso-table :columns="columns" :tableData="tableData"> </anso-table>
  </div>
</template>

<script>
import { areaDmaMeterChange } from 'comm/src/services'
export default {
  name: 'areaChangeMeter',
  components: {},
  props: { orgInfo: Object },
  data() {
    return {
      columns: [
        {
          prop: 'waterUserName',
          label: '用户名称',
          minWidth: '100px'
        },
        {
          prop: 'pointAddress',
          label: '接水点地址',
          minWidth: '100px'
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
          prop: 'pointTypeName',
          label: '总表类型',
          minWidth: '100px'
        },
        {
          prop: 'modifyType',
          label: '变更类型',
          render: (row, prop) => {
            if (row[prop] === 1) {
              return '新增关联'
            } else if (row[prop] === 2) {
              return '取消关联'
            }
          }
        },
        { prop: 'operator', label: '变更人' },
        {
          prop: 'operationTime',
          label: '变更时间',
          minWidth: '120px',
          format: 'YYYY-MM-DD HH:mm:ss'
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
        meterType: 1
      }
      let { code, data, message } = await areaDmaMeterChange(params)
      if (code === 200) {
        this.tableData = data
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
