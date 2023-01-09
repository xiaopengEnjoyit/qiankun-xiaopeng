<template>
  <el-carousel
    class="imageBox"
    indicator-position="none"
    :arrow="list.length > 1 ? 'always' : 'never'"
    :autoplay="false"
  >
    <el-carousel-item v-for="(item, index) in list" :key="index">
      <div class="imgWarp">
        <img :src="item" />
      </div>
    </el-carousel-item>
  </el-carousel>
</template>
<script>
export default {
  name: 'viewImage',
  components: {},
  directives: {},
  filters: {},
  extends: {},
  mixins: {},
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style scoped lang="scss">
.imageBox {
  height: 580px;
  text-align: center;
  //stylelint-disable
  ::v-deep .el-carousel__container {
    height: 100%;

    .imgWarp {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        height: auto;
        width: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>
