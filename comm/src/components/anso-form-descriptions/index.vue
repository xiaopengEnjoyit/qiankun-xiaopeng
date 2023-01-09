<script>
/***
 * <anso-form-descriptions
      :descList="descList"
      :column="2"
      :isEdit="isEdit"
      ref="formDescriptions"
    ></anso-form-descriptions>
    data() {
      isEdit: true, // 是否整个可以编辑，目前没有做单个可编辑
      descList：[
        {
          title: 'test',
          list: [
            {
              label: '123',
              desc: '321',
              type: 'input',
              field: 'a2',
              value: '',
              rules: {
                required: true,
                trigger: 'blur'
              }
            }
          ]
        }
      ]
    }
 *
 *
*/
import ansoDescriptions from './anso-descriptions'
export default {
  name: 'AnsoFormDescriptions',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    descList: {
      type: Array,
      default: () => []
    },
    column: {
      // 列数
      type: Number,
      default: 2
    },
    size: {
      type: String,
      default: 'small'
    },
    border: {
      // 是否加边框
      type: Boolean,
      default: true
    },
    labelClassName: {
      // 左边label的样式
      type: String,
      default: 'desc-label-txtr'
    },
    isEdit: {
      // 是否是可编辑的，false就是不可编辑只显示，统一的开关
      type: Boolean,
      default: true
    },
    validateErrMsg: {
      // 校验失败提示
      type: String,
      default: '字段校验失败，请检查！'
    },
    // 是否显示校验错误提示
    showErrorTips: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  components: {
    ansoDescriptions
  },
  methods: {
    renderList() {
      if (Array.isArray(this.descList)) {
        return this.descList.map((l, index) => {
          return (
            <anso-descriptions
              descList={l}
              listIndex={index}
              column={this.column}
              size={this.size}
              border={this.border}
              labelClassName={this.labelClassName}
              isEdit={this.isEdit}
              validateErrMsg={this.validateErrMsg}
              ref={`descForm${index}`}
              attrs={{ ...this.attrs }}
            ></anso-descriptions>
          )
        })
      }
    },
    submit() {
      // 提交前先校验
      let validateSuccess = []
      let resultData = {}
      this.descList.forEach((item, index) => {
        let listValidateResult = this.$refs[`descForm${index}`].submitForm()
        resultData = { ...resultData, ...listValidateResult }
        validateSuccess.push(!!listValidateResult)
      })
      if (validateSuccess.includes(false)) return
      return resultData
      // this.$emit('resultData', resultData)
    }
  },
  render() {
    const { isEdit, showErrorTips } = this
    return (
      <div
        class={[
          isEdit ? 'anso-form-descriptions' : 'anso-descriptions',
          showErrorTips ? '' : 'anso-form-descriptions-no-err'
        ]}
      >
        {this.renderList()}
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
