<!--
 * @Author: zhangpeng
 * @Date: 2022-10-27 16:38:15
 * @LastEditors: zhangpeng
 * @LastEditTime: 2022-11-02 20:28:42
 * @Description: 
 * @FilePath: \platform\comm\src\components\anso-lowCode-components\tableCom\index.vue
-->
<template>
  <table-page class="table-bg" :columns="columns" :tableData="tableData"> </table-page>
</template>
<script>
export default {
  name: 'tableCom',

  data() {
    return {
      tableData: [
        {
          name: 'sss'
        }
      ],
      columns: [
        {
          type: 'index',
          label: '序号'
        },
        {
          prop: 'name',
          label: '应用名称'
        },
        {
          prop: 'url',
          label: '对接地址'
        },
        {
          prop: 'appId',
          label: 'App Key'
        },
        {
          prop: 'createdTime',
          label: '创建时间'
        }
      ],
      comConfig: { wd: 400, ht: 200, text: 'tableCom' }
    }
  },

  mounted() {},

  methods: {}
}
</script>
<style lang="scss" scoped></style>
