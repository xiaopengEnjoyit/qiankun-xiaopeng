<template>
  <div class="container-fluid">
    <anso-info-title :list="list"></anso-info-title>
  </div>
</template>

<script>
import { getYMDHMSDate } from 'comm/src/utils/date.js'
import ansoInfoTitle from 'comm/src/components/anso-lowCode-systemView/systemView-dmaOperate/components/anso-info-title'
import { dmaInfo } from 'comm/src/services'
export default {
  name: 'dmaInfo',
  components: { ansoInfoTitle },
  props: { orgInfo: Object },
  data() {
    return {
      list: [
        {
          title: '基本信息',
          data: [
            {
              label: 'DMA名称',
              value: '',
              key: 'dmaName'
            },
            {
              label: 'DMA别名',
              value: '',
              key: 'dmaAlias'
            },
            {
              label: 'DMA编码',
              value: '',
              key: 'dmaCode'
            },
            {
              label: 'DMA类型',
              value: '',
              key: 'dmaTypeName'
            },
            {
              label: 'DMA状态',
              value: '',
              key: 'constructStateName'
            },
            {
              label: 'DMA属性',
              value: '',
              key: 'areaPropertyName'
            }
          ]
        },
        {
          title: '住户信息',
          data: [
            {
              label: '住户总数',
              value: '',
              key: 'customerCount'
            },
            {
              label: '实际入住户数',
              value: '',
              key: 'actualCustomerCount'
            },
            {
              label: '居民用户数',
              value: '',
              key: 'smallCustomerCount'
            },
            {
              label: '非居民用户数',
              value: '',
              key: 'largeCustomerCount'
            },
            {
              label: '居民夜间水量定额',
              value: '',
              key: 'smallCustomerWaterQuota'
            },
            {
              label: '非居民夜间水量定额',
              value: '',
              key: 'largeCustomerWaterQuota'
            },
            {
              label: '抄表周期',
              value: '',
              key: 'readRateName'
            }
          ]
        },
        {
          title: '管网信息',
          data: [
            {
              label: '供水方式',
              value: '',
              key: 'waterMethodName'
            },
            {
              label: '平均压力',
              value: '',
              key: 'areaAvgPressure'
            },
            {
              label: '管道材质',
              value: '',
              key: 'pipeTextureName'
            },
            {
              label: '管道敷设时间',
              value: '',
              key: 'pipeLayTime'
            },
            {
              label: '埋深',
              value: '',
              key: 'pipeDeep'
            },
            {
              label: '管道长度',
              value: '',
              key: 'pipeLength'
            },
            {
              label: '连接户管数',
              value: '',
              key: 'customerPipeCount'
            },
            {
              label: '连接支管数',
              value: '',
              key: 'branckPipeCount'
            },
            {
              label: '水池容积',
              value: '',
              key: 'poolCubage'
            },
            {
              label: '区域面积',
              value: '',
              key: 'zoneArea'
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
      let { code, data } = await dmaInfo(this.orgInfo.objId)
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
      } else {
        this.list.forEach(k => {
          k.data.forEach(j => {
            j.value = ''
          })
        })
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
