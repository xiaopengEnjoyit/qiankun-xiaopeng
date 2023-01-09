import { isFunction } from 'lodash'

<script>
import { DataBus } from '../../utils/'
import { ansoTreeSelect, ansoJsonEditor } from '../'
export default {
  name: 'AnsoFormGroup',
  props: {
    // 分组小组标题
    groupTitle: {
      type: Array,
      default: function _default() {
        return []
      },
      validator: function validator(titleArr) {
        return titleArr.every(value => {
          if (typeof value === 'string') return !!value
          if (value instanceof Object) return value.icon || value.label
        })
      }
    },
    groupTitleConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    // 字段分组
    groupSplit: {
      type: Array,
      default: function _default() {
        return []
      }
    },
    // 分组类型：可选row,grid,default
    groupType: {
      type: [String, Array]
    },
    buttonFixed: {
      type: Boolean,
      default: true
    },
    buttonAlign: {
      type: String,
      default: 'right',
      validator: function validator(value) {
        return ['center', 'left', 'right'].indexOf(value) > -1
      }
    },
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
    },
    checkedLabel: {
      type: Boolean,
      default: false
    },
    checkedList: {
      type: Object,
      default: () => ({})
    },
    hasSplitLine: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      refname: 'dataformGroup',
      openGroups: Array.from(
        {
          length: this.groupSplit.length
        },
        () => {
          return true
        }
      ),
      formTempBtns: this.buttonList
    }
  },
  computed: {
    form: {
      get() {
        // this.initForm()
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    checkedForm: {
      get() {
        // this.initForm()
        return this.checkedList || {}
      },
      set(val) {
        console.log(val)
        this.$emit('update:checkedList', val)
      }
    }
  },
  mounted() {
    this.initForm()
    DataBus.on('reset', res => res && this.initForm()) // 监听表单是否重置

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
    // 初始化表单
    initForm() {
      const { formList, value } = this
      Array.isArray(formList) &&
        formList.forEach(f => {
          if (f.model || f.model === 0) {
            this.$set(value, f.field, f.model)
          } else {
            if (f.type !== 'select' && f.type !== 'jsonEditor') {
              this.$set(value, f.field, '')
            }

            if (f.type === 'jsonEditor') {
              this.$set(value, f.field, {})
            }
          }
        })
    },
    // 表单元素构建
    createFormItem(formList) {
      return formList.map(f => {
        if (f.type === 'slot' && f.nolabel) {
          return <el-col span={24 / (f.itemRow ? f.itemRow : this.itemRow)}>{this.$slots[f.field]}</el-col>
        }
        return (
          <el-col span={24 / (f.itemRow ? f.itemRow : this.itemRow)}>
            <el-form-item props={{ label: f.name, prop: f.field, ...this.itemConfig }} key={f.field}>
              {f.name ? (
                <div slot="label" class="label-wrap">
                  <div>
                    {this.checkedLabel ? (
                      <el-checkbox v-model={this.checkedForm[f.field]} label={f?.name}></el-checkbox>
                    ) : (
                      f?.name
                    )}
                  </div>
                  {f.tips ? (
                    <el-tooltip placement="right-end" effect={f.effect || 'light'}>
                      <div slot="content">{typeof f.tips === 'function' ? f.tips() : f.tips}</div>
                      <span class="iconfont icon-hint1 tips-icon"></span>
                    </el-tooltip>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                ''
              )}

              {this.checkTypeToFormElement(f)}
            </el-form-item>
          </el-col>
        )
      })
    },
    // 根据type渲染对应的form组件
    checkTypeToFormElement(r) {
      const { form } = this
      let _options = []
      switch (r.type) {
        case 'select':
          if (typeof r.options !== 'function') _options = r.options
          return (
            <el-select
              style={{ width: r.width }}
              v-model={form[r.field]}
              size={r.size ? r.size : 'small'}
              {...this.createFormAttrs(r)}
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
          return <el-switch v-model={form[r.field]} {...this.createFormAttrs(r)}></el-switch>
        case 'cascader':
          return (
            <el-cascader
              v-model={form[r.field]}
              size={r.size ? r.size : 'small'}
              style={{ width: r.width }}
              {...this.createFormAttrs(r)}
            ></el-cascader>
          )
        case 'datePicker':
          return (
            <el-date-picker
              v-model={form[r.field]}
              type={r.dateType || 'date'}
              size={r.size ? r.size : 'small'}
              style={{ width: r.width }}
              editable={r.editable ? true : false}
              {...this.createFormAttrs(r)}
            ></el-date-picker>
          )
        case 'jsonEditor':
          return (
            <ansoJsonEditor
              style={{ width: r.width, height: r.height }}
              v-model={form[r.field]}
              {...this.createFormAttrs(r)}
            ></ansoJsonEditor>
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
          return <ansoTreeSelect v-model={form[r.field]} {...this.createFormAttrs(r)}></ansoTreeSelect>
        // 自定义
        case 'custom':
          return r.custom(form[r.field])
        case 'slot':
          return this.$slots[r.field]
        default:
          return (
            <el-input
              size={r.size ? r.size : 'small'}
              style={{ width: r.width }}
              v-model={form[r.field]}
              type={r.type ? r.type : 'text'}
              {...this.createFormAttrs(r)}
            ></el-input>
          )
      }
    },
    createGroupItem(group, groupSplit, formList) {
      const { groupTitleConfig } = this
      return group.map((f, i) => {
        if (!groupSplit[i] || groupSplit[i].length === 0) {
          return ''
        }
        return (
          <div class={this.hasSplitLine ? 'form-group-item' : 'form-group-item no_split_line'}>
            <el-row class="form-group-title" style={groupTitleConfig.style ? groupTitleConfig.style : ''}>
              {f}
            </el-row>
            <el-row type="flex" class="form-row" gutter={15}>
              {this.createFormItem(
                formList.filter(e => {
                  return groupSplit[i].includes(e.field)
                })
              )}
            </el-row>
          </div>
        )
      })
    },
    // 属性和事件导入
    createFormAttrs(formOptions) {
      const _props = {}
      const _event = {}
      const _native = {}
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
            case 'width':
            case 'size':
            case 'options':
            case 'type':
            case 'name':
            case 'model':
            case 'text':
              break
            default:
              Object.assign(_props, { [m]: formOptions[m] })
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
  render() {
    const { model, rules, labelWidth, labelPosition, formList, formConfig, groupTitle, groupSplit } = this
    return (
      <el-form
        props={{
          model,
          rules,
          labelPosition,
          labelWidth,
          inline: true,
          ...formConfig
        }}
        ref="ruleForm"
        class="form"
      >
        <el-row type="flex" class="form-row">
          {groupTitle.length > 0
            ? this.createGroupItem(groupTitle, groupSplit, formList)
            : this.createFormItem(formList)}
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
}

.el-tooltip__popper[x-placement^='top'] .popper__arrow::after {
  border-top-color: #505050 !important;
}

.el-tooltip__popper[x-placement^='top'] .popper__arrow {
  border-top-color: #505050 !important;
}
</style>
