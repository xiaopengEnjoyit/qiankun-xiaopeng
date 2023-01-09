<script>
import Print from 'print-js'
/**
 * demo:
 * toolsConfig: ['refresh', 'print', 'export', 'space', 'setting']
 */
export default {
  name: 'TableTools',
  data() {
    return {
      activeName: '默认',
      spaceMap: ['默认', '紧凑', '中等', '宽松'],
      fColumns: [],
      checkedColumns: [],
      selectAllState: false
    }
  },
  directives: {
    /*
     * 解决tooltips，在弹框之后再次出现的问题，原因是由于tabindex导致
     */
    clearIndex: {
      bind(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        el.__vueSetTimeoutIndex__ = setTimeout(() => {
          // 清除当前tabIndex
          el.removeAttribute('tabindex')
          clearTimeout(el.__vueSetTimeoutIndex__)
        }, 0)
      },
      unbind(el) {
        clearTimeout(el.__vueSetTimeoutIndex__)
      }
    }
  },
  props: {
    // 表头原始数据
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    // 表格工具展示配置
    toolsConfig: {
      type: Array,
      default() {
        return [] // 根据数据展示对应的工具
      }
    },
    printId: {
      type: String,
      default: 'print'
    },
    title: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.initColumns()
  },
  watch: {
    columns: function(n) {
      this.initColumns()
    }
  },
  methods: {
    /**
     * @description: 打印
     * @param {*}
     * @return {*}
     */
    handlePrint() {
      new Print({
        header: this.title,
        headerStyle: 'text-align:center',
        printable: 'print',
        type: 'html',
        maxWidth: 1150,
        targetStyles: ['*']
      })
    },
    /**
     * @description:   表格间距调整
     * @param {*} active
     * @return {*}
     */
    adjustSpace(active) {
      this.activeName = active
      let _h = 0
      switch (active) {
        case '默认':
          _h = 40
          break
        case '紧凑':
          _h = 30
          break
        case '中等':
          _h = 50
          break
        case '宽松':
          _h = 60
          break
      }
      this.$emit('setSpace', _h)
    },

    /**
     * @description: 初始化Column
     * @param {*}
     * @return {*}
     */
    initColumns() {
      this.fColumns = this.columns.map(item => {
        if (item.checked === undefined) {
          item.checked = true
        }
        return item
      })
      this.filterColumn()
    },
    /**
     * @description: 表头筛选
     * @param {*}
     * @return {*}
     */
    filterColumn() {
      const columns = this.fColumns.filter(c => c.checked)
      this.$emit('setCheckedColumns', columns)
    },
    /**
     * @description: 选中/取消
     * @param {*} item
     * @return {*}
     */
    handleChange(item) {
      this.fColumns.forEach(c => {
        if (c.prop === item.prop) {
          c.checked = !c.checked
        }
      })
      this.filterColumn()
    },
    /**
     * @description: 下载
     * @param {*}
     * @return {*}
     */
    handleExprot() {
      this.$emit('export')
    },
    /**
     * @description: 全选/反选
     * @param {*}
     * @return {*}
     */
    // selectAll() {
    //    this.columns.map(item => {
    //     item.checked = this.selectAllState
    //     return item
    //   })
    //   this.filterColumn()
    // },
    /**
     * @description: 工具筛选
     * @param {*}
     * @return {*}
     */
    switchTool() {
      const { handlePrint, spaceMap, fColumns, handleChange, adjustSpace, handleExprot, toolsConfig } = this
      if (!toolsConfig.length) return
      return toolsConfig.map(t => {
        let name
        if (typeof t === 'string') {
          name = t
        } else {
          name = t.name
        }
        switch (name) {
          case 'refresh':
            return (
              <el-tooltip effect="dark" content="刷新" placement="bottom" v-clear-index>
                <em class="iconfont icon-refresh" title="刷新" onClick={() => this.$emit('refresh')}></em>
              </el-tooltip>
            )
          case 'print':
            return (
              <el-tooltip effect="dark" content="打印" placement="bottom" v-clear-index>
                <em class="iconfont icon-copy" onClick={handlePrint}></em>
              </el-tooltip>
            )
          case 'export':
            return (
              <el-tooltip effect="dark" content="导出" placement="bottom" v-clear-index>
                <em class="iconfont icon-export1" onClick={handleExprot}></em>
              </el-tooltip>
            )
          case 'space':
            return (
              <el-tooltip effect="dark" content="密度调整" placement="bottom" v-clear-index>
                <el-popover
                  placement="bottom"
                  trigger="click"
                  class="table-tools-item"
                  popper-class="table-tools-popover"
                >
                  <ul class="table-tools-item-ul">
                    {spaceMap.map(item => {
                      return (
                        <li class={{ 'is-active': this.activeName === item }} onClick={adjustSpace.bind(this, item)}>
                          {item}
                        </li>
                      )
                    })}
                  </ul>
                  <em class="iconfont icon-sort" slot="reference"></em>
                </el-popover>
              </el-tooltip>
            )
          case 'setting':
            return (
              <el-tooltip effect="dark" content="列设置" placement="bottom" v-clear-index>
                <el-popover placement="bottom" trigger="click" class="table-tools-item">
                  {/*
                    <div>
                      <el-checkbox label="全部" v-model={this.selectAllState} onChange={this.selectAll}></el-checkbox>
                    </div>
                  */}
                  <el-checkbox-group size="mini" v-model={this.checkedColumns}>
                    {fColumns.map(c => {
                      if (c.type !== 'selection' && c.type !== 'index') {
                        // 只剩下一个的时候不可以再去除，不然表格错位
                        if (this.checkedColumns.length < 2 && c.checked) {
                          return (
                            <el-checkbox
                              key={c.prop}
                              label={c.label}
                              checked={c.checked}
                              disabled={true}
                              value={c.prop}
                              onChange={handleChange.bind(this, c)}
                            ></el-checkbox>
                          )
                        } else {
                          return (
                            <el-checkbox
                              key={c.prop}
                              label={c.label}
                              checked={c.checked}
                              value={c.prop}
                              onChange={handleChange.bind(this, c)}
                            ></el-checkbox>
                          )
                        }
                      }
                    })}
                  </el-checkbox-group>
                  <em class="iconfont icon-set-up" slot="reference"></em>
                </el-popover>
              </el-tooltip>
            )
          default:
            return (
              <el-tooltip effect="dark" content={t.name} placement="bottom" v-clear-index>
                <em
                  class={`iconfont ${t.icon}`}
                  onClick={() => {
                    t.handler()
                  }}
                ></em>
              </el-tooltip>
            )
        }
      })
    }
  },
  render() {
    return (
      <div class="table-tools">
        {this.$slots.default}
        {this.switchTool()}
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
<style lang="scss">
.table-tools-popover {
  min-width: 100px !important;
  padding: 0 !important;
}
.el-checkbox-group {
  width: 100px;
  .el-checkbox {
    margin: 0;
    // width: 80px;
    width: 100px; // 修改宽度是因为如果文字过长会被挡住
  }
  .el-checkbox:nth-of-type(odd) {
    margin-right: 20px;
  }
}
</style>
