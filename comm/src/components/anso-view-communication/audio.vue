<template>
  <el-carousel
    class="audioBox"
    indicator-position="none"
    :arrow="list.length > 1 ? 'always' : 'never'"
    :autoplay="false"
    @change="carouelChange"
  >
    <el-carousel-item v-for="(item, index) in list" :key="index">
      <div class="imgWarp">
        <audio class="audio" controls="controls" :src="item" :ref="'audio' + index"></audio>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>
<script>
export default {
  name: 'viewAudio',
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
        let name = 'audio' + [index]
        this.$refs[name][0].pause()
      })
    },
    carouelChange(i) {
      let name = ''
      if (i !== 0) {
        name = 'audio' + (i - 1)
      } else {
        name = 'audio' + (this.list.length - 1)
      }
      this.$refs[name][0].pause()
    }
  }
}
</script>
<style scoped lang="scss">
.audioBox {
  width: 100%;
  height: 200px;

  //stylelint-disable
  ::v-deep .el-carousel__container {
    height: 100%;

    .imgWarp {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .audio {
        height: 60px;
        max-width: 100%;
        max-height: 100%;
        min-width: 50%;
        outline: none;
      }
    }
  }
}
</style>
