<!--
 * @Description:
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2022-05-11 13:38:54
 * @LastEditors: Seven
 * @LastEditTime: 2022-11-17 09:49:52
-->
<template>
  <el-tooltip class="item" effect="dark" :content="showText" :placement="placement" :disabled="disabled">
    <div class="text" @mouseenter="isShowTooltip">{{ showText }}</div>
  </el-tooltip>
</template>

<script>
import { tree2arr } from './../../utils/utils.js'

export default {
  name: 'ansoTooltips',
  props: {
    text: [String, Array],
    placement: {
      type: String,
      require: false,
      default: () => {
        return 'top-start'
      }
    },
    options: {
      required: false,
      type: Array,
      default: () => {
        return []
      }
    },
    propKeys: {
      required: false,
      type: Object,
      default: () => {
        return {
          label: 'label',
          value: 'value',
          children: 'children'
        }
      }
    }
  },
  watch: {
    text: {
      handler(val) {
        this.showText = this.optionsMapText(val, this.options)
      },
      deep: true,
      immediate: true
    },
    options: {
      handler(val) {
        this.showText = this.optionsMapText(this.text, val)
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      disabled: false,
      showText: ''
    }
  },
  methods: {
    isShowTooltip(e) {
      let clientWidth = e.target.clientWidth
      let scrollWidth = e.target.scrollWidth
      if (scrollWidth > clientWidth) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // 根据options列表与text中value的对应关系生成映射字符串，支持 , / - 分隔符
    optionsMapText(text, options) {
      if (!options.length) return text

      const tempArr = []
      let list = tree2arr(options, this.propKeys['label'], this.propKeys['value'], this.propKeys['children'])
      if (Array.isArray(text)) {
        text.forEach(f => {
          const el = list.find(item => item[this.propKeys['value']] === f)
          el && tempArr.push(el[this.propKeys['label']])
        })
        return tempArr.toString()
      } else {
        const reg = new RegExp('([^\\,\\-\\/])+', 'g')
        return (
          text?.replace(reg, match => {
            const el = list.find(item => item[this.propKeys['value']] === match)
            return el ? el[this.propKeys['label']] : match
          }) || ''
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
