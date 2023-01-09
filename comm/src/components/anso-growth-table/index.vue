<script>
export default {
  name: 'AnsoGrowthTable',
  props: {
    growthTableList: {
      type: Object,
      default: () => {
        return {
          // columns: [
          //   // 表头
          //   {
          //     label: '字段',
          //     type: 'select',
          //     field: 'a', // 对应list的字段，一般是保存时传给后台的字段
          //     rules: {
          //       required: true,
          //       message: '请选择',
          //       trigger: 'blur'
          //     },
          //     options: [
          //       // 下拉选项
          //       {
          //         label: 1,
          //         value: 1
          //       },
          //       {
          //         label: 2,
          //         value: 2
          //       }
          //     ],
          //     controlField: 'field2,options',
          //     controlFunction: val => {
          //       // val表示当前选中的值，只支持下拉选单选的模式
          //       const filterData = this.currentFieldList.filter(item => item.fieldTypeCode === val)
          //       return filterData.map(i => {
          //         return {
          //           label: i.fieldName,
          //           value: i.fieldCode
          //         }
          //       })
          //     }
          //   },
          //   {
          //     label: '表名',
          //     type: 'select',
          //     field: 'field2',
          //     rules: {
          //       required: true,
          //       trigger: 'blur'
          //     },
          //     options: []
          //   },
          //   {
          //     label: '表名',
          //     type: 'input',
          //     field: 'a2',
          //     rules: {
          //       required: true,
          //       trigger: 'blur'
          //     }
          //   }
          // ],
          // // 最终生成的数据保存在list
          // list: [
          //   {
          //     a: 1,
          //     a2: '231'
          //   }
          // ],
          // // defalutList为原始的list数据，必须与list数据字段保存一致，用于点+的时候，从defaultList拷贝到list里
          // defalutList: [
          //   {
          //     a: '',
          //     a2: ''
          //   }
          // ]
        }
      }
    },
    addColumn: {}, // 自定义添加事件
    validateErrMsg: {
      // 校验失败统一报错
      type: String,
      default: '校验错误！'
    },
    deleteColumn: {}, // 自定义删除事件
    maxListNumber: {
      // list最多可以添加多少条，参数请填大于0的整数， 0表示不限制
      type: Number,
      default: 0
    }
  },
  components: {},
  data() {
    return {
      growthTableData: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.growthTableList.columns.forEach(item => {
        if (typeof item.options === 'function') {
          item.options(item)
        }
      })
    })
  },
  computed: {},
  methods: {
    /**
     * 字段联动控制 目前只支持一对一
     * @params list array 当前添加行后对应的list数组
     */
    createdControl(list) {
      this.growthTableList.columns.forEach(item => {
        if (item?.controlField) {
          list.forEach((l, i) => {
            if (!l?.hadWatch) {
              l.hadWatch = true // 只添加一次就好
              // 字段只添加监听一次
              this.$watch(
                () => {
                  return l[item.field]
                },
                (v, o) => {
                  if (item.controlField) {
                    let controlField = item.controlField.split(',') // controlField 字段通过逗号分隔，第一个表示对应控制哪个字段的下拉选，第二个表示下拉选数据存在哪个字段
                    // 根据控制字段配置来选定哪个字段是被控制的
                    let controlIndex = this.growthTableList.columns.findIndex(i => i.field === controlField[0])
                    this.growthTableList.columns[controlIndex][controlField[1]] = item.controlFunction(v)
                    // 这里存放被控制字段下拉选数据，实现每行对应的联动下拉选是不一样的
                    l[`${controlField[0]}_options`] = item.controlFunction(v)
                    o && (l[controlField[0]] = '')
                  }
                },
                {
                  immediate: true
                }
              )
            }
          })
        }
      })
    },

    /**
     * @description:  根据type渲染对应的form组件
     * @param  r [object] 为表头column对应的每个元素的数据
     * @param  item [object] 为表格column对应的每个元素的scope数据
     * @return {*}
     */
    checkTypeToFormElement(r, item) {
      const form = this.growthTableList
      let _options = []
      let itemIndex = item.$index
      switch (r.type) {
        case 'select':
          if (typeof r.options !== 'function') {
            if (item.row?.[`${r.field}_options`]) {
              _options = item.row[`${r.field}_options`]
            } else {
              _options = r.options
            }
          }
          // if (typeof r.options !== 'function') _options = item.row.options || r.options
          return (
            <el-select
              style={{ width: r.width }}
              v-model={form.list[itemIndex][r.field]}
              {...this.createFormAttrs(r)}
              class="cus-form-select"
              on-visible-change={this.visibleChange}
            >
              {Array.isArray(_options) &&
                _options.map(option => (
                  <el-option
                    key={r.props ? option[r.props.value] : option.value}
                    value={r.props ? option[r.props.value] : option.value}
                    label={r.props ? option[r.props.label] : option.label}
                  />
                ))}
            </el-select>
          )
        case 'switch':
          return <el-switch v-model={form.list[itemIndex][r.field]} {...this.createFormAttrs(r)}></el-switch>
        case 'cascader':
          return (
            <el-cascader
              v-model={form.list[itemIndex][r.field]}
              style={{ width: r.width }}
              {...this.createFormAttrs(r)}
            ></el-cascader>
          )
        case 'date':
          if (r?.timeDismantle) {
            form.list[itemIndex][[r.field]] = [r.timeDismantle]
          }
          return (
            <ansoDatePicker
              v-model={form.list[itemIndex][r.field]}
              type={r.dateType}
              picker-options={r.pickerOptions}
              default-time={r.defaultTime}
              default-value={r.defaultValue}
              style={{ width: r.width }}
              {...this.createFormAttrs(r)}
            ></ansoDatePicker>
          )
        case 'radios':
          _options = typeof r.options === 'function' ? [] : r.options
          return (
            <el-radio-group v-model={form.list[itemIndex][r.field]} {...this.createFormAttrs(r)}>
              {Array.isArray(_options) &&
                _options.map(option => {
                  return <el-radio {...this.createFormAttrs(option)}>{option.text}</el-radio>
                })}
            </el-radio-group>
          )
        case 'checkboxs':
          if (!Array.isArray(form[r.value])) {
            this.$set(form, r.field, [])
          }
          _options = typeof r.options === 'function' ? [] : r.options
          return (
            <el-checkbox-group v-model={form.list[itemIndex][r.field]} {...this.createFormAttrs(r)}>
              {Array.isArray(_options) &&
                _options.map(option => {
                  return <el-checkbox {...this.createFormAttrs(option)}></el-checkbox>
                })}
            </el-checkbox-group>
          )
        case 'treeSelect':
          return <ansoTreeSelect v-model={form.list[itemIndex][r.field]} {...this.createFormAttrs(r)}></ansoTreeSelect>
        // 自定义
        case 'custom':
          return r.custom(form.list[itemIndex][r.field], form.list[itemIndex], r) // 当前字段的值，当前行的所有字段，当前行的配置
        case 'slot':
          return this.$scopedSlots.default(form.list[itemIndex]) || this.$slots[r.field] || r.field
        case 'none':
          return <span>{form.list[itemIndex][r.field]}</span>
        default:
          return (
            <el-input
              style={{ width: r.width }}
              v-model={form.list[itemIndex][r.field]}
              type={r.type ? r.type : 'text'}
              on={{
                input: val => {
                  if (r.validate) {
                    form[r.field] = val
                      .replace((r.regexp && new RegExp(r.regexp)) || /[#$%<>&\\*]/g, '')
                      .replace(/^\s*/g, '')
                      .replace(/\s*$/, '')
                  }
                }
              }}
              {...this.createFormAttrs(r)}
            ></el-input>
          )
      }
    },
    /**
     * @description: 属性和事件导入
     * @param {*} formOptions
     * @return {*}
     */

    createFormAttrs(formOptions) {
      const _props = {}
      const _event = {}
      const _native = {}
      let field = ''
      // todo: 没加上的方法自己加入数组
      const _methods = ['change', 'select', 'input', 'clear', 'focus', 'blur', 'click']
      Object.keys(formOptions).forEach(m => {
        if (_methods.includes(m)) {
          Object.assign(_event, { [m]: formOptions[m] })
        } else {
          // 键盘事件处理
          switch (m) {
            case 'keyup':
              Object.assign(_native, { [m]: formOptions[m] })
              break
            case 'enter':
              Object.assign(_native, {
                keyup: e => {
                  if (e.keyCode !== 13) return
                  return formOptions[m](e.target.value)
                }
              })
              break
            case 'field':
              field = formOptions[m]
              break
            case 'width':
            case 'options':
            case 'type':
            case 'name':
            case 'model':
            case 'text':
            case 'dateType':
              break
            default:
              Object.assign(_props, { [m]: formOptions[m], name: field })
              break
          }
        }
      })
      return {
        attrs: _props,
        on: _event,
        nativeOn: _native
      }
    },
    /**
     * @description: select 取消回车弹出下拉
     * @param {*}
     * @return {*}
     */

    visibleChange(e) {
      let doms = document.querySelectorAll('.cus-form-select')
      Array.from(doms).forEach(v => {
        let input = v.querySelector('.el-input__inner')
        if (input) {
          input.blur()
        }
      })
    },
    createTableColumn(columns) {
      const columnsList = columns.map(l => {
        return (
          <el-table-column
            label={l.label}
            width={l?.width ? l.width : ''}
            show-overflow-tooltip
            scopedSlots={{
              default: scope => this.createFormItem(scope, l)
            }}
          ></el-table-column>
        )
      })
      return columnsList
    },
    createFormItem(scope, item) {
      return (
        <el-form-item prop={`list[${scope.$index}][${item.field}]`} rules={item.rules}>
          {this.checkTypeToFormElement(item, scope)}
        </el-form-item>
      )
    },
    addClick() {
      // 自定义添加事件
      if (this.maxListNumber > 0 && this.growthTableList.list.length >= this.maxListNumber) {
        return
      }
      if (typeof this.addColumn === 'function') {
        this.addColumn()
      } else {
        const addItem = JSON.parse(JSON.stringify(this.growthTableList.defalutList[0])) // 添加的时候取第一个元素进行添加
        this.growthTableList.list.push(addItem)
      }
    },
    createdAddBtn(scope) {
      if (this.maxListNumber > 0 && this.growthTableList.list.length >= this.maxListNumber) {
        return ''
      }
      return <span class="growth-table-btn add-column el-icon-plus" on={{ click: this.addClick }}></span>
    },
    createdDeleteBtn(scope) {
      return (
        <span
          class="growth-table-btn del-column el-icon-minus"
          onClick={() => {
            this.deleteItem(scope)
          }}
        ></span>
      )
    },
    deleteItem(scope) {
      if (typeof this.deleteColumn === 'function') {
        return this.deleteColumn(scope)
      }
      this.$ansoConfirm({
        title: '删除',
        message: '请确认是否删除此行数据？',
        type: 'error'
      })
        .then(res => {
          this.growthTableList.list = this.growthTableList.list.filter((item, index) => {
            return index !== scope.$index
          })
        })
        .catch(() => {
          console.log('取消')
        })
    },
    clearHadWatch() {
      this.growthTableList.list.forEach(item => {
        delete item.hadWatch
      })
    },
    submit() {
      let res = false
      this.$refs['growthTable'].validate(valid => {
        if (valid) {
          res = true
        } else {
          res = false
          let hasMessage = document.body.querySelector('.el-message')
          !hasMessage &&
            this.$message({
              type: 'warning',
              message: this.validateErrMsg
            })
        }
      })
      return res
    }
  },
  render() {
    const { growthTableList, growthTableData } = this
    return (
      <el-form props={{ model: growthTableList }} class="growth-table" ref="growthTable" attrs={{ ...this.$attrs }}>
        <el-table data={growthTableData}>
          {this.createTableColumn(growthTableList.columns)}
          <el-table-column
            width={60}
            scopedSlots={{ header: scope => this.createdAddBtn(), default: scope => this.createdDeleteBtn(scope) }}
          ></el-table-column>
        </el-table>
      </el-form>
    )
  },
  watch: {
    'growthTableList.list': {
      handler(newVal, oldVal) {
        this.growthTableData = newVal
        this.createdControl(newVal)
        if (!oldVal) {
          this.clearHadWatch()
        }
      },
      immediate: true,
      deep: true
    }
  },
  beforeDestroy() {
    this.clearHadWatch()
  }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
