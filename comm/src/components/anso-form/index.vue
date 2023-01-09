<script>
import { ansoTreeSelect, ansoDatePicker } from '..'
import { guid } from '../../utils'
export default {
  name: 'AnsoForm',
  props: {
    formList: {
      type: Array,
      default() {
        return []
      }
    },
    value: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    model: {
      type: Object,
      default: () => ({})
    },
    labelWidth: {
      type: String,
      default: ''
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    formConfig: {
      type: Object,
      default: () => ({})
    },
    itemConfig: {
      type: Object,
      default: () => ({})
    },
    itemRow: {
      type: Number,
      default: 1
    }
  },
  created() {
    this.initForm()
    // 渲染完后再调异步数据
    this.$nextTick(() => {
      this.formList.forEach(item => {
        if (typeof item.options === 'function') {
          item.options(item)
        }
      })
    })
  },
  methods: {
    /**
     * @description: 初始化表单
     * @param {*}
     * @return {*}
     */

    initForm() {
      const { formList, value } = this
      Array.isArray(formList) &&
        formList.forEach(f => {
          if (value[f.field] !== undefined) return
          if (f.model !== undefined) {
            this.$set(value, f.field, f.model)
          } else {
            if (f.type !== 'select') {
              this.$set(value, f.field, '')
            }
          }
        })
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
    /**
     * @description: 表单元素构建
     * @param {*} formList
     * @return {*}
     */

    createFormItem(formList) {
      return formList.map(f => {
        return (
          <el-col span={24 / (f.itemRow ? f.itemRow : this.itemRow)}>
            <el-form-item props={{ prop: f.field, ...this.itemConfig }} key={f.field}>
              <div slot="label" class="label-wrap">
                <div>{f?.name}</div>
                {f.tips ? (
                  <el-tooltip placement="right-end" effect={f.effect || 'dark'}>
                    <div slot="content">{typeof f.tips === 'function' ? f.tips() : f.tips}</div>
                    <span class="iconfont icon-hint1 tips-icon" style={{ height: '0px' }}></span>
                  </el-tooltip>
                ) : (
                  ''
                )}
              </div>
              {this.checkTypeToFormElement(f)}
            </el-form-item>
          </el-col>
        )
      })
    },
    /**
     * @description:  根据type渲染对应的form组件
     * @param {*} r
     * @return {*}
     */

    checkTypeToFormElement(r) {
      const form = this.value
      let _options = []
      let { slot, slotRender } = r.props || {}
      switch (r.type) {
        case 'select':
          if (typeof r.options !== 'function') _options = r.options
          return (
            <el-select
              style={{ width: r.width }}
              v-model={form[r.field]}
              {...this.createFormAttrs(r)}
              class="cus-form-select"
              on-visible-change={this.visibleChange}
              disabled={r.disabled}
              clearable={typeof r.clearable === 'boolean' ? r.clearable : true}
            >
              {Array.isArray(_options) &&
                _options.map(option => (
                  <el-option
                    key={r.props ? option[r.props.value] : option.value}
                    value={r.props ? option[r.props.value] : option.value}
                    label={r.props ? option[r.props.label] : option.label}
                    disabled={r.props ? option[r.props.disabled] : option.disabled}
                  />
                ))}
            </el-select>
          )
        case 'switch':
          return <el-switch v-model={form[r.field]} {...this.createFormAttrs(r)}></el-switch>
        case 'cascader':
          return (
            <el-cascader
              v-model={form[r.field]}
              style={{ width: r.width }}
              options={r.options}
              {...this.createFormAttrs(r)}
            ></el-cascader>
          )
        case 'date':
          return (
            <ansoDatePicker
              v-model={form[r.field]}
              type={r.dateType}
              picker-options={r.pickerOptions}
              default-time={r.defaultTime}
              default-value={r.defaultValue}
              style={{ width: r.width }}
              value-format={r.valueFormat || 'timestamp'}
              {...this.createFormAttrs(r)}
            ></ansoDatePicker>
          )
        case 'radios':
          _options = typeof r.options === 'function' ? [] : r.options
          return (
            <el-radio-group v-model={form[r.field]} {...this.createFormAttrs(r)}>
              {Array.isArray(_options) &&
                _options.map(option => {
                  return <el-radio {...this.createFormAttrs(option)}>{option.text}</el-radio>
                })}
            </el-radio-group>
          )
        case 'checkboxs':
          if (!Array.isArray(form[r.field])) {
            this.$set(form, r.field, [])
          }
          _options = typeof r.options === 'function' ? [] : r.options
          return (
            <el-checkbox-group v-model={form[r.field]} {...this.createFormAttrs(r)}>
              {Array.isArray(_options) &&
                _options.map(option => {
                  return <el-checkbox {...this.createFormAttrs(option)}></el-checkbox>
                })}
            </el-checkbox-group>
          )
        case 'treeSelect':
          return (
            <ansoTreeSelect
              ref={r.ref || 'asTreeSel'}
              v-model={form[r.field]}
              {...this.createFormAttrs(r)}
            ></ansoTreeSelect>
          )
        // 自定义
        case 'custom':
          return r.custom(form[r.field])
        case 'slot':
          return this.$slots[r.field]
        default:
          return (
            <el-input
              style={{ width: r.width }}
              v-model={form[r.field]}
              type={r.type ? r.type : 'text'}
              disabled={r.disabled}
              clearable
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
            >
              <template slot={slot} v-if={!!slot}>
                {typeof slotRender == 'function' && slotRender()}
              </template>
            </el-input>
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
    }
  },

  /**
   * @description:
   * @param {*}
   * @return {*}
   */

  render() {
    const { model, rules, labelWidth, labelPosition, formList, formConfig } = this
    return (
      <el-form
        validate-on-rule-change={false}
        nativeOnSubmit={e => e.preventDefault()}
        props={{
          model: model ? model : this.value,
          rules,
          labelPosition,
          labelWidth,
          inline: true,
          ...formConfig
        }}
        ref="ruleForm"
        class="form"
      >
        <el-row type="flex" class="form-row" gutter={16}>
          {this.createFormItem(formList)}
        </el-row>
      </el-form>
    )
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
<style>
.el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap > .el-form-item__label:before,
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label::before {
  content: '';
  margin-right: 0;
}
.el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap > .el-form-item__label:before,
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label::after {
  content: '*';
  color: #f56c6c;
  margin-left: 4px;
}
input,
textarea {
  color: #262626 !important;
}
.el-tooltip__popper {
  max-width: 234px;
}

.el-tooltip__popper.is-dark {
  background-color: #505050 !important;
  color: #e5e5e5;
  line-height: 18px;
}

.el-tooltip__popper[x-placement^='top'].is-dark .popper__arrow::after {
  border-top-color: #505050 !important;
}

.el-tooltip__popper[x-placement^='top'].is-dark .popper__arrow {
  border-top-color: #505050 !important;
}
.el-tooltip__popper[x-placement^='right'].is-dark .popper__arrow::after {
  border-right-color: #505050 !important;
}

.el-tooltip__popper[x-placement^='right'].is-dark .popper__arrow {
  border-right-color: #505050 !important;
}
</style>
