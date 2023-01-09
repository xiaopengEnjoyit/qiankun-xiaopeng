<template>
  <div class="local" @click="local" title="定位">
    <i class="icon-fire-hydrant icon iconfont"></i>
  </div>
</template>
<script>
export default {
  name: 'local',
  data() {
    return {}
  },
  methods: {
    local() {
      const { fitFeature, center, zoom } = this.$parent
      fitFeature(center, zoom)
    }
  }
}
</script>

<style lang="scss" scoped>
.local {
  position: absolute;
  bottom: 210px;
  right: 20px;
  width: 32px;
  height: 34px;
  line-height: 34px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15);
  text-align: center;
}
.icon-fire-hydrant {
  color: #888888;
  font-size: 18px;
}
.icon-fire-hydrant:active {
  color: #3171f2;
}
</style>
