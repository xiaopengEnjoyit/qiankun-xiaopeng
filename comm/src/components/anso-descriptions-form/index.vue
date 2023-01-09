<script>
import ansoUpload from './../anso-upload'
import ansoTooltips from '../anso-tooltips'
import ansoTreeSelect from '../anso-tree-select'
let dayjs = require('dayjs')
export default {
  name: 'ansoDescriptions',
  components: { ansoUpload, ansoTooltips },
  props: {
    form: Object,
    formKey: {
      required: false,
      type: String,
      default: () => {
        return ''
      }
    },
    tableList: Array,
    column: {
      required: false,
      type: Number,
      default: () => {
        return 3
      }
    },
    showBoder: {
      required: false,
      type: Boolean,
      default: () => {
        return true
      }
    },
    direction: {
      required: false,
      type: String,
      default: () => {
        return '' // 枚举值 vertical/horizontal 或者不传默认横向显示
      }
    },
    title: {
      required: false,
      type: String,
      default: () => {
        return ''
      }
    },
    size: {
      required: false,
      type: String,
      default: () => {
        return 'small'
      }
    },
    rules: {
      required: false,
      type: Object,
      default: () => {
        return {}
      }
    },
    isShowForm: {
      required: false,
      type: Boolean,
      default: () => {
        return true
      }
    },
    modelType: {
      required: false,
      type: String,
      default: () => {
        return 'add'
      }
    },
    isFormItem: {
      required: false,
      type: Boolean,
      default: () => {
        return true
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
    }
  },
  data() {
    return {}
  },
  // watch: {
  //   tableList: {
  //     handler(n, o) {
  //       console.log(this.form, this.formKey, this.modelType, '-----------ansoDescriptions-------------')
  //       this.tableList.forEach(f => {
  //         f.feild && this.$set(this.formKey ? this.form[this.formKey] : this.form, f.feild, f.value || '')
  //       })
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // },
  created() {
    console.log(this.form, this.formKey, this.modelType, '-----------ansoDescriptions-------------')
    this.tableList.forEach(f => {
      if (f.feild) {
        if (this.formKey) {
          this.$set(
            this.form[this.formKey],
            f.feild,
            this.form[this.formKey][f.feild] !== undefined
              ? this.form[this.formKey][f.feild]
              : f.value !== undefined
              ? f.value
              : ''
          )
        } else {
          this.$set(
            this.form,
            f.feild,
            this.form[f.feild] !== undefined ? this.form[f.feild] : f.value !== undefined ? f.value : ''
          )
        }
      }
    })
  },
  mounted() {},
  methods: {
    generateDescriptionItem() {
      return this.tableList.map((item, index) => {
        let { label, icon, span, feild, rules, required, showMessage, isShow } = item
        if (typeof isShow === 'function' ? isShow() === false : isShow === false) {
          return false
        }
        span = span || 1
        this.modelType === 'detail' && (required = false)
        return (
          <el-descriptions-item span={span} labelClassName={required ? 'is-required' : ''}>
            <template slot="label">
              <span class={icon}></span>
              <span>{label}</span>
            </template>
            {this.isFormItem ? (
              <el-form-item
                showMessage={showMessage}
                prop={this.formKey ? `${this.formKey}.${feild}` : `${feild}`}
                rules={rules || this.rules[feild]}
              >
                {this.generateChildItem(item)}
              </el-form-item>
            ) : (
              this.generateChildItem(item)
            )}
          </el-descriptions-item>
        )
      })
    },
    generateChildItem(item) {
      let {
        type,
        feild,
        span,
        placeholder,
        startPlaceholder,
        endPlaceholder,
        size,
        options,
        disabled,
        props,
        maxlength,
        event,
        propKeys,
        render,
        text,
        uploadData,
        filterable,
        isNumber
      } = item
      propKeys = propKeys || this.propKeys
      let { slot, slotRender } = props || {}
      options = options || []
      span = span || 12
      let tempObj = this.formKey ? this.form[this.formKey] : this.form
      // 时间格式转化统一处理
      if (this.modelType === 'detail') {
        switch (type) {
          case 'week':
            text = !tempObj[feild] ? '' : dayjs(tempObj[feild]).format('yyyy 第 WW 周')
            break
          case 'year':
            text = !tempObj[feild] ? '' : dayjs(tempObj[feild]).format('YYYY')
            break
          case 'month':
            text = !tempObj[feild] ? '' : dayjs(tempObj[feild]).format('YYYY-MM')
            break
          case 'dates':
            text = tempObj[feild].length
              ? tempObj[feild]
                  .map(m => {
                    return dayjs(m).format('YYYY-MM-DD')
                  })
                  .join()
              : ''
            break
          case 'daterange':
            text = tempObj[feild].length
              ? `${dayjs(tempObj[feild][0]).format('YYYY-MM-DD')} - ${dayjs(tempObj[feild][1]).format('YYYY-MM-DD')}`
              : ''
            break
          case 'monthrange':
            text = tempObj[feild].length
              ? `${dayjs(tempObj[feild][0]).format('YYYY-MM')} - ${dayjs(tempObj[feild][1]).format('YYYY-MM')}`
              : ''
            break
          case 'datetime':
            text = !tempObj[feild] ? '' : dayjs(tempObj[feild]).format('YYYY-MM-DD HH:mm:ss')
            break
          case 'date':
            text = !tempObj[feild] ? '' : dayjs(tempObj[feild]).format('YYYY-MM-DD')
            break
          case 'datetimerange':
            text = tempObj[feild].length
              ? `${dayjs(tempObj[feild][0]).format('YYYY-MM-DD HH:mm:ss')} - ${dayjs(tempObj[feild][1]).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}`
              : ''
            break
          case 'text':
            text = text || tempObj[feild]
            break
          default:
            text = ''
        }
      }
      let temp = options.length
        ? options.find(f => {
            return f[propKeys['value']] == tempObj[feild]
          })
        : null

      if (item.type == 'checkbox') {
        temp = Array.isArray(tempObj[feild])
          ? tempObj[feild].map(m => {
              let el = options.find(f => {
                return f[propKeys['value']] == m
              })
              return el ? el[propKeys['label']] : ''
            })
          : []
      }
      switch (item.type) {
        case 'select':
          return this.modelType === 'detail' ? (
            <anso-tooltips text={tempObj[feild]} options={options} propKeys={propKeys}></anso-tooltips>
          ) : (
            <div style="width:100%;display:flex;">
              <el-select
                v-model={tempObj[feild]}
                placeholder={placeholder || '请选择'}
                disabled={disabled}
                props={props}
                on={event}
                filterable={filterable}
                clearable
                style="flex:1"
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
              {props?.slotRender && typeof props.slotRender === 'function' ? props.slotRender() : ''}
            </div>
          )
        case 'time':
          return this.modelType === 'detail' ? (
            <anso-tooltips text={dayjs(tempObj[feild]).format('HH:mm')}></anso-tooltips>
          ) : (
            <el-time-select
              v-model={tempObj[feild]}
              type={type}
              placeholder={placeholder || '选择时间'}
              props={props}
              on={event}
              disabled={disabled}
              clearable
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
              v-model={tempObj[feild]}
              type={type}
              placeholder={placeholder || '选择日期时间'}
              props={props}
              on={event}
              disabled={disabled}
              start-placeholder={startPlaceholder || '开始时间'}
              end-placeholder={endPlaceholder || '结束时间'}
              clearable
              value-format="timestamp"
              style="width: 100%"
              attrs={{ ...propKeys }}
            ></el-date-picker>
          )
        case 'textarea':
          props = props || {
            maxlength: '200',
            showWordLimit: true,
            autosize: false,
            rows: 4
          }
          return this.modelType === 'detail' ? (
            <anso-tooltips text={tempObj[feild]}></anso-tooltips>
          ) : (
            <el-input
              type="textarea"
              v-model={tempObj[feild]}
              placeholder={placeholder || '请输入'}
              size={size || this.size}
              props={props}
              on={event}
              disabled={disabled}
              clearable
              maxlength={props.maxlength}
              style="width: 100%"
            ></el-input>
          )
        case 'cascader':
          return this.modelType === 'detail' ? (
            <anso-tooltips
              text={Array.isArray(tempObj[feild]) ? tempObj[feild].join(item.separator || '-') : ''}
              options={options}
              propKeys={propKeys}
            ></anso-tooltips>
          ) : (
            <el-cascader
              v-model={tempObj[feild]}
              props={props}
              on={event}
              options={options}
              disabled={disabled}
              style="width: 100%"
            ></el-cascader>
          )
        case 'text':
          return <anso-tooltips props={{ text: text || tempObj[feild] }}></anso-tooltips>
        case 'radio':
          return this.modelType === 'detail' ? (
            <anso-tooltips text={temp ? temp[propKeys['label']] : ''}></anso-tooltips>
          ) : (
            <el-radio-group v-model={tempObj[feild]} props={props} on={event} disabled={disabled}>
              {options.map(el => {
                return <el-radio label={el[propKeys['value']]}>{el[propKeys['label']]}</el-radio>
              })}
            </el-radio-group>
          )
        case 'checkbox':
          return this.modelType === 'detail' ? (
            <anso-tooltips text={temp.join()}></anso-tooltips>
          ) : (
            <el-checkbox-group v-model={tempObj[feild]} props={props} on={event} disabled={disabled}>
              {options.map(m => {
                return (
                  <el-checkbox label={m.value} key={m.value} props={m.props} on={m.event}>
                    {m.label}
                  </el-checkbox>
                )
              })}
            </el-checkbox-group>
          )
        case 'upload':
          return (
            <anso-upload
              v-model={tempObj[feild]}
              props={props}
              uploadData={uploadData}
              modelType={this.modelType}
              on={{
                ['update:fileList']: val => {
                  tempObj[feild] = val
                },
                ...event
              }}
            ></anso-upload>
          )
        case 'custom':
          return render && typeof render === 'function' && render(this.form, this.rules, feild, this.modelType)
        case 'inputNumber':
          return (
            <el-input-number v-model={tempObj[feild]} controls-position="right" style="width:100%"></el-input-number>
          )
        case 'treeSelect':
          return <ansoTreeSelect v-model={tempObj[feild]} attrs={{ ...propKeys }} on={event}></ansoTreeSelect>
        case 'switch':
          return (
            <el-switch
              v-model={tempObj[feild]}
              props={props}
              disabled={this.modelType === 'detail' ? true : disabled}
              class={{ 'is-active': tempObj[feild] }}
            ></el-switch>
          )
        case 'number':
        default:
          return this.modelType === 'detail' ? (
            <anso-tooltips
              text={typeof tempObj[feild] == 'number' ? tempObj[feild] + '' : tempObj[feild]}
            ></anso-tooltips>
          ) : (
            <el-input
              type={type || 'text'}
              v-model={tempObj[feild]}
              placeholder={placeholder || '请输入'}
              size={size || this.size}
              props={props}
              on={event}
              disabled={disabled}
              style="width: 100%"
              maxlength={maxlength || 100}
              clearable
              onInput={() => {
                if (isNumber && tempObj[feild] && new RegExp('^(\\+|\\-)?\\d*\\.?\\d*$', 'g').test(tempObj[feild])) {
                  tempObj[feild] = +tempObj[feild]
                }
              }}
            >
              <template slot={slot} v-if={!!slot}>
                {typeof slotRender == 'function' && slotRender()}
              </template>
            </el-input>
          )
      }
    }
  },
  render(h) {
    let that = this
    return (
      <el-descriptions
        title={this.title}
        column={this.column}
        size={this.size}
        border={this.showBoder}
        direction={this.direction}
        class="descriptions-form"
      >
        <template slot="extra">{that.$slots.extra}</template>
        {this.generateDescriptionItem()}
      </el-descriptions>
    )
  }
}
</script>

<style lang="scss" scoped>
.descriptions-form {
  margin-bottom: 10px;
  /deep/ .el-descriptions__table {
    table-layout: fixed !important;
  }

  /deep/ .el-descriptions-row {
    > th {
      text-align: right;
      min-width: 120px;
      max-width: 150px;
      width: 200px;
      color: #626262 !important;
      background-color: #f4f5f8 !important;
      font-weight: 700;
    }

    > td {
      width: auto;

      > .el-form-item {
        max-height: auto !important;
        margin-bottom: 0px !important;

        .el-form-item__error {
          position: relative !important;
          line-height: 1.1 !important;
          padding-top: 0px !important;
          width: 100%;
          margin-top: 5px;
        }

        .el-form-item__content {
          overflow: hidden;
          line-height: normal;

          .el-checkbox-group {
            width: 100%;
            display: flex;
            flex-wrap: wrap;

            .el-checkbox {
              width: max-content;
              margin-right: 10px;

              .el-checkbox__label {
                width: max-content;
              }
            }
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
    }

    .el-form-item.is-required {
      &::before {
        content: '' !important;
      }
    }
  }

  /deep/ .is-required {
    &::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }

  /deep/ .el-input-number {
    line-height: normal !important;

    .el-input-number__decrease {
      display: none;
    }

    .el-input-number__increase {
      display: none;
    }
  }
  /deep/.el-descriptions__title {
    color: #626262;
    font-weight: 500;
  }
  /deep/.el-descriptions__header {
    margin-bottom: 16px;
  }

  /deep/ .is-active {
    .el-switch__core {
      background: #3171f2;
    }
  }
}
</style>
