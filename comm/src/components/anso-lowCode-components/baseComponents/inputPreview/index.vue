<!--
 * @Author: zhangpeng
 * @Date: 2022-11-07 17:45:48
 * @LastEditors: zhangpeng
 * @LastEditTime: 2022-11-09 10:13:37
 * @Description: 
 * @FilePath: \customer\comm\src\components\anso-lowCode-components\inputPreview\index.vue
-->
<template>
  <div class="full">
    <div class="text" v-clickOutSide="changeText" contenteditable="true">{{ config.text }}</div>
  </div>
</template>
<script>
export default {
  name: 'inputPreview',
  directives: {
    clickOutSide: {
      // iview源码
      bind(el, binding) {
        const documentHandler = e => {
          if (el.contains(e.target)) return
          binding.value(e)
        }
        el.__vueClickOutside__ = documentHandler
        document.addEventListener('click', documentHandler)
      },
      unbind(el) {
        document.removeEventListener('click', el.__vueClickOutside__)
        delete el.__vueClickOutside__
      }
    }
  },
  data() {
    return {
      comConfig: {
        wd: 350,
        ht: 252,
        text: ''
      },
      input: ''
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    changeText() {
      this.config.text = this.$el.innerText
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-input__inner {
  border: none;
}
.text {
  width: 100%;
  cursor: auto;
  outline: none;
  text-align: left;
  padding-left: 10px;
}
/deep/.el-input {
  width: 100% !important;
  display: flex;
  align-items: center;
}
.full {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
