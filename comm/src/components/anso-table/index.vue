<script>
import { willStampToDate, getQuarterDate } from '../../utils'
import { render } from './render'
import ansoButton from '../anso-button'
import { EMPTY_IMG } from '../../config'
import { guid } from './../../utils/utils.js'

export default {
  name: 'AnsoTable',
  props: {
    // 表头
    columns: {
      type: Array,
      default: () => []
    },
    // 表数据
    tableData: {
      type: Array,
      default: () => []
    },
    // 操作
    operates: {
      type: Object,
      default: () => {}
    },
    // 表配置
    tableConfig: {
      type: Object,
      default: () => ({})
    },
    // 表事件
    tableEvent: {
      type: Object,
      default: () => ({})
    },
    // 行样式
    rowStyle: {
      type: Object,
      default: () => ({})
    },
    // 页码
    pageIndex: {
      type: Number,
      default: 1
    },
    // 页容量
    pageSize: {
      type: Number,
      default: 20
    },
    // 页码配置
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 50, 100]
      }
    },
    // 分页布局
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    //总条数
    total: {
      type: [Number, String],
      default: undefined
    },
    rowkey: {
      type: String,
      default: 'id'
    }
  },
  computed: {
    currentPage: {
      get() {
        return Number(this.pageIndex)
      },
      set(page) {
        this.$emit('update:pageIndex', page)
      }
    },
    limit: {
      get() {
        return Number(this.pageSize)
      },
      set(size) {
        this.$emit('update:pageSize', size)
      }
    }
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.ansoTabel && this.$refs.ansoTabel.doLayout()
    })
  },
  // 使用watch监听用于解决工具栏表格列全隐藏后，在显示固定列错位问题
  watch: {
    columns: function (n) {
      this.$nextTick(() => {
        this.$refs.ansoTabel && this.$refs.ansoTabel.doLayout()
      })
    },
    tableData(val) {
      if (val) {
        this.$refs.ansoTabel.clearSelection()
      }
    }
  },
  methods: {
    /**
     * @description: 创建column
     * 修改时间：2021/10/16
     * 修改原因：1.当后端返回空字符串（''）时，表格中也要显示--（如果有其他情况不能这样显示，可以去掉）
     * 2.日期返回null时也需要显示--
     * 修改内容：1.增加返回为空的判断（scope.row[col.prop] === '' ）
     * 2.修改日期判断的位置，在判断完空条件后再去判断日期
     * 3.增加expand判断，实现表格展开行功能
     * @param {*} columns 表格列
     * @return {*}
     */
    createColumsFragment(columns) {
      return columns.map(col => {
        return col.type === 'expand' ? (
          <el-table-column
            attrs={{ ...col }}
            key={col.type}
            scopedSlots={{
              default: scope => {
                {
                  return this.$scopedSlots.custom({
                    row: scope.row,
                    prop: col.prop,
                    index: scope.$index
                  })
                }
              }
            }}
            show-overflow-tooltip
          ></el-table-column>
        ) : col.type ? (
          <el-table-column attrs={{ ...col }} key={col.type} show-overflow-tooltip></el-table-column>
        ) : (
          <el-table-column
            attrs={{ ...col }}
            key={col.prop} //使用guid()会造成表格抖动，也不能默认使用guid()，不然多个系统的表格都要改
            show-overflow-tooltip={!col.showall}
            scopedSlots={{
              default: scope => {
                if (col.render) {
                  return render({
                    fullData: scope.row,
                    data: scope.row[col.prop],
                    column: col,
                    index: scope.$index,
                    name: col.prop
                  })
                } else if (col.custom) {
                  return this.$scopedSlots.custom({
                    row: scope.row,
                    prop: col.prop,
                    index: scope.$index
                  })
                } else {
                  //有时候后端也会返回'',所以下面加了为空的判断，如果造成其他影响可以直接去掉
                  // format === 'Q' 传时间戳会显示 XXXX年X季度
                  return !scope.row[col.prop] && scope.row[col.prop] !== 0 ? (
                    <span style="color:#bfbfbf">--</span>
                  ) : col.format ? (
                    col.format === 'Q' ? (
                      getQuarterDate(scope.row[col.prop])
                    ) : (
                      willStampToDate(scope.row[col.prop], col.format)
                    )
                  ) : (
                    scope.row[col.prop]
                  )
                }
              },
              header: scope => {
                if (col.operate === 'operate') {
                  return this.$scopedSlots.header({
                    label: col.label,
                    index: scope.$index
                  })
                } else {
                  if (col?.label?.length > 15) {
                    return (
                      <el-tooltip placement="top">
                        <div slot="content">{col.label}</div>
                        <span>{col.label.slice(0, 10) + '...'}</span>
                      </el-tooltip>
                    )
                  } else {
                    return col?.label
                  }
                }
              }
            }}
          >
            {col.children && col.children.length ? this.createColumsFragment(col.children) : ''}
          </el-table-column>
        )
      })
    },

    /**
     * @description:  表格操作列筛选，超过三个用‘更多’下拉代替
     * 2021/10/16 如果刚好4个，则不显示更多
     * @param {*} scope
     * @param {*} operates
     * @return {*}
     */
    createOperates(scope, operates) {
      const [generalOperates, specialOperates] = [[], []]
      const showOprates = operates.filter(e => {
        return !e.show || e.show(scope.row)
      })
      showOprates.forEach((option, index) =>
        index > 2 && showOprates.length > 4 && !option.showBtnList
          ? specialOperates.push(option)
          : generalOperates.push(option)
      )
      if (specialOperates.length) {
        generalOperates.push({
          label: '更多',
          children: specialOperates
        })
      }
      return generalOperates.map(btn => {
        return this.switchOperares(scope, btn)
      })
    },

    /**
     * @description:  根据按钮文本为按钮添加对应的parentElement
     * @param {*} scope
     * @param {*} operate
     * @return {*}
     */
    switchOperares(scope, operate) {
      const _flag = operate.show ? operate.show(scope.row) : true
      switch (operate.label) {
        case '更多':
          return (
            <el-dropdown class="table-wrap-dropdown" trigger="click">
              <span class="el-dropdown-link">
                {typeof operate.label === 'function' ? operate.label(scope.row) : operate.label}
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                {operate.children.map(c => {
                  return <el-dropdown-item>{this.switchOperares(scope, c)}</el-dropdown-item>
                })}
              </el-dropdown-menu>
            </el-dropdown>
          )
        default:
          return _flag ? (
            <ansoButton
              class="table-wrap-btn"
              style={
                'margin: 0;margin-right: 10px;' +
                (operate.showBtnList ? 'display:' + operate.showBtnList(scope.row) + ';' : '')
              }
              type={operate.type}
              size={operate.size ? operate.size : 'small'}
              disabled={operate.disabled ? operate.disabled(scope.row) : false}
              loading={operate.isLoading ? operate.isLoading(scope.row) : false}
              permission={typeof operate.permission === 'function' ? operate.permission(scope.row) : operate.permission}
              nativeOnClick={e => {
                e.preventDefault()
                operate.method(scope.$index, scope.row, this.tableData)
              }}
            >
              {typeof operate.label === 'function' ? operate.label(scope.row) : operate.label}
            </ansoButton>
          ) : (
            ''
          )
      }
    },

    /**
     * @description:  改变页码/页容量
     * @param {*}
     * @return {*}
     */
    _dispatchEvent(state) {
      if (state) {
        this.currentPage = 1
        // 这里是为了解决弹框中的表格，改变了每页条数后，关闭弹框时，条数下拉会出现一下的问题。
        let dom = document.querySelectorAll('.el-dialog__body .v-pager .el-input__inner')
        if (dom.length) {
          setTimeout(() => {
            dom.forEach(v => {
              v.blur()
            })
          }, 0)
        }
      }
      this.$emit('pagination')
    },

    /**
     * @description:  获取操作列属性
     * @param {*} operates
     * @return {*}
     */
    getOperatesAttrs(operates) {
      const _props = {}
      Object.keys(operates).forEach(k => {
        if (k !== 'data') {
          Object.assign(_props, { [k]: operates[k] })
        }
      })
      return _props
    },
    exportTable() {
      this.$emit('exportTable')
    }
  },
  /**
   * @description:
   * @param {*} h
   * @return {*}
   */
  render(h) {
    const {
      columns,
      rowStyle,
      rowkey,
      tableData,
      createColumsFragment,
      operates,
      createOperates,
      total,
      currentPage,
      limit,
      layout,
      pageSizes,
      _dispatchEvent
    } = this
    return (
      <div class="table-wrap">
        <el-table
          class="v-table"
          ref="ansoTabel"
          data={tableData}
          style="width: 100%;"
          row-style={rowStyle}
          row-key={rowkey}
          border
          attrs={{
            height: total || total === 0 ? 'calc(100% - 56px)' : '100%',
            'header-cell-style': { background: '#f4f5f8' },
            'tooltip-effect': 'light',
            ...this.tableConfig,
            ...this.$attrs
          }}
          on={{ ...this.tableEvent, ...this.$listeners }}
        >
          {/* column渲染 */}
          {createColumsFragment(columns, h)}
          {/* <slot></slot> */}
          {/* 操作列 */}
          {operates?.data.length ? (
            <el-table-column
              props={{ label: '操作', ...this.getOperatesAttrs(operates), fixed: 'right' }}
              scopedSlots={{
                default: scope => createOperates(scope, operates.data)
              }}
            />
          ) : (
            ''
          )}
          {/* 空展示 */}
          <el-empty image={EMPTY_IMG} slot="empty" description="暂无数据"></el-empty>
        </el-table>
        {/* 分页 */}
        {total || total === 0 ? (
          <div class="v-pager">
            <el-pagination
              class="page"
              current-page={currentPage}
              page-size={limit}
              on={{
                'update:currentPage': page => {
                  this.currentPage = page
                },
                'update:pageSize': size => {
                  this.limit = size
                }
              }}
              layout={layout}
              page-sizes={pageSizes}
              total={Number(total)}
              on-size-change={val => _dispatchEvent(true)}
              on-current-change={val => _dispatchEvent()}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
