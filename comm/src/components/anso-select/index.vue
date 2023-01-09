<template>
  <el-select
    v-model="selected"
    :multiple="multiple"
    :filterable="filterable"
    collapse-tags
    :style="{ width: width }"
    clearable
    :placeholder="placeholder"
    @change="handleChange"
  >
    <el-option
      v-for="item in options"
      :key="item[defaultProps.value]"
      :label="item[defaultProps.name]"
      :value="item[defaultProps.value]"
    >
    </el-option>
    <div class="cus-select cus-select-common" v-if="multiple">
      <el-button size="mini" type="primary" @click="handleAllSelect">全选</el-button>
      <el-button size="mini" @click="handleCancel">取消</el-button>
    </div>
  </el-select>
</template>
<script>
export default {
  name: 'AnsoSelect',
  props: {
    width: {
      type: String,
      default: () => '100%'
    },
    multiple: {
      type: Boolean,
      default: () => false
    },
    filterable: {
      type: Boolean,
      default: () => false
    },

    placeholder: {
      type: String,
      default: () => '请选择'
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          value: 'value',
          name: 'label'
        }
      }
    },
    value: [Array, String],
    options: Array
  },
  data() {
    return {
      selected: this.value || [],
      data: []
    }
  },
  // watch: {
  //   options(n) {
  //     console.log('aa:' + n)
  //     // this.value = n
  //   }
  // },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // this.data.push(...this.options)
      console.log(3333, this.options)
    },
    // 全选
    handleAllSelect() {
      this.options.forEach(v => {
        if (!this.selected.includes(v[this.defaultProps.value])) {
          this.selected.push(v[this.defaultProps.value])
        }
      })
      // this.$emit('update:selected', this.value)
      this.$emit('change', this.selected)
    },
    // 取消全选
    handleCancel() {
      this.value = []
      this.$emit('change', this.selected)
      // this.$emit('update:selected', this.value)
    },
    handleChange(val) {
      this.$emit('change', this.selected)
      // this.$emit('update:selected', val)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
<style lang="scss">
.cus-select-common {
  .el-button--mini {
    padding: 4px;
  }
}
</style>
