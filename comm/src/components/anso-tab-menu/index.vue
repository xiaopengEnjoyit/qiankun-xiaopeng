/* 带导航标签的页面布局 */
<template>
  <div class="menu_layout">
    <div class="menu_layout-topbar">
      <el-menu
        class="menu_layout-menu"
        mode="horizontal"
        text-color="#8c8c8c"
        active-text-color="#3171f2"
        :default-active="value"
        v-if="isshow"
      >
        <template v-for="(item, index) in titleList">
          <el-menu-item
            :key="index"
            :index="item.value"
            v-if="permission(item.permission)"
            @click="select(item.value, item.name)"
          >
            {{ item.name }}
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="menu_layout-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/**
 *
 *
 * <anso-tab-menu :titleList="titleList" v-model="tabActive" ref="tab-menu">
      <div class="tab-cont" v-show="tabActive === '1'">
        1
      </div>
      <div class="tab-cont" v-show="tabActive === '2'">
        2
      </div>
    </anso-tab-menu>
    js:
    data() {
      tabActive: '1',
      titleList: [
        // 导航标签
        { name: '外部资源配置', value: '1' },
        { name: '客户端', value: '2' }
        // { name: '普通租户管理平台', value: '3', permission: MENU.TABPT } // permission权限控制
      ],
    }
 *
 *
 *
*/
export default {
  name: 'menuLayout',
  props: {
    titleList: {
      type: Array,
      default: () => [
        { name: '运营管理平台', value: '1' },
        { name: 'sass应用平台', value: '2' }
      ]
    },
    active: {
      type: [String, Number],
      default: '1'
    },
    value: {
      type: [String, Number],
      default: '1'
    }
  },
  data() {
    return {
      // defaultActive: '',
      isshow: false
    }
  },
  mounted() {
    this.init(true)
  },
  computed: {
    defaultActive: {
      get() {
        // this.initForm()
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    /**
     * @auther 曾品斯
     * @time 2021-10-20
     * @description:
     * @param {*}
     * @return {*}
     * @example
     */
    init(val) {
      // this.defaultActive = this.active
      this.isshow = val
      setTimeout(() => {
        this.isshow = true
      }, 0)
    },
    permission(val) {
      console.log('val', val)
      if (val === undefined) {
        return true
      } else {
        return this.$route?.meta.btnTabInfo.some(p => p.funcCode === val)
      }
    },
    /**
     * @auther 曾品斯
     * @time 2021-10-20
     * @description:
     * @param {*}
     * @return {*}
     * @example
     */
    select(index) {
      this.$emit('input', index)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
