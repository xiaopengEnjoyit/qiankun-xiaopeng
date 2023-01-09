<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2022-11-11 15:01:41
 * @LastEditors: Seven
 * @LastEditTime: 2022-11-11 15:21:21
-->
<template>
  <div class="anso-image">
    <el-image :src="imgSrc" :preview-src-list="previewSrcList ? [imgSrc] : []" v-bind="$attrs">
      <template slot="placeholder"> <slot name="placeholder"></slot></template>
      <template slot="error"> <slot name="error"></slot></template>
    </el-image>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ansoImage',
  props: {
    imgSrc: {
      require: false,
      type: [String],
      default: () => {
        return ''
      }
    },
    previewSrcList: {
      require: false,
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.anso-image {
  display: inline-block;
}
</style>
