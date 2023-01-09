<template>
  <vue-json-editor
    class="sass_json_edit"
    v-model="routeJson"
    :showBtns="false"
    :mode="'text'"
    :modes="['tree', 'code', 'text']"
    lang="zh"
    @json-change="onJsonChange"
    @json-save="onJsonSave"
  />
</template>

<script>
// 引入vue-json-editor模块
import vueJsonEditor from 'vue-json-editor'
export default {
  name: 'AnsoJsonEditor',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      // 可使用 JSON.parse() JSON.stringify() 转化 json 数据
      json: {
        msg: 'demo of jsoneditor'
      }
    }
  },
  components: {
    vueJsonEditor
  },
  computed: {
    routeJson: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    onJsonChange() {
      // 数据改变时触发
    },
    onJsonSave() {
      // 点击保存触发
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/base.scss';
.sass_json_edit {
  height: 100%;

  ::v-deep .jsoneditor-vue {
    height: 100%;
  }

  ::v-deep .jsoneditor {
    border: 1px solid $borderColor !important;
  }

  ::v-deep .jsoneditor-menu {
    & > button {
      color: #000;
      display: none;
    }
  }

  ::v-deep .ace_gutter {
    background: #fafafa;
  }

  ::v-deep .jsoneditor-poweredBy {
    display: none;
  }

  ::v-deep .jsoneditor-selected {
    background: #f3f5f8;
    color: #262626;

    &:hover {
      background: #f3f5f8;
      color: #262626;
    }
  }

  ::v-deep div.jsoneditor-contextmenu ul li button {
    color: #262626;
  }
  ::v-deep .ace-jsoneditor {
    font-size: 12px !important;
  }
}
</style>
