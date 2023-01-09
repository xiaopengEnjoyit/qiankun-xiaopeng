<script>
export default {
  name: 'AnsoSidebar',
  data: () => ({
    collapse: false
  }),
  props: {
    menuList: {
      type: Array,
      dafault: []
    },
    router: {
      type: Boolean,
      default: true
    },
    textColor: {
      type: String,
      default: '#bfbfbf' //'#262626'
    },
    bgColor: {
      type: String,
      default: '#1C263D' // #ffffff
    },
    activeTextColor: {
      type: String,
      default: '#ffffff' //'#3171F2'
    },
    mode: {
      type: String,
      default: 'vertical'
    },
    defaultActive: String,
    uniqueOpened: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * @description: 菜单创建
     * @param {*} arr
     * @return {*}
     */

    createMenu(arr) {
      return arr.map((item, index) => {
        // 如果存在子集
        if (Array.isArray(item.children)) {
          return (
            <el-submenu index={item.index} key={item.index}>
              <template slot="title">
                {this.icon(item)}
                <span title={item.menuName}>{item.menuName}</span>
              </template>
              {this.createMenu(item.children)}
            </el-submenu>
          )
        } else {
          return (
            <el-menu-item index={item.index} key={item.index}>
              {this.icon(item)}
              <span slot="title" title={item.menuName}>
                {item.menuName}
              </span>
            </el-menu-item>
          )
        }
      })
    },
    // icon图标处理
    icon(item) {
      if (item.icon) {
        // 如果是图片
        if (!item.icon.startsWith('icon-')) {
          let n = `/api/file/view?fileId=${item.icon}`.replace(/'/g, '')
          return (
            <i class={['icon-img']}>
              <img src={n} />
            </i>
          )
        } else {
          return <i class={['iconfont', item.icon]} />
        }
      } else {
        return <i class={['iconfont', ' ']} />
      }
    },
    /**
     * @description:
     * @param {*} index
     * @param {*} indexPath
     * @return {*}
     */

    open(index, indexPath) {
      this.$emit('open', index, indexPath)
    },
    /**
     * @description:
     * @param {*} index
     * @param {*} indexPath
     * @return {*}
     */

    select(index, indexPath) {
      this.$emit('select', index, indexPath)
    },
    /**
     * @description:
     * @param {*} index
     * @param {*} indexPath
     * @return {*}
     */

    close(index, indexPath) {
      this.$emit('close', index, indexPath)
    },
    /**
     * @description:
     * @param {*} collapse
     * @return {*}
     */

    handleCollapse(collapse) {
      this.collapse = collapse
      // actions.setGlobalState({ isCollapse: this.collapse })
      // DataBus.emit('collapse', this.collapse)
    }
  },
  /**
   * @description:
   * @param {*}
   * @return {*}
   */

  render() {
    const MenuAttribute = {
      props: {
        router: this.router,
        backgroundColor: this.bgColor,
        textColor: this.textColor,
        activeTextColor: this.activeTextColor,
        mode: this.mode,
        collapse: this.collapse,
        defaultActive: this.defaultActive,
        uniqueOpened: this.uniqueOpened
      },
      on: {
        open: this.open,
        select: this.select
      }
    }
    return (
      <el-scrollbar class={['app-scrollbar', { 'el-menu-collapse': this.collapse }]}>
        <el-menu class="menu-collapse" style="width: 100%" {...MenuAttribute}>
          {' '}
          {this.createMenu(this.menuList)}
        </el-menu>
      </el-scrollbar>
    )
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
<style lang="scss">
.el-menu--popup {
  .el-menu-item {
    height: 48px;
    line-height: 48px;
  }
}
</style>
