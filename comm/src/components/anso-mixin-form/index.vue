<script>
import ansoDescriptions from '../anso-descriptions-form'
import tablePage from '../table-page'
import ansoTitle from '../anso-title'
import ansoTooltips from '../anso-tooltips'
import ansoTableEdit from '../anso-table-edit'
import ansoFormTopTitle from '../anso-formTop-title'
import ansoUpload from './../anso-upload'
import { treeSearch } from './../../utils/utils.js'
import ansoMap from '../anso-map'
let dayjs = require('dayjs')

function returnValue(obj, str) {
  let temp = str.split('.')
  let tempObj = obj
  temp.forEach(f => {
    tempObj = tempObj[f]
  })
  return tempObj
}
export default {
  name: 'ansoMixinForm',
  components: {
    ansoDescriptions,
    tablePage,
    ansoTitle,
    ansoTooltips,
    ansoTableEdit,
    ansoUpload,
    ansoFormTopTitle,
    ansoMap
  },
  props: {
    formTop: {
      required: false,
      type: Object,
      default: () => {
        return {
          title: '',
          btns: []
        }
      }
    },
    form: Object,
    formList: Array,
    rules: {
      required: false,
      type: Object,
      default: () => {
        return {}
      }
    },
    labelWdith: {
      required: false,
      type: String,
      default: ''
    },
    labelPosition: {
      required: false,
      type: String,
      default: () => {
        return 'right' // 取值范围right、left、top
      }
    },
    gutter: {
      required: false,
      type: Number,
      default: () => {
        return 15
      }
    },
    size: {
      required: false,
      type: String,
      default: () => {
        return 'small'
      }
    },
    modelType: {
      required: false,
      type: String,
      default: () => {
        return 'add'
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
  created() {
    this.formList.forEach(f => {
      if (!f?.formKey) {
        f['feild'] &&
          this.$set(
            this.form,
            f['feild'],
            this.form[f['feild']] !== undefined ? this.form[f['feild']] : f?.value ? f.value : ''
          )
      }
    })
    console.log('----------form---------', this.form)
  },
  methods: {
    generateFormItem(itemProp) {
      let {
        type,
        feild,
        label,
        span,
        placeholder,
        size,
        options,
        disabled,
        props,
        maxlength,
        event,
        rules,
        propKeys,
        formKey,
        title,
        text,
        style,
        color,
        width,
        tableKey,
        checkboxKey,
        columns,
        startPlaceholder,
        endPlaceholder,
        isShow,
        uploadData,
        isNumber,
        method,
        column,
        message,
        maxAccount,
        operatorText,
        operatorBtn
      } = itemProp
      propKeys = propKeys || this.propKeys
      let { slot, slotRender } = props || {}
      options = options || []
      span = span || 12
      if (isShow === false) {
        return false
      }
      // 时间格式转化统一处理
      if (this.modelType === 'detail') {
        switch (type) {
          case 'week':
            text = !this.form[feild] ? '' : dayjs(this.form[feild]).format('yyyy 第 WW 周')
            break
          case 'year':
            text = !this.form[feild] ? '' : dayjs(this.form[feild]).format('YYYY')
            break
          case 'month':
            text = !this.form[feild] ? '' : dayjs(this.form[feild]).format('YYYY-MM')
            break
          case 'dates':
            text = this.form[feild].length
              ? this.form[feild]
                  .map(m => {
                    return dayjs(m).format('YYYY-MM-DD')
                  })
                  .join()
              : ''
            break
          case 'daterange':
            text = this.form[feild].length
              ? `${dayjs(this.form[feild][0]).format('YYYY-MM-DD')} - ${dayjs(this.form[feild][1]).format(
                  'YYYY-MM-DD'
                )}`
              : ''
            break
          case 'monthrange':
            text = this.form[feild].length
              ? `${dayjs(this.form[feild][0]).format('YYYY-MM')} - ${dayjs(this.form[feild][1]).format('YYYY-MM')}`
              : ''
            break
          case 'datetime':
            text = !this.form[feild] ? '' : dayjs(this.form[feild]).format('YYYY-MM-DD HH:mm:ss')
            break
          case 'datet':
            text = !this.form[feild] ? '' : dayjs(this.form[feild]).format('YYYY-MM-DD')
            break
          case 'datetimerange':
            text = this.form[feild].length
              ? `${dayjs(this.form[feild][0]).format('YYYY-MM-DD HH:mm:ss')} - ${dayjs(this.form[feild][1]).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}`
              : ''
            break
          default:
            text = ''
        }
        rules = []
      }
      let temp = options
        ? options.find(f => {
            return f[propKeys['value']] === this.form[feild]
          })
        : null

      if (type === 'cascader') {
        temp = treeSearch(options, this.form[feild] || [])
      }
      switch (type) {
        case 'select':
          return (
            <el-col span={span}>
              <el-form-item label={label} prop={feild} rules={rules || this.rules[feild]}>
                {this.modelType === 'detail' ? (
                  <anso-tooltips text={temp ? temp[propKeys['label']] : ''}></anso-tooltips>
                ) : (
                  <el-select
                    v-model={this.form[feild]}
                    placeholder={placeholder || '请选择'}
                    disabled={disabled}
                    props={props}
                    on={event}
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
                )}
              </el-form-item>
            </el-col>
          )
        case 'custom':
          return (
            <el-col span={span} style="marginBottom:22px;" class="custom-class">
              {itemProp.render(this.modelType)}
            </el-col>
          )
        case 'bigtitle':
          return (
            <el-col span={span}>
              <p class="big-title">{itemProp.title}</p>
            </el-col>
          )
        case 'title':
          return (
            <el-col span={span}>
              <el-form-item class="sub-title">{itemProp.render()}</el-form-item>
            </el-col>
          )
        case 'subtitle':
          return (
            <el-col span={span}>
              <anso-title props={{ title }}></anso-title>
            </el-col>
          )
        case 'button':
          return (
            <el-col span={span}>
              <el-form-item label={label} prop={feild} rules={rules || this.rules[feild]}>
                <el-button
                  onClick={() => {
                    method()
                  }}
                  disabled={disabled}
                  style="width: 100%"
                >
                  {text}
                </el-button>
              </el-form-item>
            </el-col>
          )
        case 'text':
          return (
            <el-col span={span}>
              <el-form-item label={label} prop={feild} rules={rules || this.rules[feild]}>
                <anso-tooltips props={{ text }}></anso-tooltips>
              </el-form-item>
            </el-col>
          )
        case 'textarea':
          props = props || {
            maxlength: '200',
            showWordLimit: true,
            autosize: false,
            rows: 4
          }
          return (
            <el-col span={span}>
              <el-form-item label={label} prop={feild} rules={rules || this.rules[feild]}>
                {this.modelType === 'detail' ? (
                  <anso-tooltips text={this.form[feild]}></anso-tooltips>
                ) : (
                  <el-input
                    type="textarea"
                    v-model={this.form[feild]}
                    placeholder={placeholder || '请输入'}
                    size={size || this.size}
                    props={props}
                    on={event}
                    disabled={disabled}
                    attrs={props}
                    clearable
                    maxlength={maxlength}
                    show-word-limit
                    style="width: 100%"
                  ></el-input>
                )}
              </el-form-item>
            </el-col>
          )
        case 'table':
          return (
            <el-col span={span} class="form-item-table">
              <el-form-item>
                <table-page
                  style="height: max-content !important"
                  props={props}
                  modelType={this.modelType}
                  on={{
                    ['update:pageIndex']: val => {
                      props.pageIndex = val
                    },
                    ['update:pageSize']: val => {
                      props.pageSize = val
                    },
                    ...event
                  }}
                ></table-page>
              </el-form-item>
            </el-col>
          )
        case 'map':
          return <anso-map props={props} ref={feild} on={event}></anso-map>
        case 'descriptions':
          return (
            <el-col span={span} class="form-item-table">
              <anso-descriptions
                props={{ modelType: this.modelType, form: this.form, formKey: formKey, ...props }}
                rules={this.rules}
                on={event}
                column={column}
              ></anso-descriptions>
            </el-col>
          )
        case 'tableEdit':
          return (
            <el-col span={span}>
              <anso-table-edit
                props={{
                  modelType: this.modelType,
                  columns,
                  tableData: returnValue(this.form, tableKey) || [],
                  tableKey,
                  form: this.form,
                  rules: this.rules,
                  message,
                  maxAccount,
                  operatorText,
                  operatorBtn,
                  ...props
                }}
                // columns={columns}
                // tableData={this.form[tableKey] || []}
                // tableKey={tableKey}
                // form={this.form}
                // rules={this.rules}
                // modelType={this.modelType}
                on={event}
              ></anso-table-edit>
            </el-col>
          )
        case 'time':
          return (
            <el-col span={span} class="form-item-table">
              <el-form-item label={label} prop={feild} rules={rules || this.rules[feild]}>
                {this.modelType === 'detail' ? (
                  <anso-tooltips text={dayjs(this.form[feild]).format('HH:mm')}></anso-tooltips>
                ) : (
                  <el-time-select
                    v-model={this.form[feild]}
                    type={type}
                    placeholder={placeholder || '选择时间'}
                    props={props}
                    on={event}
                    disabled={disabled}
                    clearable
                    style="width: 100%"
                  ></el-time-select>
                )}
              </el-form-item>
            </el-col>
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
          return (
            <el-col span={span} class="form-item-table">
              <el-form-item label={label} prop={feild} rules={rules || this.rules[feild]}>
                {this.modelType === 'detail' ? (
                  <anso-tooltips text={text}></anso-tooltips>
                ) : (
                  <el-date-picker
                    v-model={this.form[feild]}
                    type={type}
                    placeholder={placeholder || '选择日期时间'}
                    start-placeholder={startPlaceholder}
                    end-placeholder={endPlaceholder}
                    props={props}
                    on={event}
                    disabled={disabled}
                    clearable
                    value-format="timestamp"
                    style="width: 100%"
                  ></el-date-picker>
                )}
              </el-form-item>
            </el-col>
          )
        case 'radio':
          return (
            <el-col span={span}>
              <el-form-item label={label} prop={feild} rules={rules || this.rules[feild]}>
                {this.modelType === 'detail' ? (
                  <anso-tooltips text={temp ? temp[this.propKeys['label']] : ''}></anso-tooltips>
                ) : (
                  <el-radio-group v-model={this.form[feild]} props={props} on={event} disabled={disabled}>
                    {options.map(el => {
                      return (
                        <el-radio disabled={el['disabled']} label={el[this.propKeys['value']]}>
                          {el[this.propKeys['label']]}
                        </el-radio>
                      )
                    })}
                  </el-radio-group>
                )}
              </el-form-item>
            </el-col>
          )
        case 'checkbox':
          return (
            <el-col span={span}>
              {this.modelType === 'detail' ? (
                <el-descriptions class="checkbox">
                  <el-descriptions-item label={label}>
                    <div class="textInfo">
                      {options
                        .map(e => {
                          return this.form[checkboxKey].includes(e.value) ? e.label : ''
                        })
                        .filter(e => {
                          return e && e.trim()
                        })
                        .join('、')}
                    </div>
                  </el-descriptions-item>
                </el-descriptions>
              ) : (
                <el-descriptions class="checkbox">
                  <el-descriptions-item label={label}>
                    <el-checkbox-group
                      style="width: 100%;padding: 8px 0;font-size: 12px;"
                      v-model={this.form[checkboxKey]}
                      props={props}
                      on={event}
                      disabled={disabled}
                    >
                      {options.map(el => {
                        return (
                          <el-checkbox label={el[this.propKeys['value']]}>{el[this.propKeys['label']]}</el-checkbox>
                        )
                      })}
                    </el-checkbox-group>
                  </el-descriptions-item>
                </el-descriptions>
              )}
            </el-col>
          )
        case 'upload':
          return (
            <el-col span={span}>
              <el-form-item label={label} prop={feild} rules={rules || this.rules[feild]}>
                {this.modelType === 'detail' ? (
                  <div>{this.form[feild].join()}</div>
                ) : (
                  <anso-upload
                    v-model={this.form[feild]}
                    props={props}
                    uploadData={uploadData}
                    on={{
                      ['update:fileList']: val => {
                        this.form[feild] = val
                      },
                      ...event
                    }}
                  ></anso-upload>
                )}
              </el-form-item>
            </el-col>
          )

        case 'divider':
          return (
            <el-col span={24}>
              <div
                class="divider"
                style={{ 'border-color': color, 'border-top-style': style, 'border-width': width }}
              ></div>
            </el-col>
          )
        case 'number':
        default:
          return (
            <el-col span={span}>
              <el-form-item label={label} prop={feild} rules={rules || this.rules[feild]}>
                {this.modelType === 'detail' ? (
                  <anso-tooltips text={this.form[feild]}></anso-tooltips>
                ) : (
                  <el-input
                    type={type || 'text'}
                    v-model={this.form[feild]}
                    placeholder={placeholder || '请输入'}
                    size={size || this.size}
                    props={props}
                    on={event}
                    disabled={disabled}
                    style="width: 100%"
                    maxlength={maxlength || 100}
                    clearable
                    onInput={() => {
                      if (
                        isNumber &&
                        this.form[feild] &&
                        new RegExp('^(\\+|\\-)?\\d*\\.?\\d*$', 'g').test(this.form[feild])
                      ) {
                        this.form[feild] = +this.form[feild]
                      }
                    }}
                    nativeOnClick={() => {
                      typeof method === 'function' && method(this.form)
                    }}
                  >
                    <template slot={slot} v-if={!!slot}>
                      {typeof slotRender == 'function' && slotRender()}
                    </template>
                  </el-input>
                )}
              </el-form-item>
            </el-col>
          )
      }
    },
    submitForm(callback) {
      this.$refs['mixinForm'].validate(valid => {
        if (valid) {
          typeof callback == 'function' && callback(valid)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs['mixinForm'].resetFields()
    }
  },
  render() {
    return (
      <div class="form-wrap">
        {this.formTop.title || this.formTop.btns.length ? <anso-formTop-title formTop={this.formTop} /> : ''}
        {this.$scopedSlots.formHeader?.({ form: this.form })}
        <el-form
          ref="mixinForm"
          props={{ model: this.form }}
          labelPosition={this.labelPosition}
          labelWidth={this.labelWdith}
          class={this.labelPosition !== 'top' ? 'mixin-form' : 'top-form'}
        >
          <el-row gutter={this.gutter}>
            {this.formList.map(m => {
              return this.generateFormItem(m)
            })}
          </el-row>
        </el-form>
        {this.$scopedSlots.formFooter?.({ form: this.form })}
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
// $labelWidth: 80px;

.mixin-form {
  margin-bottom: 15px;

  /deep/ .el-col {
    .checkbox {
      margin-bottom: 10px;
      .el-descriptions-row {
        text-align: right;
        height: 36px;
        line-height: 36px;
        color: #626262 !important;
        font-weight: 700;

        .el-descriptions-item__label {
          padding: 10px;
          margin: 0;
          width: 132px;
          text-align: right;
          border: 1px solid #ebeef5;
          background-color: #f4f5f8 !important;
          font-size: 12px;
          font-weight: 700;
        }

        .el-descriptions-item__content {
          padding-left: 10px;
          width: calc(100% - 132px);
          min-height: 40px;
          border: 1px solid #ebeef5;

          .textInfo {
            padding: 8px 0;
          }
        }

        .el-descriptions-item__label.has-colon::after {
          content: '' !important;
        }
      }

      td {
        padding: 0;
      }
    }
    .el-checkbox-group .el-checkbox {
      width: auto !important;
      margin-right: 10px;
    }
    > .el-form-item {
      display: flex;
      max-height: 30px;
      margin-bottom: 10px;

      .el-form-item__content {
        overflow-x: hidden;
        flex: 1;
        font-size: 12px;
        line-height: 30px !important;
        > div {
          color: #626262;
        }
      }

      .el-form-item__label {
        font-size: 12px;
        flex-shrink: 0;
        line-height: 20px !important;
        // min-width: $labelWidth;
        // max-width: $labelWidth;
        // width: $labelWidth;
        color: #262626;
        word-break: normal;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0;
        &::after {
          margin-left: 1px !important;
        }
      }

      .el-input--small .el-input__inner {
        height: 28px !important;
        line-height: 28px;
      }

      .table-page {
        .table-page-main {
          padding: 0px;
        }
      }

      .el-select,
      .el-date-editor {
        .el-icon-arrow-up {
          line-height: 30px;
        }

        .el-input__icon {
          line-height: 30px;
        }

        .el-range-separator {
          line-height: 20px;
        }
      }
    }

    .sub-title {
      margin-bottom: 4px !important;

      .el-form-item__content {
        line-height: 30px !important;
      }
    }
  }
}
.big-title {
  font-size: 16px;
  margin: 0 0 13px;
  font-weight: 500;
}
.top-form {
  /deep/ .el-form-item__label {
    line-height: 30px !important;
    padding-bottom: 0px !important;
  }

  /deep/.el-form-item__content {
    line-height: 30px !important;

    .el-select,
    .el-date-editor {
      .el-input__icon {
        line-height: 20px;
      }
    }
  }
}

.form-wrap {
  .form-top {
    display: flex;
    position: static;
    align-items: center;
    justify-content: space-between;
    padding-top: 25px;
    padding-bottom: 22px;
    position: sticky;
    top: 0px;
    z-index: 1000;
    background: #fff;

    .title {
      font-size: 18px;
      color: #262626;
      display: flex;
      align-items: center;
      > i {
        margin-right: 5px;
        cursor: pointer;
      }
    }

    .btns {
      > * {
        margin-left: 10px;
      }
    }
  }
}

.divider {
  width: 100%;
  height: 1px;
  border-top: 1px dashed #cccc;
  margin: 11px 0px 24px;
}
</style>
