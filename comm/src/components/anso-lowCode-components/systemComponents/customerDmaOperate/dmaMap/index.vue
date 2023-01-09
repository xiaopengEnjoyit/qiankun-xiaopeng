<template>
  <div class="lowCodeComponents" style="padding:4px">
    <anso-dma-map :mapId="mapId"></anso-dma-map>
  </div>
</template>

<script>
import ansoDmaMap from 'comm/src/components/anso-dma-map'
import { uuid } from 'comm/src/utils/utils.js'

export default {
  name: 'dmaMap',
  components: { ansoDmaMap },
  data() {
    return {
      comConfig: {
        wd: 700,
        ht: 390,
        title: '区域地图'
      },
      mapId: uuid()
    }
  },
  mounted() {},
  methods: {
    // 地图加载成功
    mapSuccess() {}
  }
}
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
}
</style>
