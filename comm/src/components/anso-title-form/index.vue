<script>
import { debounce } from 'comm/src/utils'
export default {
  name: 'ansoTitleForm',
  props: {
    title: {
      required: false,
      type: String,
      default: ''
    },
    formList: {
      required: false,
      type: Array,
      default: () => {
        return []
      }
    },
    exportBtn: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {}
    }
  },
  methods: {
    /**
     * @description: 初始化表单字段
     * @param {*}
     * @return {*}
     */

    initForm() {
      const { formList, form } = this
      Array.isArray(formList) &&
        formList.forEach(f => {
          if (f.model || f.model === 0) {
            this.$set(form, f.field, f.model)
          } else {
            this.$set(form, f.field, '')
          }
        })
    },
    handleQuery: debounce(function() {
      this.$emit('handleQuery', this.form)
    }, 300),
    exportQuery: debounce(function() {
      this.$emit('exportQuery', this.form)
    }, 300)
  },
  render() {
    const { title, formList, handleQuery, exportQuery, form, exportBtn } = this
    return (
      <div class="header-con">
        <div class="header-title">
          <span>{title}</span>
        </div>
        <div class="form-view-box">
          <section class="form-view" ref="formGroup">
            <anso-form
              v-model={form}
              props={{
                formList
              }}
            ></anso-form>
            <el-button size="mini" type="primary" ref="formBtn" onClick={handleQuery}>
              查询
            </el-button>
            {exportBtn ? (
              <el-button size="mini" ref="formBtn" onClick={exportQuery}>
                导出
              </el-button>
            ) : (
              ''
            )}
          </section>
        </div>
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
.header-con {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  .header-title {
    color: #262626;
    font-size: 16px;
    font-weight: 700;
  }
  .form-view-box {
    background-color: #fff;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;

    .form-view {
      width: 100%;
      display: flex;
      align-items: center;
      .el-form {
        padding-left: 10px;
      }

      /deep/ .el-form-item {
        margin-bottom: 0px;
        display: flex;
        height: 32px;
      }
      /deep/ .el-col {
        width: auto !important;
        padding: 0px !important;
      }
      /deep/ .el-form-item__label {
        line-height: 32px !important;
        padding: 0px;
      }

      /deep/ .el-form-item__content {
        flex: 1;
        .el-radio-group {
          padding-left: 10px;
        }
      }
      .el-button {
        margin-left: 8px;
      }
      /deep/.el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background-color: #fff;
        color: #3171f2;
        border-color: #3171f2;
      }
    }
    .from-view-button-group {
      position: absolute;
      right: 0;
      bottom: 0;
      button:last-child {
        margin-left: 8px !important;
      }

      .is-open {
        font-size: 14px;
        color: #8c8c8c;
        margin-right: 12px;
        text-align: right;
        font-weight: 400;
        &:hover {
          color: #3171f2;
        }
      }
    }
  }
}
</style>
