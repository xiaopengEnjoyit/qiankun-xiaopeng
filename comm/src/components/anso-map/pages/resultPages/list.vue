<template>
  <div class="resultList">
    <header class="header">搜索结果</header>
    <i class="el-icon-close close" @click="$emit('close')"></i>
    <section class="list">
      <ul v-if="tableData.length > 0">
        <li v-for="(item, index) in tableData" :key="index" @click="handleDetail(index, item)">
          <div class="text">
            <h1>{{ item.name }}</h1>
            <p>共查询到 {{ item.count }} 个结果</p>
          </div>
          <div class="bt">
            <anso-button class="form-bt" type="text" size="mini">查看</anso-button>
          </div>
        </li>
      </ul>
      <p class="no-datas" v-else><el-empty :image-size="100" :image="EMPTY_IMG"></el-empty></p>
    </section>
  </div>
</template>
<script>
import { ansoButton } from 'comm/src/components'
import { EMPTY_IMG } from '../../../../config'

export default {
  name: 'resultList',
  components: { ansoButton },
  props: {
    itemDatas: Object,
    tableData: Array
  },
  data() {
    return {
      EMPTY_IMG
    }
  },
  mounted() {},
  methods: {
    sliceNumber(num) {
      if (typeof num === 'number') {
        return num.toFixed(10)
      } else {
        return num
      }
    },
    handleDetail(index, row) {
      // console.log(index, row)
      const item = {
        itemDatas: row
      }
      this.$emit('oprate', 'detail', item)
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './list.scss';
.form-bt {
  padding: 0;
}
.list {
  ul {
    padding: 10px 0;
  }
  .no-datas {
    text-align: center;
    padding: 50px;
  }
  li {
    margin-bottom: 10px;
    display: flex;
    width: 326px;
    height: 58px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 8px 16px;
    padding-right: 0;
    cursor: pointer;
    &:hover {
      background: #f5f5f8;
      .text {
        h1 {
          color: #3171f2;
        }
      }
    }
    .text {
      width: calc(100% - 50px);
      h1 {
        height: 22px;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #262626;
      }
      p {
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #8c8c8c;
      }
    }
    .bt {
      line-height: 40px;
    }
  }
}
</style>
