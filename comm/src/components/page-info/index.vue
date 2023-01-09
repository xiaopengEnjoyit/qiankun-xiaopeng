<template>
  <div class="page-info">
    <h4 v-show="title">{{ title }}</h4>
    <div class="page-info-tips" v-if="showId">
      <span> {{ productTitle }}：</span>
      <span class="page-info-tips-id">{{ productId }}</span>
      <a href="javascript:;" @click="copyText">复制</a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PageInfo',
  props: {
    title: {
      type: String,
      default: ''
    },
    showId: {
      type: Boolean,
      default: true
    },
    productTitle: {
      type: String,
      default: '产品ID (ProductId)'
    },
    productId: {
      type: String,
      default: ''
    }
  },
  methods: {
    copyText() {
      this.$copyText(this.productId).then(
        e => {
          this.$message.success('复制成功！')
        },
        e => {
          console.log('不能复制，复制失败')
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
