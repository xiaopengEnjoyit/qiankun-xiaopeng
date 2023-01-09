<template>
  <div class="anso-table-tab">
    <anso-info-title :list="list"></anso-info-title>
  </div>
</template>
<script>
import { getYMDHMSDate } from 'comm/src/utils/date.js'
import ansoInfoTitle from 'comm/src/components/anso-lowCode-systemView/systemView-dmaOperate/components/anso-info-title'
import { deviceInfo } from 'comm/src/services'
export default {
  name: 'deviceInfo',
  components: { ansoInfoTitle },
  props: { orgInfo: Object },
  data() {
    return {
      list: [
        {
          data: [
            {
              label: '用户名称',
              value: '',
              key: 'waterUserName'
            },
            {
              label: '用户编号',
              value: '',
              key: 'waterUserCode'
            },
            {
              label: '用水性质',
              value: '',
              key: 'categoriesName'
            },
            {
              label: '用户地址',
              value: '',
              key: 'waterUserAddress'
            },
            {
              label: '用户状态',
              value: '',
              key: 'waterUserStatusName'
            },
            {
              label: '接水点地址',
              value: '',
              key: 'pointAddress'
            },
            {
              label: '接水点坐标',
              value: '',
              key: 'waterPointCoord'
            },
            {
              label: '设备编号',
              value: '',
              key: 'deviceCode'
            },
            {
              label: '出厂编号',
              value: '',
              key: 'factoryCode'
            },
            {
              label: '口径',
              value: '',
              key: 'caliberName'
            },
            {
              label: '厂家',
              value: '',
              key: 'manufacturerName'
            },
            {
              label: '通讯方式',
              value: '',
              key: 'communModelName'
            },
            {
              label: '测量参数',
              value: '',
              key: 'measureParamName'
            },
            {
              label: '表用途',
              value: '',
              key: 'purposeName'
            },
            {
              label: '安装日期',
              value: '',
              key: 'installTime'
            },
            {
              label: '仪表坐标',
              value: '',
              key: 'meterCoord'
            },
            {
              label: '安装地址',
              value: '',
              key: 'installAddress'
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
      let { code, data } = await deviceInfo({
        objId: this.orgInfo.objId
      })
      if (code === 200) {
        this.list.forEach(m => {
          m.data.forEach(v => {
            if (v.key === 'installTime') {
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

<style lang="scss" scoped></style>
