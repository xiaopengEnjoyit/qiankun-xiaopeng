<template>
  <div class="left-title-right-btn">
    <h4>{{ title }}</h4>
    <div class="right-btns">
      <template v-if="btns.length">
        <template v-for="(item, index) in btns">
          <anso-button
            v-if="item.permission && !item.show"
            :size="item.size ? item.size : 'small'"
            :key="index"
            :type="item.type ? item.type : ''"
            :disabled="item.disabled"
            :permission="item.permission"
            @click="handleClick(item)"
            >{{ item.text }}</anso-button
          >
          <el-button
            v-else-if="!item.show"
            :size="item.size ? item.size : 'small'"
            :key="index"
            :type="item.type ? item.type : ''"
            :disabled="item.disabled"
            :permission="item.permission"
            @click="handleClick(item)"
            >{{ item.text }}</el-button
          >
        </template>
      </template>
    </div>
  </div>
</template>
<script>
/***
 * 案例
 * <left-title-right-btn
        title="产品信息"
        :btns="topRightBtns"
      ></left-title-right-btn>
 *
  topRightBtns 在 vue的data里面定义
  topRightBtns: [
    {
      text: '返回',
      size: 'normal',
      handlerClick: () => {
        this.goback() // 方法在 methods里定义
      }
    },
    {
      text: '保存',
      size: 'normal',
      type: 'primary',
      handlerClick: () => {
        this.sure()
      }
    }
  ]
*/
import { debounce } from '../../utils'
export default {
  name: 'leftTitleRightBtn',
  data() {
    return {}
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    btns: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClick: debounce(function (item) {
      return typeof item.handlerClick === 'function' ? item.handlerClick() : null
    }, 300)
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
