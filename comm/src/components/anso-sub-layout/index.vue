<template>
  <div class="sub-cont-wrap">
    <div :class="className" ref="mainCont" :style="{ height: mainContHeight }">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { commonMixins } from 'comm/src/mixins'
export default {
  name: 'ansoSubLayout',
  components: {},
  props: {
    className: {
      type: String,
      default: 'sub-main-layout'
    }
  },
  mixins: [commonMixins],
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
