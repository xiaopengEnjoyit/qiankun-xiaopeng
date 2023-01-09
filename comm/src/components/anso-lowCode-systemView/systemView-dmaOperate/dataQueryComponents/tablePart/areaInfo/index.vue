<template>
  <div class="container-fluid">
    <anso-info-title :list="list"></anso-info-title>
  </div>
</template>

<script>
import { getYMDHMSDate } from 'comm/src/utils/date.js'
import ansoInfoTitle from 'comm/src/components/anso-lowCode-systemView/systemView-dmaOperate/components/anso-info-title'
import { areaInfo } from 'comm/src/services'
export default {
  name: 'areaInfo',
  components: { ansoInfoTitle },
  props: { orgInfo: Object },
  data() {
    return {
      list: [
        {
          title: '基本信息',
          data: [
            {
              label: '分区名称',
              value: '',
              key: 'areaName'
            },
            {
              label: '分区层级',
              value: '',
              key: 'areaLevelName'
            },
            {
              label: '区域编码',
              value: '',
              key: 'areaCode'
            },
            {
              label: '是否虚拟分区',
              value: '',
              key: 'isVirtualName'
            },
            {
              label: '管网总长度',
              value: '',
              key: 'pipeLength'
            },
            {
              label: '入口表数',
              value: '',
              key: 'inMeterNumber'
            },
            {
              label: '出口表数',
              value: '',
              key: 'outMeterNumber'
            },
            {
              label: '更新人',
              value: '',
              key: 'updateUserName'
            },
            {
              label: '更新时间',
              value: '',
              key: 'updateTime'
            },
            {
              label: '创建人',
              value: '',
              key: 'createUserName'
            },
            {
              label: '创建时间',
              value: '',
              key: 'createTime'
            }
          ]
        }
      ]
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
      let { code, data } = await areaInfo(this.orgInfo.objId)
      if (code === 200) {
        this.list.forEach(m => {
          m.data.forEach(v => {
            if (v.key === 'updateTime' || v.key === 'createTime') {
              v.value = getYMDHMSDate(data[v.key])
            } else {
              v.value = data[v.key]
            }
          })
        })
        this.loading = false
      } else {
        this.list.forEach(k => {
          k.data.forEach(j => {
            j.value = ''
          })
        })
        this.loading = false
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

<style lang="scss" scoped>
.container-fluid {
  padding: 16px 0px;
  box-sizing: border-box;
}
</style>
