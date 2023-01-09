<template>
  <div class="cont-title">
    <h3 class="title" v-if="showTitle">{{ title }}</h3>
    <div class="crumb" v-else>
      <a href="javascript:;" v-if="showBack" class="crumb-back" @click="backRouter"
        ><i class="iconfont icon-return"></i>返回</a
      >
      <div class="crumb-list">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(route, i) in renderTitle" :key="i">
            {{ route.meta.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'ContTitle',
  data() {
    return {
      title: this.$route.meta.name,
      showTitle: this.$route.meta.needCrumb ? false : true
    }
  },
  props: {
    showBack: {
      type: Boolean,
      default: true
    },
    // 自定义title内容项，例如：[1,2,3] ==> 1/2/3。不传默认取路由值
    customTitle: {
      type: Array,
      default: () => []
    },
    // 自定义返回事件 例如 返回之前做一些业务判断处理
    isBackEvent: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  computed: {
    ...mapState(['crumbListMap']),
    ...mapGetters(['crumbListArr']),
    renderTitle() {
      if (this.customTitle?.length > 0) {
        return this.customTitle.map(o => ({ meta: { name: o } }))
      }
      return this.crumbListArr
    }
  },
  mounted() {},
  methods: {
    backRouter() {
      if (this.isBackEvent) {
        this.$emit('backRouterEvent')
      } else {
        this.$router.go(-1)
      }
      // const currentRouterPath = this.$route.path
      // let nextRouter = null
      // for (var [key, value] of myMap.entries()) {
      //   if (value.path === currentRouterPath) {
      //     nextRouter = key
      //   }
      // }
      // nextRouter()
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
