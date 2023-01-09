<template>
  <el-dialog
    class="viewModel"
    title=""
    :visible.sync="viewVisible"
    @close="closeModel"
    width="750px"
    :append-to-body="true"
  >
    <template v-if="type == 'image'">
      <viewImage :list="list"></viewImage>
    </template>
    <template v-if="type == 'video'">
      <viewVideo :list="list"></viewVideo>
    </template>
    <template v-if="type == 'audio'">
      <viewAudio :list="list"></viewAudio>
    </template>
  </el-dialog>
</template>
<script>
import viewImage from './image'
import viewVideo from './video'
import viewAudio from './audio'
export default {
  components: {
    viewImage,
    viewVideo,
    viewAudio
  },
  directives: {},
  filters: {},
  extends: {},
  mixins: {},
  props: {
    // 是否显示
    value: {
      default: false,
      type: Boolean
    },
    // 查看类型 三种 image(图片) video(视频) audio(语音)
    type: {
      default: 'image',
      type: String
    },
    // 数据 数组形式 如 ['图片地址']
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      viewVisible: false
    }
  },
  computed: {},
  watch: {
    value(val) {
      if (val) {
        this.viewVisible = val
      }
    },
    viewVisible(val) {
      this.$emit('input', val)
    }
  },
  created() {},
  mounted() {},
  methods: {
    getVisible(val) {
      this.viewVisible = val
    },
    closeModel() {
      this.viewVisible = false
      if (this.type === 'video') {
        this.$refs.video.closePlay()
      } else if (this.type === 'audio') {
        this.$refs.audio.closePlay()
      }
      this.$emit('faterEvent', false)
    }
  }
}
</script>
<style scoped lang="scss">
//stylelint-disable
.viewModel {
  background: rgba(0, 0, 0, 0.3);

  ::v-deep .el-dialog {
    background: #464646;
  }

  ::v-deep .el-dialog__header {
    padding: 0;
    position: relative;
    z-index: 10;
  }

  ::v-deep .el-dialog__body {
    padding: 0;
  }

  ::v-deep .el-dialog__headerbtn {
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    color: #464646;
    font-weight: bold;
    width: 19px;
    height: 19px;
    line-height: 19px;
    text-align: center;

    .el-dialog__close {
      color: #464646;
      font-weight: bolder;
    }
  }
}
</style>
