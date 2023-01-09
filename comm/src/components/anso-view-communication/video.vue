<template>
  <el-carousel
    class="videoBox"
    indicator-position="none"
    :arrow="list.length > 1 ? 'always' : 'never'"
    :autoplay="false"
    @change="carouelChange"
  >
    <el-carousel-item v-for="(item, index) in list" :key="index">
      <div class="imgWarp">
        <video class="video" controls="controls" :src="item" :ref="'video' + index"></video>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>
<script>
export default {
  name: 'viewVideo',
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
  methods: {
    closePlay() {
      this.list.forEach((e, index) => {
        let name = 'video' + [index]
        this.$refs[name][0].pause()
      })
    },
    carouelChange(i) {
      let name = ''
      if (i !== 0) {
        name = 'video' + (i - 1)
      } else {
        name = 'video' + (this.list.length - 1)
      }
      this.$refs[name][0].pause()
    }
  }
}
</script>
<style scoped lang="scss">
.videoBox {
  height: 580px;

  //stylelint-disable
  ::v-deep .el-carousel__container {
    height: 100%;

    .imgWarp {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .video {
        height: 100%;
        width: auto;
        max-width: 100%;
        outline: none;
      }
    }
  }
}
</style>
