<template>
  <div class="anso-table-tab">
    <anso-info-title :list="list"></anso-info-title>
  </div>
</template>

<script>
import ansoInfoTitle from 'comm/src/components/anso-lowCode-systemView/systemView-dmaOperate/components/anso-info-title'
import { buildInfo } from 'comm/src/services'
export default {
  name: 'buildingInfo',
  components: { ansoInfoTitle },
  props: { orgInfo: Object },
  data() {
    return {
      isEdit: false,
      list: [
        {
          data: [
            {
              label: '楼栋表ID',
              value: '',
              key: 'id'
            },
            {
              label: '楼栋表地址',
              value: '',
              key: 'installAddress'
            },
            {
              label: '经纬度',
              value: '',
              key: 'coordinate'
            },
            {
              label: '是否虚拟表',
              value: '',
              key: 'isRealName'
            },
            {
              label: '关联户表数',
              value: '',
              key: 'relDeviceCount'
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
      let { code, data } = await buildInfo({
        objId: this.orgInfo.objId
      })
      if (code === 200) {
        this.list.forEach(m => {
          m.data.forEach(v => {
            v.value = data[v.key]
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
