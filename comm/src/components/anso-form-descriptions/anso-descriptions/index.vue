<script>
export default {
  name: 'AnsoDescriptions',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    descList: {
      type: Object,
      default: () => {
        return {
          title: 'test',
          list: [
            {
              label: '123',
              desc: '321',
              type: 'input',
              field: 'a',
              value: '',
              rules: {
                required: true,
                trigger: 'blur'
              }
            }
          ]
        }
      }
    },
    column: {
      type: Number,
      default: 2
    },
    size: {
      type: String,
      default: ''
    },
    border: {
      type: Boolean,
      default: true
    },
    labelClassName: {
      type: String,
      default: 'desc-label-txtr'
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    listIndex: {
      type: Number,
      default: 0
    },
    validateErrMsg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    submitForm() {
      let res = false
      this.$refs['descForm'].validate(valid => {
        if (valid) {
          res = this.getData()
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
    },
    getData() {
      let resultData = {}
      this.descList.list.forEach(item => {
        resultData[item.field] = item.value
      })
      return resultData
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
     * @description:  根据type渲染对应的form组件
     * @param {*} r
     * @return {*}
     */

    checkTypeToFormElement(r, listIndex, itemIndex) {
      const form = this.descList
      let _options = []
      switch (r.type) {
        case 'select':
          if (typeof r.options !== 'function') _options = r.options
          return (
            <el-select
              style={{ width: r.width }}
              v-model={form.list[itemIndex].value}
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
          return <el-switch v-model={form.list[itemIndex].value} {...this.createFormAttrs(r)}></el-switch>
        case 'cascader':
          return (
            <el-cascader
              v-model={form.list[itemIndex].value}
              style={{ width: r.width }}
              {...this.createFormAttrs(r)}
            ></el-cascader>
          )
        case 'date':
          if (r?.timeDismantle) {
            form.list[itemIndex].value = [r.timeDismantle]
          }
          return (
            <ansoDatePicker
              v-model={form.list[itemIndex].value}
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
            <el-radio-group v-model={form.list[itemIndex].value} {...this.createFormAttrs(r)}>
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
            <el-checkbox-group v-model={form.list[itemIndex].value} {...this.createFormAttrs(r)}>
              {Array.isArray(_options) &&
                _options.map(option => {
                  return <el-checkbox {...this.createFormAttrs(option)}></el-checkbox>
                })}
            </el-checkbox-group>
          )
        case 'treeSelect':
          return <ansoTreeSelect v-model={form.list[itemIndex].value} {...this.createFormAttrs(r)}></ansoTreeSelect>
        // 自定义
        case 'custom':
          return r.custom(form.list[itemIndex].value, r)
        case 'slot':
          return this.$slots[r.field]
        default:
          return (
            <el-input
              style={{ width: r.width }}
              v-model={form.list[itemIndex].value}
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
     * 处理右边显示文字还是form表单
     *  @params item 当前表单的配置信息
     *  @params listIndex 当前表单是总的表单中第几个索引
     * @params itemIndex 当前item在其表单中的索引
     */
    descShow(item, listIndex, itemIndex) {
      const form = this.value
      if (item?.type && this.isEdit) {
        return (
          <el-form-item label="" prop={`list[${itemIndex}].value`} rules={item.rules}>
            {this.checkTypeToFormElement(item, listIndex, itemIndex)}
          </el-form-item>
        )
      } else {
        return item.desc
      }
    },

    reanderItem(list, listIndex) {
      return list.map((item, itemIndex) => {
        if (item?.icon || item.rules?.required) {
          return (
            <el-descriptions-item>
              <template slot="label">
                {item?.icon ? <i class={item.icon}></i> : ''}
                {item.rules?.required && this.isEdit ? <em class="red">*</em> : ''}
                <span class={['desc-label']}>{item.label}</span>
              </template>
              {this.descShow(item, listIndex, itemIndex)}
            </el-descriptions-item>
          )
        } else {
          return (
            <el-descriptions-item label={item.label}>{this.descShow(item, listIndex, itemIndex)}</el-descriptions-item>
          )
        }
      })
    }
  },
  render() {
    const { descList, reanderItem, column, size, border, labelClassName, listIndex, isEdit } = this
    return (
      <div class={'anso-descriptions-item'}>
        <el-form props={{ model: descList }} ref="descForm">
          <el-descriptions
            labelClassName={labelClassName}
            title={descList.title}
            column={column}
            size={size}
            border={border}
            attrs={{ ...this.attrs }}
          >
            {reanderItem(descList.list, listIndex)}
          </el-descriptions>
        </el-form>
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
