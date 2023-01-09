<script>
import ansoTooltips from '../anso-tooltips'
let dayjs = require('dayjs')
export default {
  name: 'ansoTableEdit',
  components: { ansoTooltips },
  props: {
    form: {
      required: false,
      type: Object,
      default: () => {
        return {}
      }
    },
    columns: {
      required: false,
      type: Array,
      default: () => {
        return []
      }
    },
    tableKey: {
      required: false,
      type: String,
      default: () => {
        return ''
      }
    },
    border: {
      required: false,
      type: Boolean,
      default: () => {
        return true
      }
    },
    height: {
      required: false,
      type: String,
      default: () => {
        return ''
      }
    },
    tableData: {
      required: false,
      type: Array,
      default: () => {
        return []
      }
    },
    modelType: {
      required: false,
      type: String,
      default: () => {
        return 'add'
      }
    },
    rules: {
      required: false,
      type: Object,
      default: () => {
        return {}
      }
    },
    size: {
      required: false,
      type: String,
      default: () => {
        return 'mini'
      }
    },
    propKeys: {
      required: false,
      type: Object,
      default: () => {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
    isFormItem: {
      required: false,
      type: Boolean,
      default: () => {
        return true
      }
    },
    isShowBtn: {
      required: false,
      type: Boolean,
      default: () => {
        return true
      }
    },
    maxAccount: {
      required: false,
      type: Number,
      default: () => {
        return 0
      }
    },
    message: {
      required: false,
      type: String,
      default: () => {
        return ''
      }
    },
    operatorText: {
      required: false,
      type: Boolean,
      default: () => {
        return true
      }
    },
    operatorBtn: {
      required: false,
      type: [String, Object],
      default: ''
    }
  },
  watch: {
    tableData: {
      handler(n, o) {
        console.log(n, 23434)
      }
    }
  },
  data() {
    return {
      row: {}
    }
  },
  created() {
    let that = this
    function resever(arr) {
      arr.forEach(a => {
        if (a?.children) {
          resever(a.children)
        } else {
          that.row[a.feild] = a.value || ''
        }
      })
    }
    resever(this.columns)
    console.log(this.form, this.tableKey, this.modelType, '------------tableEdite-----------------')
  },
  methods: {
    generateTableItem(itemProp, scope, feild) {
      let { rules } = itemProp || {}
      rules = rules || []
      return this.isFormItem ? (
        <el-form-item prop={`${this.tableKey}.${scope.$index}.${feild}`} rules={rules}>
          {this.generateFormItem(itemProp, scope, feild)}
        </el-form-item>
      ) : (
        this.generateFormItem(itemProp, scope, feild)
      )
    },
    generateFormItem(itemProp, scope, feild) {
      itemProp = itemProp || {}
      let {
        type,
        label,
        placeholder,
        size,
        options,
        dynamicOptions,
        disabled,
        rowDisabled,
        props,
        event,
        rules,
        maxlength,
        render,
        text,
        startPlaceholder,
        endPlaceholder,
        isNumber,
        width,
        propKeys,
        multiple,
        collapseTags
      } = itemProp
      propKeys = propKeys || {
        label: 'label',
        value: 'value'
      }
      // 自定义options
      if (dynamicOptions) {
        options = this.tableData[scope.$index][dynamicOptions] || []
      } else {
        options = options || []
      }
      rowDisabled && (disabled = this.tableData[scope.$index][rowDisabled])
      let { slot, slotRender } = props || {}
      // 时间格式转化统一处理
      if (this.modelType === 'detail') {
        switch (type) {
          case 'week':
            text = !this.tableData[scope.$index][feild]
              ? ''
              : dayjs(this.tableData[scope.$index][feild]).format('yyyy 第 WW 周')
            break
          case 'year':
            text = !this.tableData[scope.$index][feild] ? '' : dayjs(this.tableData[scope.$index][feild]).format('YYYY')
            break
          case 'month':
            text = !this.tableData[scope.$index][feild]
              ? ''
              : dayjs(this.tableData[scope.$index][feild]).format('YYYY-MM')
            break
          case 'dates':
            text = this.tableData[scope.$index][feild].length
              ? this.tableData[scope.$index][feild]
                  .map(m => {
                    return dayjs(m).format('YYYY-MM-DD')
                  })
                  .join()
              : ''
            break
          case 'daterange':
            text = this.tableData[scope.$index][feild].length
              ? `${dayjs(this.tableData[scope.$index][feild][0]).format('YYYY-MM-DD')}-${dayjs(
                  this.tableData[scope.$index][feild][1]
                ).format('YYYY-MM-DD')}}`
              : ''
            break
          case 'monthrange':
            text = this.tableData[scope.$index][feild].length
              ? `${dayjs(this.tableData[scope.$index][feild][0]).format('YYYY-MM')}-${dayjs(
                  this.tableData[scope.$index][feild][1]
                ).format('YYYY-MM')}}`
              : ''
            break
          case 'date':
            text = !this.tableData[scope.$index][feild]
              ? ''
              : dayjs(this.tableData[scope.$index][feild]).format('YYYY-MM-DD')
            break
          case 'datetime':
            text = !this.tableData[scope.$index][feild]
              ? ''
              : dayjs(this.tableData[scope.$index][feild]).format('YYYY-MM-DD HH:mm:ss')
            break
          case 'datetimerange':
            text = this.form[feild].length
              ? `${dayjs(this.tableData[scope.$index][feild][0]).format('YYYY-MM-DD HH:mm:ss')}-${dayjs(
                  this.tableData[scope.$index][feild][1]
                ).format('YYYY-MM-DD HH:mm:ss')}}`
              : ''
            break
          default:
            text = ''
        }
      }
      let temp = options
        ? options.find(f => {
            return this.tableData.length && f[this.propKeys['value']] == this.tableData[scope.$index][feild]
          })
        : null
      switch (type) {
        case 'select':
          return this.modelType === 'detail' ? (
            <anso-tooltips
              text={
                Array.isArray(this.tableData[scope.$index][feild])
                  ? this.tableData[scope.$index][feild].join('-')
                  : this.tableData[scope.$index][feild] + ''
              }
              options={options}
              propKeys={propKeys}
            ></anso-tooltips>
          ) : (
            <el-select
              v-model={this.tableData[scope.$index][feild]}
              placeholder={placeholder || '请选择'}
              disabled={disabled}
              props={props}
              multiple={multiple}
              collapse-tags={collapseTags}
              on={
                (event,
                {
                  change: val => {
                    event?.change && event.change(val, scope.$index)
                  }
                })
              }
              clearable
              style="width: 100%"
            >
              {options.map(m => {
                return (
                  <el-option
                    key={m[propKeys['value']]}
                    label={m[propKeys['label']]}
                    value={m[propKeys['value']]}
                    disabled={m.disabled || false}
                  ></el-option>
                )
              })}
            </el-select>
          )
        case 'textarea':
          props = props || {
            maxlength: '200',
            showWordLimit: true,
            autosize: false,
            rows: 4
          }
          return this.modelType === 'detail' ? (
            <anso-tooltips text={this.tableData[scope.$index][feild]}></anso-tooltips>
          ) : (
            <el-input
              type="textarea"
              v-model={this.tableData[scope.$index][feild]}
              placeholder={placeholder || '请输入'}
              size={size || this.size}
              props={props}
              on={event}
              disabled={disabled}
              style="width: 100%"
            ></el-input>
          )
        case 'time':
          return this.modelType === 'detail' ? (
            <anso-tooltips text={dayjs(this.tableData[scope.$index][feild]).format('HH:mm')}></anso-tooltips>
          ) : (
            <el-time-select
              v-model={this.tableData[scope.$index][feild]}
              type={type}
              placeholder={placeholder || '选择时间'}
              props={props}
              on={event}
              value-format="timestamp"
              disabled={disabled}
              style="width: 100%"
            ></el-time-select>
          )
        case 'date':
        case 'week':
        case 'month':
        case 'year':
        case 'dates':
        case 'daterange':
        case 'monthrange':
        case 'datetime':
        case 'datetimerange':
          return this.modelType === 'detail' ? (
            <anso-tooltips text={text}></anso-tooltips>
          ) : (
            <el-date-picker
              v-model={this.tableData[scope.$index][feild]}
              type={type}
              placeholder={placeholder || '选择日期时间'}
              start-placeholder={startPlaceholder || '开始时间'}
              end-placeholder={endPlaceholder || '结束时间'}
              props={props}
              on={event}
              value-format="timestamp"
              disabled={disabled}
              style="width: 100%"
            ></el-date-picker>
          )
        case 'radio':
          return this.modelType === 'detail' ? (
            <anso-tooltips text={temp ? temp[this.propKeys['label']] : ''}></anso-tooltips>
          ) : (
            <el-radio-group v-model={this.tableData[scope.$index][feild]} props={props} on={event} disabled={disabled}>
              {options.map(el => {
                return <el-radio label={el.value}>{el.label}</el-radio>
              })}
            </el-radio-group>
          )
        case 'text':
          return typeof render === 'function' ? render(scope, feild) : scope.row[feild]
        case 'index':
          return scope.$index + 1
        case 'custom':
          return typeof render === 'function' && render(scope.row, scope.$index, scope)
        case 'switch':
          return (
            <el-switch
              v-model={this.tableData[scope.$index][feild]}
              props={props}
              disabled={this.modelType === 'detail' ? true : disabled}
              class={{ 'is-active': this.tableData[scope.$index][feild] }}
            ></el-switch>
          )
        case 'number':
        default:
          return this.modelType === 'detail' ? (
            <anso-tooltips
              text={this.unit(this.tableData[scope.$index][feild], slotRender, this.tableData[scope.$index][feild])}
            ></anso-tooltips>
          ) : (
            <el-input
              type={type || 'text'}
              v-model={this.tableData[scope.$index][feild]}
              placeholder={placeholder || '请输入'}
              size={size || this.size}
              props={props}
              on={
                (event,
                {
                  focus: val => {
                    event?.focus && event.focus(scope.row, scope.$index)
                  }
                })
              }
              maxlength={maxlength}
              disabled={disabled}
              clearable
              style={{ width: width || '100%' }}
              onInput={() => {
                if (
                  isNumber &&
                  this.tableData[scope.$index][feild] &&
                  new RegExp('^(\\+|\\-)?\\d*\\.?\\d*$', 'g').test(this.tableData[scope.$index][feild])
                ) {
                  this.tableData[scope.$index][feild] = +this.tableData[scope.$index][feild]
                }
              }}
            >
              <template slot={slot} v-if={!!slot}>
                {typeof slotRender == 'function' && slotRender(scope.row)}
              </template>
            </el-input>
          )
      }
    },
    unit(type, slot, text) {
      console.log(typeof slot == 'function')
      let resule = ''
      if (typeof type == 'number') {
        resule = typeof slot == 'function' ? text + slot() : text + ' '
      } else {
        resule = typeof slot == 'function' ? text + slot() : text
      }
      return resule
    },
    generateTableColumn(arr) {
      if (Array.isArray(arr)) {
        return arr.map(m => {
          let { feild, label, align, width, formItem, props, event, render, required, children, minWidth, type } = m
          this.modelType === 'detail' && (required = false)
          if (children) {
            return (
              <el-table-column label={label} label-class-name={required ? 'is-reqiured' : ''}>
                {this.generateTableColumn(children)}
              </el-table-column>
            )
          }
          return (
            <el-table-column
              type={type}
              prop={feild}
              width={width || ''}
              minWidth={minWidth || ''}
              label={label}
              align={align || 'left'}
              props={props}
              on={event}
              label-class-name={required ? 'is-reqiured' : ''}
              scopedSlots={{
                default: scope => {
                  {
                    return this.generateTableItem(formItem, scope, feild)
                  }
                }
              }}
            ></el-table-column>
          )
        })
      }
    },
    add() {
      if (this.maxAccount && this.tableData.length >= this.maxAccount) {
        this.$message({ type: 'error', message: this.message || `允许添加的最大条数为${this.maxAccount}` })
        return false
      }
      let that = this
      this.tableData.push({ ...that.row })
    },
    del(index) {
      this.tableData.splice(index, 1)
    },
    operatorBtnMethod(val) {
      console.log(val)
    },
    isExitForm() {
      let parent = this.$parent

      function resever(parent) {
        while (parent) {
          if (parent.$el && parent.$el.localName == 'form') {
            return true
          }
          parent = parent.$parent
          return false
        }
      }

      return resever(parent)
    }
  },
  render() {
    let that = this
    let props = {}
    this.height && (props['height'] = this.height)
    return (
      <div class="table-edit-component">
        <el-table data={this.tableData} style="width: 100%" border={this.border} size={this.size} props={props}>
          {this.generateTableColumn(this.columns)}
          {
            // 增加自定义操作列:operatorBtn
          }
          {(this.isShowBtn && this.modelType !== 'detail') || this.operatorBtn ? (
            <el-table-column
              minWidth={'70px'}
              width={'70px'}
              align={'center'}
              scopedSlots={{
                default: scope => {
                  return this.operatorBtn ? (
                    <el-button
                      type="text"
                      disabled={this.operatorBtn.disabled ? this.operatorBtn.disabled(scope.row) : false}
                      onClick={() => {
                        this.operatorBtn.fuc(scope.row, scope.$index)
                      }}
                      class="operator-btn"
                    >
                      {this.operatorBtn.name}
                    </el-button>
                  ) : (
                    <i
                      class="el-icon-minus"
                      style="cursor: pointer"
                      onClick={() => {
                        that.del(scope.$index)
                      }}
                    ></i>
                  )
                },
                header: scope => {
                  return this.operatorText ? (
                    <i
                      class="el-icon-plus"
                      style="cursor: pointer"
                      onClick={() => {
                        that.add()
                      }}
                    ></i>
                  ) : (
                    '操作'
                  )
                }
              }}
            ></el-table-column>
          ) : (
            ''
          )}
        </el-table>
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
.table-edit-component {
  height: auto;
  width: 100%;
  flex: 1;

  /deep/ .el-table__body-wrapper {
    tr {
      td {
        .el-form-item {
          margin-bottom: 0px;

          .el-form-item__content {
            overflow: hidden;
            line-height: normal;

            .el-input--small .el-input__inner {
              height: 28px !important;
              line-height: 28px;
            }

            .el-range-editor {
              .el-range-separator {
                line-height: 20px;
              }
            }

            .el-input__inner {
              height: 28px !important;
              line-height: 28px;
            }

            .el-cascader {
              line-height: normal;
            }

            .el-input__suffix,
            .el-input__prefix {
              .el-input__icon {
                line-height: 28px !important;
              }
            }
          }
        }

        .el-form-item__error {
          position: relative !important;
          line-height: 1.1;
          padding-top: 0px;
          margin-top: 5px;
        }

        .el-range-editor {
          .el-range-separator {
            line-height: 20px;
          }
        }
      }
    }
  }
  /deep/ .el-switch.is-active .el-switch__core {
    border-color: #3171f2;
    background-color: #3171f2;
  }
}

/deep/ .cell.is-reqiured {
  &::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
.operator-btn {
  color: #3171f2;
  cursor: pointer;
}
/deep/.el-form-item__content {
  color: #626262;
}
</style>
